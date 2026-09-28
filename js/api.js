/* ==========================================================================
   api.js  ·  Cliente del backend (Google Apps Script)
   --------------------------------------------------------------------------
   Si CONFIG.API_URL está vacío, todo funciona igual pero guardando en el
   navegador (modo demo), para poder ver y probar la web sin backend.

   Detalle técnico importante: los POST se mandan con Content-Type
   'text/plain'. Es a propósito: así el navegador no hace la petición previa
   de CORS (preflight), que Apps Script no sabe contestar. El cuerpo sigue
   siendo JSON y el servidor lo parsea igual.
   ========================================================================== */

(function () {
  'use strict';

  var API = (window.CONFIG && window.CONFIG.API_URL || '').trim();
  var DEMO = !API;
  var CLAVE_DEMO = 'cph_reservas_demo';

  /* ------------------------------------------------------ Almacén demo */
  function demoLeer() {
    try { return JSON.parse(localStorage.getItem(CLAVE_DEMO) || '[]'); }
    catch (e) { return []; }
  }
  function demoGuardar(lista) {
    localStorage.setItem(CLAVE_DEMO, JSON.stringify(lista));
  }
  function demoSemilla() {
    if (localStorage.getItem(CLAVE_DEMO)) return;
    var hoy = new Date();
    function mas(dias) {
      var d = new Date(hoy.getTime() + dias * 86400000);
      return d.toISOString().slice(0, 10);
    }
    demoGuardar([
      { id: 'demo1', nombre: 'Laura (ejemplo)', email: '', llegada: mas(6),  salida: mas(10),
        nota: 'Reserva de ejemplo: desaparece en cuanto conectes el backend.', creado: '' },
      { id: 'demo2', nombre: 'Javi (ejemplo)',  email: '', llegada: mas(22), salida: mas(26),
        nota: '', creado: '' },
    ]);
  }

  /* --------------------------------------------------------- Peticiones */
  function get(params) {
    var u = API + (API.indexOf('?') === -1 ? '?' : '&') +
            Object.keys(params).map(function (k) {
              return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
            }).join('&');
    return fetch(u, { method: 'GET', redirect: 'follow' })
      .then(function (r) { return r.json(); });
  }

  function post(datos) {
    return fetch(API, {
      method: 'POST',
      redirect: 'follow',
      // text/plain a propósito: evita el preflight de CORS
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos),
    }).then(function (r) { return r.json(); });
  }

  /* ============================================================ API PÚBLICA */
  window.API = {

    demo: DEMO,

    /* Lista de reservas -------------------------------------------------- */
    listar: function () {
      if (DEMO) {
        demoSemilla();
        return Promise.resolve({ ok: true, reservas: demoLeer() });
      }
      return get({ accion: 'listar' });
    },

    /* Crear reserva (esto es lo que dispara el email a Mario) ------------- */
    crear: function (r) {
      if (DEMO) {
        var lista = demoLeer();
        r.id = 'local-' + Date.now();
        r.creado = new Date().toISOString();
        lista.push(r);
        demoGuardar(lista);
        return Promise.resolve({ ok: true, reserva: r, demo: true });
      }
      return post({
        accion: 'crear',
        nombre: r.nombre, email: r.email,
        llegada: r.llegada, salida: r.salida, nota: r.nota,
      });
    },

    /* Comprobar la contraseña de admin ----------------------------------- */
    login: function (password) {
      if (DEMO) {
        return Promise.resolve({ ok: password === 'demo',
          error: password === 'demo' ? '' : 'En modo demo la contraseña es: demo' });
      }
      return post({ accion: 'login', password: password });
    },

    /* Editar (solo admin) ------------------------------------------------ */
    editar: function (r, password) {
      if (DEMO) {
        var lista = demoLeer().map(function (x) { return x.id === r.id ? Object.assign({}, x, r) : x; });
        demoGuardar(lista);
        return Promise.resolve({ ok: true });
      }
      return post({
        accion: 'editar', password: password, id: r.id,
        nombre: r.nombre, email: r.email,
        llegada: r.llegada, salida: r.salida, nota: r.nota,
      });
    },

    /* Borrar (solo admin) ------------------------------------------------ */
    borrar: function (id, password) {
      if (DEMO) {
        demoGuardar(demoLeer().filter(function (x) { return x.id !== id; }));
        return Promise.resolve({ ok: true });
      }
      return post({ accion: 'borrar', password: password, id: id });
    },
  };
})();
