/* 
Full file with inline comments explaining each block and function for study.
*/
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Slider (optional) ----------
  // Select slider container and slides (if present)
  const slider = document.querySelector('.hero-slider');
  // slidesEl is null when there is no slider on the page (safe handling)
  const slidesEl = slider ? slider.querySelector('.slides') : null;
  // array of .slide elements (empty array if slidesEl is null)
  const slides = slidesEl ? Array.from(slidesEl.querySelectorAll('.slide')) : [];
  const total = slides.length || 0; // total slide count (0 if none)
  let current = 0;                  // index of current visible slide
  let autoTimer = null;             // autoslide interval handle
  const AUTOPLAY_MS = 5000;         // autoplay interval duration (ms)

  // If slides exist, wire up controls and autoplay
  if (slidesEl && total > 0) {
    // Stop any CSS keyframe animation and use JS transform for responsive control
    slidesEl.style.animation = 'none';
    slidesEl.style.transition = 'transform 0.6s ease';
    slidesEl.style.willChange = 'transform';

    // Create Prev/Next controls (DOM injection)
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

    // append buttons to controls container and append to slider
    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    slider.appendChild(controls);

    // Create pagination dots allowing direct access to any slide
    const dots = document.createElement('div');
    dots.className = 'dots';
    const dotButtons = [];
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'dot';
      d.type = 'button';
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      // clicking a dot will pause autoplay and jump to that slide
      d.addEventListener('click', () => {
        pauseAutoplay();
        goTo(i);
      });
      dots.appendChild(d);
      dotButtons.push(d);
    }
    slider.appendChild(dots);

    // Update dots active state to reflect current slide
    function updateDots() {
      dotButtons.forEach((b, i) => b.classList.toggle('active', i === current));
    }

    // applyTransform uses percentage movement so it works responsively
    // slidesEl width = total * 100% (CSS), so translateX(-X%) moves by slide fraction
    function applyTransform() {
      slidesEl.style.transform = `translateX(-${(current * 100) / total}%)`;
      updateDots();
    }

    // goTo wraps index and triggers transform via rAF for smoothness
    function goTo(index) {
      current = ((index % total) + total) % total; // wrap negative indices
      requestAnimationFrame(applyTransform);
    }

    // Prev/Next button handlers: pause autoplay and move
    prevBtn.addEventListener('click', () => {
      pauseAutoplay();
      goTo(current - 1);
    });
    nextBtn.addEventListener('click', () => {
      pauseAutoplay();
      goTo(current + 1);
    });

    // Autoplay: start timer and pause/resume on hover/focus
    function startAutoplay() {
      if (autoTimer) return;
      autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    }
    function pauseAutoplay() {
      if (!autoTimer) return;
      clearInterval(autoTimer);
      autoTimer = null;
    }

    // Pause when user interacts (mouse/focus), resume when leaving
    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('focusin', pauseAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Keyboard support: left/right arrows navigate slides
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { pauseAutoplay(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { pauseAutoplay(); goTo(current + 1); }
    });

    // On resize, re-apply transform (keeps translation in sync with responsive widths)
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => applyTransform(), 120);
    });

    // initialize slider to first slide and start autoplay
    goTo(0);
    startAutoplay();
  } // end slider setup

  // ---------- Smooth scroll helper (works even if slider not present) ----------
  // scrolls to an element accounting for fixed header height
  function smoothScrollTo(target) {
    if (!target) return;
    // find header to compute offset so section isn't hidden under fixed header
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    // perform smooth scrolling
    window.scrollTo({ top, behavior: 'smooth' });

    // If mobile nav was open, close it after navigation
    const mainNav = document.querySelector('.nav-container');
    const navToggle = document.querySelector('.nav-toggle');
    if (mainNav && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // ---------- Nav links: ensure clicks always navigate to page sections ----------
  // select internal anchors in nav and the page (prevents default link behavior and uses smoothScrollTo)
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], a[href^="#"]'));

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return; // ignore empty anchors
      const target = document.querySelector(href);
      if (!target) return; // target not on page
      e.preventDefault();   // prevent instant jump
      smoothScrollTo(target); // smooth scroll with header offset
    });
  });

  // ---------- Buttons that should scroll to sections ----------
  // Profile "More" button (intro -> profile)
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) profileBtn.addEventListener('click', () => {
    const el = document.getElementById('profile');
    if (el) smoothScrollTo(el);
  });

  // Map slide buttons (.see-more-btn) to actions:
  // - "Anime" opens Crunchyroll One Piece in a new tab
  // - "Profile", "Others", "Contact" scroll to respective sections
  document.querySelectorAll('.see-more-btn').forEach(btn => {
    const txt = (btn.textContent || btn.innerText || '').trim().toLowerCase();
    if (txt.includes('anime')) {
      btn.addEventListener('click', () => {
        // open external link safely in new tab
        window.open('https://www.crunchyroll.com/one-piece', '_blank', 'noopener');
      });
    } else if (txt.includes('profile')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('profile')));
    } else if (txt.includes('others')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('activities')));
    } else if (txt.includes('contact')) {
      btn.addEventListener('click', () => smoothScrollTo(document.getElementById('contact')));
    } else {
      // fallback - no-op or move to next slide if you prefer
      btn.addEventListener('click', () => {});
    }
  });

  // ---------- Mobile nav toggle (if present) ----------
  // toggles class "open" on .nav-container so CSS can show/hide mobile menu
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.nav-container');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      e.stopPropagation(); // prevent click bubbling closing nav immediately
    });

    // clicking outside the nav closes it
    document.addEventListener('click', (e) => {
      if (!mainNav.classList.contains('open')) return;
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // when user resizes to desktop, ensure nav is closed
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  } // end mobile nav

  // ---------- Header show/hide on scroll (slide effect) ----------
  // Hides header when scrolling down, shows when scrolling up (improves reading area)
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (header) {
    let lastScroll = window.pageYOffset;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 120) {
          // user scrolled down — hide header
          header.classList.add('hidden');
        } else {
          // user scrolled up — show header
          header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }
}); // end DOMContentLoaded