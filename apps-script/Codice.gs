/**
 * =========================================================================
 * RACCOLTA CONFERME RSVP - Matrimonio Marco e Elisa
 * =========================================================================
 * Questo codice NON fa parte del sito: va incollato dentro Google Apps Script,
 * collegato al foglio Google che raccoglie le risposte.
 * Istruzioni passo passo: GUIDA_PERSONALIZZAZIONE.md, sezione 3.
 * =========================================================================
 */

// Nome del foglio (la linguetta in basso) in cui scrivere le risposte.
var NOME_FOGLIO = 'Conferme';

var INTESTAZIONI = [
  'Data/Ora',
  'Nome',
  'Cognome',
  'Presenza',
  'Allergie/Note Alimentari',
  'Confermato da'         // chi ha compilato il modulo per questa persona
];

var MAX_PERSONE_PER_INVIO = 12;


/**
 * Riceve le conferme inviate dal sito.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return rispondi({ result: 'error', message: 'Richiesta senza dati' });
    }

    var dati = JSON.parse(e.postData.contents);
    var persone = dati.guests;

    if (!persone || !persone.length) {
      return rispondi({ result: 'error', message: 'Nessuna persona nell invio' });
    }
    if (persone.length > MAX_PERSONE_PER_INVIO) {
      return rispondi({ result: 'error', message: 'Troppe persone in un solo invio' });
    }
    for (var i = 0; i < persone.length; i++) {
      if (!persone[i].firstName || !persone[i].lastName) {
        return rispondi({ result: 'error', message: 'Nome o cognome mancante' });
      }
    }

    // Stesso istante per tutte le righe: e' cosi' che si riconosce un invio unico.
    var quando = new Date();
    var confermatoDa = dati.submittedBy || (persone[0].firstName + ' ' + persone[0].lastName);

    var righe = persone.map(function (p) {
      return [
        quando,
        p.firstName,
        p.lastName,
        p.presence || '',
        p.notes || '-',
        confermatoDa
      ];
    });

    // Il blocco serve a evitare che due invii simultanei si sovrascrivano a vicenda.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var foglio = getFoglio();
      // Scrittura in blocco: o entrano tutte le righe, o nessuna.
      foglio.getRange(foglio.getLastRow() + 1, 1, righe.length, INTESTAZIONI.length)
            .setValues(righe);
    } finally {
      lock.releaseLock();
    }

    return rispondi({ result: 'success', rows: righe.length });

  } catch (err) {
    // L'errore viene riportato al sito, che mostra all'invitato il contatto alternativo.
    return rispondi({ result: 'error', message: String(err) });
  }
}


/**
 * Aprendo l'URL dello script nel browser si vede se è pubblicato correttamente.
 * Serve solo come verifica: non scrive nulla.
 */
function doGet() {
  return rispondi({
    result: 'success',
    message: 'Lo script è attivo e raggiungibile. Le conferme vanno inviate dal sito.'
  });
}


/**
 * Restituisce il foglio delle conferme, creandolo con le intestazioni se non esiste.
 */
function getFoglio() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var foglio = ss.getSheetByName(NOME_FOGLIO);

  if (!foglio) {
    foglio = ss.insertSheet(NOME_FOGLIO);
  }

  if (foglio.getLastRow() === 0) {
    scriviIntestazioni(foglio);
  } else {
    // Se le colonne sono quelle di una versione precedente, le allinea.
    // Va fatto PRIMA di iniziare a raccogliere risposte vere, altrimenti i dati
    // gia' presenti finirebbero sotto etichette sbagliate.
    var attuali = foglio.getRange(1, 1, 1, INTESTAZIONI.length).getValues()[0];
    if (attuali.join('|') !== INTESTAZIONI.join('|')) {
      scriviIntestazioni(foglio);
    }
  }

  return foglio;
}


function scriviIntestazioni(foglio) {
  foglio.getRange(1, 1, 1, INTESTAZIONI.length).setValues([INTESTAZIONI]).setFontWeight('bold');
  foglio.setFrozenRows(1);
}


function rispondi(oggetto) {
  return ContentService
    .createTextOutput(JSON.stringify(oggetto))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * ESEGUI QUESTA FUNZIONE UNA VOLTA dall'editor di Apps Script (menu a tendina
 * in alto, poi "Esegui") per verificare che tutto funzioni PRIMA di pubblicare:
 * scrive una riga di prova nel foglio.
 */
function testScriviRigaDiProva() {
  var quando = new Date();
  var foglio = getFoglio();
  foglio.getRange(foglio.getLastRow() + 1, 1, 2, INTESTAZIONI.length).setValues([
    [quando, 'Prova', 'Di Prova', 'Presente', 'riga di test - si può cancellare', 'Prova Di Prova'],
    [quando, 'Seconda', 'Persona', 'Presente', 'celiaca', 'Prova Di Prova']
  ]);
  Logger.log('Scritte 2 righe di prova nel foglio "%s" con la stessa data/ora. Controlla e cancellale.', NOME_FOGLIO);
}
