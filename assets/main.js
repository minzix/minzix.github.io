(function () {
  var root = document.documentElement;

  // ---------- Theme toggle ----------
  var toggle = document.querySelector('.theme-toggle');
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---------- TOC active section ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var targets = Object.keys(byId)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function updateActive() {
    var offset = window.innerHeight * 0.3;
    var current = null;
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top - offset <= 0) current = el;
    });
    links.forEach(function (a) { a.classList.remove('active'); });
    if (current) byId[current.id].classList.add('active');
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateActive(); ticking = false; });
  }, { passive: true });
  updateActive();

  // ---------- Lightbox ----------
  var box = document.querySelector('.lightbox');
  var boxImg = box.querySelector('img');
  function close() { box.hidden = true; boxImg.removeAttribute('src'); document.body.style.overflow = ''; }
  document.querySelectorAll('figure img').forEach(function (img) {
    img.addEventListener('click', function () {
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) close();
  });
})();
