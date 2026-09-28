/* ==========================================================================
   monumentos.js  ·  Sitios que ver en Copenhague y alrededores
   --------------------------------------------------------------------------
   CÓMO EDITAR ESTO
   - Cada { ... } es una tarjeta. Copia una entera para añadir un sitio nuevo.
   - "foto" es la CLAVE de data/creditos.js (p. ej. 'nyhavn' usa img/fotos/nyhavn.jpg
     y coge su autor y licencia automáticamente).
     Si pones foto: null, sale un placeholder amarillo de "foto pendiente".
     Si quieres usar una foto TUYA: métela en img/fotos/, añádela a
     data/creditos.js con autor "Mario" y licencia "Foto propia", y pon aquí su clave.
   - "categoria" agrupa las tarjetas: 'imprescindible' | 'barrio' | 'museo' | 'excursion'
   ========================================================================== */

window.DATA_MONUMENTOS = [

  /* ---------------------------------------------------- IMPRESCINDIBLES */
  {
    id: 'nyhavn',
    nombre: 'Nyhavn',
    foto: 'nyhavn',
    categoria: 'imprescindible',
    zona: 'Centro',
    precio: 'Gratis',
    tiempo: '30–45 min',
    texto: 'El canal de las casitas de colores, la foto que todo el mundo tiene de Copenhague. ' +
           'Era el puerto de marineros del siglo XVII y hoy es una fila de terrazas. ' +
           'Hans Christian Andersen vivió en los números 20, 67 y 18.',
    consejo: 'Las terrazas de Nyhavn son de las más caras de la ciudad. La jugada local es ' +
             'comprar unas cervezas en un 7-Eleven o Netto y sentarse en el borde del canal, ' +
             'que es perfectamente legal y gratis.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6797&mlon=12.5910#map=17/55.6797/12.5910',
  },
  {
    id: 'sirenita',
    nombre: 'La Sirenita (Den Lille Havfrue)',
    foto: null,   // Ver nota de licencia: no hay fotos libres de la estatua
    notaFoto: 'La escultura de Edvard Eriksen sigue con derechos de autor y en Dinamarca ' +
              'no hay "libertad de panorama" para obras de arte, así que no existen fotos ' +
              'libres en Wikimedia. Haz la tuya y ponla aquí.',
    categoria: 'imprescindible',
    zona: 'Langelinie',
    precio: 'Gratis',
    tiempo: '15 min',
    texto: 'Mide 1,25 m, está sobre una roca y siempre tiene treinta personas alrededor haciéndose ' +
           'la foto. Es oficialmente la mayor decepción turística de Europa y aun así hay que verla ' +
           'una vez. Está en el paseo de Langelinie, a 15 minutos andando de Kastellet.',
    consejo: 'Ve temprano (antes de las 9:00) o te la encuentras rodeada de autobuses. ' +
             'Encadénala con Kastellet y la fuente de Gefion en el mismo paseo.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6929&mlon=12.5993#map=17/55.6929/12.5993',
  },
  {
    id: 'tivoli',
    nombre: 'Tivoli',
    foto: 'tivoli',
    categoria: 'imprescindible',
    zona: 'Junto a la Estación Central',
    precio: '~160 kr entrada · atracciones aparte',
    tiempo: 'Media tarde',
    texto: 'Parque de atracciones de 1843, el segundo más antiguo del mundo que sigue abierto. ' +
           'Walt Disney vino aquí y se le ocurrió lo suyo. La montaña rusa de madera es de 1914 ' +
           'y todavía lleva un frenador a bordo.',
    consejo: 'La entrada y las atracciones se pagan por separado; si no vas a montarte en nada, ' +
             'la entrada sola merece la pena de noche, cuando encienden las luces. ' +
             'Abre por temporadas: verano, Halloween y Navidad. Comprueba fechas antes de ir.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6736&mlon=12.5681#map=17/55.6736/12.5681',
  },
  {
    id: 'rundetaarn',
    nombre: 'Rundetårn (la Torre Redonda)',
    foto: 'rundetaarn',
    categoria: 'imprescindible',
    zona: 'Centro',
    precio: '~40 kr',
    tiempo: '45 min',
    texto: 'Observatorio de 1642 con una rampa helicoidal en espiral en lugar de escaleras: ' +
           'se construyó así para poder subir el instrumental a caballo. Arriba tienes la mejor ' +
           'vista de tejados del centro.',
    consejo: 'Es la subida más fácil y barata de la ciudad, sin colas eternas. ' +
             'A mitad de camino hay una sala de exposiciones que casi nadie mira.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6813&mlon=12.5757#map=18/55.6813/12.5757',
  },
  {
    id: 'christiansborg',
    nombre: 'Christiansborg',
    foto: 'christiansborg',
    categoria: 'imprescindible',
    zona: 'Slotsholmen',
    precio: 'Torre gratis · salas ~180 kr',
    tiempo: '1–2 h',
    texto: 'El único edificio del mundo que aloja los tres poderes del Estado a la vez: parlamento ' +
           '(Folketinget), Tribunal Supremo y despacho del primer ministro. Debajo se pueden ver ' +
           'las ruinas del castillo del obispo Absalón, de 1167.',
    consejo: 'La torre es la más alta de Copenhague y subir es GRATIS (solo pasas un control de ' +
             'seguridad). Mejores vistas que Rundetårn y no cuesta nada.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6761&mlon=12.5797#map=17/55.6761/12.5797',
  },
  {
    id: 'rosenborg',
    nombre: 'Rosenborg + Kongens Have',
    foto: 'rosenborg',
    categoria: 'imprescindible',
    zona: 'Centro norte',
    precio: 'Jardín gratis · castillo ~140 kr',
    tiempo: '1–2 h',
    texto: 'Castillo renacentista de Christian IV (1606) rodeado del jardín público más antiguo ' +
           'de Dinamarca. En el sótano están las joyas de la Corona danesa, que se siguen usando.',
    consejo: 'Aunque no entres al castillo, el parque (Kongens Have) es el sitio donde media ' +
             'Copenhague hace picnic en cuanto sale el sol. Lleva manta.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6857&mlon=12.5773#map=17/55.6857/12.5773',
  },
  {
    id: 'amalienborg',
    nombre: 'Amalienborg',
    foto: 'amalienborg',
    categoria: 'imprescindible',
    zona: 'Frederiksstaden',
    precio: 'Plaza gratis · museo ~125 kr',
    tiempo: '30 min',
    texto: 'Residencia de la familia real: cuatro palacios rococó idénticos alrededor de una plaza ' +
           'octogonal. Si ondea la bandera, la reina está en casa.',
    consejo: 'El cambio de guardia es a las 12:00 todos los días; si el monarca está en palacio, ' +
             'la guardia sale desde Rosenborg con banda de música y cruza media ciudad sobre las 11:30.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6841&mlon=12.5934#map=17/55.6841/12.5934',
  },
  {
    id: 'marmorkirken',
    nombre: 'Marmorkirken (Iglesia de Mármol)',
    foto: 'marmorkirken',
    categoria: 'imprescindible',
    zona: 'Frederiksstaden',
    precio: 'Gratis · cúpula ~60 kr',
    tiempo: '30 min',
    texto: 'Su cúpula de 31 m de diámetro es la mayor de Escandinavia. Tardaron 145 años en ' +
           'terminarla: se quedaron sin dinero y estuvo en ruinas casi un siglo.',
    consejo: 'Se puede subir a la cúpula, pero solo en visitas guiadas a horas concretas ' +
             '(normalmente fines de semana). Justo enfrente tienes Amalienborg.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6846&mlon=12.5914#map=18/55.6846/12.5914',
  },

  /* --------------------------------------------------------- BARRIOS */
  {
    id: 'christiania',
    nombre: 'Freetown Christiania',
    foto: 'christiania',
    categoria: 'barrio',
    zona: 'Christianshavn',
    precio: 'Gratis',
    tiempo: '1–2 h',
    texto: 'Comuna autoproclamada independiente desde 1971 en un antiguo cuartel militar. ' +
           'Casas autoconstruidas, talleres, murales, conciertos y un ambiente que no se parece ' +
           'a nada más en la ciudad. Viven allí unas 900 personas.',
    consejo: 'REGLA DE ORO: prohibido hacer fotos en la parte central (Pusher Street y alrededores), ' +
             'y te lo van a recordar. Fuera de esa zona no hay problema. ' +
             'Entra por Prinsessegade, pasea, tómate algo en Nemoland y sal por la puerta del ' +
             '"You are now entering the EU". No compres nada ilegal.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6736&mlon=12.5993#map=16/55.6736/12.5993',
  },
  {
    id: 'stroget',
    nombre: 'Strøget y el centro peatonal',
    foto: 'stroget',
    categoria: 'barrio',
    zona: 'Centro',
    precio: 'Gratis (mirar)',
    tiempo: '1 h',
    texto: 'Una de las calles peatonales más largas de Europa: 1,1 km desde Rådhuspladsen ' +
           '(plaza del ayuntamiento) hasta Kongens Nytorv. De cadenas baratas al principio ' +
           'a tiendas de lujo al final.',
    consejo: 'Sal de la calle principal: las paralelas (Strædet, Pilestræde, Kronprinsensgade) ' +
             'tienen las tiendas y cafés interesantes. En Gråbrødretorv hay una plaza preciosa ' +
             'a 30 segundos del gentío.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6785&mlon=12.5755#map=16/55.6785/12.5755',
  },
  {
    id: 'kastellet',
    nombre: 'Kastellet',
    foto: 'kastellet',
    categoria: 'barrio',
    zona: 'Østerbro / Langelinie',
    precio: 'Gratis',
    tiempo: '45 min',
    texto: 'Fortaleza con forma de estrella de cinco puntas, de 1626, todavía en uso militar ' +
           'y a la vez parque público. Barracones rojos, murallas verdes y un molino de viento.',
    consejo: 'Es el mejor sitio del centro para correr o pasear al atardecer, y está pegado a ' +
             'la Sirenita: junta las dos visitas.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6907&mlon=12.5947#map=16/55.6907/12.5947',
  },
  {
    id: 'superkilen',
    nombre: 'Superkilen',
    foto: 'superkilen',
    categoria: 'barrio',
    zona: 'Nørrebro',
    precio: 'Gratis',
    tiempo: '30 min',
    texto: 'Parque urbano diseñado por BIG con objetos traídos de los 60 países de los vecinos ' +
           'del barrio: una fuente marroquí, bancos brasileños, un ring de boxeo tailandés, ' +
           'señales de tráfico rusas. El suelo rojo y la plaza negra ondulada son la postal.',
    consejo: 'Está en Nørrebro, el barrio más joven de la ciudad. Aprovecha para bajar por ' +
             'Jægersborggade (calle de tiendecitas y cafés) y ver el cementerio Assistens, ' +
             'donde está enterrado Andersen y donde la gente hace picnic sin ningún problema.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6996&mlon=12.5416#map=17/55.6996/12.5416',
  },
  {
    id: 'reffen',
    nombre: 'Refshaleøen y Reffen',
    foto: 'reffen',
    categoria: 'barrio',
    zona: 'Refshaleøen',
    precio: 'Gratis entrar',
    tiempo: 'Media tarde',
    texto: 'Antiguo astillero convertido en zona de contenedores con street food, galerías, ' +
           'saunas flotantes y espacio para conciertos. Aquí está Reffen, el mercado de comida ' +
           'callejera más grande del norte de Europa (temporada de primavera a otoño).',
    consejo: 'Se llega en el autobús 2A o, mucho mejor, en el barco-autobús 991/992, que cuenta ' +
             'como transporte público normal: con tu billete o el check-in de Rejsekort. ' +
             'Es el paseo en barco más barato de Copenhague.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6924&mlon=12.6110#map=15/55.6924/12.6110',
  },
  {
    id: 'frederiksberg',
    nombre: 'Frederiksberg Have',
    foto: 'frederiksberg',
    categoria: 'barrio',
    zona: 'Frederiksberg',
    precio: 'Gratis',
    tiempo: '1–2 h',
    texto: 'Jardín romántico con canales, sauces y un palacio en lo alto. Desde uno de sus ' +
           'bordes se ven gratis los elefantes del zoo, que está pared con pared.',
    consejo: 'Combínalo con el barrio de Værnedamsvej, la "calle francesa" de Copenhague, ' +
             'llena de bares de vino y tiendas de comida.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6735&mlon=12.5241#map=16/55.6735/12.5241',
  },

  /* ---------------------------------------------------------- MUSEOS */
  {
    id: 'glyptoteket',
    nombre: 'Ny Carlsberg Glyptotek',
    foto: 'glyptoteket',
    categoria: 'museo',
    zona: 'Junto a Tivoli',
    precio: '~135 kr · martes GRATIS',
    tiempo: '2 h',
    texto: 'Colección del fundador de Carlsberg: escultura antigua (Egipto, Grecia, Roma) y ' +
           'una sala entera de Rodin y de impresionistas franceses. El jardín de invierno con ' +
           'palmeras bajo una cúpula de cristal es de los sitios más bonitos de la ciudad.',
    consejo: 'Los martes la entrada es gratuita. Plan perfecto para un día de lluvia. ' +
             'La cafetería del jardín de invierno merece la pena aunque no veas el museo.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6727&mlon=12.5725#map=18/55.6727/12.5725',
  },
  {
    id: 'bibliotek',
    nombre: 'Den Sorte Diamant (Diamante Negro)',
    foto: 'bibliotek',
    categoria: 'museo',
    zona: 'Slotsholmen',
    precio: 'Gratis',
    tiempo: '30–60 min',
    texto: 'Ampliación de la Biblioteca Real: un bloque de granito negro pulido inclinado sobre ' +
           'el agua. Por dentro tiene un atrio de siete plantas con vistas al puerto y salas ' +
           'de lectura donde puedes sentarte aunque no seas estudiante.',
    consejo: 'Entrar es gratis. Si llueve, es un refugio con vistas y wifi. Suele haber ' +
             'exposiciones pequeñas sin coste.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6733&mlon=12.5822#map=18/55.6733/12.5822',
  },
  {
    id: 'operaen',
    nombre: 'Operaen (Ópera de Copenhague)',
    foto: 'operaen',
    categoria: 'museo',
    zona: 'Holmen',
    precio: 'Gratis por fuera',
    tiempo: '20 min',
    texto: 'Uno de los edificios de ópera más caros jamás construidos, regalo de la fundación ' +
           'Mærsk a la ciudad. Está justo enfrente de Amalienborg y de Marmorkirken: los tres ' +
           'están alineados a propósito en el mismo eje.',
    consejo: 'Se ve perfectamente desde el paseo de Amalienborg, al otro lado del agua. ' +
             'Para cruzar, coge el barco-autobús 991/992 desde Nyhavn.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6816&mlon=12.6003#map=17/55.6816/12.6003',
  },
  {
    id: 'torvehallerne',
    nombre: 'Torvehallerne',
    foto: 'torvehallerne',
    categoria: 'museo',
    zona: 'Nørreport',
    precio: 'Gratis entrar',
    tiempo: '1 h',
    texto: 'Dos naves de cristal junto a la estación de Nørreport con más de 60 puestos: ' +
           'pescado, quesos, smørrebrød, café de tueste propio, tapas y un puesto de porridge ' +
           'que es muy danés y muy raro a la vez.',
    consejo: 'Sitio ideal para comer bien sin reservar y sin gastarte una fortuna. ' +
             'Cierra pronto (sobre las 19–20 h). El puesto de Hija de Sanchez, de tacos, ' +
             'lo montó una cocinera que estuvo en Noma.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6832&mlon=12.5697#map=18/55.6832/12.5697',
  },

  /* ------------------------------------------------------ EXCURSIONES */
  {
    id: 'louisiana',
    nombre: 'Museo Louisiana',
    foto: 'louisiana',
    categoria: 'excursion',
    zona: 'Humlebæk · 35 min en tren',
    precio: '~160 kr + tren',
    tiempo: 'Medio día',
    texto: 'Probablemente el mejor museo de Dinamarca: arte moderno en pabellones bajos ' +
           'metidos en un parque de esculturas sobre un acantilado, mirando a Suecia. ' +
           'Calder, Giacometti, Yayoi Kusama.',
    consejo: 'Tren regional desde København H o desde Lyngby haciendo transbordo, dirección ' +
             'Helsingør, parada Humlebæk, y 10 minutos andando. Si hace bueno, el parque de ' +
             'esculturas vale tanto como el museo.',
    mapa: 'https://www.openstreetmap.org/?mlat=55.9694&mlon=12.5419#map=16/55.9694/12.5419',
  },
  {
    id: 'kronborg',
    nombre: 'Castillo de Kronborg (Helsingør)',
    foto: 'kronborg',
    categoria: 'excursion',
    zona: 'Helsingør · 45 min en tren',
    precio: '~160 kr + tren',
    tiempo: 'Medio día',
    texto: 'El castillo de Hamlet, Patrimonio de la Humanidad, en la punta más estrecha del ' +
           'estrecho de Øresund: desde las murallas se ve Suecia a 4 km. En los sótanos duerme ' +
           'la estatua de Holger Danske, que según la leyenda despertará si Dinamarca corre peligro.',
    consejo: 'Se puede juntar con Louisiana en el mismo día (están en la misma línea de tren). ' +
             'Y desde Helsingør salen ferris a Suecia de 20 minutos, que la gente usa para ' +
             'comprar alcohol barato.',
    mapa: 'https://www.openstreetmap.org/?mlat=56.0390&mlon=12.6216#map=16/56.0390/12.6216',
  },
  {
    id: 'roskilde',
    nombre: 'Roskilde: catedral y barcos vikingos',
    foto: 'roskilde',
    categoria: 'excursion',
    zona: 'Roskilde · 25 min en tren',
    precio: 'Catedral ~80 kr · museo ~160 kr',
    tiempo: 'Medio día',
    texto: 'La antigua capital de Dinamarca. Su catedral de ladrillo es Patrimonio de la ' +
           'Humanidad y contiene las tumbas de casi 40 reyes y reinas. A diez minutos andando, ' +
           'el Museo de Barcos Vikingos expone cinco barcos hundidos a propósito en el fiordo ' +
           'hacia el año 1070.',
    consejo: 'Tren directo y frecuente desde København H. Si vais en verano se puede navegar ' +
             'en una réplica de barco vikingo (hay que remar de verdad).',
    mapa: 'https://www.openstreetmap.org/?mlat=55.6426&mlon=12.0803#map=16/55.6426/12.0803',
  },
];
