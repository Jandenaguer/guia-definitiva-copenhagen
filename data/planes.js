/* ==========================================================================
   planes.js  ·  Planes ya montados, para no tener que pensar
   --------------------------------------------------------------------------
   Cada plan es una tarjeta con una lista de pasos.
   tipo: 'dia' | 'noche' | 'gratis' | 'lluvia'   (controla el color de la etiqueta)
   Para añadir un plan, copia un bloque { ... } entero.
   ========================================================================== */

window.DATA_PLANES = [

  /* ------------------------------------------------------------- DE DÍA */
  {
    titulo: 'Primer día: el Copenhague de postal',
    tipo: 'dia',
    duracion: 'Día completo',
    coste: '~150 kr + lo que comáis',
    resumen: 'Si solo tenéis un día, este. Todo el centro a pie, casi sin transporte.',
    pasos: [
      'Letbane hasta Lyngby St. y S-tog línea A o E hasta Nørreport (~25 min en total).',
      'Desayuno en Torvehallerne, nada más salir de la estación.',
      'Rundetårn: subes la rampa en espiral y ves los tejados (~40 kr).',
      'Bajas por Strøget hasta Kongens Nytorv y sales a Nyhavn. Foto obligatoria.',
      'Paseo por Amalienborg (cambio de guardia a las 12:00) y Marmorkirken.',
      'Sigues hasta Kastellet y la Sirenita. Son 20 min andando desde Amalienborg.',
      'Vuelta por el centro y torre de Christiansborg al atardecer: es gratis y es la vista más alta.',
      'Cena en Kødbyen o cerveza en Nyhavn comprada en el súper.',
    ],
  },
  {
    titulo: 'Copenhague en bici',
    tipo: 'dia',
    duracion: '4–6 h',
    coste: 'Gratis (usa mi bici)',
    resumen: 'La forma real de ver la ciudad. Léete antes las normas de la sección de transporte.',
    pasos: [
      'Sal de casa por los carriles bici hacia el sur: hasta el centro son ~13 km, una hora larga.',
      'Alternativa cómoda: bici hasta Lyngby St., metes la bici en el S-tog (gratis) y bajas en el centro.',
      'Ruta por el puerto: Islands Brygge → puente Cykelslangen → Kalvebod Bølge.',
      'Cruzas a Christianshavn por el puente Inderhavnsbroen y das una vuelta por Christiania.',
      'Refshaleøen: comes en Reffen y te bañas en La Banchina si hace bueno.',
      'Vuelta por Nørrebro: Superkilen y Jægersborggade, y cerveza en el cementerio Assistens.',
    ],
  },
  {
    titulo: 'Día de playa y ciervos (sin salir de la zona)',
    tipo: 'dia',
    duracion: 'Medio día',
    coste: 'Casi gratis',
    resumen: 'El plan de al lado de casa, y de los más bonitos que tiene la región.',
    pasos: [
      'Andando o en bici hasta Jægersborg Dyrehave, que empieza a un paso de casa.',
      'Cruzas el parque hasta el palacete del Eremitage, en lo alto de la colina.',
      'Si es temporada, das una vuelta por Bakken (entrar es gratis).',
      'Bajas hasta Klampenborg y la playa de Bellevue, con sus casetas de rayas.',
      'Vuelta en S-tog línea C desde Klampenborg, o andando por el bosque.',
    ],
  },
  {
    titulo: 'Excursión al norte: Louisiana + Kronborg',
    tipo: 'dia',
    duracion: 'Día completo',
    coste: '~320 kr + tren',
    resumen: 'Los dos están en la misma línea de tren hacia Helsingør. Se pueden juntar.',
    pasos: [
      'Tren desde Lyngby o København H dirección Helsingør.',
      'Bajas en Humlebæk: Museo Louisiana (arte moderno + parque de esculturas sobre el mar).',
      'Comes en la cafetería del museo, con terraza mirando a Suecia.',
      'Sigues en tren hasta Helsingør: castillo de Kronborg, el de Hamlet.',
      'Extra: ferry a Helsingborg (Suecia), 20 min. Ida y vuelta el mismo día.',
    ],
  },

  /* ------------------------------------------------------------ DE NOCHE */
  {
    titulo: 'Noche de Vesterbro',
    tipo: 'noche',
    duracion: 'Noche',
    coste: '€€',
    resumen: 'La zona con más vida entre semana, y se llega fácil desde la Estación Central.',
    pasos: [
      'Empezar cenando en Kødbyen (el antiguo matadero): pizza, pescado o barbacoa.',
      'Cervezas en WarPigs o en alguno de los Mikkeller.',
      'Bares por Istedgade y Viktoriagade.',
      'Ojo con la vuelta: mira el último tren a Lyngby ANTES de salir (ver transporte). ' +
      'El metro sí funciona 24 h, pero no llega a Lyngby.',
    ],
  },
  {
    titulo: 'Tivoli de noche',
    tipo: 'noche',
    duracion: '3–4 h',
    coste: '~160 kr entrada',
    resumen: 'El parque encendido es otra cosa. Funciona incluso si no te montas en nada.',
    pasos: [
      'Entrar sobre las 19:00, cuando empieza a oscurecer.',
      'Dar la vuelta completa al lago y ver el pabellón chino iluminado.',
      'Los viernes de temporada de verano hay concierto gratis incluido en la entrada.',
      'Cerrar con el paseo por Rådhuspladsen, justo enfrente.',
    ],
  },
  {
    titulo: 'Noche tranquila en Lyngby',
    tipo: 'noche',
    duracion: 'Noche',
    coste: '€',
    resumen: 'Cuando no apetece bajar al centro o llegáis tarde.',
    pasos: [
      'Cena en Lyngby Hovedgade o en el centro comercial.',
      'Cervezas en casa: el alcohol en el súper es muchísimo más barato que en los bares.',
      'Paseo nocturno por el lago de Lyngby, que está iluminado y a diez minutos.',
    ],
  },

  /* ------------------------------------------------------------- GRATIS */
  {
    titulo: 'Un día entero sin gastar (casi) nada',
    tipo: 'gratis',
    duracion: 'Día completo',
    coste: 'Solo el transporte',
    resumen: 'Copenhague es cara, pero lo mejor de la ciudad es gratis.',
    pasos: [
      'Torre de Christiansborg: la vista más alta del centro, entrada gratis.',
      'Kongens Have y Frederiksberg Have: los dos parques, gratis.',
      'Kastellet y la Sirenita: gratis.',
      'Christiania: gratis (y sin fotos en la zona central).',
      'Den Sorte Diamant: entrar a la biblioteca y sentarse mirando el puerto, gratis.',
      'Cementerio de Assistens en Nørrebro: parque y picnic, gratis.',
      'Superkilen: gratis.',
      'Glyptoteket los martes: gratis.',
      'Barco-autobús 991/992: cuenta como bus normal, así que con tu billete ya tienes ' +
      'un paseo en barco por el puerto sin pagar aparte.',
    ],
  },
  {
    titulo: 'Baño en el puerto',
    tipo: 'gratis',
    duracion: '2 h',
    coste: 'Gratis',
    resumen: 'De junio a agosto. El agua del puerto está limpia y hay piscinas públicas dentro.',
    pasos: [
      'Havnebadet Islands Brygge: la más famosa, con césped alrededor.',
      'Sandkaj (Nordhavn): más tranquila y moderna.',
      'La Banchina en Refshaleøen: escalera al agua y sauna de pago.',
      'Si te da igual el frío: la gente se baña todo el año. En invierno hay sauna al lado.',
    ],
  },

  /* ------------------------------------------------------------- LLUVIA */
  {
    titulo: 'Llueve y no para',
    tipo: 'lluvia',
    duracion: 'Día completo',
    coste: '€€',
    resumen: 'Va a pasar. Aquí llueve poco de golpe pero muchos días, así que hay plan B.',
    pasos: [
      'Glyptoteket: escultura, impresionistas y jardín de invierno bajo cúpula (martes gratis).',
      'Museo Nacional (Nationalmuseet): entrada gratuita a la colección permanente.',
      'Den Sorte Diamant: sillón, vistas al agua y wifi.',
      'Torvehallerne: comer sin mojarse y con muchas opciones.',
      'Rundetårn: rampa cubierta y exposición a mitad de subida.',
      'Centro comercial de Lyngby, si ni siquiera apetece coger el tren.',
      'Plan definitivo: sauna. Hay varias en el puerto y es lo más danés que puedes hacer.',
    ],
  },
  {
    titulo: 'Hygge en casa',
    tipo: 'lluvia',
    duracion: 'Tarde',
    coste: 'Gratis',
    resumen: 'El concepto danés del invierno: velas, manta y no salir. Está socialmente aceptado.',
    pasos: [
      'Pasar por Netto o Føtex a por velas, cerveza y algo de picar.',
      'Kanelsnegle (caracoles de canela) de cualquier panadería.',
      'Poner el radiador, encender velas y no hacer absolutamente nada.',
      'Si os sobra energía, el lago de Lyngby con paraguas también está bien.',
    ],
  },
];
