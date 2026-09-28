/* ==========================================================================
   contenido.js  ·  Pinta las tarjetas a partir de los archivos data/*.js
   --------------------------------------------------------------------------
   No necesitas tocar este archivo para cambiar textos: eso se hace en
   data/monumentos.js, data/restaurantes.js y data/planes.js.
   ========================================================================== */

(function () {
  'use strict';

  var CREDITOS = window.DATA_CREDITOS || {};

  function escapar(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ======================================================================
     FOTOS
     foto('nyhavn', 'Las casas de Nyhavn') devuelve una <figure> con la
     imagen y su atribución. Si la clave no existe, devuelve el placeholder
     amarillo de "foto pendiente".
     ====================================================================== */
  function foto(clave, alt, nota) {
    var c = CREDITOS[clave];
    if (!c) return placeholder(clave, nota);

    var lic = c.licenciaUrl
      ? '<a href="' + escapar(c.licenciaUrl) + '" rel="noopener">' + escapar(c.licencia) + '</a>'
      : escapar(c.licencia);

    return '' +
      '<figure class="foto">' +
        '<img src="' + escapar(c.archivo) + '" alt="' + escapar(alt || '') + '" loading="lazy" decoding="async">' +
        '<figcaption>' +
          '<strong>' + escapar(alt || c.titulo) + '</strong><br>' +
          'Foto: ' + escapar(c.autor) + ' · ' + lic + ' · ' +
          '<a href="' + escapar(c.fuente) + '" rel="noopener">Wikimedia Commons</a>' +
        '</figcaption>' +
      '</figure>';
  }

  function placeholder(clave, nota) {
    return '' +
      '<figure class="foto">' +
        '<div class="foto-pendiente">' +
          '<span>&#128247; FOTO PENDIENTE</span>' +
          '<span>Sustitúyela por <code>img/fotos/' + escapar(clave || 'nombre') + '.jpg</code></span>' +
          (nota ? '<span class="pequeno" style="font-weight:normal">' + escapar(nota) + '</span>' : '') +
        '</div>' +
        '<figcaption>Aquí no hay foto libre disponible: pon una tuya y añade su crédito ' +
        'en <code>data/creditos.js</code>.</figcaption>' +
      '</figure>';
  }

  /* ======================================================================
     MONUMENTOS
     ====================================================================== */
  var ETIQUETAS_CAT = {
    imprescindible: 'Imprescindible',
    barrio:         'Barrio / paseo',
    museo:          'Museo y cultura',
    excursion:      'Excursión de un día',
  };

  function pintarMonumentos() {
    var datos = window.DATA_MONUMENTOS;
    if (!datos) return;

    Object.keys(ETIQUETAS_CAT).forEach(function (cat) {
      var destino = document.querySelector('[data-monumentos="' + cat + '"]');
      if (!destino) return;

      destino.innerHTML = datos.filter(function (m) { return m.categoria === cat; })
        .map(function (m) {
          var img = m.foto
            ? '<img class="tarjeta__foto" src="' + escapar((CREDITOS[m.foto] || {}).archivo || '') +
              '" alt="' + escapar(m.nombre) + '" loading="lazy" decoding="async">'
            : '<div class="foto-pendiente" style="aspect-ratio:4/3">' +
              '<span>&#128247; FOTO PENDIENTE</span>' +
              (m.notaFoto ? '<span class="pequeno" style="font-weight:normal">' + escapar(m.notaFoto) + '</span>' : '') +
              '</div>';

          var cred = m.foto && CREDITOS[m.foto]
            ? '<span class="pequeno">Foto: ' + escapar(CREDITOS[m.foto].autor) + ' · ' +
              escapar(CREDITOS[m.foto].licencia) + ' · ' +
              '<a href="' + escapar(CREDITOS[m.foto].fuente) + '" rel="noopener">Commons</a></span>'
            : '';

          return '' +
            '<article class="tarjeta" id="' + escapar(m.id) + '">' +
              '<h3 class="tarjeta__barra">' + escapar(m.nombre) + '</h3>' +
              img +
              '<div class="tarjeta__cuerpo">' +
                '<p>' + escapar(m.texto) + '</p>' +
                '<p><strong>&#128161; ' + escapar(m.consejo) + '</strong></p>' +
              '</div>' +
              '<div class="tarjeta__pie">' +
                '<span class="etiqueta etiqueta--precio">' + escapar(m.precio) + '</span>' +
                '<span class="etiqueta">' + escapar(m.zona) + '</span>' +
                '<span class="etiqueta etiqueta--dia">' + escapar(m.tiempo) + '</span>' +
                '<a class="boton" href="' + escapar(m.mapa) + '" rel="noopener" ' +
                  'style="min-height:20px;padding:1px 8px;font-size:11px">Mapa</a>' +
                cred +
              '</div>' +
            '</article>';
        }).join('');
    });
  }

  /* ======================================================================
     RESTAURANTES
     ====================================================================== */
  function pintarRestaurantes() {
    var destino = document.querySelector('[data-restaurantes]');
    if (!destino || !window.DATA_RESTAURANTES) return;

    destino.innerHTML = window.DATA_RESTAURANTES.map(function (r) {
      var vacia = r.estado === 'vacia';
      return '' +
        '<article class="tarjeta' + (vacia ? ' tarjeta--vacia' : '') + '">' +
          '<h3 class="tarjeta__barra">' +
            (vacia ? '&#9998; ' : '&#127869; ') + escapar(r.nombre) +
          '</h3>' +
          '<div class="tarjeta__cuerpo">' +
            (r.tipo ? '<p><strong>' + escapar(r.tipo) + '</strong></p>' : '') +
            '<p>' + escapar(r.porque) + '</p>' +
            (r.direccion ? '<p class="pequeno">&#128205; ' + escapar(r.direccion) + '</p>' : '') +
          '</div>' +
          '<div class="tarjeta__pie">' +
            '<span class="etiqueta etiqueta--precio">' + escapar(r.precio || '?') + '</span>' +
            (r.zona ? '<span class="etiqueta">' + escapar(r.zona) + '</span>' : '') +
            (vacia ? '<span class="etiqueta etiqueta--nuevo">Por rellenar</span>' : '') +
            (r.web ? '<a class="boton" href="' + escapar(r.web) + '" rel="noopener" ' +
              'style="min-height:20px;padding:1px 8px;font-size:11px">Web</a>' : '') +
          '</div>' +
        '</article>';
    }).join('');
  }

  /* ======================================================================
     PLANES
     ====================================================================== */
  var CLASE_TIPO = { dia: 'etiqueta--dia', noche: 'etiqueta--noche',
                     gratis: 'etiqueta--gratis', lluvia: 'etiqueta--lluvia' };
  var NOMBRE_TIPO = { dia: 'De día', noche: 'De noche',
                      gratis: 'Gratis', lluvia: 'Con mal tiempo' };
  var BARRA_TIPO = { dia: '', noche: 'ventana__barra--morado',
                     gratis: 'ventana__barra--verde', lluvia: 'ventana__barra--naranja' };

  function pintarPlanes() {
    var datos = window.DATA_PLANES;
    if (!datos) return;

    Object.keys(NOMBRE_TIPO).forEach(function (tipo) {
      var destino = document.querySelector('[data-planes="' + tipo + '"]');
      if (!destino) return;

      destino.innerHTML = datos.filter(function (p) { return p.tipo === tipo; })
        .map(function (p) {
          return '' +
            '<section class="ventana">' +
              '<div class="ventana__barra ' + BARRA_TIPO[tipo] + '">' +
                '<img class="ventana__icono" src="img/pixel/estrella.svg" alt="">' +
                '<span class="ventana__titulo">' + escapar(p.titulo) + '</span>' +
              '</div>' +
              '<div class="ventana__cuerpo">' +
                '<p>' + escapar(p.resumen) + '</p>' +
                '<ol>' + p.pasos.map(function (s) {
                  return '<li>' + escapar(s) + '</li>';
                }).join('') + '</ol>' +
                '<p class="mb-0">' +
                  '<span class="etiqueta ' + CLASE_TIPO[tipo] + '">' + NOMBRE_TIPO[tipo] + '</span> ' +
                  '<span class="etiqueta">' + escapar(p.duracion) + '</span> ' +
                  '<span class="etiqueta etiqueta--precio">' + escapar(p.coste) + '</span>' +
                '</p>' +
              '</div>' +
            '</section>';
        }).join('');
    });
  }

  /* ======================================================================
     CRÉDITOS
     ====================================================================== */
  function pintarCreditos() {
    var destino = document.querySelector('[data-creditos]');
    if (!destino) return;

    var filas = Object.keys(CREDITOS).sort().map(function (k) {
      var c = CREDITOS[k];
      return '<tr>' +
        '<td><img src="' + escapar(c.archivo) + '" alt="" width="90" loading="lazy" ' +
          'style="display:block;border:1px solid #666"></td>' +
        '<td><code>' + escapar(k) + '</code><br><span class="pequeno">' + escapar(c.titulo) + '</span></td>' +
        '<td>' + escapar(c.autor) + '</td>' +
        '<td>' + (c.licenciaUrl
          ? '<a href="' + escapar(c.licenciaUrl) + '" rel="noopener">' + escapar(c.licencia) + '</a>'
          : escapar(c.licencia)) + '</td>' +
        '<td><a href="' + escapar(c.fuente) + '" rel="noopener">Archivo original</a></td>' +
        '</tr>';
    }).join('');

    destino.innerHTML =
      '<div class="tabla-scroll"><table class="retro">' +
        '<thead><tr><th>Foto</th><th>Clave</th><th>Autor</th><th>Licencia</th><th>Fuente</th></tr></thead>' +
        '<tbody>' + filas + '</tbody>' +
      '</table></div>';
  }

  /* ======================================================================
     FOTOS SUELTAS EN EL HTML
     Escribe <div data-foto="dyrehave" data-alt="Los ciervos"></div>
     y aquí se rellena con la imagen y su atribución.
     ====================================================================== */
  function pintarFotosSueltas() {
    document.querySelectorAll('[data-foto]').forEach(function (el) {
      el.innerHTML = foto(el.dataset.foto, el.dataset.alt, el.dataset.nota);
    });
  }

  function iniciar() {
    pintarFotosSueltas();
    pintarMonumentos();
    pintarRestaurantes();
    pintarPlanes();
    pintarCreditos();
  }

  window.RETRO = { foto: foto, escapar: escapar };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
