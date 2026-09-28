/* ==========================================================================
   ui.js  ·  El "sistema operativo" de la web
   --------------------------------------------------------------------------
   - Pinta la barra de tareas y el menú Inicio (el menú vive SOLO aquí:
     si añades una página nueva, añádela a la lista MENU de abajo)
   - Botones _ □ ✕ de las ventanas
   - Reloj de la bandeja del sistema
   - Contador de visitas
   - Zumbido de Messenger
   - Ventanas arrastrables (solo en ratón, no en móvil)
   ========================================================================== */

(function () {
  'use strict';

  /* --- Menú Inicio: la navegación de todo el sitio ----------------------- */
  var MENU = [
    { url: 'index.html',        icono: 'casa.svg',       texto: 'Inicio' },
    { separador: true },
    { url: 'transporte.html',   icono: 'tranvia.svg',    texto: 'Transporte y bici' },
    { url: 'lyngby.html',       icono: 'bolsa.svg',      texto: 'Lyngby Centrum' },
    { url: 'cerca-de-casa.html',icono: 'ciervo.svg',     texto: 'Cerca de casa' },
    { url: 'monumentos.html',   icono: 'nyhavn.svg',     texto: 'Monumentos' },
    { url: 'restaurantes.html', icono: 'plato.svg',      texto: 'Restaurantes' },
    { url: 'planes.html',       icono: 'estrella.svg',   texto: 'Planes' },
    { url: 'util.html',         icono: 'info.svg',       texto: 'Info útil' },
    { separador: true },
    { url: 'calendario.html',   icono: 'calendario.svg', texto: 'Calendario de visitas' },
    { separador: true },
    { url: 'creditos.html',     icono: 'camara.svg',     texto: 'Créditos de fotos' },
    { url: 'admin.html',        icono: 'llave.svg',      texto: 'Admin (solo Mario)' },
  ];

  var ICONOS = 'img/pixel/';

  /* ======================================================================
     BARRA DE TAREAS + MENÚ INICIO
     ====================================================================== */
  function construirBarraTareas() {
    if (document.querySelector('.barra-tareas')) return;

    var barra = document.createElement('div');
    barra.className = 'barra-tareas';
    barra.innerHTML =
      '<button type="button" class="boton boton-inicio" id="botonInicio" aria-expanded="false" aria-controls="menuInicio">' +
        '<img src="' + ICONOS + 'pc.svg" alt="" width="16" height="16">Inicio' +
      '</button>' +
      '<div class="barra-tareas__centro">' +
        '<a class="boton" href="calendario.html" style="max-width:100%">' +
          '<img src="' + ICONOS + 'calendario.svg" alt="" width="16" height="16">' +
          '<span class="nowrap">Calendario</span>' +
        '</a>' +
      '</div>' +
      '<div class="bandeja">' +
        '<span title="Emoticono de Messenger" class="emo"></span>' +
        '<span id="relojBandeja" class="mono">--:--</span>' +
      '</div>';

    var menu = document.createElement('nav');
    menu.className = 'menu-inicio';
    menu.id = 'menuInicio';
    menu.hidden = true;
    menu.setAttribute('aria-label', 'Menú principal');

    var lista = MENU.map(function (it) {
      if (it.separador) return '<li class="separador"></li>';
      return '<li><a href="' + it.url + '">' +
             '<img src="' + ICONOS + it.icono + '" alt="">' + it.texto + '</a></li>';
    }).join('');

    menu.innerHTML =
      '<div class="menu-inicio__franja"><span>Copenhague&nbsp;26</span></div>' +
      '<ul class="menu-inicio__lista">' + lista + '</ul>';

    document.body.appendChild(menu);
    document.body.appendChild(barra);

    var boton = document.getElementById('botonInicio');

    function abrir(si) {
      menu.hidden = !si;
      boton.classList.toggle('abierto', si);
      boton.setAttribute('aria-expanded', si ? 'true' : 'false');
    }

    boton.addEventListener('click', function (e) {
      e.stopPropagation();
      abrir(menu.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target)) abrir(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') abrir(false);
    });
  }

  /* ======================================================================
     RELOJ DE LA BANDEJA
     ====================================================================== */
  function arrancarReloj() {
    var el = document.getElementById('relojBandeja');
    if (!el) return;
    function pinta() {
      var d = new Date();
      el.textContent = String(d.getHours()).padStart(2, '0') + ':' +
                       String(d.getMinutes()).padStart(2, '0');
      el.title = 'Hora de tu dispositivo · en Copenhague es UTC+1 (UTC+2 en verano)';
    }
    pinta();
    setInterval(pinta, 20000);
  }

  /* ======================================================================
     BOTONES DE LAS VENTANAS  _ □ ✕
     ====================================================================== */
  function activarVentanas() {
    document.querySelectorAll('.ventana').forEach(function (v) {
      var barra = v.querySelector('.ventana__barra');
      if (!barra || barra.querySelector('.ventana__botones')) return;

      var botones = document.createElement('div');
      botones.className = 'ventana__botones';
      botones.innerHTML =
        '<button type="button" class="ventana__boton" data-accion="plegar" title="Minimizar" aria-label="Minimizar ventana">_</button>' +
        '<button type="button" class="ventana__boton" data-accion="zumbar" title="Zumbido" aria-label="Enviar un zumbido">&#9633;</button>' +
        '<button type="button" class="ventana__boton" data-accion="plegar" title="Cerrar" aria-label="Cerrar ventana">&#10005;</button>';
      barra.appendChild(botones);

      botones.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.accion === 'plegar') {
          v.classList.toggle('plegada');
        } else {
          v.classList.remove('zumbido');
          void v.offsetWidth;          // reinicia la animación
          v.classList.add('zumbido');
          setTimeout(function () { v.classList.remove('zumbido'); }, 600);
        }
      });
    });
  }

  /* ======================================================================
     VENTANAS ARRASTRABLES  (.ventana--arrastrable, solo con ratón)
     ====================================================================== */
  function activarArrastre() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('.ventana--arrastrable').forEach(function (v) {
      var barra = v.querySelector('.ventana__barra');
      if (!barra) return;
      barra.style.cursor = 'move';
      var x = 0, y = 0, x0 = 0, y0 = 0, activo = false;

      barra.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button')) return;
        activo = true;
        x0 = e.clientX - x;
        y0 = e.clientY - y;
        barra.setPointerCapture(e.pointerId);
        v.style.position = 'relative';
        v.style.zIndex = '20';
      });
      barra.addEventListener('pointermove', function (e) {
        if (!activo) return;
        x = e.clientX - x0;
        y = e.clientY - y0;
        v.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        barra.addEventListener(ev, function () { activo = false; });
      });
      barra.addEventListener('dblclick', function () {
        x = y = 0;
        v.style.transform = '';
      });
    });
  }

  /* ======================================================================
     MARQUESINA
     El HTML solo lleva un <span> de texto (así es fácil de editar); aquí lo
     metemos en una pista y lo duplicamos para que el desfile sea continuo.
     ====================================================================== */
  function prepararMarquesinas() {
    document.querySelectorAll('.marquesina').forEach(function (m) {
      var texto = m.querySelector('.marquesina__texto');
      if (!texto || m.querySelector('.marquesina__pista')) return;

      var pista = document.createElement('div');
      pista.className = 'marquesina__pista';
      m.insertBefore(pista, texto);
      pista.appendChild(texto);

      var copia = texto.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      pista.appendChild(copia);
    });
  }

  /* ======================================================================
     CONTADOR DE VISITAS
     Pide el número real al backend; si no hay backend, cuenta en local.
     ====================================================================== */
  function contadorVisitas() {
    var caja = document.getElementById('contadorVisitas');
    if (!caja) return;

    function pinta(n) {
      var txt = String(Math.max(0, n | 0)).padStart(6, '0');
      caja.innerHTML = txt.split('').map(function (d) {
        return '<span class="contador__digito">' + d + '</span>';
      }).join('');
    }

    var api = (window.CONFIG && window.CONFIG.API_URL) || '';
    if (!api) {
      var n = parseInt(localStorage.getItem('cph_visitas') || '1336', 10) + 1;
      localStorage.setItem('cph_visitas', n);
      pinta(n);
      caja.title = 'Contador local (aún no hay backend configurado)';
      return;
    }

    pinta(0);
    fetch(api + '?accion=visita', { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (d) { pinta(d.visitas || 0); })
      .catch(function () { pinta(parseInt(localStorage.getItem('cph_visitas') || '1337', 10)); });
  }

  /* ======================================================================
     ARRANQUE
     ====================================================================== */
  function iniciar() {
    construirBarraTareas();
    prepararMarquesinas();
    arrancarReloj();
    activarVentanas();
    activarArrastre();
    contadorVisitas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
