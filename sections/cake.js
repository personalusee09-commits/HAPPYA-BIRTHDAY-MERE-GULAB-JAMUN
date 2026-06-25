/* ============================================================
   CAKE.JS — Blow candles → cut cake → fireworks explosion
============================================================ */

(function () {

  let candlesBlown = false;
  let cakeCut = false;

  function injectContent() {
    const revealText = document.getElementById('cakeRevealText');
    if (revealText) revealText.textContent = CONFIG.HER_NAME;
  }

  // ── Blow candles ──────────────────────────────────────────────
  function initBlowButton() {
    const blowBtn = document.getElementById('blowBtn');
    const cutBtn = document.getElementById('cutBtn');
    const flames = document.querySelectorAll('.flame');
    const smokes = document.querySelectorAll('.smoke');

    if (!blowBtn) return;

    blowBtn.addEventListener('click', () => {
      if (candlesBlown) return;
      candlesBlown = true;

      flames.forEach((flame, i) => {
        setTimeout(() => {
          flame.classList.add('blown');
          const smoke = smokes[i];
          if (smoke) {
            smoke.classList.add('active');
          }
        }, i * 180);
      });

      // Disable blow, enable cut
      blowBtn.disabled = true;
      blowBtn.textContent = 'Blown out';

      setTimeout(() => {
        if (cutBtn) cutBtn.disabled = false;
      }, flames.length * 180 + 400);
    });
  }

  // ── Cut cake ──────────────────────────────────────────────────
  function initCutButton() {
    const cutBtn = document.getElementById('cutBtn');
    const stage = document.querySelector('.cake-stage');

    if (!cutBtn) return;

    cutBtn.addEventListener('click', () => {
      if (cakeCut || !candlesBlown) return;
      cakeCut = true;

      stage.classList.add('cut');
      cutBtn.disabled = true;
      cutBtn.textContent = 'Cut';

      // Trigger fireworks after the cut animation
      setTimeout(() => {
        triggerFireworks();
      }, 1400);
    });
  }

  // ── Fireworks ─────────────────────────────────────────────────
  function triggerFireworks() {
    const overlay = document.getElementById('fireworksOverlay');
    const canvas = document.getElementById('fireworksCanvas');
    const textEl = document.getElementById('fireworksText');

    if (!overlay || !canvas) return;

    textEl.textContent = CONFIG.FINAL_WISH || `Happy Birthday, ${CONFIG.HER_NAME}`;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Show overlay (black screen)
    gsap.to(overlay, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        startFireworksAnimation(ctx, canvas);

        // Show text after a beat
        setTimeout(() => {
          gsap.to(textEl, { opacity: 1, duration: 1.2, ease: 'power2.out' });
        }, 1200);
      }
    });

    // Duck music for the moment, then bring it back up for the finale
    if (window.AudioManager) window.AudioManager.duck(0.15, 800);

    // Allow closing by click — moves to next section
    overlay.addEventListener('click', closeFireworks, { once: true });
  }

  function closeFireworks() {
    const overlay = document.getElementById('fireworksOverlay');
    const textEl = document.getElementById('fireworksText');

    gsap.to(overlay, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        overlay.style.visibility = 'hidden';
        textEl.style.opacity = 0;
        if (window.AudioManager) window.AudioManager.restore(1500);

        // Scroll to next section (wish)
        const wishSection = document.getElementById('wish');
        if (wishSection) {
          wishSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // ── Particle-based fireworks ─────────────────────────────────
  function startFireworksAnimation(ctx, canvas) {
    const particles = [];
    const colors = ['#C8A882', '#FFD9A0', '#FF8FA3', '#A8D8FF', '#C8FFD4', '#FFFFFF'];
    let animFrame;
    let running = true;

    function createExplosion(x, y) {
      const particleCount = 60;
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2 + 1,
        });
      }
    }

    function animate() {
      if (!running) return;

      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= 0.012;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrame = requestAnimationFrame(animate);
    }

    // Initial burst sequence
    const launchPoints = [
      { x: 0.5, y: 0.35 },
      { x: 0.3, y: 0.45 },
      { x: 0.7, y: 0.45 },
      { x: 0.5, y: 0.25 },
      { x: 0.25, y: 0.3 },
      { x: 0.75, y: 0.3 },
    ];

    launchPoints.forEach((pt, i) => {
      setTimeout(() => {
        createExplosion(pt.x * canvas.width, pt.y * canvas.height);
      }, i * 350);
    });

    // Continue periodic fireworks while overlay is open
    const periodicInterval = setInterval(() => {
      if (!running) {
        clearInterval(periodicInterval);
        return;
      }
      createExplosion(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      );
    }, 900);

    animate();

    // Cleanup when overlay closes
    const overlay = document.getElementById('fireworksOverlay');
    const observer = new MutationObserver(() => {
      if (overlay.style.visibility === 'hidden') {
        running = false;
        clearInterval(periodicInterval);
        cancelAnimationFrame(animFrame);
        observer.disconnect();
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
  }

  function initScrollReveal() {
    gsap.to('.cake-header', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#cake', start: 'top 70%' }
    });

    gsap.to('.cake-stage', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#cake', start: 'top 60%' }
    });

    gsap.to('.cake-actions', {
      opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.cake-actions', start: 'top 90%' }
    });
  }

  function init() {
    injectContent();
    initBlowButton();
    initCutButton();
    setTimeout(initScrollReveal, 100);

    window.addEventListener('resize', () => {
      const canvas = document.getElementById('fireworksCanvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
