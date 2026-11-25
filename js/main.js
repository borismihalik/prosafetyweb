/* Prosafety – menu a kontaktný formulár */

/* E-mail, na ktorý chodia správy z kontaktného formulára (služba FormSubmit.co).
   Pri prvej odoslanej správe príde na túto adresu e-mail s tlačidlom „Activate Form“ –
   po jeho potvrdení začnú správy chodiť. */
var FORM_EMAIL = 'boris.mihalik@gmail.com';

(function () {
  // ---------- Otvorenie webu priamo z disku (file://) ----------
  // Prehliadač vtedy neotvorí index.html v priečinku sám, preto ho k odkazom doplníme.
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      var parts = h.split(/([?#].*)/);
      var path = parts[0], rest = parts[1] || '';
      if (path === '' ) return;
      if (path === './' || path === '.') path = './index.html';
      else if (/\/$/.test(path)) path = path + 'index.html';
      a.setAttribute('href', path + rest);
    });
  }

  // ---------- Mobilné menu ----------
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('mnav');
  if (burger && nav) {
    var setMenu = function (open) {
      nav.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    };
    burger.addEventListener('click', function () { setMenu(nav.hidden); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960 && !nav.hidden) setMenu(false); });
  }
  document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = document.getElementById(btn.getAttribute('data-toggle'));
      sub.hidden = !sub.hidden;
      btn.setAttribute('aria-expanded', sub.hidden ? 'false' : 'true');
      btn.querySelector('.sign').textContent = sub.hidden ? '+' : '−';
    });
  });

  // ---------- Kontaktný formulár ----------
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var params = new URLSearchParams(window.location.search);
  if (params.get('predmet')) form.elements.predmet.value = params.get('predmet');

  function showError(input, msg) {
    var el = document.getElementById(input.id + '-err');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (el) el.textContent = msg || '';
  }
  function validate() {
    var ok = true;
    var name = form.elements.meno, email = form.elements.email;
    if (!name.value.trim()) { showError(name, 'Vyplňte, prosím, vaše meno.'); ok = false; } else showError(name, '');
    if (!email.value.trim()) { showError(email, 'Vyplňte, prosím, váš e-mail.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Zadajte e-mail v tvare meno@domena.sk.'); ok = false; }
    else showError(email, '');
    return ok;
  }
  function setStatus(kind, html) {
    status.hidden = false;
    status.className = 'form-status ' + kind;
    status.innerHTML = html;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (form.elements._honey.value) return; // ochrana proti spamu
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Odosielam…';
    var data = {
      'Meno': form.elements.meno.value.trim(),
      'E-mail': form.elements.email.value.trim(),
      'Predmet': form.elements.predmet.value.trim(),
      'Správa': form.elements.sprava.value.trim(),
      '_replyto': form.elements.email.value.trim(),
      '_subject': 'Správa z webu prosafety.sk' + (form.elements.predmet.value.trim() ? ': ' + form.elements.predmet.value.trim() : ''),
      '_template': 'table'
    };
    fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && (res.j.success === true || res.j.success === 'true')) {
          form.reset();
          setStatus('ok', '<b>Ďakujeme, správa bola odoslaná.</b> Ozveme sa vám čo najskôr.');
          return;
        }
        var msg = (res.j && res.j.message) ? String(res.j.message) : '';
        if (/activat/i.test(msg)) {
          // Prvé odoslanie: FormSubmit čaká na potvrdenie adresy príjemcu
          setStatus('bad', '<b>Formulár ešte nie je aktivovaný.</b> Na adresu ' + FORM_EMAIL + ' prišiel e-mail od FormSubmit s tlačidlom „Activate Form“. Po jeho potvrdení odošlite správu znova.');
          return;
        }
        var e = new Error(msg); e.detail = msg; throw e;
      })
      .catch(function (err) {
        var body = encodeURIComponent('Meno: ' + data['Meno'] + '\nE-mail: ' + data['E-mail'] + '\n\n' + data['Správa']);
        var detail = err && err.detail ? '<br><small>Odpoveď služby: ' + String(err.detail).replace(/</g, '&lt;') + '</small>' : '';
        setStatus('bad', 'Správu sa nepodarilo odoslať. Skúste to znova alebo nám napíšte priamo na <a href="mailto:info@prosafety.sk?subject=' + encodeURIComponent(data['_subject']) + '&body=' + body + '">info@prosafety.sk</a>.' + detail);
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Odoslať správu'; });
  });
})();
