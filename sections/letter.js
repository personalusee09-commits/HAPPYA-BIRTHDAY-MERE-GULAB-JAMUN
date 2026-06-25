/* ============================================================
   LETTER.JS — Editorial letter with cursor trail + scroll reveals
============================================================ */

(function () {

  // ── Inject letter content from config ────────────────────────
  function buildLetter() {
    const body = document.getElementById('letterBody');
    if (!body) return;

    // Clear existing
    body.innerHTML = '';

    // Build paragraphs
    CONFIG.LETTER.forEach((para, i) => {
      const p = document.createElement('p');
      p.textContent = para;
      p.classList.add('reveal');
      body.appendChild(p);
    });

    // Signature
    const sign = document.createElement('p');
    sign.textContent = `— ${CONFIG.YOUR_NAME}`;
    sign.classList.add('letter-sign', 'reveal');
    body.appendChild(sign);
  }

  // ── Cursor trail on letter section ───────────────────────────
  function initCursorTrail() {
    const canvas = document.getElementById('trailCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = document.getElementById('letter');
    let trail = [];
    let isOver = false;

    function resize() {
      const rect = section.getBoundingClientRect();
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      trail.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        opacity: 0.6,
        size: 3
      });
      if (trail.length > 40) trail.shift();
      isOver = true;
    });

    section.addEventListener('mouseleave', () => {
      isOver = false;
    });

    function drawTrail() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((point, i) => {
        point.opacity -= 0.015;
        point.size *= 0.98;

        if (point.opacity <= 0) return;

        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0.5, point.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 168, 130, ${point.opacity})`;
        ctx.fill();
      });

      // Clean up faded points
      trail = trail.filter(p => p.opacity > 0);

      requestAnimationFrame(drawTrail);
    }

    drawTrail();
  }

  // ── GSAP Scroll animations ────────────────────────────────────
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Label reveal
    gsap.to('.letter-label', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#letter',
        start: 'top 75%',
      }
    });

    // Each paragraph staggered
    gsap.utils.toArray('#letterBody .reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: i * 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        }
      });
    });
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    buildLetter();
    initCursorTrail();

    // Wait a tick for DOM to settle
    setTimeout(initScrollAnimations, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
