/* ==========================================================================
   calendario.js  ·  Calendario de visitas
   --------------------------------------------------------------------------
   Pinta el mes, la lista de reservas y el formulario, y avisa de solapes.
   Las fechas se manejan siempre como texto 'AAAA-MM-DD' para no pelearse
   con las zonas horarias.
   ========================================================================== */

(function () {
  'use strict';

  var PLAZAS = (window.CONFIG && window.CONFIG.PLAZAS) || 2;

  var COLORES = ['#c60c30', '#0a246a', '#1b7a1b', '#9b30ff', '#d97400',
                 '#00778a', '#b3007a', '#5a3a00', '#2f6f9f', '#7a0018'];

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
               'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  var reservas = [];
  var mesActual;          // Date con día 1 del mes que se está viendo

  /* ======================================================================
     UTILIDADES DE FECHA (todo en texto AAAA-MM-DD)
     ====================================================================== */
  function hoyISO() {
    var d = new Date();
    return iso(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function iso(a, m, d) {
    return a + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }
  function aFecha(s) {                       // 'AAAA-MM-DD' -> Date local
    var p = String(s).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function noches(desde, hasta) {
    return Math.round((aFecha(hasta) - aFecha(desde)) / 86400000);
  }
  function bonita(s) {
    var d = aFecha(s);
    return d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3) +
           (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
  }

  /* Color estable a partir del nombre: la misma persona siempre igual */
  function color(nombre) {
    var h = 0;
    for (var i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) >>> 0;
    return COLORES[h % COLORES.length];
  }
  function inicial(nombre) {
    return (nombre.trim()[0] || '?').toUpperCase();
  }

  /* ======================================================================
     SOLAPES
     Devuelve, para un rango, con quién choca y cuántas NOCHES comparte.
     Compartir noche = los intervalos [llegada, salida) se cruzan.
     ====================================================================== */
  function buscarSolapes(llegada, salida, ignorarId) {
    var res = [];
    reservas.forEach(function (r) {
      if (ignorarId && r.id === ignorarId) return;
      var ini = llegada > r.llegada ? llegada : r.llegada;
      var fin = salida  < r.salida  ? salida  : r.salida;
      var n = noches(ini, fin);
      if (n > 0) {
        res.push({ reserva: r, noches: n, tipo: 'noches' });
      } else if (llegada === r.salida || salida === r.llegada) {
        res.push({ reserva: r, noches: 0, tipo: 'relevo' });
      }
    });
    return res;
  }

  /* Cuántas personas hay la noche que empieza en el día 'fecha' */
  function ocupacionNoche(fecha) {
    return reservas.filter(function (r) {
      return fecha >= r.llegada && fecha < r.salida;
    });
  }

  /* ======================================================================
     REJILLA DEL MES
     ====================================================================== */
  function pintarMes() {
    var cont = document.getElementById('calRejilla');
    var titulo = document.getElementById('calMes');
    if (!cont) return;

    var anio = mesActual.getFullYear();
    var mes = mesActual.getMonth();
    titulo.textContent = MESES[mes] + ' de ' + anio;

    var primero = new Date(anio, mes, 1);
    // getDay(): 0=domingo. Queremos que la semana empiece en lunes.
    var desplazamiento = (primero.getDay() + 6) % 7;
    var diasMes = new Date(anio, mes + 1, 0).getDate();
    var diasMesAnterior = new Date(anio, mes, 0).getDate();

    var html = DIAS.map(function (d) {
      return '<div class="cal-cabecera">' + d + '</div>';
    }).join('');

    var hoy = hoyISO();

    function celda(a, m, d, fuera) {
      var fecha = iso(a, m, d);
      var diaSemana = new Date(a, m, d).getDay();
      var clases = ['cal-dia'];
      if (fuera) clases.push('cal-dia--fuera');
      if (diaSemana === 0 || diaSemana === 6) clases.push('cal-dia--finde');
      if (fecha === hoy) clases.push('cal-dia--hoy');
      else if (fecha < hoy) clases.push('cal-dia--pasado');

      // Quién está ese día (incluye el día de salida, aunque no duerma)
      var presentes = reservas.filter(function (r) {
        return fecha >= r.llegada && fecha <= r.salida;
      });
      if (ocupacionNoche(fecha).length > PLAZAS) clases.push('cal-dia--lleno');

      var barras = presentes.map(function (r) {
        var extra = '';
        if (fecha === r.llegada) extra = ' cal-barra--llega';
        else if (fecha === r.salida) extra = ' cal-barra--sale';
        var flecha = fecha === r.llegada ? '&#9654; ' : (fecha === r.salida ? '&#9664; ' : '');
        return '<span class="cal-barra' + extra + '" style="background:' + color(r.nombre) + '" ' +
               'title="' + esc(r.nombre) + ': ' + bonita(r.llegada) + ' &rarr; ' + bonita(r.salida) + '">' +
               flecha + esc(r.nombre.split(' ')[0]) + '</span>';
      }).join('');

      return '<div class="' + clases.join(' ') + '">' +
               '<span class="cal-dia__num">' + d + '</span>' + barras +
             '</div>';
    }

    for (var i = desplazamiento; i > 0; i--) {
      html += celda(mes === 0 ? anio - 1 : anio, (mes + 11) % 12, diasMesAnterior - i + 1, true);
    }
    for (var d = 1; d <= diasMes; d++) html += celda(anio, mes, d, false);
    var restantes = (7 - ((desplazamiento + diasMes) % 7)) % 7;
    for (var j = 1; j <= restantes; j++) {
      html += celda(mes === 11 ? anio + 1 : anio, (mes + 1) % 12, j, true);
    }

    cont.innerHTML = html;
    pintarLeyenda();
  }

  function pintarLeyenda() {
    var el = document.getElementById('calLeyenda');
    if (!el) return;
    var nombres = [];
    reservas.forEach(function (r) { if (nombres.indexOf(r.nombre) === -1) nombres.push(r.nombre); });
    el.innerHTML = nombres.length
      ? nombres.map(function (n) {
          return '<span><span class="cal-leyenda__punto" style="background:' + color(n) + '"></span>' +
                 esc(n) + '</span>';
        }).join('')
      : '<span class="pequeno">Todavía no hay nadie apuntado. Sé el primero.</span>';
  }

  /* ======================================================================
     LISTA DE RESERVAS
     ====================================================================== */
  function pintarLista() {
    var cont = document.getElementById('listaReservas');
    if (!cont) return;
    var hoy = hoyISO();

    var ordenadas = reservas.slice().sort(function (a, b) {
      return a.llegada < b.llegada ? -1 : a.llegada > b.llegada ? 1 : 0;
    });
    var futuras = ordenadas.filter(function (r) { return r.salida >= hoy; });
    var pasadas = ordenadas.filter(function (r) { return r.salida < hoy; }).reverse();

    function fila(r, pasada) {
      var n = noches(r.llegada, r.salida);
      return '<div class="reserva' + (pasada ? ' reserva--pasada' : '') + '">' +
        '<div class="reserva__avatar" style="background:' + color(r.nombre) + '">' +
          esc(inicial(r.nombre)) + '</div>' +
        '<div class="reserva__datos">' +
          '<div class="reserva__nombre">' + esc(r.nombre) + '</div>' +
          '<div class="reserva__fechas">' + bonita(r.llegada) + ' &rarr; ' + bonita(r.salida) +
            ' &middot; <strong>' + n + (n === 1 ? ' noche' : ' noches') + '</strong></div>' +
          (r.nota ? '<div class="reserva__nota">' + esc(r.nota) + '</div>' : '') +
        '</div>' +
      '</div>';
    }

    cont.innerHTML =
      (futuras.length
        ? futuras.map(function (r) { return fila(r, false); }).join('')
        : '<p class="pequeno">No hay ninguna visita apuntada todavía.</p>') +
      (pasadas.length
        ? '<hr><p class="pequeno"><strong>Ya pasaron:</strong></p>' +
          pasadas.slice(0, 8).map(function (r) { return fila(r, true); }).join('')
        : '');
  }

  /* ======================================================================
     AVISO DE SOLAPE EN VIVO
     ====================================================================== */
  function revisarSolape() {
    var caja = document.getElementById('avisoSolape');
    var llegada = document.getElementById('campoLlegada').value;
    var salida = document.getElementById('campoSalida').value;
    if (!caja) return;

    caja.innerHTML = '';
    if (!llegada || !salida) return;

    if (salida <= llegada) {
      caja.innerHTML = cajaAviso('grave', 'Las fechas no cuadran',
        '<p class="mb-0">La fecha de salida tiene que ser posterior a la de llegada.</p>');
      return;
    }

    var choques = buscarSolapes(llegada, salida);
    if (!choques.length) {
      caja.innerHTML = cajaAviso('ok', 'Fechas libres',
        '<p class="mb-0">&#10003; Esas fechas están libres. Adelante.</p>');
      return;
    }

    var duros = choques.filter(function (c) { return c.tipo === 'noches'; });
    var relevos = choques.filter(function (c) { return c.tipo === 'relevo'; });
    var html = '';

    if (duros.length) {
      html += '<p>Esas fechas <strong>coinciden con alguien que ya está apuntado</strong>:</p><ul>' +
        duros.map(function (c) {
          return '<li><strong>' + esc(c.reserva.nombre) + '</strong> — ' +
                 bonita(c.reserva.llegada) + ' &rarr; ' + bonita(c.reserva.salida) +
                 ' (' + c.noches + (c.noches === 1 ? ' noche' : ' noches') + ' en común)</li>';
        }).join('') + '</ul>' +
        '<p class="mb-0">Puedes apuntarte igualmente —a lo mejor cabéis o os conocéis—, ' +
        'pero avisad a Mario para que lo organice.</p>';
    }
    if (relevos.length) {
      html += (duros.length ? '<hr>' : '') +
        '<p class="mb-0">El mismo día se cruza con <strong>' +
        relevos.map(function (c) { return esc(c.reserva.nombre); }).join(', ') +
        '</strong>, pero no compartís ninguna noche: uno llega el día que el otro se va.</p>';
    }

    caja.innerHTML = cajaAviso(duros.length ? 'grave' : 'leve',
      duros.length ? 'Ojo: se solapan las fechas' : 'Relevo el mismo día', html);
  }

  function cajaAviso(nivel, titulo, cuerpo) {
    if (nivel === 'ok') {
      return '<div class="solape solape--leve" style="border-color:#157015;background:#e6ffe6">' +
             '<div class="solape__barra" style="background:linear-gradient(90deg,#0d4d0d,#3cb043)">' +
             titulo + '</div><div class="solape__cuerpo">' + cuerpo + '</div></div>';
    }
    return '<div class="solape' + (nivel === 'leve' ? ' solape--leve' : '') + '">' +
           '<div class="solape__barra">&#9888; ' + titulo + '</div>' +
           '<div class="solape__cuerpo">' + cuerpo + '</div></div>';
  }

  /* ======================================================================
     ENVÍO DEL FORMULARIO
     ====================================================================== */
  function enviar(e) {
    e.preventDefault();
    var boton = document.getElementById('botonApuntarse');
    var estado = document.getElementById('estadoEnvio');

    var datos = {
      nombre: document.getElementById('campoNombre').value.trim(),
      email: document.getElementById('campoEmail').value.trim(),
      llegada: document.getElementById('campoLlegada').value,
      salida: document.getElementById('campoSalida').value,
      nota: document.getElementById('campoNota').value.trim(),
    };

    if (!datos.nombre) { estado.innerHTML = error('Pon tu nombre.'); return; }
    if (!datos.llegada || !datos.salida) { estado.innerHTML = error('Faltan las fechas.'); return; }
    if (datos.salida <= datos.llegada) {
      estado.innerHTML = error('La salida tiene que ser posterior a la llegada.'); return;
    }
    if (noches(datos.llegada, datos.salida) > 60) {
      estado.innerHTML = error('¿Más de dos meses? Habla con Mario antes.'); return;
    }

    boton.disabled = true;
    estado.innerHTML = '<div class="progreso"><div class="progreso__relleno"></div></div>' +
                       '<p class="pequeno centrado">Guardando y avisando a Mario…</p>';

    window.API.crear(datos).then(function (res) {
      if (!res || !res.ok) throw new Error((res && res.error) || 'El servidor no aceptó la reserva.');
      document.getElementById('formReserva').reset();
      document.getElementById('avisoSolape').innerHTML = '';
      estado.innerHTML =
        '<div class="aviso aviso--truco"><span class="aviso__icono">&#127881;</span><div>' +
        '<p class="mb-0"><strong>¡Apuntado!</strong> ' +
        (res.demo
          ? 'Ojo: estás en <strong>modo demo</strong>, esto solo se ha guardado en tu navegador ' +
            'y Mario NO ha recibido ningún correo.'
          : 'Mario acaba de recibir un correo con tus fechas. Nos vemos en Copenhague.') +
        '</p></div></div>';
      return cargar();
    }).catch(function (err) {
      estado.innerHTML = error('No se ha podido guardar: ' + err.message +
        ' Prueba otra vez o escríbele a Mario directamente.');
    }).finally(function () {
      boton.disabled = false;
    });
  }

  function error(msg) {
    return '<div class="aviso aviso--ojo"><span class="aviso__icono">&#9888;</span>' +
           '<div><p class="mb-0">' + msg + '</p></div></div>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ======================================================================
     CARGA
     ====================================================================== */
  function cargar() {
    var cont = document.getElementById('calRejilla');
    if (cont && !reservas.length) {
      cont.innerHTML = '<div class="cargando" style="grid-column:1/-1">' +
        '<div class="progreso"><div class="progreso__relleno"></div></div>' +
        '<p>Cargando las visitas…</p></div>';
    }
    return window.API.listar().then(function (res) {
      reservas = (res && res.reservas) || [];
      pintarMes();
      pintarLista();
      revisarSolape();
    }).catch(function (err) {
      if (cont) {
        cont.innerHTML = '<div style="grid-column:1/-1">' +
          error('No se ha podido conectar con el servidor de reservas (' + esc(err.message) + ').') +
          '</div>';
      }
    });
  }

  /* ======================================================================
     ARRANQUE
     ====================================================================== */
  function iniciar() {
    if (!document.getElementById('calRejilla')) return;

    var inicial = (window.CONFIG && window.CONFIG.MES_INICIAL) || 'hoy';
    if (/^\d{4}-\d{2}$/.test(inicial)) {
      mesActual = new Date(+inicial.slice(0, 4), +inicial.slice(5, 7) - 1, 1);
    } else {
      var h = new Date();
      mesActual = new Date(h.getFullYear(), h.getMonth(), 1);
    }

    document.getElementById('calAnterior').addEventListener('click', function () {
      mesActual = new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1);
      pintarMes();
    });
    document.getElementById('calSiguiente').addEventListener('click', function () {
      mesActual = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1);
      pintarMes();
    });
    document.getElementById('calHoy').addEventListener('click', function () {
      var h = new Date();
      mesActual = new Date(h.getFullYear(), h.getMonth(), 1);
      pintarMes();
    });

    ['campoLlegada', 'campoSalida'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', revisarSolape);
    });
    document.getElementById('formReserva').addEventListener('submit', enviar);

    // No dejar elegir fechas de hace tiempo
    var min = hoyISO();
    document.getElementById('campoLlegada').min = min;
    document.getElementById('campoSalida').min = min;

    // Cartel de modo demo
    if (window.API.demo) {
      var d = document.getElementById('avisoDemo');
      if (d) d.hidden = false;
    }

    cargar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
