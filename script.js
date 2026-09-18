/**
 * =========================================================================
 * MARCO & ELISA - LOGICA INTERATTIVA SITO MATRIMONIO
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  applyCustomConfig();   // per primo: il countdown e il file .ics leggono i dati da qui
  initCountdown();
  initNativeCalendar();
  initRsvpForm();
  initIbanCopy();
  initFloatingRsvp();
});

/* --- Helper: scrive un testo in un elemento solo se entrambi esistono --- */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

/* --- Helper: imposta un attributo (href/src) solo se entrambi esistono --- */
function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

/* --- Applica la configurazione da config.js se presente --- */
function applyCustomConfig() {
  if (typeof WEDDING_CONFIG === 'undefined') return;

  const { church = {}, reception = {}, gift = {}, rsvp = {} } = WEDDING_CONFIG;

  // Nomi degli sposi
  if (WEDDING_CONFIG.groom && WEDDING_CONFIG.bride) {
    const names = `${WEDDING_CONFIG.groom} e ${WEDDING_CONFIG.bride}`;
    setText('coupleNames', names);
    setText('footerNames', names);
  }

  // Cerimonia / Chiesa
  setText('churchTitleDisplay', church.name);
  setText('timelineChurchName', church.name);
  setText('churchAddressDisplay', church.address);
  setText('timelineChurchAddr', church.address);
  setText('churchTimeDisplay', church.time);
  setText('timelineChurchTime', church.time);
  setAttr('churchMapsLink', 'href', church.googleMapsUrl);
  setAttr('timelineChurchMapLink', 'href', church.googleMapsUrl);
  setAttr('churchWazeLink', 'href', church.wazeUrl);

  // Ricevimento / Location
  setText('locationTitleDisplay', reception.name);
  setText('timelineLocationName', reception.name);
  setText('locationAddressDisplay', reception.address);
  setText('timelineLocationAddr', reception.address);
  setText('receptionTimeDisplay', reception.time);
  setText('timelineReceptionTime', reception.time);
  setAttr('locationMapsLink', 'href', reception.googleMapsUrl);
  setAttr('locationWazeLink', 'href', reception.wazeUrl);
  setAttr('locationIframe', 'src', reception.embedMapUrl);

  // Lista nozze / IBAN
  setText('ibanCodeText', gift.iban);
  setText('ibanBeneficiary', gift.beneficiary);
  setText('ibanCausale', gift.causale);

  // Scadenza RSVP
  setText('rsvpDeadlineDisplay', rsvp.deadline);

  // Link Google Drive Foto
  setAttr('photosDriveLink', 'href', WEDDING_CONFIG.photosDriveUrl);
}

