document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.hero-slider');
  const slidesEl = slider ? slider.querySelector('.slides') : null;
  const slides = slidesEl ? Array.from(slidesEl.querySelectorAll('.slide')) : [];
  const total = slides.length || 0;
  let current = 0;
  let autoTimer = null;
  const AUTOPLAY_MS = 5000;

  if (slidesEl && total > 0) {
    slidesEl.style.animation = 'none';
    slidesEl.style.transition = 'transform 0.6s ease';
    slidesEl.style.willChange = 'transform';

    const controls = document.createElement('div');
    controls.className = 'slider-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = '›';

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    slider.appendChild(controls);

    const dots = document.createElement('div');
    dots.className = 'dots';
    const dotButtons = [];
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'dot';
      d.type = 'button';
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => {
        pauseAutoplay();
        goTo(i);
      });
      dots.appendChild(d);
      dotButtons.push(d);
    }
    slider.appendChild(dots);

    function updateDots() {
      dotButtons.forEach((b, i) => b.classList.toggle('active', i === current));
    }

    function applyTransform() {
      slidesEl.style.transform = `translateX(-${(current * 100) / total}%)`;
      updateDots();
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      requestAnimationFrame(applyTransform);
    }

    prevBtn.addEventListener('click', () => {
      pauseAutoplay();
      goTo(current - 1);
    });
    nextBtn.addEventListener('click', () => {
      pauseAutoplay();
      goTo(current + 1);
    });

    function startAutoplay() {
      if (autoTimer) return;
      autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    }
    function pauseAutoplay() {
      if (!autoTimer) return;
      clearInterval(autoTimer);
      autoTimer = null;
    }

    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('focusin', pauseAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { pauseAutoplay(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { pauseAutoplay(); goTo(current + 1); }
    });

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => applyTransform(), 120);
    });

    goTo(0);
    startAutoplay();
  }

  function smoothScrollTo(target) {
    if (!target) return;
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top, behavior: 'smooth' });

    const mainNav = document.querySelector('.nav-container');
    const navToggle = document.querySelector('.nav-toggle');
    if (mainNav && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], a[href^="#"]'));

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });

  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) profileBtn.addEventListener('click', () => {
    const el = document.getElementById('profile');
    if (el) smoothScrollTo(el);
  });

  document.querySelectorAll('.see-more-btn').forEach(btn => {
    const txt = (btn.textContent || btn.innerText || '').trim().toLowerCase();
    if (txt.includes('anime')) {
      btn.addEventListener('click', () => {
        window.open('https://www.crunchyroll.com/one-piece', '_blank', 'noopener');
      });
    } else if (txt.includes('profile')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('profile')));
    } else if (txt.includes('others')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('activities')));
    } else if (txt.includes('contact')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('contact')));
    } else {
      btn.addEventListener('click', () => {});
    }
  });

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.nav-container');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.classList.contains('open')) return;
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (header) {
    let lastScroll = window.pageYOffset;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 120) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }
});