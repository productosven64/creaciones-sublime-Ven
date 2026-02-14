# Guardar envíos del formulario en Google Sheets

Esta guía explica cómo crear un Google Apps Script que reciba los envíos del formulario de contacto y los guarde en una hoja de cálculo (Google Sheets), desplegarlo como Web App y conectar la URL en `main.js` de este proyecto.

Pasos resumidos:
- Crear una hoja nueva en Google Sheets (p. ej. `ContactResponses`). Copia el ID desde la URL.
- Crear un proyecto en script.google.com y pegar el código `Code.gs` que incluyo abajo.
- Reemplazar `SPREADSHEET_ID` con el ID de tu hoja.
- Desplegar como "Web app" (acceso: "Cualquiera, incluso anónimo"). Copia la URL `/exec`.
- Pegar esa URL en `SHEETS_WEBHOOK_URL` dentro de `creaciones-sublime/main.js`.
- Abrir el sitio localmente y enviar un formulario para probar.

---

## Código Apps Script (Code.gs)

Crea un nuevo proyecto en https://script.google.com, añade este archivo `Code.gs` y reemplaza `SPREADSHEET_ID`.

```javascript
const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_SPREADSHEET_ID'; // ID de tu hoja de cálculo
const SHEET_NAME = 'FormResponses'; // Nombre de la hoja donde se guardarán los registros

function doPost(e) {
  try {
    const payload = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const row = [
      new Date(),
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.subject || '',
      payload.message || ''
    ];
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Despliegue como Web App

1. En el editor de Apps Script: `Deploy` → `New deployment`.
2. Selecciona "Web app".
3. En "Who has access" elige "Anyone" / "Anyone, even anonymous" para permitir POST desde tu sitio.
4. Haz click en `Deploy`. Copia la `Web app URL` (termina en `/exec`).

Nota: permitir acceso anónimo es necesario si no quieres autenticar peticiones desde el navegador. Asegúrate de usar una hoja dedicada y revisar permisos.

---

## Configurar `main.js`

Abre `creaciones-sublime/main.js` y busca la constante `SHEETS_WEBHOOK_URL`. Reemplaza su valor por la URL `/exec` que obtuviste al desplegar.

Ejemplo:

```javascript
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxxxxx/exec';
```

Guarda el archivo y recarga la página en el navegador.

---

## Prueba local (servir archivos estáticos)

Opciones para servir la carpeta localmente y abrir en el navegador:
- VS Code: instala la extensión `Live Server` y abre `index.html`, luego `Go Live`.
- Node (si tienes npm): instalar `http-server` y ejecutarlo:

```powershell
npm install -g http-server
cd "c:\Users\COMPU SOL\Desktop\antropi\pruebas\landy page\creaciones-sublime"
http-server -c-1
```

- Python (si está disponible):

```powershell
cd "c:\Users\COMPU SOL\Desktop\antropi\pruebas\landy page\creaciones-sublime"
python -m http.server 8000
```

Abre `http://localhost:8000` (o el puerto que indique) y envía el formulario.

---

## Posibles problemas y soluciones

- CORS / Preflight: si el navegador bloquea la petición por CORS, asegúrate de desplegar la Web App con acceso "Anyone, even anonymous". Si persiste, prueba desde un servidor local (Live Server) o usar un proxy.
- Error 403/401 al llamar al webhook: revisa los permisos del despliegue y que el `SPREADSHEET_ID` sea correcto.
- No aparecen filas en la hoja: abre la hoja y revisa si existe la pestaña `FormResponses` (o la hoja activa); revisa el historial de ejecuciones en Apps Script (`Executions`) para ver errores.

---

Si quieres, puedo:
- Generar y actualizar `main.js` con la URL si me la pegas aquí.
- O guiarte paso a paso mientras despliegas el Web App.

Fin.
