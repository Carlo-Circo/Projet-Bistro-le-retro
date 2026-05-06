/* contact.js — Soumission vers POST /api/contact */
(function () {
  'use strict';

  const API_URL   = '/api/contact';
  const form      = document.getElementById('contact-form');
  const success   = document.getElementById('contact-success');
  const submitBtn = form?.querySelector('.form-submit');

  if (!form) return;

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
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

  // Validation en temps réel
  document.getElementById('contact-nom')    ?.addEventListener('blur',   function () { setError('contact-nom',     'contact-nom-error',     this.value.trim().length >= 2); });
  document.getElementById('contact-email')  ?.addEventListener('blur',   function () { setError('contact-email',   'contact-email-error',   isValidEmail(this.value)); });
  document.getElementById('contact-message')?.addEventListener('blur',   function () { setError('contact-message', 'contact-message-error', this.value.trim().length >= 10); });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nom     = document.getElementById('contact-nom')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();
    const rgpd    = document.getElementById('contact-rgpd')?.checked;

    let valid = true;
    if (!setError('contact-nom',     'contact-nom-error',     nom.length >= 2))       valid = false;
    if (!setError('contact-email',   'contact-email-error',   isValidEmail(email)))   valid = false;
    if (!setError('contact-message', 'contact-message-error', message.length >= 10))  valid = false;

    const rgpdError = document.getElementById('contact-rgpd-error');
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

    // Payload : nom, email, message uniquement (table contacts sans sujet)
    const payload = { nom, email, message };

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
        Object.entries(json.errors).forEach(function ([key, msg]) {
          const fieldMap = { nom: 'contact-nom', email: 'contact-email', message: 'contact-message' };
          const fId = fieldMap[key];
          if (!fId) return;
          const f = document.getElementById(fId);
          const err = document.getElementById(fId + '-error');
          if (f) { f.classList.add('error'); }
          if (err) { err.textContent = msg; err.classList.add('visible'); }
        });
      } else {
        alert(json.error ?? 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Envoyer le message';
    }
  });
})();