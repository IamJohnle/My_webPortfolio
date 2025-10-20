/* ==========================================================================
   ORGANIZED AND WELL-COMMENTED JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. SLIDER FUNCTIONALITY
    // ==========================================================================
    
    // Select slider elements
    const slider = document.querySelector('.hero-slider');
    const slidesEl = slider ? slider.querySelector('.slides') : null;
    const slides = slidesEl ? Array.from(slidesEl.querySelectorAll('.slide')) : [];
    const total = slides.length || 0;
    
    // Slider state variables
    let current = 0;
    let autoTimer = null;
    const AUTOPLAY_MS = 5000;

    // Initialize slider if it exists on the page
    if (slidesEl && total > 0) {
        initializeSlider();
    }

    function initializeSlider() {
        // Disable CSS animation and use JS for better control
        slidesEl.style.animation = 'none';
        slidesEl.style.transition = 'transform 0.6s ease';
        slidesEl.style.willChange = 'transform';

        // Create and append slider controls
        createSliderControls();
        
        // Create pagination dots
        createPaginationDots();
        
        // Initialize slider position and start autoplay
        goTo(0);
        startAutoplay();
    }

    function createSliderControls() {
        // Create controls container
        const controls = document.createElement('div');
        controls.className = 'slider-controls';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slide-prev';
        prevBtn.type = 'button';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.innerHTML = '‹';
        prevBtn.addEventListener('click', () => {
            pauseAutoplay();
            goTo(current - 1);
        });

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slide-next';
        nextBtn.type = 'button';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.innerHTML = '›';
        nextBtn.addEventListener('click', () => {
            pauseAutoplay();
            goTo(current + 1);
        });

        // Append buttons to controls and slider
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        slider.appendChild(controls);
    }

    function createPaginationDots() {
        const dots = document.createElement('div');
        dots.className = 'dots';
        const dotButtons = [];

        // Create dots for each slide
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            // Dot click event
            dot.addEventListener('click', () => {
                pauseAutoplay();
                goTo(i);
            });
            
            dots.appendChild(dot);
            dotButtons.push(dot);
        }

        slider.appendChild(dots);
        window.dotButtons = dotButtons; // Store for updateDots function
    }

    function updateDots() {
        if (window.dotButtons) {
            window.dotButtons.forEach((button, index) => {
                button.classList.toggle('active', index === current);
            });
        }
    }

    function applyTransform() {
        // Calculate transform percentage based on current slide
        const transformValue = `translateX(-${(current * 100) / total}%)`;
        slidesEl.style.transform = transformValue;
        updateDots();
    }

    function goTo(index) {
        // Handle wrap-around for slide indices
        current = ((index % total) + total) % total;
        requestAnimationFrame(applyTransform);
    }

    function startAutoplay() {
        if (autoTimer) return;
        autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    }

    function pauseAutoplay() {
        if (!autoTimer) return;
        clearInterval(autoTimer);
        autoTimer = null;
    }

    // Autoplay control events
    if (slider) {
        slider.addEventListener('mouseenter', pauseAutoplay);
        slider.addEventListener('focusin', pauseAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusout', startAutoplay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pauseAutoplay();
            goTo(current - 1);
        }
        if (e.key === 'ArrowRight') {
            pauseAutoplay();
            goTo(current + 1);
        }
    });

    // Handle window resize
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => applyTransform(), 120);
    });

    // ==========================================================================
    // 2. SMOOTH SCROLLING FUNCTIONALITY
    // ==========================================================================
    
    function smoothScrollTo(target) {
        if (!target) return;
        
        // Calculate offset to account for fixed header
        const header = document.querySelector('.site-header') || document.querySelector('header');
        const offset = header ? header.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
        
        // Perform smooth scroll
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile navigation if open
        closeMobileNav();
    }

    function closeMobileNav() {
        const mainNav = document.querySelector('.nav-container');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (mainNav && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // ==========================================================================
    // 3. NAVIGATION LINK HANDLING
    // ==========================================================================
    
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], a[href^="#"]'));

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignore empty anchors
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            smoothScrollTo(target);
        });
    });

    // ==========================================================================
    // 4. BUTTON ACTION HANDLING
    // ==========================================================================
    
    // Profile "More" button
        // ==========================================================================
    // 4. BUTTON ACTION HANDLING
    // ==========================================================================
    
    // Profile "More" button
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            const profileSection = document.getElementById('profile');
            if (profileSection) smoothScrollTo(profileSection);
        });
    }

    // Back button in profile section - scroll to home
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Scroll to home section (hero slider)
            const homeSection = document.getElementById('home');
            if (homeSection) smoothScrollTo(homeSection);
        });
    });

    // Slide buttons with different actions
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        const buttonText = (btn.textContent || btn.innerText || '').trim().toLowerCase();
        
        switch (true) {
            case buttonText.includes('anime'):
                btn.addEventListener('click', () => {
                    window.open('https://www.crunchyroll.com/one-piece', '_blank', 'noopener');
                });
                break;
                
            case buttonText.includes('profile'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('profile'));
                });
                break;
                
            case buttonText.includes('others'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('activities'));
                });
                break;
                
            case buttonText.includes('contact'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('contact'));
                });
                break;
                
            default:
                // Fallback for buttons without specific actions
                btn.addEventListener('click', () => {});
                break;
        }
    });

    // Slide buttons with different actions
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        const buttonText = (btn.textContent || btn.innerText || '').trim().toLowerCase();
        
        switch (true) {
            case buttonText.includes('anime'):
                btn.addEventListener('click', () => {
                    window.open('https://www.crunchyroll.com/one-piece', '_blank', 'noopener');
                });
                break;
                
            case buttonText.includes('profile'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('profile'));
                });
                break;
                
            case buttonText.includes('others'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('activities'));
                });
                break;
                
            case buttonText.includes('contact'):
                btn.addEventListener('click', () => {
                    smoothScrollTo(document.getElementById('contact'));
                });
                break;
                
            default:
                // Fallback for buttons without specific actions
                btn.addEventListener('click', () => {});
                break;
        }
    });

    // ==========================================================================
    // 5. MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.nav-container');

    // Create backdrop for mobile navigation
    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        document.body.appendChild(navBackdrop);
    }

    if (navToggle && mainNav) {
        // Toggle navigation menu
        navToggle.addEventListener('click', (e) => {
            const isOpen = mainNav.classList.contains('open');
            
            mainNav.classList.toggle('open', !isOpen);
            navToggle.setAttribute('aria-expanded', !isOpen);
            navBackdrop.classList.toggle('visible', !isOpen);
            document.body.style.overflow = !isOpen ? 'hidden' : '';
            
            e.stopPropagation();
        });

        // Close navigation when clicking backdrop
        navBackdrop.addEventListener('click', () => {
            closeNavigation();
        });

        // Close navigation when clicking nav links
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeNavigation();
            });
        });

        // Close navigation on window resize (for desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 820) {
                closeNavigation();
            }
        });
    }

    function closeNavigation() {
        if (mainNav) mainNav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        if (navBackdrop) navBackdrop.classList.remove('visible');
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // 6. HEADER SCROLL BEHAVIOR
    // ==========================================================================
    
    const header = document.querySelector('.site-header') || document.querySelector('header');
    
    if (header) {
        let lastScroll = window.pageYOffset;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (ticking) return;
            
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Hide header when scrolling down, show when scrolling up
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


}); // End of DOMContentLoaded
