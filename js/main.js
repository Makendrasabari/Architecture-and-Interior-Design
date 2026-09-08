/**
 * STACKLY Architecture & Interior Design Studio
 * Core Application Interactions & Global Page Scroll Reset Engine
 */

// Disable browser auto-restoration of scroll position across all page navigations
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}



// Global capture listener: save exact scroll position for any element navigating to 404
window.addEventListener('click', (e) => {
  const target = e.target.closest('a, button, .btn, [href]');
  if (!target) return;

  const href = target.getAttribute('href');
  const is404Link = href === '404.html' || (href && href.includes('404.html'));

  if (is404Link) {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
      sessionStorage.setItem('stackly_returning_from_404', 'true');
      sessionStorage.setItem('stackly_source_page', window.location.pathname);
    } catch (err) {}
  }
}, true);

// Reliable scroll restoration function for back-navigation from 404
function restoreScrollPositionFrom404() {
  // 1. Force close any and all modals so they never restore
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';

  try {
    const isReturning = sessionStorage.getItem('stackly_returning_from_404') === 'true';
    const savedScroll = sessionStorage.getItem('stackly_saved_scroll');
    if (isReturning && savedScroll !== null) {
      const targetY = parseInt(savedScroll, 10);
      if (!isNaN(targetY)) {
        const applyScroll = () => {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = targetY;
          document.body.scrollTop = targetY;
        };

        applyScroll();

        // Micro-staggers guarantee exact restoration as layout and webfonts render
        requestAnimationFrame(applyScroll);
        setTimeout(applyScroll, 30);
        setTimeout(applyScroll, 100);
        setTimeout(applyScroll, 250);
        setTimeout(applyScroll, 500);

        // Keep flags intact for 1500ms so DOMContentLoaded, pageshow, and load events do not trigger reset to 0
        setTimeout(() => {
          sessionStorage.removeItem('stackly_returning_from_404');
          sessionStorage.removeItem('stackly_saved_scroll');
          sessionStorage.removeItem('stackly_source_page');
        }, 1500);
        return true;
      }
    }
  } catch (err) {}
  return false;
}

function resetGlobalScrollPosition() {
  // If returning from 404 or back-navigation, restore previous scroll position and do NOT reset to top
  try {
    if (sessionStorage.getItem('stackly_returning_from_404') === 'true') {
      restoreScrollPositionFrom404();
      return;
    }
  } catch (e) {}

  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const scrollContainers = document.querySelectorAll(
    '.dashboard-main, .dashboard-content-area, #arch-module-container, #int-module-container, .dashboard-shell'
  );
  scrollContainers.forEach((container) => {
    container.scrollTop = 0;
  });
}

window.STACKLY_RESET_SCROLL = resetGlobalScrollPosition;
window.STACKLY_RESTORE_SCROLL = restoreScrollPositionFrom404;

// Reset or restore scroll on script parse
if (!restoreScrollPositionFrom404()) {
  resetGlobalScrollPosition();
}

window.addEventListener('pageshow', (e) => {
  if (sessionStorage.getItem('stackly_returning_from_404') === 'true' || e.persisted) {
    restoreScrollPositionFrom404();
    return;
  }
  resetGlobalScrollPosition();
});

window.addEventListener('beforeunload', () => {
  if (sessionStorage.getItem('stackly_returning_from_404') === 'true') {
    return;
  }
  resetGlobalScrollPosition();
});

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('stackly_returning_from_404') === 'true') {
    restoreScrollPositionFrom404();
  } else {
    resetGlobalScrollPosition();
    initArchitecturalPreloader();
  }
  initCursor();
  initNavbar();
  initScrollReveals();
  initAnimatedCounters();
  initProjectModals();
  initFooterNewsletter();
  initHeroScrollBtn();
  initHeroBgSlider();
  initMobileDashboardSidebar();
});

/**
 * Premium Architectural Door-Opening Preloader
 */
