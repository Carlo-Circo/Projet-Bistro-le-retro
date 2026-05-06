/* reservation.js — Validation du formulaire de réservation */
(function () {
  'use strict';

  const form    = document.getElementById('reservation-form');
  const success = document.getElementById('reservation-success');

  if (!form) return;

  // Définir la date min = aujourd'hui
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = yyyy + '-' + mm + '-' + dd;
  }

  function showError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field)  field.classList.add('error');
    if (error)  error.classList.add('visible');
    return false;
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field)  { field.classList.remove('error'); field.classList.add('success'); }
    if (error)  error.classList.remove('visible');
    return true;
  }

  function validateField(id, errorId, condition) {
    return condition ? clearError(id, errorId) : showError(id, errorId);
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function isValidPhone(v) {
    return /^(\+33|0)[0-9]{9}$/.test(v.replace(/\s/g, ''));
  }

  function isValidDate(v) {
    if (!v) return false;
    const d   = new Date(v);
    const day = d.getDay(); // 0=dim, 1=lun
    return day !== 0 && day !== 1;
  }

  // Validation en temps réel
  document.getElementById('prenom')    ?.addEventListener('blur', function () { validateField('prenom',    'prenom-error',    this.value.trim().length >= 2); });
  document.getElementById('nom')       ?.addEventListener('blur', function () { validateField('nom',       'nom-error',       this.value.trim().length >= 2); });
  document.getElementById('email')     ?.addEventListener('blur', function () { validateField('email',     'email-error',     isValidEmail(this.value)); });
  document.getElementById('telephone') ?.addEventListener('blur', function () { validateField('telephone', 'telephone-error', isValidPhone(this.value)); });
  document.getElementById('date')      ?.addEventListener('change', function () { validateField('date',    'date-error',      isValidDate(this.value)); });
  document.getElementById('heure')     ?.addEventListener('change', function () { validateField('heure',   'heure-error',     this.value !== ''); });
  document.getElementById('couverts')  ?.addEventListener('change', function () { validateField('couverts','couverts-error',  this.value !== ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const prenom    = document.getElementById('prenom');
    const nom       = document.getElementById('nom');
    const email     = document.getElementById('email');
    const telephone = document.getElementById('telephone');
    const date      = document.getElementById('date');
    const heure     = document.getElementById('heure');
    const couverts  = document.getElementById('couverts');
    const rgpd      = document.getElementById('rgpd');

    let valid = true;

    if (!validateField('prenom',    'prenom-error',    prenom?.value.trim().length >= 2))    valid = false;
    if (!validateField('nom',       'nom-error',       nom?.value.trim().length >= 2))       valid = false;
    if (!validateField('email',     'email-error',     isValidEmail(email?.value)))           valid = false;
    if (!validateField('telephone', 'telephone-error', isValidPhone(telephone?.value)))       valid = false;
    if (!validateField('date',      'date-error',      isValidDate(date?.value)))             valid = false;
    if (!validateField('heure',     'heure-error',     heure?.value !== ''))                  valid = false;
    if (!validateField('couverts',  'couverts-error',  couverts?.value !== ''))               valid = false;

    // RGPD
    const rgpdError = document.getElementById('rgpd-error');
    if (!rgpd?.checked) {
      if (rgpdError) rgpdError.classList.add('visible');
      valid = false;
    } else {
      if (rgpdError) rgpdError.classList.remove('visible');
    }

    if (valid) {
      form.style.display    = 'none';
      success.classList.add('visible');
      window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
    } else {
      // Focus sur le premier champ en erreur
      const firstError = form.querySelector('.error, .form-error.visible');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();