/* --- Countdown Timer to 3 April 2027 at 15:00 --- */
function initCountdown() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minutesEl = document.getElementById('countdownMinutes');
  const secondsEl = document.getElementById('countdownSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // 3 Aprile 2027 ore 15:00:00 (Fuso orario Roma UTC+2), preso da config.js
  const configured = (typeof WEDDING_CONFIG !== 'undefined') ? WEDDING_CONFIG.weddingDate : null;
  let targetDate = configured ? new Date(configured).getTime() : NaN;
  if (isNaN(targetDate)) targetDate = new Date('2027-04-03T15:00:00+02:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* --- Aggiungi al Calendario Nativo (iPhone / Android / Mac / PC) --- */
function initNativeCalendar() {
  const calBtn = document.getElementById('addToCalendarBtn');
  if (!calBtn) return;

  const cfg = (typeof WEDDING_CONFIG !== 'undefined') ? WEDDING_CONFIG : {};
  const names = (cfg.groom && cfg.bride) ? `${cfg.groom} e ${cfg.bride}` : 'Marco e Elisa';
  const churchName = (cfg.church && cfg.church.name) || 'Chiesa di Santa Maria Goretti';
  const churchAddr = (cfg.church && cfg.church.address) || 'Via di Santa Maria Goretti, 29 - Roma';
  // Nel formato iCalendar virgole e punti e virgola vanno preceduti da backslash
  const icsEscape = (s) => String(s).replace(/([,;\\])/g, '\\$1');

  // Lo standard iCalendar vuole righe da massimo 75 caratteri: quelle piu' lunghe
  // vanno spezzate e le righe successive iniziano con uno spazio.
  const icsFold = (line) => {
    if (line.length <= 75) return line;
    const parts = [line.slice(0, 75)];
    for (let i = 75; i < line.length; i += 74) parts.push(' ' + line.slice(i, i + 74));
    return parts.join('\r\n');
  };

  calBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // File standard iCalendar .ICS compatibile con iOS Apple Calendar, Google Calendar, Outlook, Android
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//' + icsEscape(names) + '//Matrimonio 2027//IT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Matrimonio ' + icsEscape(names),
      'BEGIN:VEVENT',
      'UID:matrimonio-marco-elisa-20270403@nozze.it',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:20270403T130000Z', // 15:00 CEST (UTC+2)
      'DTEND:20270403T230000Z',
      'SUMMARY:Matrimonio ' + icsEscape(names),
      'DESCRIPTION:' + icsEscape(`Celebrazione del matrimonio di ${names}. Ore 15:00 presso la ${churchName} a Roma. A seguire ricevimento e festeggiamenti.`),
      'LOCATION:' + icsEscape(`${churchName}, ${churchAddr}`),
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P7D',
      'DESCRIPTION:' + icsEscape(`Promemoria: Matrimonio ${names} tra 7 giorni!`),
      'ACTION:DISPLAY',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'DESCRIPTION:' + icsEscape(`Promemoria: Matrimonio ${names} domani alle 15:00!`),
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].map(icsFold).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Matrimonio_' + names.replace(/\s+/g, '_') + '.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    showToast('Evento pronto per il calendario!');
  });
}