function initArchitecturalPreloader() {
  try {
    if (sessionStorage.getItem('stackly_returning_from_404') === 'true') {
      return;
    }
  } catch (e) {}

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (document.getElementById('architectural-preloader')) return;

  const preloader = document.createElement('div');
  preloader.id = 'architectural-preloader';
  preloader.className = 'architectural-preloader';
  preloader.setAttribute('aria-hidden', 'true');
  preloader.innerHTML = `
    <div class="preloader-door-left"></div>
    <div class="preloader-door-right"></div>
    <div class="preloader-logo-wrap">
      <img src="assets/Logo11.webp" alt="STACKLY" class="preloader-logo-img" />
    </div>
  `;

  if (document.body) {
    document.body.insertBefore(preloader, document.body.firstChild);
    document.body.style.overflow = 'hidden';
  } else {
    return;
  }

  const doorLeft = preloader.querySelector('.preloader-door-left');
  const doorRight = preloader.querySelector('.preloader-door-right');
  const logoWrap = preloader.querySelector('.preloader-logo-wrap');

  const cleanup = () => {
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }
    document.body.style.overflow = '';
  };

  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ onComplete: cleanup });

    gsap.set(logoWrap, { opacity: 0, scale: 0.95 });
    gsap.set(doorLeft, { xPercent: 0 });
    gsap.set(doorRight, { xPercent: 0 });

    // Phase 1 — Initial Logo Reveal (0.35s)
    tl.to(logoWrap, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out'
    });

    // Phase 2 & 3 — Architectural Doors Open (0.8s) & Logo Exit (0.25s)
    tl.to(
      logoWrap,
      {
        opacity: 0,
        scale: 1.05,
        duration: 0.25,
        ease: 'power2.in'
      },
      '+=0.05'
    );

    tl.to(
      doorLeft,
      {
        xPercent: -102,
        duration: 0.8,
        ease: 'power3.inOut'
      },
      '<='
    );

    tl.to(
      doorRight,
      {
        xPercent: 102,
        duration: 0.8,
        ease: 'power3.inOut'
      },
      '<'
    );

    // Phase 4 — Final Website Reveal
    tl.to(
      preloader,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      },
      '-=0.15'
    );
  } else {
    logoWrap.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    logoWrap.style.opacity = '1';
    logoWrap.style.transform = 'translate(-50%, -50%) scale(1)';

    setTimeout(() => {
      logoWrap.style.opacity = '0';
      logoWrap.style.transform = 'translate(-50%, -50%) scale(1.05)';
      doorLeft.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      doorRight.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      doorLeft.style.transform = 'translateX(-102%)';
      doorRight.style.transform = 'translateX(102%)';
    }, 400);

    setTimeout(() => {
      preloader.style.transition = 'opacity 0.25s ease';
      preloader.style.opacity = '0';
      setTimeout(cleanup, 250);
    }, 1300);
  }
}

/**
 * 1. Architectural Custom Cursor
 */
function initCursor() {
  return;
}

/**
 * 2. Sticky Navbar & Mobile Drawer
 */
