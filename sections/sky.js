/* ============================================================
   SKY.JS — Same Sky section
   Real moon phase (calculated) + starfield + message
============================================================ */

(function () {

  // ── Moon phase calculation ───────────────────────────────────
  // Returns phase 0–1 (0 = new moon, 0.5 = full moon, 1 = next new moon)
  function getMoonPhase(date) {
    const synodicMonth = 29.53058867; // days
    // Known new moon reference: Jan 6, 2000, 18:14 UTC
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const diffDays = (date.getTime() - knownNewMoon.getTime()) / 86400000;
    let phase = (diffDays % synodicMonth) / synodicMonth;
    if (phase < 0) phase += 1;
    return phase;
  }

  function phaseToName(phase) {
    if (phase < 0.03 || phase > 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }

  // ── Draw the moon shadow based on phase ──────────────────────
  // phase: 0 = new (fully dark), 0.5 = full (fully lit)
  function drawMoon(phase) {
    const shadow = document.getElementById('moonShadow');
    if (!shadow) return;

    // Illuminated fraction (0 = new, 1 = full)
    const illum = (1 - Math.cos(phase * Math.PI * 2)) / 2;

    // Terminator position: shift shadow rect left/right based on phase
    // waxing (0 -> 0.5): shadow recedes from left edge to off-screen right
    // waning (0.5 -> 1): shadow grows back from right edge
    const waxing = phase <= 0.5;
    const offset = 200 * (1 - illum); // 0 = fully lit, 200 = fully dark

    shadow.setAttribute('fill', '#0A0A0A');

    if (illum >= 0.98) {
      // Full moon — hide shadow
      shadow.setAttribute('x', '-300');
    } else if (illum <= 0.02) {
      // New moon — cover everything
      shadow.setAttribute('x', '0');
      shadow.setAttribute('width', '200');
    } else if (waxing) {
      // Shadow on the left, shrinking
      shadow.setAttribute('width', '200');
      shadow.setAttribute('x', String(-offset));
    } else {
      // Shadow on the right, growing
      shadow.setAttribute('width', '200');
      shadow.setAttribute('x', String(200 - offset));
    }
  }

  function injectContent() {
    const phase = getMoonPhase(new Date());
    drawMoon(phase);

    const nameEl = document.getElementById('moonPhaseName');
    if (nameEl) nameEl.textContent = phaseToName(phase);

    const msgEl = document.getElementById('skyMessage');
    if (msgEl) msgEl.textContent = CONFIG.SKY_MESSAGE;
  }

  // ── Starfield canvas ──────────────────────────────────────────
  let canvas, ctx, stars = [];
  let animFrame;

  function resizeCanvas() {
    if (!canvas) return;
    const section = document.getElementById('sky');
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const o = s.baseOpacity + Math.sin(s.twinklePhase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, o)})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(drawStars);
  }

  function initStarfield() {
    canvas = document.getElementById('skyCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    drawStars();
    window.addEventListener('resize', resizeCanvas);
  }

  // ── Scroll reveal ──────────────────────────────────────────────
  function initScrollReveal() {
    gsap.to('.sky-content .section-label, .sky-content .section-title', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#sky', start: 'top 70%' }
    });

    gsap.to('.moon-wrap', {
      opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#sky', start: 'top 60%' }
    });

    gsap.to('.moon-phase-name', {
      opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#sky', start: 'top 55%' }
    });

    gsap.to('.sky-message', {
      opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out',
      scrollTrigger: { trigger: '#sky', start: 'top 50%' }
    });
  }

  function init() {
    injectContent();
    initStarfield();
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