/* =========================================================================
 * Modulo R.S.V.P.
 * Una scheda per persona, di cui una sola aperta alla volta: ogni scheda
 * diventa una riga distinta nel foglio Google, con le sue allergie.
 * ========================================================================= */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const list = document.getElementById('guestList');
  const template = document.getElementById('guestCardTemplate');
  const addGuestBtn = document.getElementById('addGuestBtn');
  const successCard = document.getElementById('rsvpSuccessCard');
  const errorCard = document.getElementById('rsvpErrorCard');
  const resetViewBtn = document.getElementById('rsvpResetViewBtn');
  const retryBtn = document.getElementById('rsvpRetryBtn');
  const submitBtn = document.getElementById('rsvpSubmitBtn');

  if (!form || !list || !template) return;

  const MAX_PERSONE = 12;
  const submitBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  let lastPayload = null;   // conservato per il tasto "Riprova"
  let sending = false;
  let progressivo = 0;      // serve solo a generare id univoci per le etichette

  // Link di contatto alternativo, usato se l'invio non riesce
  const contacts = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.rsvp) || {};
  const fallbackLink = document.getElementById('rsvpFallbackContact');
  if (fallbackLink) {
    if (contacts.whatsappNumber) {
      const testo = encodeURIComponent('Ciao! Vi confermo la mia presenza al matrimonio: ');
      fallbackLink.href = `https://wa.me/${String(contacts.whatsappNumber).replace(/\D/g, '')}?text=${testo}`;
    } else if (contacts.contactEmail) {
      fallbackLink.href = `mailto:${contacts.contactEmail}?subject=${encodeURIComponent('Conferma presenza matrimonio')}`;
      fallbackLink.innerHTML = '<i class="fa-regular fa-envelope"></i> Scrivici una mail';
    } else {
      fallbackLink.style.display = 'none';
    }
  }

  /* ---------- Gestione delle schede ---------- */

  const schede = () => Array.from(list.querySelectorAll('[data-guest-card]'));
  const campo = (scheda, nome) => scheda.querySelector(`[data-field="${nome}"]`);
  const valore = (scheda, nome) => (campo(scheda, nome)?.value || '').trim();
  const presenza = (scheda) =>
    scheda.querySelector('[data-field="presence"]:checked')?.value === 'NO' ? 'Assente' : 'Presente';

  function apri(scheda) {
    schede().forEach(s => {
      const attiva = (s === scheda);
      s.classList.toggle('is-open', attiva);
      s.querySelector('.guest-toggle').setAttribute('aria-expanded', attiva ? 'true' : 'false');
      s.querySelector('.guest-body').hidden = !attiva;
    });
    aggiornaTestate();
  }

  /** Titolo, riepilogo e visibilità del cestino: ricalcolati a ogni modifica. */
  function aggiornaTestate() {
    const tutte = schede();
    tutte.forEach((scheda, i) => {
      const primo = (i === 0);
      const nome = `${valore(scheda, 'firstName')} ${valore(scheda, 'lastName')}`.trim();
      const assente = (presenza(scheda) === 'Assente');

      scheda.querySelector('.guest-title').textContent =
        primo ? 'I tuoi dati' : (nome || `Persona ${i + 1}`);

      const riepilogo = scheda.querySelector('.guest-summary');
      riepilogo.classList.remove('is-absent', 'is-incomplete');

      if (scheda.classList.contains('is-open')) {
        riepilogo.textContent = '';                    // aperta: il riepilogo sarebbe ridondante
      } else if (!nome) {
        riepilogo.textContent = 'Da completare';
        riepilogo.classList.add('is-incomplete');
      } else if (assente) {
        riepilogo.textContent = primo ? `${nome} · non potrai esserci` : `${nome} · non ci sarà`;
        riepilogo.classList.add('is-absent');
      } else {
        riepilogo.textContent = primo ? `${nome} · ci sarai` : `${nome} · ci sarà`;
      }

      // La prima scheda è di chi sta compilando: non ha senso poterla togliere
      scheda.querySelector('[data-remove]').hidden = primo;
    });

    if (addGuestBtn) addGuestBtn.hidden = (tutte.length >= MAX_PERSONE);
  }

  function creaScheda() {
    progressivo++;
    const scheda = template.content.firstElementChild.cloneNode(true);
    const primo = (schede().length === 0);

    // Etichette e campi vanno collegati con id univoci, altrimenti il tocco
    // sull'etichetta attiverebbe il campo della scheda sbagliata
    ['firstName', 'lastName', 'notes'].forEach(nome => {
      const id = `guest-${progressivo}-${nome}`;
      campo(scheda, nome).id = id;
      scheda.querySelector(`[data-label-for="${nome}"]`).setAttribute('for', id);
    });
    scheda.querySelectorAll('[data-field="presence"]').forEach((radio, i) => {
      radio.name = `presence-${progressivo}`;
      radio.id = `guest-${progressivo}-presence-${i}`;
    });

    // Chi compila parla di sé, gli altri sono in terza persona
    if (!primo) {
      scheda.querySelector('[data-label-yes]').textContent = 'Ci sarà';
      scheda.querySelector('[data-label-no]').textContent = 'Non ci sarà';
    }

    scheda.querySelector('.guest-toggle').addEventListener('click', () => {
      if (scheda.classList.contains('is-open')) {
        scheda.classList.remove('is-open');
        scheda.querySelector('.guest-toggle').setAttribute('aria-expanded', 'false');
        scheda.querySelector('.guest-body').hidden = true;
        aggiornaTestate();
      } else {
        apri(scheda);
      }
    });

    scheda.querySelector('[data-remove]').addEventListener('click', () => {
      scheda.remove();
      aggiornaTestate();
      showToast('Persona rimossa.');
    });

    // Chi non viene non deve compilare le note
    scheda.querySelectorAll('[data-field="presence"]').forEach(radio => {
      radio.addEventListener('change', () => {
        scheda.querySelector('[data-notes-group]').hidden = (radio.value === 'NO');
        aggiornaTestate();
      });
    });

    ['firstName', 'lastName'].forEach(nome => {
      campo(scheda, nome).addEventListener('input', () => {
        scheda.classList.remove('has-error');
        aggiornaTestate();
      });
    });

    list.appendChild(scheda);
    return scheda;
  }

  function reimpostaLista() {
    list.innerHTML = '';
    progressivo = 0;
    apri(creaScheda());
  }

  if (addGuestBtn) {
    addGuestBtn.addEventListener('click', () => {
      if (schede().length >= MAX_PERSONE) return;
      const nuova = creaScheda();
      apri(nuova);
      campo(nuova, 'firstName').focus();
      nuova.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  reimpostaLista();

  function showView(view) {
    form.style.display = (view === 'form') ? 'block' : 'none';
    if (successCard) successCard.style.display = (view === 'success') ? 'block' : 'none';
    if (errorCard) errorCard.style.display = (view === 'error') ? 'block' : 'none';
  }

  function setSending(on) {
    sending = on;
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.innerHTML = on
      ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Invio in corso...'
      : submitBtnHtml;
  }

  /**
   * Invia la conferma allo script di Google e ASPETTA la risposta.
   * Volutamente senza header Content-Type esplicito: il browser usa text/plain,
   * che evita la richiesta di preflight CORS che Google Apps Script non gestisce.
   * Cosi' possiamo leggere l'esito invece di inviare "alla cieca".
   */
  async function sendRsvp(url, data) {
    const res = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Risposta HTTP ' + res.status);
    const json = await res.json();
    if (!json || json.result !== 'success') {
      throw new Error((json && json.message) || 'Lo script non ha confermato il salvataggio');
    }
    return json;
  }

  async function deliver(rsvpData) {
    const url = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.rsvp)
      ? WEDDING_CONFIG.rsvp.googleSheetsWebhookUrl
      : '';

    // Copia di sicurezza nel browser di chi compila: non sostituisce l'invio,
    // ma permette di recuperare il dato se qualcosa va storto.
    try {
      const stored = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
      stored.push(rsvpData);
      localStorage.setItem('wedding_rsvp_entries', JSON.stringify(stored));
    } catch (err) {
      /* navigazione in incognito o storage pieno: non e' un motivo per bloccare l'invio */
    }

    if (!url) {
      throw new Error('googleSheetsWebhookUrl non configurato in config.js');
    }
    return sendRsvp(url, rsvpData);
  }

  function showSuccess(rsvpData) {
    showView('success');
    const customMsg = document.getElementById('successCustomMsg');
    if (!customMsg) return;

    const persone = rsvpData.guests || [];
    const presenti = persone.filter(p => p.presence === 'Presente').length;

    // textContent per il nome: e' testo scritto dall'utente, non va interpretato come HTML
    customMsg.textContent = '';
    const nome = document.createElement('strong');
    nome.textContent = persone[0] ? persone[0].firstName : '';

    if (presenti === 0) {
      customMsg.append('Grazie ', nome, ' per avercelo comunicato. ',
        persone.length > 1 ? 'Ci mancherete!' : 'Ci mancherai!');
    } else if (persone.length === 1) {
      customMsg.append('Grazie ', nome, '! La tua presenza è confermata con gioia. Ci vediamo il 3 Aprile 2027!');
    } else {
      customMsg.append('Grazie ', nome, `! Abbiamo registrato ${persone.length} risposte: `,
        presenti === 1 ? 'ti aspettiamo' : `vi aspettiamo in ${presenti}`,
        ' il 3 Aprile 2027. Che gioia!');
    }
  }

  async function submitPayload(rsvpData) {
    setSending(true);
    try {
      await deliver(rsvpData);
      lastPayload = null;
      showSuccess(rsvpData);
      showToast('Risposta inviata con successo!');
      // Avvisa il pulsante flottante che non serve piu'
      document.dispatchEvent(new CustomEvent('rsvp:sent'));
    } catch (err) {
      console.error('RSVP non consegnato:', err);
      lastPayload = rsvpData;
      showView('error');
      showToast('Invio non riuscito. Riprova o scrivici.');
    } finally {
      setSending(false);
    }
  }

  // Gestione invio modulo
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sending) return;   // evita il doppio invio con doppio tap

    const tutte = schede();
    const persone = [];

    for (const scheda of tutte) {
      const firstName = valore(scheda, 'firstName');
      const lastName = valore(scheda, 'lastName');

      if (!firstName || !lastName) {
        // Porta l'invitato esattamente sulla scheda incompleta
        scheda.classList.add('has-error');
        apri(scheda);
        scheda.scrollIntoView({ block: 'center', behavior: 'smooth' });
        campo(scheda, firstName ? 'lastName' : 'firstName').focus();
        showToast(tutte.length > 1
          ? 'Completa nome e cognome di ogni persona.'
          : 'Per favore, inserisci Nome e Cognome.');
        return;
      }

      const presente = (presenza(scheda) === 'Presente');
      const notes = valore(scheda, 'notes');

      persone.push({
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        presence: presente ? 'Presente' : 'Assente',
        notes: (presente && notes) ? notes : '-'
      });
    }

    submitPayload({
      timestamp: new Date().toISOString(),
      submittedBy: persone[0].fullName,
      guests: persone
    });
  });

  // Tasto "Riprova": rimanda gli stessi dati, senza farli riscrivere
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      if (sending) return;
      if (lastPayload) {
        showView('form');   // il pulsante di invio con lo spinner e' dentro al form
        submitPayload(lastPayload);
      } else {
        showView('form');
      }
    });
  }

  // Tasto per inviare un'altra risposta: si riparte da una lista pulita
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      reimpostaLista();
      showView('form');
    });
  }
}

