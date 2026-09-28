/**
 * ============================================================================
 *  GUÍA DE COPENHAGUE · Backend de reservas
 *  Google Apps Script + Google Sheets + Gmail
 * ============================================================================
 *
 *  QUÉ HACE
 *    - Guarda las reservas en una hoja de cálculo de Google (persistentes y
 *      compartidas entre todos los que abran la web).
 *    - Te manda un correo a tu Gmail cada vez que alguien se apunta.
 *    - Deja editar y borrar reservas, pero solo con la contraseña correcta,
 *      que se comprueba AQUÍ, en el servidor, nunca en el navegador.
 *
 *  CÓMO SE INSTALA
 *    Está explicado paso a paso en backend/README.md. Resumen:
 *      1. Crea una hoja de cálculo nueva en Google Drive.
 *      2. Extensiones ▸ Apps Script y pega este archivo entero.
 *      3. Configuración del proyecto ▸ Propiedades del script, y añade:
 *             ADMIN_PASSWORD  = la contraseña que quieras para el panel admin
 *             NOTIFY_EMAIL    = tu correo de Gmail
 *      4. Ejecuta una vez la función `instalar` (crea las pestañas y comprueba
 *         que la configuración está bien).
 *      5. Implementar ▸ Nueva implementación ▸ Aplicación web
 *             Ejecutar como:  Yo
 *             Quién tiene acceso: Cualquier usuario
 *      6. Copia la URL que acaba en /exec y pégala en js/config.js.
 *
 *  NOTA SOBRE CORS
 *    Las apps web de Apps Script no saben responder al "preflight" de CORS.
 *    Por eso el frontend manda los POST con Content-Type text/plain y aquí
 *    parseamos el cuerpo a mano. Es a propósito, no lo cambies.
 * ============================================================================
 */

var HOJA_RESERVAS = 'Reservas';
var CABECERAS = ['id', 'nombre', 'email', 'llegada', 'salida', 'nota', 'creado', 'estado'];

var MAX_NOMBRE = 60;
var MAX_NOTA = 400;
var MAX_NOCHES = 60;


/* ==========================================================================
   INSTALACIÓN · ejecuta esta función UNA VEZ desde el editor
   ========================================================================== */
function instalar() {
  var hoja = obtenerHoja();
  var props = PropertiesService.getScriptProperties();
  var faltan = [];

  if (!props.getProperty('ADMIN_PASSWORD')) faltan.push('ADMIN_PASSWORD');
  if (!props.getProperty('NOTIFY_EMAIL')) faltan.push('NOTIFY_EMAIL');

  if (faltan.length) {
    throw new Error(
      'Faltan propiedades del script: ' + faltan.join(', ') + '.\n' +
      'Ve a Configuración del proyecto ▸ Propiedades del script y añádelas.'
    );
  }

  // Un correo de prueba, para que Google te pida los permisos ahora y no
  // la primera vez que alguien se apunte.
  MailApp.sendEmail({
    to: props.getProperty('NOTIFY_EMAIL'),
    subject: '✅ Guía de Copenhague: el backend ya funciona',
    htmlBody:
      '<p>Todo listo. La hoja de reservas se llama <b>' + hoja.getName() + '</b>.</p>' +
      '<p>Ahora publica la aplicación web y pega la URL en <code>js/config.js</code>.</p>',
  });

  Logger.log('Instalación correcta. Hoja lista y correo de prueba enviado.');
}


/* ==========================================================================
   PUNTOS DE ENTRADA HTTP
   ========================================================================== */

