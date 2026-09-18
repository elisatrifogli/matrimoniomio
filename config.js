/**
 * =========================================================================
 * CONFIGURAZIONE PERSONALIZZABILE DEL MATRIMONIO DI MARCO E ELISA
 * Modifica questo file per personalizzare testi, indirizzi, IBAN e link.
 * Tutti i campi qui sotto vengono applicati davvero alla pagina da script.js.
 * =========================================================================
 */
const WEDDING_CONFIG = {
  // Informazioni Sposi
  groom: "Marco",
  bride: "Elisa",

  // IMPORTANTE: lasciare il fuso "+02:00" (ora legale italiana, attiva dal 28 marzo 2027).
  // Senza fuso il countdown mostrerebbe un orario diverso a chi ha il telefono
  // impostato su un altro fuso orario.
  weddingDate: "2027-04-03T15:00:00+02:00", // 3 Aprile 2027 ore 15:00

  // Chiesa / Cerimonia
  church: {
    name: "Chiesa di Santa Maria Goretti",
    address: "Via di Santa Maria Goretti, 29 - 00199 Roma (RM)",
    time: "Ore 15:00",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chiesa+di+Santa+Maria+Goretti+Roma+Via+di+Santa+Maria+Goretti+29",
    wazeUrl: "https://waze.com/ul?q=Chiesa%20di%20Santa%20Maria%20Goretti%20Roma"
  },

  // Ricevimento / Location
  reception: {
    name: "Villa Fravili",
    address: "Via Quarto di Conca, 137 - 00013 Fonte Nuova (RM)",
    time: "Ore 17:30",
    googleMapsUrl: "https://maps.app.goo.gl/nqCkzXTLR4yenpoPA",
    wazeUrl: "https://ul.waze.com/ul?venue_id=8257956.82710633.17765473&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
    embedMapUrl: "https://maps.google.com/maps?q=Villa+Fravili+Fonte+Nuova&t=&z=15&ie=UTF8&iwloc=near&output=embed"
  },

  // Lista Nozze & IBAN
  gift: {
    beneficiary: "Marco Linardi",              // Nome dell'intestatario del conto
    iban: "IT00 X000 0000 0000 0000 0000 000", // ⚠️ DA SOSTITUIRE con l'IBAN reale
    causale: "Matrimonio Marco e Elisa"
  },

  // Cartella Condivisa Google Drive per le foto degli invitati
  photosDriveUrl: "https://drive.google.com/drive/folders/12u2mDwecdQt5g-eXPgKsItJpRG5t79-J?usp=sharing",

  // Contatti & RSVP
  rsvp: {
    deadline: "15 Febbraio 2027",

    // ⚠️ INDISPENSABILE: l'indirizzo dello script Google che raccoglie le conferme.
    // Finché è vuoto, il sito mostra all'invitato un messaggio di errore con il
    // contatto alternativo qui sotto. Vedi GUIDA_PERSONALIZZAZIONE.md § 3.
    googleSheetsWebhookUrl: "https://script.google.com/macros/s/AKfycbwpOesTP-jxwR39qq2Vzy87Zar-Zo3DLYq1iVUZpdDF7Xpap4xmxSop1PYJPs216YoUmw/exec",

    // Contatto mostrato all'invitato se l'invio non riesce, così non si perde nessuno.
    // Numero con prefisso internazionale, senza spazi né "+". Es: "393401234567"
    whatsappNumber: "393881785880",
    contactEmail: ""   // usato solo se whatsappNumber è vuoto
  }
};
