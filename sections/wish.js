/* ============================================================
   WISH.JS — Final section: confetti falls, closing message
============================================================ */

(function () {

  function injectContent() {
    const nameEl = document.getElementById('wishName');
    const messageEl = document.getElementById('wishMessage');
    const signEl = document.getElementById('wishSign');
    const futureEl = document.getElementById('wishFuture');

    if (nameEl) nameEl.textContent = CONFIG.HER_NAME;
    if (messageEl) messageEl.textContent = CONFIG.FINAL_WISH;
    if (signEl) signEl.textContent = `— ${CONFIG.YOUR_NAME}`;

    if (futureEl && CONFIG.FUTURE) {
      futureEl.innerHTML = '';
      CONFIG.FUTURE.forEach(item => {
        const p = document.createElement('p');
        p.className = 'wish-future-item';
        p.textContent = item;
        futureEl.appendChild(p);
      });
    }
  }

  // ── Confetti ──────────────────────────────────────────────────
  let confettiStarted = false;

  function startConfetti() {
    if (confettiStarted) return;
    confettiStarted = true;

    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#C8A882', '#FFD9A0', '#FF8FA3', '#A8D8FF', '#C8FFD4', '#FFFFFF'];
    const confetti = [];

    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach(c => {
        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height) {
          c.y = -20;
          c.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;

        if (c.shape === 'rect') {
          ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  function initScrollReveal() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#wish',
        start: 'top 60%',
        once: true,
        onEnter: startConfetti
      }
    });

    tl.to('.wish-eyebrow', { opacity: 1, duration: 0.8, ease: 'power3.out' })
      .to('.wish-name', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.3')
      .to('.wish-message', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .to('.wish-sign', { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to('.wish-future', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.2')
      .to('.wish-end', { opacity: 0.5, duration: 1, ease: 'power2.out' }, '-=0.2');
  }

  function init() {
    injectContent();

    // Set initial scale for name (used in GSAP animation)
    gsap.set('.wish-name', { scale: 0.92 });

    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
