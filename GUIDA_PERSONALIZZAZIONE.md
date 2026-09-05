# 🌸 Guida al Sito di Matrimonio - Marco ed Elisa

Congratulazioni per il vostro matrimonio! Questa guida vi spiega come personalizzare, testare e pubblicare la vostra landing page pronta per le partecipazioni.

---

## 📂 Struttura dei File

- **`index.html`**: La pagina web del matrimonio (un'unica pagina scorrevole, pulita e armoniosa).
- **`style.css`**: Lo stile grafico, colori botanici estratti dalla vostra partecipazione, font e sfondo floreale statico.
- **`config.js`**: Il file semplice dove potete modificare **indirizzi, orari, IBAN e link** in 30 secondi.
- **`script.js`**: La logica del countdown, calendario nativo per smartphone e modulo RSVP.
- **`Immagine 08-08-26 - 12.32.PNG`**: La grafica originale della vostra partecipazione usata come copertina e per la palette.

---

## 🚀 1. Come Visualizzare il Sito Subito
Basta fare **doppio clic sul file `index.html`** per aprirlo in Google Chrome, Edge o Safari.

---

## ✏️ 2. Come Personalizzare i Dati in `config.js`
Aprite il file `config.js` con un editor di testo (es. Blocco Note) e modificate i campi:

```javascript
const WEDDING_CONFIG = {
  groom: "Marco",
  bride: "Elisa",
  weddingDate: "2027-04-03T15:00:00", // 3 Aprile 2027

  // Chiesa / Cerimonia
  church: {
    name: "Chiesa di Santa Maria Goretti",
    address: "Via di Santa Maria Goretti, 29, 00199 Roma (RM)",
    time: "Ore 15:00",
    googleMapsUrl: "https://maps.google.com/?q=Chiesa+di+Santa+Maria+Goretti+Via+di+Santa+Maria+Goretti+29+Roma",
    appleMapsUrl: "https://maps.apple.com/?daddr=Via+di+Santa+Maria+Goretti+29+Roma"
  },

  // Ricevimento / Location
  reception: {
    name: "Tenuta / Villa Ricevimento", // Inserite il nome della location
    address: "Via del Ricevimento, Roma (RM)", // Indirizzo
    time: "Ore 17:30",
    googleMapsUrl: "https://maps.google.com/?q=Roma", // Incollate il link di Google Maps
    wazeUrl: "https://waze.com/ul?q=Roma"
  },

  // Lista Nozze & IBAN
  gift: {
    beneficiary: "Marco ed Elisa",
    iban: "IT00 X000 0000 0000 0000 0000 000", // Inserite il vostro IBAN reale
    causale: "Matrimonio Marco ed Elisa"
  },

  // Modulo RSVP
  rsvp: {
    deadline: "15 Febbraio 2027",
    googleSheetsWebhookUrl: "" // Opzionale: URL dello script Google Sheets
  }
};
```

---

## 📊 3. Come Ricevere le Risposte su Google Sheets (Opzionale)
Se volete raccogliere automaticamente le conferme in un foglio Google Drive:

1. Aprite [Google Sheets](https://sheets.google.com) e create un foglio con queste colonne nella prima riga:
   - `Data/Ora` | `Nome` | `Cognome` | `Presenza` | `Allergie/Note Alimentari`
2. Cliccate su **Estensioni** > **Apps Script** e incollate:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       new Date(),
       data.firstName,
       data.lastName,
       data.presence,
       data.notes
     ]);
     return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Cliccate in alto su **Esegui Distribuzione** > **Nuova Distribuzione** > **Applicazione Web** (Accesso: *Chiunque*).
4. Copiate l'URL generato e incollatelo in `config.js` alla voce `googleSheetsWebhookUrl`.

---

## 🌐 4. Come Pubblicare il Sito Gratis per le Partecipazioni

- **Netlify Drop** (https://app.netlify.com/drop): trascinate l'intera cartella per avere subito il link online.
- **GitHub Pages**: caricando i file nella vostra repository.

Con il link ottenuto potete generare un **QR Code** da stampare sulle partecipazioni cartacee.
