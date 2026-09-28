# Backend de reservas · Google Apps Script + Google Sheets

Esto es lo que guarda las reservas de verdad (compartidas entre todos, no solo en tu
navegador) y lo que te manda el correo a Gmail cuando alguien se apunta.

**Es gratis, no hace falta tarjeta, y no hay servidor que mantener.** La base de datos es
una hoja de cálculo tuya de Google Drive y el correo sale de tu propio Gmail.

---

## Por qué Apps Script y no Supabase o Firebase

| | Apps Script + Sheets | Supabase | Firebase |
|---|---|---|---|
| Coste | Gratis | Gratis con límites | Gratis, pero Functions pide tarjeta |
| Enviar email | Incluido (`MailApp`), sale de tu Gmail | Hace falta una Edge Function + Resend/SendGrid | Hace falta Cloud Functions + proveedor |
| Ver/editar los datos a mano | Abres la hoja de cálculo | Panel web | Consola |
| Secretos fuera del frontend | Sí (*Script Properties*) | La clave `anon` va en el frontend | Igual |
| Piezas que montar | 1 | 3 | 3 |

Para lo que necesitas —guardar unas cuantas reservas y recibir un aviso— la opción con
menos piezas es claramente la primera.

---

## Instalación paso a paso

### 1. Crear la hoja de cálculo

1. Entra en [sheets.google.com](https://sheets.google.com) con tu cuenta de Gmail.
2. Crea una hoja en blanco.
3. Ponle un nombre reconocible, por ejemplo **"Visitas Copenhague"**.

No hace falta que crees ninguna columna: el script lo hace solo.

### 2. Pegar el script

1. En esa misma hoja: menú **Extensiones ▸ Apps Script**.
2. Se abre el editor con un archivo `Código.gs` que trae una función vacía.
   **Bórralo todo.**
3. Abre `backend/Code.gs` de este repositorio, copia **el archivo entero** y pégalo ahí.
4. Guarda (el icono del disquete, o `Ctrl+S`).
5. Arriba a la izquierda ponle nombre al proyecto, por ejemplo *Reservas Copenhague*.

### 3. Configurar la contraseña y tu correo

Aquí es donde van los secretos, **fuera del código y fuera de GitLab**.

1. En el editor de Apps Script, icono del engranaje de la izquierda:
   **Configuración del proyecto**.
2. Baja hasta **Propiedades del script** y pulsa **Añadir propiedad de script**.
3. Añade estas dos:

| Propiedad | Valor |
|---|---|
| `ADMIN_PASSWORD` | La contraseña que quieras para el panel de administración |
| `NOTIFY_EMAIL` | Tu dirección de Gmail, donde quieres recibir los avisos |

4. Guarda.

> Estas dos propiedades **nunca salen del servidor**. La web pública no las contiene ni
> puede leerlas: cuando entras en `admin.html`, tu contraseña viaja al script y es el
> script quien la compara.

### 4. Ejecutar `instalar` una vez

1. En el desplegable de funciones de la barra superior, elige **`instalar`**.
2. Pulsa **Ejecutar**.
3. Google te va a pedir permisos. Es normal, es tu propio script:
   - *Revisar permisos* → elige tu cuenta.
   - Saldrá una pantalla de **"Google no ha verificado esta aplicación"**. Pulsa
     **Configuración avanzada** → **Ir a Reservas Copenhague (no seguro)**.
     Sale porque el script es tuyo y no está publicado en ninguna tienda.
   - Acepta los permisos (hoja de cálculo y envío de correo **en tu nombre**).
4. Si todo va bien: se crea la pestaña **Reservas** en la hoja y te llega un correo de
   prueba. Si falta alguna propiedad, el error te dice cuál.

### 5. Publicar la aplicación web

1. Arriba a la derecha: **Implementar ▸ Nueva implementación**.
2. En el engranaje de "Selecciona el tipo", elige **Aplicación web**.
3. Rellena:
   - **Descripción:** lo que quieras.
   - **Ejecutar como:** `Yo (tu@gmail.com)` ← importante, si no no puede escribir ni enviar correo.
   - **Quién tiene acceso:** `Cualquier usuario` ← importante, si no tus amigos no pueden apuntarse.
4. **Implementar**.
5. Copia la **URL de la aplicación web**. Termina en `/exec` y es larga:
   `https://script.google.com/macros/s/AKfycb.../exec`

### 6. Conectar la web

Abre `js/config.js` en este repositorio y pega la URL:

```js
API_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
```

Guarda, haz commit y push. En cuanto GitLab Pages publique, el aviso amarillo de
"MODO DEMO" desaparece y las reservas empiezan a guardarse de verdad.

---

## Comprobar que funciona

1. Abre `calendario.html` y apúntate con un nombre de prueba.
2. Debería pasar todo esto:
   - Aparece el mensaje verde de "¡Apuntado!".
   - La reserva sale en el calendario y en la lista de la derecha.
   - Se añade una fila en la pestaña **Reservas** de tu hoja de cálculo.
   - **Te llega el correo a Gmail** con nombre y fechas.
3. Recarga la página en otro navegador o en el móvil: la reserva sigue ahí.
   (Eso confirma que está en la nube y no en el navegador.)
4. Entra en `admin.html` con tu contraseña y borra la reserva de prueba.
5. Prueba a entrar en `admin.html` con una contraseña mal: tiene que rechazarte.

---

## Cosas que conviene saber

### Si cambias el código del script
Cada vez que edites `Code.gs` tienes que **volver a implementar** para que el cambio
salga a producción: **Implementar ▸ Gestionar implementaciones ▸ el lápiz ▸ Versión:
Nueva versión ▸ Implementar**. La URL no cambia.

### Límites gratuitos
Una cuenta de Gmail normal puede enviar **unos 100 correos al día** desde Apps Script.
Para un calendario de visitas de amigos sobra de largo.

### Los borrados no se pierden
Cuando borras una reserva desde el panel, la fila **no se elimina** de la hoja: se le
pone `borrada` en la columna `estado` y deja de aparecer en la web. Si te arrepientes,
cambias esa celda a `activa` y vuelve.

### Puedes editar directamente en la hoja
La hoja de cálculo es la base de datos de verdad. Si te resulta más cómodo, cambia las
fechas o los nombres ahí mismo y la web lo refleja al recargar. Respeta el formato de
fecha **`AAAA-MM-DD`** (el script lo tolera aunque Sheets lo convierta a fecha, pero es
más limpio si la columna está formateada como *Texto sin formato*).

### El email de tus amigos no se publica
El campo de email del formulario se guarda en la hoja y aparece en el correo que te
llega, pero **no se envía nunca al navegador de los demás**: la función que lista las
reservas lo quita a propósito.

### Si algo falla
En el editor de Apps Script, menú de la izquierda ▸ **Ejecuciones**. Ahí ves cada
llamada y el error exacto si lo hubo.