function initNavbar() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (header) {
    const isDarkInitial = header.classList.contains('nav-dark');

    function handleScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
        header.classList.remove('nav-transparent');
        if (isDarkInitial) {
          header.classList.remove('nav-dark');
        }
      } else {
        header.classList.remove('scrolled');
        if (isDarkInitial) {
          header.classList.add('nav-dark', 'nav-transparent');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      if (header) header.classList.toggle('drawer-open', isOpen);
      drawer.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        if (header) header.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        if (header) header.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * 3. Native IntersectionObserver Scroll Reveals
 */
function initScrollReveals() {
  const revealTargets = document.querySelectorAll('[data-anim]');
  if (!revealTargets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach((target) => observer.observe(target));
}

/**
 * 4. Animated Number Counters
 */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-counter-target'), 10);
        if (!isNaN(targetVal)) {
          animateValue(el, 0, targetVal, 1800);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach((el) => observer.observe(el));
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    obj.innerText = Math.floor(easeOut * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerText = end;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * 5. Global STACKLY Brand Logo Reset & 404 Route Handler
 */
document.addEventListener('click', (e) => {
  const brandLink = e.target.closest('.brand-logo, .navbar-brand, a[href*="dashboard"]');
  if (brandLink && window.STACKLY_STORE) {
    const href = brandLink.getAttribute('href') || '';
    if (href.includes('architecture-dashboard.html')) {
      window.STACKLY_STORE.setArchTab('overview');
    } else if (href.includes('interior-dashboard.html')) {
      window.STACKLY_STORE.setIntTab('overview');
    }
  }

  // Check if click was on a status badge or notification bell icon
  const notifTarget = e.target.closest('#dashboard-notif-btn, .notif-badge-pulse');
  if (notifTarget) {
    e.preventDefault();
    e.stopPropagation();

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
      sessionStorage.setItem('stackly_returning_from_404', 'true');
      sessionStorage.setItem('stackly_source_page', window.location.pathname);
    } catch (err) {}

    document.querySelectorAll('.modal-overlay').forEach((modal) => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';

    window.location.href = '404.html';
    return;
  }

  const badgeTarget = e.target.closest('.badge, .status-badge, .badge-dark, .badge-red, .badge-outline, .project-tag-pill, .report-thumbnail-tag');
  if (badgeTarget) {
    e.preventDefault();
    e.stopPropagation();

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
      sessionStorage.setItem('stackly_returning_from_404', 'true');
      sessionStorage.setItem('stackly_source_page', window.location.pathname);
    } catch (err) {}

    document.querySelectorAll('.modal-overlay').forEach((modal) => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';

    window.location.href = '404.html';
    return;
  }

  const target = e.target.closest('button, .btn, a');
  if (!target) return;

  // Preserve primary navigation links & category filter buttons (Header menu, Footer main page links, Auth forms submit, Newsletter forms, Contact inquiry form, Blog category filters)
  const isPrimaryNav = target.closest('.navbar-menu, .mobile-drawer, .mobile-nav-drawer, .brand-logo, .auth-switch-link, .auth-back-link, #login-form, #signup-form, #contact-form, #contact-inquiry-form, #footer-newsletter-form, #blog-subscribe-form, #blog-cat-filters, .blog-filter-btn');
  if (isPrimaryNav) return;

  const text = (target.textContent || '').trim().toLowerCase();

  // Redirect specified CTA buttons, social media icons, footer email link & polygon play buttons across Home, About, Services, Blog, and Dashboards to 404 page
  if (
    target.classList.contains('footer-social-link') ||
    target.closest('.footer-social-link') ||
    (target.getAttribute('href') && target.getAttribute('href').includes('mailto:')) ||
    text.includes('salem@stackly-studio.com') ||
    (target.getAttribute('aria-label') && target.getAttribute('aria-label').includes('Play')) ||
    text.includes('watch documentary') ||
    text.includes('watch masterclass') ||
    text.includes('watch light study') ||
    target.getAttribute('aria-label') === 'Instagram' ||
    target.getAttribute('aria-label') === 'LinkedIn' ||
    target.getAttribute('aria-label') === 'Twitter / X' ||
    target.getAttribute('aria-label') === 'Pinterest' ||
    text.includes('explore projects') ||
    text.includes('salem studio inquiries') ||
    text.includes('discover our story') ||
    text.includes('schedule atelier consultation') ||
    text.includes('inquire for') ||
    text.includes('inquire for landscape') ||
    text.includes('inquire for management') ||
    text.includes('connect with our principals') ||
    text.includes('featured projects') ||
    text.includes('architecture practice') ||
    text.includes('interior design atelier') ||
    text.includes('our 6-step process') ||
    text.includes('studio command center') ||
    text.includes('confidentiality protocol') ||
    text.includes('terms of practice') ||
    text.includes('architectural licensing') ||
    text.includes('explore scope') ||
    text.includes('read analysis') ||
    text.includes('read full essay') ||
    text.includes('inspect monograph') ||
    text.includes('explore practice') ||
    text.includes('explore all services') ||
    text.includes('view portfolio') ||
    text.includes('read all articles') ||
    text.includes('commission architectural study') ||
    text.includes('commission study') ||
    text.includes('inquire about commission') ||
    text.includes('schedule studio consultation') ||
    target.classList.contains('report-download-btn') ||
    target.classList.contains('ffe-dl-btn') ||
    target.id === 'generate-full-dossier-btn' ||
    target.id === 'export-all-ffe-btn' ||
    target.id === 'dashboard-notif-btn' ||
    text.includes('download dossier') ||
    text.includes('generate full atelier dossier') ||
    text.includes('download schedule') ||
    text.includes('request paper pdf') ||
    text.includes('request paper')
  ) {
    e.preventDefault();
    e.stopPropagation();

    // 1. Save exact scroll position before navigating to 404
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
      sessionStorage.setItem('stackly_returning_from_404', 'true');
      sessionStorage.setItem('stackly_source_page', window.location.pathname);
    } catch (err) {}

    // 2. Ensure all modals are closed so history state never contains open popups
    document.querySelectorAll('.modal-overlay').forEach((modal) => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';

    window.location.href = '404.html';
  }
});

/**
 * 6. Project Blueprint & Architectural Inspection Modal
 */
function initProjectModals() {
  // Pop-up modal card functionality for project image cards on the home page disabled per user request
  return;
}

function openProjectModal(p) {
  let overlay = document.getElementById('project-detail-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'project-detail-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-card" id="project-detail-content"></div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  }

  const content = document.getElementById('project-detail-content');
  content.innerHTML = `
    <button class="modal-close" id="close-project-modal" aria-label="Close modal">×</button>
    
    <div style="display: flex; gap: 2rem; align-items: stretch; margin-bottom: 2rem; flex-wrap: wrap;">
      <!-- Reduced Image Left -->
      <div style="width: 320px; max-width: 100%; min-height: 240px; flex-shrink: 0; border-radius: var(--radius-sm); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.12); position: relative; background: var(--color-off-white);">
        <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        <span class="project-tag-pill" style="position: absolute; top: 1rem; left: 1rem; z-index: 2; font-size: 0.7rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(4px);">${p.category}</span>
      </div>

      <!-- Contents Right -->
      <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-red-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">${p.location} • ${p.year}</span>
            <span class="badge ${p.progress === 100 ? 'badge-dark' : 'badge-red'}">${p.status}</span>
          </div>

          <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 700; margin-bottom: 0.75rem; color: var(--color-near-black); line-height: 1.2;">${p.name}</h2>
          <p style="font-size: 0.95rem; color: var(--color-charcoal-deep); line-height: 1.65; margin-bottom: 1.25rem;">
            ${p.description}
          </p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(20,20,22,0.08); padding-top: 0.85rem; margin-top: auto;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Capital Investment</span>
            <strong style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 700; color: var(--color-red-primary);">${p.budget}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Completion Rate</span>
            <strong style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--color-near-black);">${p.progress}%</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Architectural Blueprint Specs Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; background: var(--color-off-white); padding: 1.25rem 1.5rem; border-radius: var(--radius-xs); margin-bottom: 2rem;">
      <div>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Total Footprint</span>
        <strong style="font-size: 1.05rem; color: var(--color-near-black);">${p.area}</strong>
      </div>
      <div>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Project Budget</span>
        <strong style="font-size: 1.05rem; color: var(--color-red-primary);">${p.budget}</strong>
      </div>
      <div>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Construction Status</span>
        <strong style="font-size: 1.05rem; color: var(--color-near-black);">${p.status} (${p.progress}%)</strong>
      </div>
      <div>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Client Classification</span>
        <strong style="font-size: 1.05rem; color: var(--color-near-black);">${p.client}</strong>
      </div>
    </div>

    <!-- Gallery Thumbnail Previews if available -->
    ${p.gallery && p.gallery.length ? `
      <div style="margin-bottom: 2rem;">
        <span class="eyebrow" style="margin-bottom: 0.75rem;">Atmospheric Elevations</span>
        <div style="display: grid; grid-template-columns: repeat(${p.gallery.length}, 1fr); gap: 1rem;">
          ${p.gallery.map(img => `
            <img src="${img}" alt="Elevation Detail" style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-xs);" />
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(20,20,22,0.1); padding-top: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <a href="contact.html" class="btn btn-primary">
        <span>Inquire About Similar Typology</span>
        <span class="btn-icon">→</span>
      </a>
      <a href="404.html" class="btn btn-secondary">
        <span>Inspect in Architecture Command</span>
        <span class="btn-icon">→</span>
      </a>
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeProject = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const closeBtn = document.getElementById('close-project-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProject);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeProject();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeProject();
    }
  });
}

/**
 * 6. Footer Newsletter Form
 */
function initFooterNewsletter() {
  const form = document.getElementById('footer-newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribed';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }
      form.reset();
    });
  }

  // STACKLY Monograph Research Newsletter Subscription (blog.html)
  const blogForm = document.getElementById('blog-subscribe-form');
  if (blogForm && !blogForm.dataset.listenerBound) {
    blogForm.dataset.listenerBound = 'true';
    const emailInput = document.getElementById('blog-subscribe-email');
    const errorWrapper = document.getElementById('sub-error-wrapper');
    const errorMsg = document.getElementById('sub-error');
    const successMsg = document.getElementById('sub-success');

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (errorWrapper) errorWrapper.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      });
    }

    blogForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailVal || !emailRegex.test(emailVal)) {
        if (errorWrapper) errorWrapper.style.display = 'block';
        if (errorMsg) errorMsg.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
        if (emailInput) {
          emailInput.style.borderColor = '#ef4444';
          emailInput.focus();
        }
        return;
      }

      if (errorWrapper) errorWrapper.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
      if (emailInput) emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';

      window.location.href = '404.html';
    });
  }
}

/**
 * 7. Hero Scroll Button
 */
function initHeroScrollBtn() {
  const btn = document.getElementById('scroll-to-projects');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('projects-showcase');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * 8. Continuous Hero Background Slider (2s interval)
 */
function initHeroBgSlider() {
  const slider = document.getElementById('hero-bg-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-bg-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 2000);
}

/**
 * 9. Mobile Dashboard Sidebar Off-Canvas Drawer Toggle
 */
function initMobileDashboardSidebar() {
  const hamburgerBtn = document.getElementById('dashboard-hamburger-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  let backdrop = document.querySelector('.dashboard-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dashboard-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  const closeSidebar = () => {
    sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openSidebar = () => {
    sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar.classList.contains('mobile-open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking any nav item on mobile
  const navBtns = document.querySelectorAll('.dashboard-nav-btn');
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });
}
