/* contact.js — Validation du formulaire de contact */
(function () {
  'use strict';

  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');

  if (!form) return;

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.add('error');
    if (error) error.classList.add('visible');
    return false;
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) { field.classList.remove('error'); field.classList.add('success'); }
    if (error) error.classList.remove('visible');
    return true;
  }

  function validateField(id, errorId, condition) {
    return condition ? clearError(id, errorId) : showError(id, errorId);
  }

  // Validation en temps réel
  document.getElementById('contact-nom')     ?.addEventListener('blur', function () { validateField('contact-nom',     'contact-nom-error',     this.value.trim().length >= 2); });
  document.getElementById('contact-email')   ?.addEventListener('blur', function () { validateField('contact-email',   'contact-email-error',   isValidEmail(this.value)); });
  document.getElementById('contact-sujet')   ?.addEventListener('change', function () { validateField('contact-sujet', 'contact-sujet-error',   this.value !== ''); });
  document.getElementById('contact-message') ?.addEventListener('blur', function () { validateField('contact-message', 'contact-message-error', this.value.trim().length >= 10); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom     = document.getElementById('contact-nom');
    const email   = document.getElementById('contact-email');
    const sujet   = document.getElementById('contact-sujet');
    const message = document.getElementById('contact-message');
    const rgpd    = document.getElementById('contact-rgpd');

    let valid = true;

    if (!validateField('contact-nom',     'contact-nom-error',     nom?.value.trim().length >= 2))     valid = false;
    if (!validateField('contact-email',   'contact-email-error',   isValidEmail(email?.value)))         valid = false;
    if (!validateField('contact-sujet',   'contact-sujet-error',   sujet?.value !== ''))                valid = false;
    if (!validateField('contact-message', 'contact-message-error', message?.value.trim().length >= 10)) valid = false;

    const rgpdError = document.getElementById('contact-rgpd-error');
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
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();