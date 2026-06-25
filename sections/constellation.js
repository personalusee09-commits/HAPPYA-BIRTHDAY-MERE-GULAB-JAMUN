/* ============================================================
   CONSTELLATION.JS — Interactive constellation
   She clicks stars in any order; once all are clicked,
   lines draw connecting them into a moon + heart shape.
============================================================ */

(function () {

  const POINTS = [
    // Crescent moon outline (outer arc, 4 points)
    { x: 0.16, y: 0.22 },
    { x: 0.08, y: 0.42 },
    { x: 0.14, y: 0.62 },
    { x: 0.28, y: 0.70 },
    // transition point bridging moon to heart
    { x: 0.42, y: 0.40 },
    // Heart shape (right side, 6 points forming two lobes + bottom point)
    { x: 0.55, y: 0.30 },
    { x: 0.68, y: 0.20 },
    { x: 0.82, y: 0.30 },
    { x: 0.78, y: 0.50 },
    { x: 0.62, y: 0.78 },
  ];

  // ── Hit target radius (px) — big enough to tap comfortably ──
  const HIT_RADIUS   = 32;   // was 14 — now generous on mobile
  const STAR_RADIUS  = 5;    // visual dot size (was 4)
  const GLOW_RADIUS  = 28;   // proximity highlight radius

  let canvas, ctx;
  let stars = [];
  let connections = [];
  let animFrame;
  let completed = false;
  let mouseX = -999, mouseY = -999; // track cursor/finger for proximity glow

  function resizeCanvas() {
    const section = document.getElementById('constellation');
    if (!canvas || !section) return;
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    buildStars();
  }

  // ── Build stars ──────────────────────────────────────────────
  function buildStars() {
    stars = POINTS.map((p, i) => ({
      x: p.x * canvas.width,
      y: p.y * canvas.height,
      r: STAR_RADIUS,
      clicked: connections.includes(i),
      twinklePhase: Math.random() * Math.PI * 2,
      // each star pulses to a unique beat so they feel alive
      pulseSpeed: 0.025 + Math.random() * 0.02,
    }));

    bgStars = [];
    const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        baseOpacity: Math.random() * 0.4 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  let bgStars = [];

  // ── Drawing ──────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background stars
    bgStars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const o = s.baseOpacity + Math.sin(s.twinklePhase) * 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, o)})`;
      ctx.fill();
    });

    // Connection lines
    if (connections.length > 1) {
      ctx.beginPath();
      ctx.moveTo(stars[connections[0]].x, stars[connections[0]].y);
      for (let i = 1; i < connections.length; i++) {
        ctx.lineTo(stars[connections[i]].x, stars[connections[i]].y);
      }
      if (completed) {
        ctx.lineTo(stars[connections[0]].x, stars[connections[0]].y);
      }
      ctx.strokeStyle = 'rgba(200, 168, 130, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(200, 168, 130, 0.6)';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Soft fill on completion
    if (completed) {
      ctx.beginPath();
      ctx.moveTo(stars[connections[0]].x, stars[connections[0]].y);
      for (let i = 1; i < connections.length; i++) {
        ctx.lineTo(stars[connections[i]].x, stars[connections[i]].y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(200, 168, 130, 0.07)';
      ctx.fill();
    }

    // Interactive stars
    stars.forEach((s, i) => {
      s.twinklePhase += s.pulseSpeed;

      const nearMouse = Math.hypot(mouseX - s.x, mouseY - s.y) < GLOW_RADIUS;
      const pulse = s.clicked ? 1 : 0.75 + Math.sin(s.twinklePhase) * 0.25;

      // ── Large invisible hit-area ring (visual guide only) ────
      if (!s.clicked) {
        const ringAlpha = nearMouse ? 0.35 : 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, HIT_RADIUS * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 168, 130, ${ringAlpha})`;
        ctx.lineWidth = nearMouse ? 1.5 : 1;
        ctx.stroke();

        // Proximity fill — glows warm when cursor/finger is close
        if (nearMouse) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, HIT_RADIUS * 0.7);
          grad.addColorStop(0, 'rgba(200,168,130,0.18)');
          grad.addColorStop(1, 'rgba(200,168,130,0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, HIT_RADIUS * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // ── Star dot ────────────────────────────────────────────
      const drawR = s.r * pulse * (nearMouse && !s.clicked ? 1.5 : 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle  = s.clicked ? '#C8A882' : (nearMouse ? 'rgba(255,230,180,1)' : 'rgba(255,245,220,0.85)');
      ctx.shadowColor = s.clicked ? 'rgba(200,168,130,0.9)' : (nearMouse ? 'rgba(255,200,120,0.9)' : 'rgba(255,245,220,0.6)');
      ctx.shadowBlur  = s.clicked ? 14 : (nearMouse ? 18 : 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Number label on unclicked stars so she can find them
      if (!s.clicked) {
        ctx.font = `600 9px Inter, sans-serif`;
        ctx.fillStyle = nearMouse ? 'rgba(255,230,180,0.9)' : 'rgba(255,245,220,0.35)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i + 1, s.x, s.y - 18);
      }
    });

    // ── "Next star" arrow hint — points to closest unclicked ──
    if (!completed && connections.length > 0 && connections.length < stars.length) {
      const lastIdx = connections[connections.length - 1];
      const last    = stars[lastIdx];
      let   closest = null, closestDist = Infinity;
      stars.forEach((s, i) => {
        if (!s.clicked) {
          const d = Math.hypot(s.x - last.x, s.y - last.y);
          if (d < closestDist) { closestDist = d; closest = s; }
        }
      });
      if (closest) {
        const angle = Math.atan2(closest.y - last.y, closest.x - last.x);
        const arrowX = last.x + Math.cos(angle) * 22;
        const arrowY = last.y + Math.sin(angle) * 22;
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -4);
        ctx.lineTo(-7, 4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,168,130,0.5)';
        ctx.fill();
        ctx.restore();
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  // ── Pointer tracking (mouse + touch) ────────────────────────
  function updatePointer(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    // Scale from CSS pixels to canvas pixels
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseX = (src.clientX - rect.left) * scaleX;
    mouseY = (src.clientY - rect.top)  * scaleY;
  }

  // ── Click / tap handling ─────────────────────────────────────
  function handleClick(e) {
    if (completed) return;
    updatePointer(e);

    // Find closest unclicked star within HIT_RADIUS
    let bestIdx = -1, bestDist = HIT_RADIUS;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (s.clicked) continue;
      const dist = Math.hypot(mouseX - s.x, mouseY - s.y);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }

    if (bestIdx === -1) return; // no star close enough

    stars[bestIdx].clicked = true;
    connections.push(bestIdx);
    updateHint();

    // Small pop animation via canvas scale trick
    stars[bestIdx].r = STAR_RADIUS * 2;
    setTimeout(() => { if (stars[bestIdx]) stars[bestIdx].r = STAR_RADIUS; }, 250);

    if (connections.length === stars.length) {
      completed = true;
      setTimeout(onCompleted, 600);
    }
  }

  function updateHint() {
    const hint = document.getElementById('constellationHint');
    if (hint) {
      const left = stars.length - connections.length;
      hint.textContent = left === 0
        ? 'All stars connected ✦'
        : `${connections.length} / ${stars.length} stars connected · ${left} to go`;
    }
  }

  // ── Completion ───────────────────────────────────────────────
  function onCompleted() {
    const hint  = document.getElementById('constellationHint');
    const msgEl = document.getElementById('constellationMessage');

    if (hint) hint.style.opacity = '0';

    if (msgEl) {
      const words = (CONFIG.CONSTELLATION_MESSAGE || '').split(' ');
      msgEl.innerHTML = words
        .map(w => `<span class="constellation-word">${w}</span>`)
        .join(' ');

      gsap.to(msgEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

      const spans = msgEl.querySelectorAll('.constellation-word');
      setTimeout(() => {
        spans.forEach((span, i) => {
          setTimeout(() => { span.style.opacity = '1'; }, i * 90);
        });
      }, 400);
    }

    if (window.AudioManager) {
      window.AudioManager.duck(0.1, 800);
      setTimeout(() => window.AudioManager.restore(2000), 2500);
    }
  }

  // ── Scroll reveal ────────────────────────────────────────────
  function initScrollReveal() {
    gsap.to('.constellation-content .section-label, .constellation-content .section-title', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#constellation', start: 'top 70%' }
    });
    gsap.to('#constellationCanvas', {
      opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#constellation', start: 'top 65%' }
    });
    gsap.to('.constellation-hint', {
      opacity: 0.6, duration: 1, delay: 0.4,
      scrollTrigger: { trigger: '#constellation', start: 'top 55%' }
    });
  }

  function init() {
    canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    draw();

    // Pointer tracking
    canvas.addEventListener('mousemove', updatePointer);
    canvas.addEventListener('touchmove', (e) => { updatePointer(e); }, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouseX = -999; mouseY = -999; });

    // Click / tap
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleClick(e);
    }, { passive: false });

    window.addEventListener('resize', () => {
      const prev = [...connections];
      resizeCanvas();
      prev.forEach(i => { stars[i].clicked = true; });
      connections = prev;
    });

    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();