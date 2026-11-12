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
})();