function doGet(e) {
  try {
    var accion = (e && e.parameter && e.parameter.accion) || 'listar';

    if (accion === 'listar') {
      return json({ ok: true, reservas: leerReservas() });
    }
    if (accion === 'visita') {
      return json({ ok: true, visitas: sumarVisita() });
    }
    return json({ ok: false, error: 'Acción desconocida: ' + accion });

  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  try {
    var datos = {};
    if (e && e.postData && e.postData.contents) {
      datos = JSON.parse(e.postData.contents);
    }

    switch (datos.accion) {
      case 'crear':  return json(crearReserva(datos));
      case 'login':
        var vale = passwordCorrecta(datos.password);
        return json({ ok: vale, error: vale ? '' : 'Contraseña incorrecta.' });
      case 'editar': return json(editarReserva(datos));
      case 'borrar': return json(borrarReserva(datos));
      default:       return json({ ok: false, error: 'Acción desconocida.' });
    }

  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}


/* ==========================================================================
   OPERACIONES
   ========================================================================== */

/** Crea una reserva y avisa por correo. No necesita contraseña: cualquiera
 *  de tus amigos puede apuntarse. */
function crearReserva(d) {
  var nombre  = limpiar(d.nombre, MAX_NOMBRE);
  var email   = limpiar(d.email, 120);
  var llegada = limpiarFecha(d.llegada);
  var salida  = limpiarFecha(d.salida);
  var nota    = limpiar(d.nota, MAX_NOTA);

  if (!nombre)  return { ok: false, error: 'Falta el nombre.' };
  if (!llegada || !salida) return { ok: false, error: 'Faltan las fechas.' };
  if (salida <= llegada)   return { ok: false, error: 'La salida debe ser posterior a la llegada.' };
  if (contarNoches(llegada, salida) > MAX_NOCHES) {
    return { ok: false, error: 'Son demasiadas noches. Habla con Mario directamente.' };
  }
  if (email && email.indexOf('@') === -1) return { ok: false, error: 'El email no parece válido.' };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var hoja = obtenerHoja();
    var reserva = {
      id: Utilities.getUuid(),
      nombre: nombre,
      email: email,
      llegada: llegada,
      salida: salida,
      nota: nota,
      creado: new Date().toISOString(),
      estado: 'activa',
    };
    hoja.appendRow(CABECERAS.map(function (c) { return reserva[c]; }));

    // El correo no debe tumbar la reserva si falla
    try { avisarPorCorreo(reserva); }
    catch (err) { Logger.log('No se pudo enviar el correo: ' + err); }

    return { ok: true, reserva: reserva };
  } finally {
    lock.releaseLock();
  }
}

/** Edita una reserva. Solo con contraseña. */
function editarReserva(d) {
  if (!passwordCorrecta(d.password)) return { ok: false, error: 'Contraseña incorrecta.' };

  var nombre  = limpiar(d.nombre, MAX_NOMBRE);
  var llegada = limpiarFecha(d.llegada);
  var salida  = limpiarFecha(d.salida);
  if (!nombre || !llegada || !salida) return { ok: false, error: 'Faltan datos.' };
  if (salida <= llegada) return { ok: false, error: 'La salida debe ser posterior a la llegada.' };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var hoja = obtenerHoja();
    var fila = buscarFila(hoja, d.id);
    if (fila < 0) return { ok: false, error: 'No existe esa reserva.' };

    hoja.getRange(fila, indice('nombre')).setValue(nombre);
    hoja.getRange(fila, indice('llegada')).setValue(llegada);
    hoja.getRange(fila, indice('salida')).setValue(salida);
    hoja.getRange(fila, indice('nota')).setValue(limpiar(d.nota, MAX_NOTA));

    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/** "Borra" una reserva: la marca como borrada pero deja la fila en la hoja,
 *  por si te arrepientes. Deja de aparecer en la web inmediatamente. */
function borrarReserva(d) {
  if (!passwordCorrecta(d.password)) return { ok: false, error: 'Contraseña incorrecta.' };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var hoja = obtenerHoja();
    var fila = buscarFila(hoja, d.id);
    if (fila < 0) return { ok: false, error: 'No existe esa reserva.' };

    hoja.getRange(fila, indice('estado')).setValue('borrada');
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}


/* ==========================================================================
   CORREO
   ========================================================================== */

function avisarPorCorreo(r) {
  var destino = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!destino) return;

  var n = contarNoches(r.llegada, r.salida);

  // ¿Choca con alguien que ya estaba apuntado? Te lo digo en el propio correo.
  var solapes = leerReservas().filter(function (x) {
    if (x.id === r.id) return false;
    return x.llegada < r.salida && r.llegada < x.salida;
  });

  var cuerpo =
    '<div style="font-family:Tahoma,Verdana,sans-serif;font-size:14px;color:#111">' +
    '<h2 style="margin:0 0 10px;color:#0a246a">Nueva visita apuntada</h2>' +
    '<table cellpadding="6" style="border-collapse:collapse;border:1px solid #999">' +
      fila('Nombre', escapar(r.nombre)) +
      fila('Llegada', r.llegada) +
      fila('Salida', r.salida) +
      fila('Noches', String(n)) +
      (r.email ? fila('Email', escapar(r.email)) : '') +
      (r.nota ? fila('Nota', escapar(r.nota)) : '') +
    '</table>';

  if (solapes.length) {
    cuerpo += '<p style="margin-top:14px;padding:10px;background:#ffe9e9;border:1px solid #a30000">' +
      '<b>⚠ Ojo: se solapa con ' + solapes.length + ' reserva(s):</b><br>' +
      solapes.map(function (x) {
        return escapar(x.nombre) + ': ' + x.llegada + ' → ' + x.salida;
      }).join('<br>') + '</p>';
  }

  cuerpo += '<p style="margin-top:14px;font-size:12px;color:#555">' +
    'Puedes editarla o borrarla desde el panel de administración de la web, ' +
    'o directamente en la hoja de cálculo.</p></div>';

  MailApp.sendEmail({
    to: destino,
    subject: '🇩🇰 Nueva visita: ' + r.nombre + ' (' + r.llegada + ' → ' + r.salida + ')',
    htmlBody: cuerpo,
    name: 'Guía de Copenhague',
    replyTo: r.email || destino,
  });
}

function fila(k, v) {
  return '<tr><td style="border:1px solid #ccc;background:#f0f0f0"><b>' + k + '</b></td>' +
         '<td style="border:1px solid #ccc">' + v + '</td></tr>';
}


/* ==========================================================================
   AYUDANTES
   ========================================================================== */

function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA_RESERVAS);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA_RESERVAS);
    hoja.appendRow(CABECERAS);
    hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight('bold').setBackground('#d4d0c8');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function leerReservas() {
  var hoja = obtenerHoja();
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return [];

  var valores = hoja.getRange(2, 1, ultimaFila - 1, CABECERAS.length).getValues();
  return valores.map(function (v) {
    var o = {};
    CABECERAS.forEach(function (c, i) { o[c] = normalizar(v[i], c); });
    return o;
  }).filter(function (r) {
    return r.id && r.estado !== 'borrada';
  }).map(function (r) {
    // El email de cada uno NO se publica: solo lo ves tú en la hoja y en el correo.
    return { id: r.id, nombre: r.nombre, llegada: r.llegada,
             salida: r.salida, nota: r.nota, creado: r.creado };
  });
}

