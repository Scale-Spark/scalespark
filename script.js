/**
 * AXIOM — Premium Design Studio
 * script.js — Animations, Interactions & Logic
 */

/* ============================================
   1. SMOOTH SCROLL (Lenis-style)
   ============================================ */
class SmoothScroll {
  constructor() {
    this.ease = 0.1;
    this.current = 0;
    this.target = 0;
    this.raf = null;
    this.init();
  }
  init() {
    document.body.style.overflow = 'auto';
    window.addEventListener('scroll', () => { this.target = window.scrollY; }, { passive: true });
    this.tick();
  }
  tick() {
    this.current += (this.target - this.current) * this.ease;
    this.raf = requestAnimationFrame(() => this.tick());
  }
}
// Initialize smooth scroll on desktop
if (window.innerWidth > 900) new SmoothScroll();


/* ============================================
   2. CUSTOM CURSOR
   ============================================ */
(function initCursor() {
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  if (!ring || !dot) return;

  let mx = 0, my = 0;      // mouse position
  let rx = 0, ry = 0;      // ring position (lagged)

  function onMouseMove(e) {
    mx = e.clientX;
    my = e.clientY;
    // Dot snaps instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }

  function animRing() {
    // Ring follows with easing
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }

  window.addEventListener('mousemove', onMouseMove);
  animRing();

  // Click effect
  window.addEventListener('mousedown', () => { ring.classList.add('clicked'); dot.style.transform = 'translate(-50%,-50%) scale(0.7)'; });
  window.addEventListener('mouseup',   () => { ring.classList.remove('clicked'); dot.style.transform = 'translate(-50%,-50%) scale(1)'; });

  // Hover effects on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .service-item, .work-card, .testimonial-card, .feature-card');
  const btnEls   = document.querySelectorAll('.btn-primary, .btn-nav, .magnetic');

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
  btnEls.forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('on-btn'); ring.classList.remove('hovered'); });
    el.addEventListener('mouseleave', () => ring.classList.remove('on-btn'));
  });
})();


/* ============================================
   3. PARTICLE BACKGROUND
   ============================================ */
(function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      const palette = ['123,110,246', '62,207,207', '245,200,66'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function initParts() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(123,110,246,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  resize();
  initParts();
  loop();
  window.addEventListener('resize', () => { resize(); initParts(); });
})();


/* ============================================
   4. NAVBAR SCROLL BEHAVIOR
   ============================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
})();


/* ============================================
   5. MOBILE MENU
   ============================================ */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ============================================
   6. SCROLL REVEAL ANIMATIONS
   ============================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================
   7. COUNTER ANIMATION (stats)
   ============================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => observer.observe(el));
})();


/* ============================================
   8. MAGNETIC BUTTON EFFECT
   ============================================ */
(function initMagnetic() {
  const magneticEls = document.querySelectorAll('.magnetic');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const dist   = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) * 0.7;
      const factor = Math.max(0, 1 - dist / maxDist);
      const tx     = dx * factor * 0.35;
      const ty     = dy * factor * 0.35;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();


/* ============================================
   9. TESTIMONIALS SLIDER
   ============================================ */
(function initSlider() {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsEl  = document.getElementById('sliderDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const cardW = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${current * cardW}px)`;
    updateDots();
  }

  function autoPlay() { autoTimer = setInterval(() => goTo(current + 1), 5000); }

  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); autoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); autoPlay(); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { clearInterval(autoTimer); goTo(current + (dx < 0 ? 1 : -1)); autoPlay(); }
  });

  window.addEventListener('resize', () => goTo(current));
  autoPlay();
})();


/* ============================================
   10. CONTACT FORM
   ============================================ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const span = btn.querySelector('span');
    const originalText = span.textContent;

    // Loading state
    btn.disabled = true;
    span.textContent = 'Sending…';
    btn.style.opacity = '0.7';

    // Simulate async send
    setTimeout(() => {
      span.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22dd73, #1ab557)';
      btn.style.opacity = '1';

      setTimeout(() => {
        span.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1800);
  });

  // Live label float effect
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
})();


/* ============================================
   11. PARALLAX ORB ON MOUSE MOVE (hero)
   ============================================ */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-bg-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      const tx = dx * factor;
      const ty = dy * factor;
      orb.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
})();


/* ============================================
   12. ACTIVE NAV LINK HIGHLIGHT (scroll spy)
   ============================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================
   13. HERO TEXT STAGGER (entrance)
   ============================================ */
(function initHeroEntrance() {
  const lines = document.querySelectorAll('.hero .reveal-up');
  lines.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || (i * 0.1));
    setTimeout(() => { el.classList.add('visible'); }, 200 + delay * 1000);
  });
})();


/* ============================================
   14. CARD TILT EFFECT (feature cards)
   ============================================ */
(function initTilt() {
  const cards = document.querySelectorAll('.feature-card, .work-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================
   15. GRADIENT ORB ANIMATION (background)
   ============================================ */
(function animateGradient() {
  let t = 0;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  function tick() {
    t += 0.005;
    if (orb1) {
      const x = Math.sin(t) * 20;
      const y = Math.cos(t * 0.7) * 20;
      orb1.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (orb2) {
      const x = Math.cos(t * 0.8) * 15;
      const y = Math.sin(t * 1.2) * 15;
      orb2.style.transform = `translate(${x}px, ${y}px)`;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ============================================
   16. NAV ACTIVE STYLE
   ============================================ */
(function addNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: var(--white); }
    .nav-link.active::after { width: 100%; }
  `;
  document.head.appendChild(style);
})();
