/* ==========================================================================
   admin.js  ·  Panel de administración (solo Mario)
   --------------------------------------------------------------------------
   La contraseña NO está en este archivo ni en ningún otro del repositorio:
   se escribe aquí, se manda al backend y es el backend quien la compara
   contra la que tiene guardada en sus Script Properties. Si no coincide,
   el servidor no hace nada.

   Mientras dura la sesión se guarda en sessionStorage (se borra al cerrar
   la pestaña), solo para no tener que reescribirla en cada acción.
   ========================================================================== */

(function () {
  'use strict';

  var CLAVE_SESION = 'cph_admin';
  var reservas = [];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function pass() { return sessionStorage.getItem(CLAVE_SESION) || ''; }

  function noches(a, b) {
    var f = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
    return Math.round((f(b) - f(a)) / 86400000);
  }

  function mensaje(caja, tipo, texto) {
    caja.innerHTML = '<div class="aviso aviso--' + tipo + '">' +
      '<span class="aviso__icono">' + (tipo === 'ojo' ? '&#9888;' : '&#10003;') + '</span>' +
      '<div><p class="mb-0">' + texto + '</p></div></div>';
  }

  /* ====================================================== ENTRAR / SALIR */
  function entrar(e) {
    e.preventDefault();
    var campo = document.getElementById('campoPassword');
    var estado = document.getElementById('estadoLogin');
    var boton = document.getElementById('botonEntrar');

    if (!campo.value) { mensaje(estado, 'ojo', 'Escribe la contraseña.'); return; }

    boton.disabled = true;
    estado.innerHTML = '<div class="progreso"><div class="progreso__relleno"></div></div>';

    window.API.login(campo.value).then(function (res) {
      if (res && res.ok) {
        sessionStorage.setItem(CLAVE_SESION, campo.value);
        campo.value = '';
        estado.innerHTML = '';
        mostrarPanel(true);
        cargar();
      } else {
        mensaje(estado, 'ojo', (res && res.error) || 'Contraseña incorrecta.');
      }
    }).catch(function (err) {
      mensaje(estado, 'ojo', 'No se ha podido conectar con el servidor: ' + esc(err.message));
    }).finally(function () { boton.disabled = false; });
  }

  function salir() {
    sessionStorage.removeItem(CLAVE_SESION);
    mostrarPanel(false);
  }

  function mostrarPanel(si) {
    document.getElementById('ventanaLogin').hidden = si;
    document.getElementById('ventanaPanel').hidden = !si;
  }

  /* ============================================================== TABLA */
  function pintar() {
    var cuerpo = document.getElementById('tablaReservas');
    if (!reservas.length) {
      cuerpo.innerHTML = '<tr><td colspan="6">No hay ninguna reserva todavía.</td></tr>';
      return;
    }

    cuerpo.innerHTML = reservas.slice().sort(function (a, b) {
      return a.llegada < b.llegada ? -1 : 1;
    }).map(function (r) {
      return '<tr data-id="' + esc(r.id) + '">' +
        '<td><input type="text" value="' + esc(r.nombre) + '" data-campo="nombre"></td>' +
        '<td><input type="date" value="' + esc(r.llegada) + '" data-campo="llegada"></td>' +
        '<td><input type="date" value="' + esc(r.salida) + '" data-campo="salida"></td>' +
        '<td class="centrado">' + noches(r.llegada, r.salida) + '</td>' +
        '<td><input type="text" value="' + esc(r.nota || '') + '" data-campo="nota"></td>' +
        '<td class="nowrap">' +
          '<button type="button" class="boton" data-accion="guardar" ' +
            'style="min-height:20px;padding:1px 8px;font-size:11px">Guardar</button> ' +
          '<button type="button" class="boton boton--peligro" data-accion="borrar" ' +
            'style="min-height:20px;padding:1px 8px;font-size:11px">Borrar</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function accionTabla(e) {
    var boton = e.target.closest('button[data-accion]');
    if (!boton) return;
    var fila = boton.closest('tr');
    var id = fila.dataset.id;
    var estado = document.getElementById('estadoPanel');

    function leer(campo) {
      return fila.querySelector('[data-campo="' + campo + '"]').value;
    }

    if (boton.dataset.accion === 'borrar') {
      var quien = leer('nombre');
      if (!confirm('¿Seguro que quieres borrar la reserva de ' + quien + '?\n\nEsto no se puede deshacer.')) return;
      boton.disabled = true;
      window.API.borrar(id, pass()).then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.error) || 'El servidor la ha rechazado.');
        mensaje(estado, 'truco', 'Reserva de <strong>' + esc(quien) + '</strong> borrada.');
        return cargar();
      }).catch(function (err) {
        mensaje(estado, 'ojo', 'No se ha podido borrar: ' + esc(err.message));
        boton.disabled = false;
      });
      return;
    }

    var datos = {
      id: id,
      nombre: leer('nombre').trim(),
      llegada: leer('llegada'),
      salida: leer('salida'),
      nota: leer('nota').trim(),
      email: '',
    };
    if (!datos.nombre || !datos.llegada || !datos.salida) {
      mensaje(estado, 'ojo', 'Falta el nombre o alguna fecha.'); return;
    }
    if (datos.salida <= datos.llegada) {
      mensaje(estado, 'ojo', 'La salida tiene que ser posterior a la llegada.'); return;
    }

    boton.disabled = true;
    window.API.editar(datos, pass()).then(function (res) {
      if (!res || !res.ok) throw new Error((res && res.error) || 'El servidor la ha rechazado.');
      mensaje(estado, 'truco', 'Reserva de <strong>' + esc(datos.nombre) + '</strong> actualizada.');
      return cargar();
    }).catch(function (err) {
      mensaje(estado, 'ojo', 'No se ha podido guardar: ' + esc(err.message));
    }).finally(function () { boton.disabled = false; });
  }

  /* ============================================================== CARGA */
  function cargar() {
    return window.API.listar().then(function (res) {
      reservas = (res && res.reservas) || [];
      pintar();
    }).catch(function (err) {
      mensaje(document.getElementById('estadoPanel'), 'ojo',
        'No se ha podido cargar la lista: ' + esc(err.message));
    });
  }

  /* =========================================================== ARRANQUE */
  function iniciar() {
    if (!document.getElementById('ventanaLogin')) return;

    document.getElementById('formLogin').addEventListener('submit', entrar);
    document.getElementById('botonSalir').addEventListener('click', salir);
    document.getElementById('tablaReservas').addEventListener('click', accionTabla);

    if (window.API.demo) {
      var d = document.getElementById('avisoDemoAdmin');
      if (d) d.hidden = false;
    }

    // ¿Ya había sesión abierta en esta pestaña?
    if (pass()) { mostrarPanel(true); cargar(); }
    else { mostrarPanel(false); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
