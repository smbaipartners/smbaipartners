/* Cookie / tracking consent for smbaipartners.com
   Analytics and business-identification scripts load ONLY after the visitor accepts.
   Choice is stored in localStorage and can be changed from the footer link. */
(function () {
  var KEY = 'smbai-consent';          // 'accepted' | 'declined'
  var GA_ID = 'G-QXHVL92VX';
  var APOLLO_APP_ID = '692d20279d938d0019796932';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  var loaded = false;
  function loadTrackers() {
    if (loaded) return;
    loaded = true;

    // Google Analytics
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    // Apollo website visitor tracker
    var ap = document.createElement('script');
    ap.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' +
             Math.random().toString(36).substring(7);
    ap.async = true;
    ap.defer = true;
    ap.onload = function () {
      if (window.trackingFunctions && window.trackingFunctions.onLoad) {
        window.trackingFunctions.onLoad({ appId: APOLLO_APP_ID });
      }
    };
    document.head.appendChild(ap);
  }

  var banner;
  function closeBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie choices');
    banner.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1f2937;color:#fff;' +
      'padding:16px;box-shadow:0 -2px 10px rgba(0,0,0,.25);font-family:Lato,system-ui,sans-serif';
    banner.innerHTML =
      '<div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;' +
      'align-items:center;justify-content:space-between">' +
        '<p style="margin:0;flex:1 1 320px;font-size:15px;line-height:1.5">' +
          'We use cookies to see how visitors use our site so we can improve it. ' +
          'Nothing loads until you choose. ' +
          '<a href="/privacy.html" style="color:#93c5fd;text-decoration:underline">Privacy Policy</a>' +
        '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" data-consent="declined" ' +
            'style="background:transparent;color:#fff;border:2px solid #9ca3af;border-radius:8px;' +
            'padding:10px 18px;font-weight:700;cursor:pointer;font-size:15px">Decline</button>' +
          '<button type="button" data-consent="accepted" ' +
            'style="background:#2A4B8D;color:#fff;border:0;border-radius:8px;padding:12px 20px;' +
            'font-weight:700;cursor:pointer;font-size:15px">Accept</button>' +
        '</div>' +
      '</div>';

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var choice = btn.getAttribute('data-consent');
      save(choice);
      closeBanner();
      if (choice === 'accepted') loadTrackers();
    });

    document.body.appendChild(banner);
    var accept = banner.querySelector('[data-consent="accepted"]');
    if (accept) accept.focus();
  }

  function init() {
    var choice = read();
    if (choice === 'accepted') loadTrackers();
    else if (choice !== 'declined') showBanner();

    // "Your Privacy Choices" links/buttons anywhere on the page
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-privacy-choices]');
      if (!el) return;
      e.preventDefault();
      showBanner();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