/** Google Sheets convierte a veces el texto '2026-10-05' en un objeto Date.
 *  Aquí lo devolvemos siempre a texto AAAA-MM-DD. */
function normalizar(valor, campo) {
  var esFecha = Object.prototype.toString.call(valor) === '[object Date]';
  if (esFecha && (campo === 'llegada' || campo === 'salida')) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(valor == null ? '' : valor);
}

function buscarFila(hoja, id) {
  if (!id) return -1;
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return -1;
  var ids = hoja.getRange(2, indice('id'), ultimaFila - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function indice(campo) {
  return CABECERAS.indexOf(campo) + 1;   // las columnas de Sheets empiezan en 1
}

function passwordCorrecta(password) {
  var guardada = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!guardada || !password) return false;
  // Comparación de longitud constante, para no filtrar información por el tiempo
  var a = String(password), b = String(guardada);
  if (a.length !== b.length) return false;
  var dif = 0;
  for (var i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

function sumarVisita() {
  var props = PropertiesService.getScriptProperties();
  var n = parseInt(props.getProperty('VISITAS') || '1337', 10) + 1;
  props.setProperty('VISITAS', String(n));
  return n;
}

function limpiar(texto, max) {
  return String(texto == null ? '' : texto).replace(/\s+/g, ' ').trim().slice(0, max);
}

function limpiarFecha(texto) {
  var s = String(texto == null ? '' : texto).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function contarNoches(a, b) {
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

function escapar(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
