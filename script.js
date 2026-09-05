/**
 * =========================================================================
 * MARCO & ELISA - LOGICA INTERATTIVA SITO MATRIMONIO
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNativeCalendar();
  initRsvpForm();
  initIbanCopy();
  applyCustomConfig();
});

/* --- Applica la configurazione da config.js se presente --- */
function applyCustomConfig() {
  if (typeof WEDDING_CONFIG === 'undefined') return;

  // Aggiorna Location Ricevimento
  const locTitle = document.getElementById('locationTitleDisplay');
  const locAddr = document.getElementById('locationAddressDisplay');
  const timeLocName = document.getElementById('timelineLocationName');
  const locIframe = document.getElementById('locationIframe');
  const locMaps = document.getElementById('locationMapsLink');
  const locWaze = document.getElementById('locationWazeLink');

  if (locTitle && WEDDING_CONFIG.reception.name) locTitle.textContent = WEDDING_CONFIG.reception.name;
  if (timeLocName && WEDDING_CONFIG.reception.name) timeLocName.textContent = WEDDING_CONFIG.reception.name;
  if (locAddr && WEDDING_CONFIG.reception.address) locAddr.textContent = WEDDING_CONFIG.reception.address;
  if (timeLocAddr && WEDDING_CONFIG.reception.address) timeLocAddr.textContent = WEDDING_CONFIG.reception.address;
  if (locMaps && WEDDING_CONFIG.reception.googleMapsUrl) locMaps.href = WEDDING_CONFIG.reception.googleMapsUrl;
  if (locWaze && WEDDING_CONFIG.reception.wazeUrl) locWaze.href = WEDDING_CONFIG.reception.wazeUrl;
  if (locIframe && WEDDING_CONFIG.reception.embedMapUrl) locIframe.src = WEDDING_CONFIG.reception.embedMapUrl;

  // Aggiorna IBAN
  const ibanText = document.getElementById('ibanCodeText');
  if (ibanText && WEDDING_CONFIG.gift.iban) {
    ibanText.textContent = WEDDING_CONFIG.gift.iban;
  }

  // Aggiorna Link Google Drive Foto
  const photosLink = document.getElementById('photosDriveLink');
  if (photosLink && WEDDING_CONFIG.photosDriveUrl) {
    photosLink.href = WEDDING_CONFIG.photosDriveUrl;
  }
}

/* --- Countdown Timer to 3 April 2027 at 15:00 --- */
function initCountdown() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minutesEl = document.getElementById('countdownMinutes');
  const secondsEl = document.getElementById('countdownSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // 3 Aprile 2027 ore 15:00:00 (Fuso orario Roma UTC+2)
  const targetDate = new Date('2027-04-03T15:00:00+02:00').getTime();

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

  calBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // File standard iCalendar .ICS compatibile con iOS Apple Calendar, Google Calendar, Outlook, Android
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Marco ed Elisa//Matrimonio 2027//IT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Matrimonio Marco ed Elisa',
      'BEGIN:VEVENT',
      'UID:matrimonio-marco-elisa-20270403@nozze.it',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:20270403T130000Z', // 15:00 CEST (UTC+2)
      'DTEND:20270403T230000Z',
      'SUMMARY:Matrimonio Marco ed Elisa',
      'DESCRIPTION:Celebrazione del matrimonio di Marco ed Elisa. Ore 15:00 presso la Chiesa di Santa Maria Goretti a Roma. A seguire ricevimento e festeggiamenti.',
      'LOCATION:Chiesa di Santa Maria Goretti\\, Via di Santa Maria Goretti 29\\, Roma',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P7D',
      'DESCRIPTION:Promemoria: Matrimonio Marco ed Elisa tra 7 giorni!',
      'ACTION:DISPLAY',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'DESCRIPTION:Promemoria: Matrimonio Marco ed Elisa domani alle 15:00!',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Matrimonio_Marco_ed_Elisa.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Evento pronto per il calendario!');
  });
}

/* --- Modulo R.S.V.P. Essenziale (Nome, Cognome, Note) --- */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const presenceRadios = document.querySelectorAll('input[name="presence"]');
  const notesGroup = document.getElementById('dietaryNotesGroup');
  const successCard = document.getElementById('rsvpSuccessCard');
  const resetViewBtn = document.getElementById('rsvpResetViewBtn');

  if (!form) return;

  // Mostra/nasconde campo note se la presenza è NO
  presenceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'NO') {
        if (notesGroup) notesGroup.style.display = 'none';
      } else {
        if (notesGroup) notesGroup.style.display = 'block';
      }
    });
  });

  // Gestione invio modulo
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('guestFirstName')?.value.trim();
    const lastName = document.getElementById('guestLastName')?.value.trim();
    const presence = document.querySelector('input[name="presence"]:checked')?.value || 'SI';
    const notes = document.getElementById('guestNotes')?.value.trim();

    if (!firstName || !lastName) {
      showToast('Per favore, inserisci Nome e Cognome.');
      return;
    }

    const rsvpData = {
      timestamp: new Date().toISOString(),
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      presence: presence === 'SI' ? 'Presente' : 'Assente',
      notes: notes || '-'
    };

    // Salvataggio locale
    const stored = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
    stored.push(rsvpData);
    localStorage.setItem('wedding_rsvp_entries', JSON.stringify(stored));

    // Webhook opzionale Google Sheets
    if (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.rsvp.googleSheetsWebhookUrl) {
      try {
        await fetch(WEDDING_CONFIG.rsvp.googleSheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpData),
          mode: 'no-cors'
        });
      } catch (err) {
        console.log('Webhook inviato:', err);
      }
    }

    // Mostra messaggio di ringraziamento
    form.style.display = 'none';
    if (successCard) successCard.style.display = 'block';

    const customMsg = document.getElementById('successCustomMsg');
    if (customMsg) {
      if (presence === 'SI') {
        customMsg.innerHTML = `Grazie <strong>${firstName}</strong>! La tua presenza è confermata con gioia. Ci vediamo il 3 Aprile 2027!`;
      } else {
        customMsg.innerHTML = `Grazie <strong>${firstName}</strong> per avercelo comunicato. Ci mancherai!`;
      }
    }

    showToast('Risposta inviata con successo!');
  });

  // Tasto per inviare un'altra risposta
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
      if (notesGroup) notesGroup.style.display = 'block';
    });
  }
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
