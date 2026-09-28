/* ==========================================================================
   config.js  ·  LO ÚNICO QUE TIENES QUE TOCAR TÚ
   --------------------------------------------------------------------------
   Cuando hayas desplegado el backend (Google Apps Script), pega aquí la URL
   que termina en /exec. Mientras esté vacía, el calendario funciona en
   "modo demo": se ve todo, pero las reservas se guardan solo en tu navegador
   y no se envía ningún correo.

   Esta URL es pública y no es un secreto: la contraseña de administrador y
   el correo de aviso viven en el servidor (Script Properties), nunca aquí.
   ========================================================================== */

window.CONFIG = {

  /* Pega aquí la URL del despliegue de Apps Script. Ejemplo:
     'https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxx/exec' */
  API_URL: '',

  /* Datos de la casa: se muestran en la portada y en el calendario. */
  CASA: {
    direccion: 'Lundtoftevej 162, G, 1.12',
    ciudad: '2800 Kongens Lyngby',
    zona: 'Zona 51 (Lundtofte / DTU)',
  },

  /* Cuántas personas caben a la vez. Solo se usa para el aviso de solapes:
     el calendario avisa, pero nunca bloquea una reserva. */
  PLAZAS: 2,

  /* Primer mes que muestra el calendario al abrirlo. 'hoy' o 'AAAA-MM'. */
  MES_INICIAL: 'hoy',
};
