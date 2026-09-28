# Guía definitiva de Copenhague

Web-guía de Copenhague y Kongens Lyngby para los amigos que vienen de visita, con
**calendario de visitas compartido**. Estética web de los 2000: ventanas de Windows,
pixel art, marquesinas y contador de visitas.

- **HTML, CSS y JavaScript puros.** Sin frameworks, sin `npm`, sin paso de compilación.
- **Se abre haciendo doble clic en `index.html`.** No necesitas servidor para verla.
- **Se despliega en GitLab Pages.**
- **Las reservas se guardan en Google Sheets** y te avisan por Gmail.

---

## Índice

1. [Qué hay en cada archivo](#1-qué-hay-en-cada-archivo)
2. [Cómo editar el contenido](#2-cómo-editar-el-contenido)
3. [Montar el backend de reservas](#3-montar-el-backend-de-reservas)
4. [Migrar de GitHub a GitLab y publicar](#4-migrar-de-github-a-gitlab-y-publicar)
5. [Cosas pendientes](#5-cosas-pendientes)

---

## 1. Qué hay en cada archivo

```
index.html            Portada (escritorio de iconos)
transporte.html       Apps, zonas, precios, casa→centro, aeropuerto, noche, bici
lyngby.html           Lyngby Centrum
cerca-de-casa.html    Dyrehave, Bakken, playa, lagos, Frilandsmuseet
monumentos.html       Nyhavn, Tivoli, Rosenborg… (se dibuja desde data/)
restaurantes.html     Tarjetas de restaurantes (se dibuja desde data/)
planes.html           Planes de día, noche, gratis y de lluvia (desde data/)
util.html             Dinero, idioma, clima, emergencias, costumbres
calendario.html       ⭐ Calendario de visitas
admin.html            Panel para borrar y editar reservas
creditos.html         Atribución de todas las fotos
404.html              Pantalla azul de error

css/win98.css         Ventanas, botones, biseles, barra de tareas
css/retro.css         Marquesinas, tarjetas, contador, banners, avisos
css/calendario.css    Rejilla del mes y formulario

js/config.js          ⚙️ LO ÚNICO QUE TIENES QUE TOCAR: la URL del backend
js/ui.js              Barra de tareas, menú Inicio, reloj, contador, zumbido
js/contenido.js       Pinta las tarjetas a partir de data/
js/api.js             Cliente del backend (y modo demo sin backend)
js/calendario.js      Calendario, solapes y formulario
js/admin.js           Login y edición/borrado

data/monumentos.js    ✏️ Textos de los monumentos
data/restaurantes.js  ✏️ Tus restaurantes
data/planes.js        ✏️ Los planes
data/creditos.js      Autoría y licencia de cada foto (generado, editable)

img/pixel/            Pixel art propio (SVG): logo, iconos, banners 88x31
img/fotos/            Fotos de Wikimedia Commons

backend/Code.gs       Script para pegar en Google Apps Script
backend/README.md     Instalación del backend, paso a paso
.gitlab-ci.yml        Publicación automática en GitLab Pages
```

---

## 2. Cómo editar el contenido

### Cambiar un texto normal

Los textos largos (transporte, Lyngby, cerca de casa, info útil) están **directamente en
el HTML**. Abre el `.html` que toque con cualquier editor, busca el párrafo y cámbialo.
No hace falta saber HTML: escribe entre las etiquetas y ya.

### Añadir un restaurante

Abre `data/restaurantes.js`. Cada sitio es un bloque entre llaves:

```js
{
  nombre: 'El sitio nuevo',
  tipo: 'Pizza napolitana',
  precio: '€€',
  zona: 'Nørrebro',
  porque: 'Por qué lo recomiendas y qué hay que pedir.',
  direccion: 'Calle tal 12',
  web: 'https://...',
  estado: 'ok',        // 'vacia' lo pinta en gris, como ficha por rellenar
},
```

Copia un bloque entero (con su coma final), pégalo debajo y cámbialo. Igual para
`data/monumentos.js` y `data/planes.js`.

### Cambiar una foto

1. Mete tu foto en `img/fotos/` con el mismo nombre que la que sustituyes
   (por ejemplo `nyhavn.jpg`). Redimensiónala a **800–1000 px de ancho**: si no, la
   web pesa demasiado para el móvil.
2. Abre `data/creditos.js` y en esa entrada pon
   `autor: "Mario"`, `licencia: "Foto propia"`, `fuente: ""`.

Para una foto **nueva**, añade una entrada con clave nueva en `data/creditos.js` y úsala:

- En una tarjeta de monumento: `foto: 'tu-clave'` en `data/monumentos.js`.
- En cualquier página: `<div data-foto="tu-clave" data-alt="Descripción"></div>`.

Donde no haya foto sale automáticamente un **placeholder amarillo de rayas** con el
nombre de archivo que tienes que crear. Ahora mismo hay dos:
**la Sirenita** (la escultura tiene derechos de autor y en Dinamarca no hay libertad de
panorama para obras de arte, así que no existen fotos libres) y **Lyngby Centrum**
(simplemente no hay ninguna decente en Wikimedia).

### Añadir una página nueva

1. Copia `lyngby.html`, renómbrala y cambia el contenido.
2. Añádela al menú: abre `js/ui.js` y mete una línea en la lista `MENU` de arriba.
   El menú Inicio y la barra de tareas de **todas** las páginas se actualizan solos.

### Cambiar los colores

Todo el sistema de color vive en el bloque `:root` de `css/win98.css`. Cambia ahí los
valores y se propaga a toda la web.

---

## 3. Montar el backend de reservas

Está explicado con detalle y capturas mentales en **[`backend/README.md`](backend/README.md)**.
Resumen de diez líneas:

1. Crea una hoja de cálculo en Google Drive.
2. **Extensiones ▸ Apps Script**, borra lo que haya y pega `backend/Code.gs`.
3. **Configuración del proyecto ▸ Propiedades del script**, añade:
   - `ADMIN_PASSWORD` → la contraseña del panel admin
   - `NOTIFY_EMAIL` → tu Gmail
4. Ejecuta la función **`instalar`** y acepta los permisos.
5. **Implementar ▸ Nueva implementación ▸ Aplicación web**, con
   *Ejecutar como: Yo* y *Quién tiene acceso: Cualquier usuario*.
6. Copia la URL que acaba en `/exec` y pégala en `js/config.js`:

```js
API_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
```

> **Mientras `API_URL` esté vacío**, el calendario funciona en *modo demo*: se ve todo y
> se puede probar, pero las reservas se guardan solo en tu navegador y no se envía
> ningún correo. Sale un cartel amarillo avisando.

### Sobre las contraseñas

**En este repositorio no hay ninguna clave secreta, y no debe haberla nunca.** La
contraseña de administrador y tu correo viven en las *Script Properties* de Apps Script,
que es servidor. `js/config.js` solo contiene la URL pública del backend, que no es un
secreto: sin la contraseña, esa URL solo deja listar reservas y crear una nueva, que es
exactamente lo que queremos que puedan hacer tus amigos.

---

## 4. Migrar de GitHub a GitLab y publicar

Ahora mismo el repositorio apunta a GitHub. GitLab Pages necesita que el código esté en
GitLab. Tienes dos formas; la segunda es más limpia.

### Opción A · Añadir GitLab como segundo remoto (rápida)

Mantienes GitHub y añades GitLab al lado.

```bash
# 1. Crea un proyecto VACÍO en gitlab.com (sin README, sin .gitignore)
#    Nombre sugerido: guia-definitiva-copenhagen

# 2. Añádelo como remoto
git remote add gitlab https://gitlab.com/TU-USUARIO/guia-definitiva-copenhagen.git

# 3. Sube la rama principal
git push -u gitlab main
```

A partir de ahí, `git push gitlab main` publica y `git push origin main` sigue
actualizando GitHub.

### Opción B · Importar el repositorio desde GitLab (recomendada)

1. En gitlab.com: **New project ▸ Import project ▸ GitHub**.
2. Autoriza GitLab en tu cuenta de GitHub y elige `guia-definitiva-copenhagen`.
3. GitLab se trae el repositorio con todo su historial.
4. En tu copia local, apunta `origin` a GitLab:

```bash
git remote set-url origin https://gitlab.com/TU-USUARIO/guia-definitiva-copenhagen.git
git push origin main
```

### Activar Pages

1. El archivo `.gitlab-ci.yml` ya está en el repositorio, así que en cuanto hagas push
   se lanza un *pipeline* solo.
2. Míralo en **Build ▸ Pipelines**. Debe quedar en verde en menos de un minuto.
3. La dirección de la web sale en **Deploy ▸ Pages**. Normalmente es:

```
https://TU-USUARIO.gitlab.io/guia-definitiva-copenhagen/
```

4. La primera vez puede tardar unos minutos en estar accesible.

> **Ojo con la visibilidad.** Si el proyecto es privado, por defecto GitLab Pages
> también lo es y tus amigos no podrán abrir la web. En
> **Settings ▸ General ▸ Visibility** pon las *Pages* como públicas, o haz público el
> proyecto entero (no hay nada secreto en él).

### Dominio propio (opcional)

En **Deploy ▸ Pages ▸ New Domain** puedes conectar un dominio tuyo. GitLab te da un
certificado HTTPS gratis con Let's Encrypt.

### Probar en local antes de subir

Doble clic en `index.html` funciona para todo. Si quieres verlo como se verá en
producción (y probarlo desde el móvil de la misma wifi):

```bash
# Con Node instalado
npx serve .

# O con Python
python -m http.server 8000
```

Y abre `http://localhost:8000`.

---

## 5. Cosas pendientes

- [ ] Rellenar las fichas grises de `data/restaurantes.js` (hay 6 en blanco).
- [ ] Hacer una foto de **Lyngby Centrum** y otra de **la Sirenita** y sustituir los dos
      placeholders amarillos.
- [ ] Hacer una foto del **tranvía nuevo (Letbane)** para `transporte.html`: es tan
      reciente que todavía no hay fotos libres en Wikimedia.
- [ ] Confirmar por dónde pasa exactamente el **150S** ahora mismo y cuál es la parada de
      Letbane más cercana al portal — la red cambió en diciembre de 2025 y en agosto de
      2026, y eso lo sabes tú mejor que ninguna fuente de internet.
- [ ] Montar el backend y quitar el cartel de MODO DEMO.

---

## Créditos

- **Fotografías:** Wikimedia Commons, bajo licencias libres. El detalle de autor y
  licencia de cada una está en [`creditos.html`](creditos.html) y en `data/creditos.js`.
- **Mapas:** enlaces a OpenStreetMap, © colaboradores de OpenStreetMap.
- **Pixel art, logotipo, iconos y botones 88x31:** originales, hechos en SVG para esta
  web. No se ha copiado ningún gráfico de Habbo Hotel, MSN Messenger ni Microsoft: el
  aire retro está reconstruido desde cero con CSS.
- **Datos de transporte:** verificados en septiembre de 2026 con DOT, Rejsekort, DSB y
  Hovedstadens Letbane. Las tarifas se revisan cada enero.
