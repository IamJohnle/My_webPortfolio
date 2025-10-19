// Simple accessible slider with autoplay, pause on hover, keyboard support
document.addEventListener('DOMContentLoaded', function () {
  // --- Slider (accessible, autoplay) ---
  const slides = Array.from(document.querySelectorAll('.hero-slider .slide'));
  const nextBtn = document.querySelector('.hero-slider .next');
  const prevBtn = document.querySelector('.hero-slider .prev');
  const dots = Array.from(document.querySelectorAll('.hero-slider .dot'));
  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current < 0) current = 0;
  let interval = null;
  const delay = 5000;

  function show(idx) {
    if (idx === current) return;
    slides.forEach((s, i) => {
      const active = i === idx;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', (!active).toString());
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', (i === idx).toString());
    });
    current = idx;
  }
  function next() { show((current + 1) % slides.length); }
  function prev() { show((current - 1 + slides.length) % slides.length); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  dots.forEach(d => d.addEventListener('click', e => show(Number(e.currentTarget.dataset.slide))));
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); });

  const hero = document.querySelector('.hero-slider');
  if (hero) {
    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, .dot, .slider-btn')) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) prev(); else next();
    });
    hero.addEventListener('touchstart', (e) => {
      const touch = e.touches && e.touches[0];
      if (!touch) return;
      if (e.target.closest('button, a, .dot, .slider-btn')) return;
      const rect = hero.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      if (x < rect.width / 2) prev(); else next();
    }, { passive: true });

    function start() { interval = setInterval(next, delay); }
    function stop() { if (interval) { clearInterval(interval); interval = null; } }
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusout', start);
    start();
  }

  // --- NAV TOGGLE (hamburger) ---
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    // ensure ARIA default
    toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'true' : 'false');

    toggle.addEventListener('click', (e) => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.classList.toggle('open', isOpen); // visual X
      e.stopPropagation();
    });

    // close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (e.target.closest('.nav') || e.target.closest('.nav-toggle')) return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('open');
    });

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('open');
        toggle.focus();
      }
    });
  }

  // --- Smooth nav link scrolling & close mobile nav ---
  const items = Array.from(document.querySelectorAll('#nav-item a, #nav-item > li'));
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      // allow external links / links with target to behave normally
      if (item.tagName.toLowerCase() === 'a' && item.target === '_blank') return;
      const anchor = item.tagName.toLowerCase() === 'a' ? item : (item.querySelector('a') || null);
      const href = anchor ? (anchor.getAttribute('href') || '') : (`#${item.className.split(' ')[0] || ''}`);
      const id = (href || '').replace(/^#/, '');
      const target = id ? document.getElementById(id) : null;

      // close mobile nav if open
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.classList.remove('open'); }
      }

      if (target) {
        e.preventDefault();
        target.classList.remove('animate-in'); void target.offsetWidth; target.classList.add('animate-in');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Read More toggle (profile) ---
  const contentContainer = document.getElementById('contentContainer');
  const button = document.getElementById('btnReadMore');
  if (button && contentContainer) {
    let contentChanged = false;
    button.addEventListener('click', function () {
      if (!contentChanged) {
        contentContainer.innerHTML = '<p>Name: John-Le P. Altoras</p><p>Age: 23 years old</p><p>Course: Diploma in Information Technology</p><p>Year Level: 3rd Year</p><p>College: Davao del Sur State College (DSSC)</p><p>Interests: Software Development, Networking, Problem-Solving, Tech Innovations</p>';
        button.textContent = 'Show Original';
        contentChanged = true;
      } else {
        contentContainer.innerHTML = ' <p>Hello! I\'m John-Le, a dedicated 3rd-year student pursuing a Diploma in Information Technology at Davao del Sur State College (DSSC). <br> I am building my skills in software development, networking, and problem-solving to prepare for a career in the tech industry. I\'m always eager to learn more and connect with fellow students and professionals. Feel free to explore my profile or get in touch! </p>';
        button.textContent = 'Read More';
        contentChanged = false;
      }
    });
  }

  // --- Ensure "View" project buttons open in a new tab (JS fallback) ---
  document.querySelectorAll('.card-actions .btn.small[data-project]').forEach(a => {
    if (!a.target) a.setAttribute('target', '_blank');
    if (!a.rel) a.setAttribute('rel', 'noopener noreferrer');
  });

  // --- Header scrolled class ---
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Contact form demo submit ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      if (status) status.textContent = "Thank you for your feedback!";
      contactForm.reset();
    });
  }
}); // end DOMContentLoaded