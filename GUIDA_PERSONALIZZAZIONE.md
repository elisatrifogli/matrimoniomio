# 🌸 Guida al Sito di Matrimonio - Marco e Elisa

Congratulazioni per il vostro matrimonio! Questa guida vi spiega come personalizzare, testare e pubblicare la vostra landing page pronta per le partecipazioni.

---

## ⚠️ Le due cose da fare prima di mandare il link agli invitati

1. **Inserire l'IBAN vero** in `config.js` (adesso c'è il segnaposto `IT00 X000...`).
2. **Collegare le conferme a Google Sheets** (§ 3). Finché non lo fate, chi compila il
   modulo vede "Grazie!" ma **la risposta resta solo nel suo telefono e a voi non arriva nulla**:
   il sito è statico e da solo non può inviarvi niente.

---

## 📂 Struttura dei File

- **`index.html`**: La pagina web del matrimonio (un'unica pagina scorrevole).
- **`style.css`**: Lo stile grafico, colori botanici estratti dalla vostra partecipazione.
- **`config.js`**: Il file dove modificate **date, indirizzi, orari, IBAN e link** in 30 secondi.
- **`script.js`**: La logica del countdown, calendario nativo per smartphone e modulo RSVP.
- **`partecipazione.jpg`**: La grafica della partecipazione usata come sfondo della copertina.
- **`anteprima-social.jpg`**: L'immagine che appare su WhatsApp quando si condivide il link.
- **`favicon.svg` / `apple-touch-icon.png`**: Le icone del sito.
- **`Immagine 08-08-26 - 12.32.PNG`**: L'originale ad alta risoluzione, conservato ma non usato dal sito.

---

## 🚀 1. Come Visualizzare il Sito Subito
Basta fare **doppio clic sul file `index.html`** per aprirlo in Google Chrome, Edge o Safari.

---

## ✏️ 2. Come Personalizzare i Dati in `config.js`

Aprite `config.js` con un editor di testo (es. Blocco Note) e modificate i valori tra virgolette.
**Tutti i campi qui sotto vengono applicati davvero alla pagina**: se cambiate l'orario della
chiesa, cambia in tutti i punti del sito in cui compare.

```javascript
const WEDDING_CONFIG = {
  groom: "Marco",
  bride: "Elisa",

  // Lasciate il "+02:00": è il fuso orario italiano.
  weddingDate: "2027-04-03T15:00:00+02:00",

  church: {
    name: "Chiesa di Santa Maria Goretti",
    address: "Via di Santa Maria Goretti, 29 - 00199 Roma (RM)",
    time: "Ore 15:00",
    googleMapsUrl: "...",   // link di Google Maps
    wazeUrl: "..."          // link di Waze
  },

  reception: {
    name: "Villa Fravili",
    address: "Via Quarto di Conca, 137 - 00013 Fonte Nuova (RM)",
    time: "Ore 17:30",
    googleMapsUrl: "...",
    wazeUrl: "...",
    embedMapUrl: "..."      // mappa incorporata nella pagina
  },

  gift: {
    beneficiary: "Marco Linardi",              // intestatario del conto
    iban: "IT00 X000 0000 0000 0000 0000 000", // ⚠️ DA SOSTITUIRE
    causale: "Matrimonio Marco e Elisa"
  },

  photosDriveUrl: "...",    // cartella Drive per le foto degli invitati

  rsvp: {
    deadline: "15 Febbraio 2027",
    googleSheetsWebhookUrl: ""  // ⚠️ vedi § 3
  }
};
```

> **Attenzione al fuso orario.** Se togliete il `+02:00` da `weddingDate`, il countdown
> mostrerà un conto alla rovescia sbagliato a chi ha il telefono impostato su un altro fuso.

---

## 📊 3. Come Ricevere le Risposte su Google Sheets (indispensabile)

Il sito è ospitato su GitHub Pages, che serve solo file statici: non c'è un server che possa
raccogliere i moduli. Serve quindi un piccolo script di Google che faccia da "cassetta postale".

Servono circa 10 minuti. Fatelo dal computer, non dal telefono.

### Passo 1 — Creare il foglio

1. Aprite [Google Sheets](https://sheets.google.com) e create un foglio nuovo.
2. Chiamatelo per esempio **"Conferme Matrimonio"**.
3. Non serve scrivere le intestazioni: le crea lo script da solo.

**Una riga per ogni persona.** Se Luca Rossi conferma anche per Mario Gialli, arrivano due
righe distinte, ciascuna con le proprie allergie, con la stessa identica data/ora (è così che
si riconosce un invio unico) e con "Luca Rossi" nella colonna *Confermato da*.

| Colonna | Contenuto |
| --- | --- |
| Data/Ora | Quando è arrivata la conferma (identica per tutte le persone dello stesso invio) |
| Nome / Cognome | La singola persona |
| Presenza | `Presente` o `Assente` |
| Allergie/Note Alimentari | Intolleranze di **quella** persona |
| Confermato da | Chi ha compilato il modulo |

> 💡 Per sapere quanti siete a tavola, contate i presenti:
> `=CONTA.SE(D2:D;"Presente")` in una cella vuota.

### Passo 2 — Incollare lo script

1. Nel foglio, menu **Estensioni** > **Apps Script**. Si apre una nuova scheda.
2. Cancellate tutto il codice di esempio che vedete (`function myFunction() {}`).
3. Aprite il file **`apps-script/Codice.gs`** di questo progetto, copiate tutto il contenuto
   e incollatelo al suo posto.
4. Salvate con l'icona del dischetto (o `Ctrl+S`).

### Passo 3 — Autorizzare e provare lo script

Prima di pubblicarlo, verificate che sappia scrivere nel foglio:

1. Nel menu a tendina in alto (di fianco al tasto **Esegui**) scegliete **`testScriviRigaDiProva`**.
2. Premete **Esegui**.
3. Google chiede l'autorizzazione: **Rivedi autorizzazioni** > scegliete il vostro account.
4. Comparirà un avviso **"Google non ha verificato questa app"**: è normale, l'app l'avete
   scritta voi. Cliccate su **Avanzate** > **Apri progetto senza titolo (non sicuro)** > **Consenti**.
5. Nel log in basso deve comparire: *"Riga di prova scritta nel foglio Conferme"*.
6. Tornate al foglio e premete **F5** per ricaricarlo. In **basso a sinistra** compare una
   linguetta nuova chiamata **"Conferme"**: è lì che lo script scrive, non in `Foglio1`.
   Apritela, controllate che ci siano le intestazioni e la riga di prova, poi cancellate la
   riga di prova.

Se questo passo funziona, la parte Google è a posto.

### Passo 4 — Pubblicare lo script

> A seconda della versione, Google chiama il pulsante in alto a destra **"Distribuisci"**
> oppure **"Esegui il deployment"**: è lo stesso comando.

1. In alto a destra: **Distribuisci** / **Esegui il deployment** > **Nuovo deployment**.
2. Cliccate sull'ingranaggio ⚙️ di fianco a "Seleziona tipo" e scegliete **Applicazione web**.
3. Compilate così:
   - Descrizione: `RSVP matrimonio`
   - Esegui come: **Me stesso** (il vostro indirizzo)
   - Chi ha accesso: **Chiunque** ← ⚠️ **non** "Chiunque con un account Google"
4. **Distribuisci**, poi **copiate l'URL dell'applicazione web**. Finisce con `/exec`.

> ⚠️ Se scegliete "Chiunque con un account Google" il modulo non funzionerà per gli invitati.
> È l'errore più comune.

### Passo 5 — Verificare che sia raggiungibile

Incollate l'URL copiato nella barra degli indirizzi del browser e premete Invio.
Dovete vedere una riga di testo simile a questa:

```json
{"result":"success","message":"Lo script è attivo e raggiungibile. Le conferme vanno inviate dal sito."}
```

- Se la vedete: perfetto, andate avanti.
- Se vedete una richiesta di login o una pagina di errore: l'accesso non è su "Chiunque".
  Tornate al passo 4.

### Passo 6 — Collegare il sito

In `config.js`, incollate l'URL:

```javascript
rsvp: {
  deadline: "15 Febbraio 2027",
  googleSheetsWebhookUrl: "https://script.google.com/macros/s/AKfy.../exec",
  whatsappNumber: "393401234567",   // vostro numero, per chi non riesce a inviare
  contactEmail: ""
}
```

Poi `git push` per pubblicare.

### Passo 7 — La prova finale

1. Aprite il **sito pubblicato** (non il file locale: dal file `index.html` aperto con doppio
   clic l'invio viene bloccato dal browser).
2. Compilate il modulo con un nome di prova e inviate.
3. Deve comparire la card verde **"Grazie!"** e, nel foglio Google, una riga nuova.
4. Cancellate la riga di prova.

Se invece compare la card **"Non siamo riusciti a salvare la risposta"**, l'invio non è andato
a buon fine: vedi la tabella qui sotto. È il comportamento voluto — il sito non dice mai
"Grazie" se il dato non è stato salvato davvero.

### 🔧 Se qualcosa non funziona

Aprite il sito, premete `F12` > scheda **Console** e riprovate l'invio: l'errore in rosso
dice quale caso è.

| Cosa vedete | Causa | Soluzione |
| --- | --- | --- |
| `googleSheetsWebhookUrl non configurato` | Campo vuoto in `config.js` | Passo 6 |
| Errore CORS / `Failed to fetch` | Accesso non impostato su "Chiunque" | Passo 4 |
| `Risposta HTTP 401` o `403` | Stessa causa | Passo 4 |
| `Risposta HTTP 404` | URL sbagliato o distribuzione eliminata | Ricopiate l'URL `/exec` |
| Card errore ma la riga compare lo stesso nel foglio | Lo script salva ma risponde male | Ricontrollate di aver copiato **tutto** `Codice.gs` |

### ♻️ Se in futuro modificate il codice dello script

Non create una **nuova distribuzione**: cambierebbe l'URL e il sito smetterebbe di funzionare.
Fate invece: **Distribuisci** > **Gestisci distribuzioni** > icona della matita ✏️ >
Versione: **Nuova versione** > **Distribuisci**. L'URL resta lo stesso.

---

## 🖼️ 4. Se Cambiate le Immagini

- **Sfondo della copertina** (`partecipazione.jpg`): tenetelo sotto i ~300 KB, altrimenti
  il sito diventa lento da aprire sui telefoni con rete mobile.
- **Anteprima WhatsApp** (`anteprima-social.jpg`): dev'essere circa 1200×630 pixel.
  Se la sostituite, WhatsApp e Facebook tengono in cache la vecchia immagine per giorni:
  per forzare l'aggiornamento usate il
  [Debugger di Facebook](https://developers.facebook.com/tools/debug/).

---

## 🌐 5. Pubblicazione

Il sito è già su **GitHub Pages**: ogni `git push` sul branch `main` aggiorna
<https://elisatrifogli.github.io/matrimoniomio/> nel giro di un paio di minuti.

Con quel link potete generare un **QR Code** da stampare sulle partecipazioni cartacee.

> 💡 **Consiglio**: un indirizzo tipo `marcoeelisa.it` costa pochi euro l'anno e fa una figura
> migliore stampato sotto il QR code. Si collega creando un file `CNAME` nella cartella del sito.

---

## 🔒 6. Nota sulla Privacy

Il sito è pubblico: chiunque abbia il link vede IBAN, indirizzi e orari. Per questo è stato
aggiunto un tag che chiede ai motori di ricerca di **non indicizzarlo** (`noindex`), così non
finisce nei risultati di Google. Resta comunque raggiungibile da chiunque conosca l'indirizzo:
è la scelta normale per un sito di matrimonio, ma è bene saperlo prima di inserire l'IBAN.
