/* ============================================================
   HERO.JS — Cinematic hero with floating particles
============================================================ */

(function () {

  // ── Particle System ──────────────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.003
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Update
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += p.opacityDir;

      // Bounce opacity
      if (p.opacity > 0.5 || p.opacity < 0.05) p.opacityDir *= -1;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw — warm gold dots
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 168, 130, ${p.opacity})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  // ── Hero Text Animations ──────────────────────────────────────
  function initHeroAnimations() {
    // Inject content from config
    const nameEl = document.getElementById('heroName');
    const eyebrowEl = document.getElementById('heroEyebrow');
    const subEl = document.getElementById('heroSub');

    if (nameEl) nameEl.textContent = CONFIG.HER_NAME;
    if (eyebrowEl) eyebrowEl.textContent = CONFIG.BIRTHDAY_DATE;
    if (subEl) subEl.textContent = CONFIG.HERO_SUBTITLE;

    // GSAP timeline — staggered entrance
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('#heroEyebrow', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .to('#heroName', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.5')
    .to('#heroSub', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .to('.hero-scroll-hint', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.3');
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    resizeCanvas();
    initParticles();
    drawParticles();
    initHeroAnimations();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
