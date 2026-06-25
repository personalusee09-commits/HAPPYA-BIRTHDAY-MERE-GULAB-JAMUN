/* ============================================================
   SHOOTINGSTARS.JS — Idle shooting stars on the hero canvas
   Triggers after 4 seconds of no mouse movement on hero
============================================================ */

(function () {

  const stars = [];
  let idleTimer = null;
  let isActive = false;
  let animFrame = null;

  // Uses the existing hero particle canvas
  function getCanvas() {
    return document.getElementById('particleCanvas');
  }

  function createStar(canvas) {
    // Start from random top/left edge
    const fromLeft = Math.random() > 0.5;
    const x = fromLeft ? -20 : Math.random() * canvas.width * 0.6;
    const y = fromLeft ? Math.random() * canvas.height * 0.4 : -20;

    const angle = Math.PI / 5 + Math.random() * (Math.PI / 8);
    const speed = 8 + Math.random() * 8;

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 80 + Math.random() * 80,
      opacity: 0,
      fadeIn: true,
      trail: [],
    };
  }

  function launchStar() {
    const canvas = getCanvas();
    if (!canvas) return;
    stars.push(createStar(canvas));
  }

  function drawStars() {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    stars.forEach((star, i) => {
      // Fade in / out
      if (star.fadeIn) {
        star.opacity = Math.min(1, star.opacity + 0.06);
        if (star.opacity >= 1) star.fadeIn = false;
      } else {
        star.opacity = Math.max(0, star.opacity - 0.025);
      }

      // Move
      star.x += star.vx;
      star.y += star.vy;

      // Store trail
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 18) star.trail.shift();

      // Draw trail
      if (star.trail.length > 1) {
        const grad = ctx.createLinearGradient(
          star.trail[0].x, star.trail[0].y,
          star.x, star.y
        );
        grad.addColorStop(0, `rgba(200, 168, 130, 0)`);
        grad.addColorStop(1, `rgba(200, 168, 130, ${star.opacity * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        star.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw head
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 210, ${star.opacity})`;
      ctx.fill();
    });

    // Remove off-screen stars
    const canvas2 = getCanvas();
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      if (s.x > canvas2.width + 100 || s.y > canvas2.height + 100 || s.opacity <= 0) {
        stars.splice(i, 1);
      }
    }
  }

  // ── Idle detection ────────────────────────────────────────────
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    stopShootingStars();
    idleTimer = setTimeout(startShootingStars, 4000);
  }

  function startShootingStars() {
    if (isActive) return;
    isActive = true;

    // Launch a burst then periodic ones
    launchStar();
    setTimeout(launchStar, 400);
    setTimeout(launchStar, 900);

    // Ongoing stars every 1.8s while idle
    window._starInterval = setInterval(() => {
      if (isActive) launchStar();
    }, 1800);
  }

  function stopShootingStars() {
    isActive = false;
    clearInterval(window._starInterval);
  }

  // ── Animation loop — piggybacks on hero's rAF cycle ──────────
  // We hook into the existing canvas draw without replacing it
  function hookIntoHero() {
    const originalDraw = window._heroDrawParticles;

    // Override the hero loop to also draw our stars
    const loop = () => {
      drawStars();
      animFrame = requestAnimationFrame(loop);
    };
    loop();
  }

  function init() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Mouse/touch activity on hero resets idle
    hero.addEventListener('mousemove', resetIdleTimer);
    hero.addEventListener('touchstart', resetIdleTimer);

    // Start idle timer immediately
    idleTimer = setTimeout(startShootingStars, 4000);

    hookIntoHero();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