/* --- Pulsante flottante verso il modulo RSVP --- */
function initFloatingRsvp() {
  const btn = document.getElementById('floatingRsvpBtn');
  const hero = document.getElementById('hero');
  const rsvp = document.getElementById('rsvp');

  if (!btn || !hero || !rsvp || !('IntersectionObserver' in window)) return;

  let heroInView = true;    // all'apertura si e' sulla copertina
  let rsvpInView = false;
  let inviato = false;

  function aggiorna() {
    const mostra = !heroInView && !rsvpInView && !inviato;
    btn.classList.toggle('is-visible', mostra);
    btn.setAttribute('aria-hidden', mostra ? 'false' : 'true');
    btn.tabIndex = mostra ? 0 : -1;
  }

  new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    aggiorna();
  }, { threshold: 0.15 }).observe(hero);

  new IntersectionObserver(([entry]) => {
    rsvpInView = entry.isIntersecting;
    aggiorna();
  }, { threshold: 0.2 }).observe(rsvp);

  // Una volta confermato, il pulsante non ha piu' motivo di esistere
  document.addEventListener('rsvp:sent', () => {
    inviato = true;
    aggiorna();
  });
}

/* --- Copia IBAN con Notifica Toast --- */
function initIbanCopy() {
  const copyBtn = document.getElementById('copyIbanBtn');
  const ibanCodeEl = document.getElementById('ibanCodeText');
  const copyLabel = document.getElementById('copyBtnLabel');

  if (!copyBtn || !ibanCodeEl) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = ibanCodeEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(textToCopy);
      if (copyLabel) copyLabel.textContent = 'Copiato!';
      showToast('IBAN copiato negli appunti!');

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copia IBAN';
      }, 2500);
    } catch (err) {
      showToast('Seleziona e copia il codice IBAN.');
    }
  });
}

/* --- Toast Notification Helper --- */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}
