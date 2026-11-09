/* ==========================================================================
   signup.js — sends guide sign-ups to BOTH Netlify Forms (backup copy)
   and Mailchimp (welcome emails, plus texts when the visitor opts in),
   then shows the download page.

   If anything goes wrong (Mailchimp slow, no JavaScript, etc.) the form
   falls back to a normal Netlify submission, so no sign-up is ever lost
   and the visitor always reaches the download page.
   ========================================================================== */
(function () {
  'use strict';

  // From the Mailchimp embedded form codes (Audience: Rebuild Method)
  var MC_URL = 'https://drsusanbesman.us1.list-manage.com/subscribe/post-json';
  var MC_U = '3642e6e423858d8a60e260494';
  var MC_ID = '140fa5f0e6';
  var FORM_EMAIL_ONLY = '0002c0e1f0';   // email sign-up form
  var FORM_WITH_SMS = '0007c0e1f0';     // "Website guide form" with SMS phone + consent
  var MC_HONEYPOT = 'b_' + MC_U + '_' + MC_ID;
  var TIMEOUT_MS = 4000;

  function toQuery(obj) {
    return Object.keys(obj).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
  }

  // US numbers only: returns "+1XXXXXXXXXX" or null
  function normalizePhone(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d.length === 10 ? '+1' + d : null;
  }

  // Mailchimp only accepts cross-site sign-ups via JSONP
  function sendToMailchimp(fields) {
    return new Promise(function (resolve) {
      var cb = 'mcCb' + Date.now() + Math.floor(Math.random() * 1000);
      var params = { u: MC_U, id: MC_ID, f_id: FORM_EMAIL_ONLY, EMAIL: fields.email, FNAME: fields.first, c: cb };
      if (fields.sms) {
        params.f_id = FORM_WITH_SMS;
        params.SMSPHONE = fields.sms;
        params['SMSPHONE[country]'] = 'US';
        params['mc-SMSPHONE-ack'] = 'true';
      }
      params[MC_HONEYPOT] = '';
      var s = document.createElement('script');
      var done = function (result) {
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        if (s.parentNode) s.parentNode.removeChild(s);
        resolve(result);
      };
      window[cb] = function (data) { done(data); };
      s.onerror = function () { done({ result: 'error', msg: 'network' }); };
      s.src = MC_URL + '?' + toQuery(params);
      document.body.appendChild(s);
    });
  }

  function sendToNetlify(form) {
    var body = new URLSearchParams(new FormData(form)).toString();
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
  }

  function withTimeout(p) {
    return Promise.race([p, new Promise(function (r) { setTimeout(function () { r('timeout'); }, TIMEOUT_MS); })]);
  }

  function wire(form) {
    var phone = form.querySelector('[name="phone"]');
    var consent = form.querySelector('[name="sms-consent"]');
    var box = form.querySelector('.smsc');
    var err = form.querySelector('.ferr');

    function showError(msg, focusEl) {
      if (err) { err.textContent = msg; err.hidden = false; }
      if (focusEl) focusEl.focus();
      // site.js may already have switched the button to "Sending…": undo that
      setTimeout(function () {
        var b = form.querySelector('button[type="submit"]');
        if (b && b.disabled) { b.disabled = false; if (b.dataset.label) b.textContent = b.dataset.label; }
      }, 0);
    }
    function clearError() { if (err) { err.hidden = true; err.textContent = ''; } }

    // Show the text-message consent only once someone starts typing a number
    if (phone && box) {
      var sync = function () { box.classList.toggle('off', !phone.value.trim() && !(consent && consent.checked)); };
      sync();
      phone.addEventListener('input', function () { sync(); clearError(); });
      if (consent) consent.addEventListener('change', clearError);
    }

    form.addEventListener('submit', function (e) {
      var phoneVal = phone ? phone.value.trim() : '';
      var wantsSms = !!(consent && consent.checked);
      var sms = null;

      // Validate the optional SMS part (works with or without the rest of this script)
      if (phoneVal || wantsSms) {
        sms = normalizePhone(phoneVal);
        if (!phoneVal) { e.preventDefault(); showError('Please add your mobile number, or uncheck the text message box.', phone); return; }
        if (!sms) { e.preventDefault(); showError('Please enter a 10-digit US mobile number, like (561) 555-0123.', phone); return; }
        if (!wantsSms) { e.preventDefault(); showError('To get texts, please check the box. Or clear the number to skip texts.', consent); return; }
      }
      clearError();

      // Bots that fill the hidden honeypot get the plain Netlify submission (Netlify filters them)
      var trap = form.querySelector('[name="company"]');
      if (trap && trap.value) return;
      if (!window.fetch || !window.Promise || !window.URLSearchParams) return; // very old browser: normal submit

      e.preventDefault();
      var email = ((form.querySelector('[name="email"]') || {}).value || '').trim();
      var first = ((form.querySelector('[name="first-name"]') || {}).value || '').trim();
      var next = form.getAttribute('action') || '/';

      var netlify = sendToNetlify(form).then(function () { return 'ok'; }, function () { return 'failed'; });
      var mailchimp = withTimeout(sendToMailchimp({ email: email, first: first, sms: wantsSms ? sms : null }));

      Promise.all([withTimeout(netlify), mailchimp]).then(function (r) {
        if (r[0] === 'failed') {
          // Netlify couldn't be reached by script: submit the form the normal way instead
          HTMLFormElement.prototype.submit.call(form);
        } else {
          window.location.href = next;
        }
      });
    });
  }

  document.querySelectorAll('form[data-mailchimp]').forEach(wire);
})();
