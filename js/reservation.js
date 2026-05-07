/* reservation.js — Soumission vers POST /projet-bistro/Projet-Bistro-le-retro/php/reservations */
(function () {
  'use strict';

  const API_URL = '/projet-bistro/Projet-Bistro-le-retro/php/reservations';
  const form    = document.getElementById('reservation-form');
  const success = document.getElementById('reservation-success');
  const submitBtn = form?.querySelector('.form-submit');

  if (!form) return;

  // Date min = aujourd'hui
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // ─── Validation locale (avant envoi) ─────────────────────────────────
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function isValidPhone(v) {
    return /^(\+33|0)[0-9 ]{8,18}$/.test(v.trim());
  }
  function isValidDate(v) {
    if (!v) return false;
    const d = new Date(v);
    const day = d.getDay();
    return d >= new Date(new Date().toDateString()) && day !== 0 && day !== 1;
  }

  function setError(fieldId, errorId, condition) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field) return condition;
    if (!condition) {
      field.classList.add('error'); field.classList.remove('success');
      if (error) error.classList.add('visible');
    } else {
      field.classList.remove('error'); field.classList.add('success');
      if (error) error.classList.remove('visible');
    }
    return condition;
  }

  function showApiErrors(errors) {
    // Correspondance champs API → IDs HTML
    const map = {
      nom:          ['nom',      'nom-error'],
      prenom:       ['prenom',   'prenom-error'],
      email:        ['email',    'email-error'],
      tel:          ['telephone','telephone-error'],
      date_resa:    ['date',     'date-error'],
      heure_resa:   ['heure',    'heure-error'],
      nb_personnes: ['couverts', 'couverts-error'],
    };
    Object.entries(errors).forEach(function ([key, msg]) {
      if (!map[key]) return;
      const [fieldId, errorId] = map[key];
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (field) { field.classList.add('error'); field.classList.remove('success'); }
      if (error) { error.textContent = msg; error.classList.add('visible'); }
    });
  }

  // Validation en temps réel
  document.getElementById('prenom')   ?.addEventListener('blur', function () { setError('prenom',   'prenom-error',    this.value.trim().length >= 2); });
  document.getElementById('nom')      ?.addEventListener('blur', function () { setError('nom',      'nom-error',       this.value.trim().length >= 2); });
  document.getElementById('email')    ?.addEventListener('blur', function () { setError('email',    'email-error',     isValidEmail(this.value)); });
  document.getElementById('telephone')?.addEventListener('blur', function () { setError('telephone','telephone-error', isValidPhone(this.value)); });
  document.getElementById('date')     ?.addEventListener('change', function () { setError('date',   'date-error',      isValidDate(this.value)); });
  document.getElementById('heure')    ?.addEventListener('change', function () { setError('heure',  'heure-error',     this.value !== ''); });
  document.getElementById('couverts') ?.addEventListener('change', function () { setError('couverts','couverts-error', this.value !== ''); });

  // ─── Soumission ───────────────────────────────────────────────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const prenom   = document.getElementById('prenom')?.value.trim();
    const nom      = document.getElementById('nom')?.value.trim();
    const email    = document.getElementById('email')?.value.trim();
    const tel      = document.getElementById('telephone')?.value.trim();
    const date     = document.getElementById('date')?.value;
    const heure    = document.getElementById('heure')?.value;
    const couverts = document.getElementById('couverts')?.value;
    const message  = document.getElementById('commentaire')?.value.trim();
    const rgpd     = document.getElementById('rgpd')?.checked;

    let valid = true;
    if (!setError('prenom',    'prenom-error',    prenom.length >= 2))     valid = false;
    if (!setError('nom',       'nom-error',       nom.length >= 2))        valid = false;
    if (!setError('email',     'email-error',     isValidEmail(email)))    valid = false;
    if (!setError('telephone', 'telephone-error', isValidPhone(tel)))      valid = false;
    if (!setError('date',      'date-error',      isValidDate(date)))      valid = false;
    if (!setError('heure',     'heure-error',     heure !== ''))           valid = false;
    if (!setError('couverts',  'couverts-error',  couverts !== ''))        valid = false;

    const rgpdError = document.getElementById('rgpd-error');
    if (!rgpd) {
      if (rgpdError) rgpdError.classList.add('visible');
      valid = false;
    } else {
      if (rgpdError) rgpdError.classList.remove('visible');
    }

    if (!valid) {
      form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Payload adapté aux colonnes SQL
    const payload = {
      prenom,
      nom,
      email,
      tel,
      date_resa:    date,
      heure_resa:   heure,
      nb_personnes: parseInt(couverts, 10),
      message:      message || null,
    };

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res  = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        form.style.display = 'none';
        success.classList.add('visible');
        window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
      } else if (json.errors) {
        showApiErrors(json.errors);
      } else {
        alert(json.error ?? 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Confirmer ma réservation';
    }
  });
})();