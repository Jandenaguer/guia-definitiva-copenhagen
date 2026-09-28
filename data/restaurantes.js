/* ==========================================================================
   restaurantes.js  ·  Sitios de comer
   --------------------------------------------------------------------------
   ESTO ES TUYO, MARIO. Los primeros son un punto de partida para que la
   página no salga vacía; los de abajo (estado: 'vacia') son fichas en blanco
   para que las rellenes tú.

   Campos de cada ficha:
     nombre    Cómo se llama
     tipo      'Panadería', 'Smørrebrød', 'Cerveza', 'Tacos'…
     precio    '€', '€€', '€€€' o '€€€€'
     zona      Barrio o ciudad
     porque    POR QUÉ lo recomiendas (lo más importante de todo)
     direccion Calle y número
     web       URL (o '' si no tiene / no la sabes)
     estado    'ok' = se muestra normal · 'vacia' = ficha gris para rellenar

   Para añadir uno: copia un bloque { ... } entero y cámbialo.
   Para quitarlo: borra el bloque entero, incluida la coma final.
   ========================================================================== */

window.DATA_RESTAURANTES = [

  /* =================================================== EJEMPLOS CONOCIDOS
     Son sitios de referencia en la ciudad. Compruébalos antes de ir:
     horarios y precios cambian, y algunos piden reserva.                  */

  {
    nombre: 'Torvehallerne',
    tipo: 'Mercado / muchos puestos',
    precio: '€€',
    zona: 'Nørreport',
    porque: 'Si no sabéis qué comer, aquí acertáis siempre: cada uno pilla de un puesto ' +
            'distinto y os sentáis juntos. Smørrebrød, pescado, tacos, café bueno.',
    direccion: 'Frederiksborggade 21',
    web: 'https://torvehallernekbh.dk/',
    estado: 'ok',
  },
  {
    nombre: 'Reffen',
    tipo: 'Street food al aire libre',
    precio: '€€',
    zona: 'Refshaleøen',
    porque: 'Contenedores con comida de medio mundo junto al agua, mesas comunales y ' +
            'atardeceres largos. El plan de tarde-noche más fácil cuando hace bueno.',
    direccion: 'Refshalevej 167A',
    web: 'https://reffen.dk/',
    estado: 'ok',
  },
  {
    nombre: 'DØP (Den Økologiske Pølsemand)',
    tipo: 'Perrito caliente ecológico',
    precio: '€',
    zona: 'Junto a Rundetårn',
    porque: 'El pølsevogn (carrito de salchichas) que hay que probar: pan de masa madre, ' +
            'salchicha ecológica y cebolla frita. Comida callejera danesa de verdad, barata.',
    direccion: 'Købmagergade 52 (al lado de la Torre Redonda)',
    web: '',
    estado: 'ok',
  },
  {
    nombre: 'Restaurant Schønnemann',
    tipo: 'Smørrebrød clásico',
    precio: '€€€',
    zona: 'Centro',
    porque: 'Sótano de 1877 donde se come el smørrebrød tradicional como se ha comido ' +
            'siempre, con su snaps al lado. Solo abre a mediodía. Hay que reservar.',
    direccion: 'Hauser Plads 16',
    web: 'https://restaurantschonnemann.dk/',
    estado: 'ok',
  },
  {
    nombre: 'Sankt Peders Bageri',
    tipo: 'Panadería',
    precio: '€',
    zona: 'Centro (Latinerkvarteret)',
    porque: 'La panadería más antigua de Copenhague. Los miércoles hacen el "onsdagssnegl", ' +
            'un caracol de canela gigante, y se hace cola en la calle. Ritual obligatorio ' +
            'si estáis aquí un miércoles.',
    direccion: 'Sankt Peders Stræde 29',
    web: '',
    estado: 'ok',
  },
  {
    nombre: 'Kødbyen (Meatpacking District)',
    tipo: 'Zona de bares y restaurantes',
    precio: '€€–€€€',
    zona: 'Vesterbro',
    porque: 'Antiguo matadero lleno de sitios en naves blancas: pizza, pescado, cervecerías ' +
            'y bares que aguantan hasta tarde. Es la zona a la que ir de noche entre semana ' +
            'sin complicarse.',
    direccion: 'Flæsketorvet, Vesterbro',
    web: '',
    estado: 'ok',
  },
  {
    nombre: 'Mikkeller / WarPigs',
    tipo: 'Cerveza artesana',
    precio: '€€',
    zona: 'Vesterbro y varios',
    porque: 'Mikkeller es la cervecera que puso a Dinamarca en el mapa cervecero. ' +
            'Tienen varios bares por la ciudad; WarPigs, en Kødbyen, junta cerveza propia ' +
            'con barbacoa tejana.',
    direccion: 'Flæsketorvet 25–37 (WarPigs)',
    web: 'https://warpigs.dk/',
    estado: 'ok',
  },
  {
    nombre: 'Grød',
    tipo: 'Porridge (gachas) saladas y dulces',
    precio: '€',
    zona: 'Nørrebro y otros',
    porque: 'Suena raro y funciona: un local dedicado entero a las gachas, dulces y saladas. ' +
            'Es barato, llena y es una cosa muy de aquí. Desayuno o comida rápida.',
    direccion: 'Jægersborggade 50',
    web: 'https://groed.com/',
    estado: 'ok',
  },
  {
    nombre: 'La Banchina',
    tipo: 'Vino natural y bocados junto al agua',
    precio: '€€',
    zona: 'Refshaleøen',
    porque: 'Cabaña diminuta al borde del puerto con una escalera para bañarse y una sauna. ' +
            'En verano es el sitio con más ambiente de la ciudad; en invierno se sauna y se ' +
            'salta al agua helada.',
    direccion: 'Refshalevej 141A',
    web: 'https://labanchina.dk/',
    estado: 'ok',
  },
  {
    nombre: 'Hija de Sánchez',
    tipo: 'Tacos',
    precio: '€€',
    zona: 'Torvehallerne / Kødbyen',
    porque: 'Tacos con nixtamal hecho aquí, montado por una cocinera que pasó por la alta ' +
            'cocina nórdica. Cuando echéis de menos comer algo picante, es aquí.',
    direccion: 'Torvehallerne y Slagterboderne 8',
    web: '',
    estado: 'ok',
  },

  /* ================================================ FICHAS PARA RELLENAR
     Cambia estado a 'ok' cuando la rellenes y desaparecerá el gris.       */

  {
    nombre: 'Tu sitio favorito de Lyngby',
    tipo: '¿Qué tipo de comida?',
    precio: '€€',
    zona: 'Kongens Lyngby',
    porque: 'Escribe aquí por qué lo recomiendas y qué hay que pedir.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
  {
    nombre: 'El kebab / after de vuelta a casa',
    tipo: 'Comida rápida',
    precio: '€',
    zona: 'Lyngby',
    porque: 'Ese sitio que abre tarde y salva la noche. Pon el nombre y hasta qué hora abre.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
  {
    nombre: 'Desayuno / brunch',
    tipo: 'Brunch',
    precio: '€€',
    zona: '',
    porque: 'El brunch en Copenhague es un deporte nacional. Apunta el que te convenció.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
  {
    nombre: 'Barato de verdad',
    tipo: '',
    precio: '€',
    zona: '',
    porque: 'Para cuando venga alguien con el presupuesto justo.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
  {
    nombre: 'Para una ocasión especial',
    tipo: '',
    precio: '€€€€',
    zona: '',
    porque: 'El sitio al que llevarías a tus padres. Apunta si hay que reservar y con cuánto tiempo.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
  {
    nombre: 'Bar de la noche',
    tipo: 'Bar / copas',
    precio: '€€',
    zona: '',
    porque: 'Dónde empieza la noche y hasta qué hora aguanta.',
    direccion: '',
    web: '',
    estado: 'vacia',
  },
];
