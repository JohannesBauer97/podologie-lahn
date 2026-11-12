// Podologie Lahn – kleine Helfer ohne Abhängigkeiten.
(function () {
  // 1. Mobiles Menü auf- und zuklappen
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mobile-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(nav.hidden);
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
  }

  // 2. Aktuelles Jahr im Footer
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });

  // 3. Google-Karte erst nach Klick laden (vorher keine Verbindung zu Google)
  var map = document.querySelector('[data-map]');
  var mapButton = map && map.querySelector('[data-map-load]');
  if (map && mapButton) {
    mapButton.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.className = 'map-frame';
      frame.src = map.getAttribute('data-src');
      frame.title = 'Karte: Bahnhofstraße 12, 14789 Wusterwitz';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      map.replaceWith(frame);
      frame.focus(); // Tastaturfokus bleibt bei der Karte statt an den Seitenanfang zu springen
    });
  }
})();
