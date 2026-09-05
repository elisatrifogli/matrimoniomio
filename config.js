/**
 * =========================================================================
 * CONFIGURAZIONE PERSONALIZZABILE DEL MATRIMONIO DI MARCO ED ELISA
 * Modifica questo file per personalizzare testi, indirizzi, IBAN e link.
 * =========================================================================
 */
const WEDDING_CONFIG = {
  // Informazioni Sposi
  groom: "Marco",
  bride: "Elisa",
  weddingDate: "2027-04-03T15:00:00", // 3 Aprile 2027 ore 15:00

  // Chiesa / Cerimonia
  church: {
    name: "Chiesa di Santa Maria Goretti",
    address: "Via di Santa Maria Goretti, 29, 00199 Roma (RM)",
    time: "Ore 15:00",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chiesa+di+Santa+Maria+Goretti+Roma+Via+di+Santa+Maria+Goretti+29",
    wazeUrl: "https://waze.com/ul?q=Chiesa%20di%20Santa%20Maria%20Goretti%20Roma"
  },

  // Ricevimento / Location
  reception: {
    name: "Villa Fravili",
    address: "Via Quarto di Conca, 137, 00013 Fonte Nuova (RM)",
    time: "Ore 17:30",
    googleMapsUrl: "https://maps.app.goo.gl/nqCkzXTLR4yenpoPA",
    wazeUrl: "https://ul.waze.com/ul?venue_id=8257956.82710633.17765473&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
    embedMapUrl: "https://maps.google.com/maps?q=Villa+Fravili+Fonte+Nuova&t=&z=15&ie=UTF8&iwloc=near&output=embed"
  },

  // Lista Nozze & IBAN
  gift: {
    beneficiary: "Marco ed Elisa",
    iban: "IT00 X000 0000 0000 0000 0000 000",
    causale: "Matrimonio Marco ed Elisa"
  },

  // Cartella Condivisa Google Drive per le foto degli invitati
  photosDriveUrl: "https://drive.google.com/drive/folders/12u2mDwecdQt5g-eXPgKsItJpRG5t79-J?usp=sharing",

  // Contatti & RSVP
  rsvp: {
    deadline: "15 Febbraio 2027",
    googleSheetsWebhookUrl: ""
  }
};
