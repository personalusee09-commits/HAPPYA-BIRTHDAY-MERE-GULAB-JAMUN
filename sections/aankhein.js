/* ============================================================
   AANKHEIN.JS — Type "aankhein" anywhere → soft dreamy mode
   Warm bokeh bloom · Gentle light · Whisper · Video plays
   Picks a random video each time
============================================================ */

(function () {

  // ── CONFIG ───────────────────────────────────────────────────

  const TARGET = 'eyes';

  // ✏️ Add your videos here — random one plays each time
  const VIDEOS = [
    'assets/video/aankhein1.mp4',
    // add more: 'assets/video/aankhein3.mp4',
  ];

  // ✏️ The message shown before the video
  const MESSAGE_LABEL = 'teri aankhein';
  const MESSAGE_MAIN  = 'inn aankhon mein kho jaana chahta hoon main';
  const MESSAGE_SUB   = 'har baar, baar baar...';

  // ── State ────────────────────────────────────────────────────
  let typed     = '';
  let timeout   = null;
  let triggered = false;

  // ── Random video ─────────────────────────────────────────────
  function pickVideo() {
    return VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  }

  // ── Build overlay ────────────────────────────────────────────
  function buildOverlay(videoSrc) {
    const el = document.createElement('div');
    el.id = 'aankheinOverlay';

    el.innerHTML = `
      <div class="aa-bloom"></div>
      <canvas id="aankheinCanvas"></canvas>

      <!-- Message -->
      <div class="aa-message" id="aankheinMessage">
        <p class="aa-message-small">${MESSAGE_LABEL}</p>
        <p class="aa-message-main">${MESSAGE_MAIN}</p>
        <p class="aa-message-sub">${MESSAGE_SUB}</p>
      </div>

      <!-- Video -->
      <div class="aa-video-wrap" id="aankheinVideoWrap">
        <video
          id="aankheinVideo"
          src="${videoSrc}"
          playsinline
          preload="metadata"
        ></video>
        <div class="aa-video-vignette"></div>
        <div class="aa-play-btn" id="aankheinPlayBtn">
          <div class="aa-play-icon">▶</div>
        </div>
      </div>

      <!-- Exit -->
      <button class="aa-exit" id="aankheinExit" aria-label="Close">✕ close</button>
    `;

    document.body.appendChild(el);
    return el;
  }

  // ── Bokeh particle system ─────────────────────────────────────
  // Soft glowing circles that drift upward slowly — like light
  // through half-closed eyes, or dust in warm afternoon sun
  function initBokeh(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COUNT = 55;
    const bokeh = [];

    // Warm gold / amber palette
    const COLORS = [
      'rgba(200, 168, 130, §)',   // warm gold
      'rgba(220, 180, 120, §)',   // amber
      'rgba(255, 220, 160, §)',   // soft yellow
      'rgba(180, 140, 100, §)',   // muted bronze
      'rgba(240, 200, 140, §)',   // champagne
    ];

    for (let i = 0; i < COUNT; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      bokeh.push({
        x:       Math.random() * canvas.width,
        y:       canvas.height * 0.3 + Math.random() * canvas.height * 0.8,
        r:       6 + Math.random() * 28,          // larger = more bokeh feel
        opacity: 0,
        maxOp:   0.04 + Math.random() * 0.1,
        speed:   0.12 + Math.random() * 0.28,     // very slow drift
        drift:   (Math.random() - 0.5) * 0.18,   // gentle horizontal sway
        delay:   Math.random() * 3500,
        color:   color,
        phase:   Math.random() * Math.PI * 2,     // pulse phase
        pulseSpeed: 0.006 + Math.random() * 0.01,
      });
    }

    const startTime = performance.now();
    let running = true;

    function draw(now) {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bokeh.forEach(b => {
        const elapsed = now - startTime;
        if (elapsed < b.delay) return;

        // Fade in
        const fadeIn = Math.min((elapsed - b.delay) / 2000, 1);
        b.opacity = fadeIn * b.maxOp;

        // Drift upward
        b.y     -= b.speed;
        b.x     += b.drift;
        b.phase += b.pulseSpeed;

        // Pulse opacity gently
        const pulse   = 0.85 + 0.15 * Math.sin(b.phase);
        const finalOp = b.opacity * pulse;

        // Respawn when off screen top
        if (b.y < -b.r * 2) {
          b.y      = canvas.height + b.r;
          b.x      = Math.random() * canvas.width;
          b.opacity = 0;
          b.delay   = 0; // no delay on respawn
        }

        // Draw soft glowing circle
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const colorFill  = b.color.replace('§', String(finalOp));
        const colorEdge  = b.color.replace('§', '0');
        grad.addColorStop(0.0, colorFill);
        grad.addColorStop(0.5, b.color.replace('§', String(finalOp * 0.5)));
        grad.addColorStop(1.0, colorEdge);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
    return () => { running = false; };
  }

  // ── Main sequence ────────────────────────────────────────────
  function startAankhein() {
    if (document.getElementById('aankheinOverlay')) return;

    const videoSrc = pickVideo();
    const overlay  = buildOverlay(videoSrc);

    const message   = document.getElementById('aankheinMessage');
    const videoWrap = document.getElementById('aankheinVideoWrap');
    const video     = document.getElementById('aankheinVideo');
    const playBtn   = document.getElementById('aankheinPlayBtn');
    const exitBtn   = document.getElementById('aankheinExit');
    const canvas    = document.getElementById('aankheinCanvas');

    let stopBokeh = null;

    // Duck music softly
    if (window.AudioManager) window.AudioManager.duck(0.1, 1400);

    // ── PHASE 1: Overlay fades in — very slowly, like closing eyes ──
    requestAnimationFrame(() => {
      overlay.classList.add('aa-visible');
    });

    // ── PHASE 2: Warm bloom spreads from center ──
    setTimeout(() => {
      overlay.classList.add('aa-bloom-in');
    }, 800);

    // ── PHASE 3: Bokeh particles begin drifting ──
    setTimeout(() => {
      stopBokeh = initBokeh(canvas);
    }, 1200);

    // ── PHASE 4: Message whispers in ──
    setTimeout(() => {
      message.classList.add('aa-message-in');
    }, 2400);

    // ── PHASE 5: Message fades away, video blooms in ──
    setTimeout(() => {
      message.style.transition = 'opacity 1.4s ease';
      message.style.opacity    = '0';
    }, 5600);

    setTimeout(() => {
      videoWrap.classList.add('aa-video-in');
      exitBtn.classList.add('aa-exit-in');

      video.play().then(() => {
        playBtn.style.display = 'none';
      }).catch(() => {
        playBtn.classList.add('aa-play-visible');
      });
    }, 7000);

    // Mobile tap to play
    playBtn.addEventListener('click', () => {
      video.play();
      playBtn.classList.remove('aa-play-visible');
      setTimeout(() => { playBtn.style.display = 'none'; }, 400);
    });

    // Video ends → close
    video.addEventListener('ended', () => closeOverlay(overlay, stopBokeh));

    // Exit button
    exitBtn.addEventListener('click', () => {
      video.pause();
      closeOverlay(overlay, stopBokeh);
    });
  }

  // ── Close ────────────────────────────────────────────────────
  function closeOverlay(overlay, stopBokeh) {
    overlay.classList.add('aa-fade-out');
    setTimeout(() => {
      if (stopBokeh) stopBokeh();
      overlay.remove();
      if (window.AudioManager) window.AudioManager.restore(2000);
    }, 1900);
  }

  // ── Keyboard listener ────────────────────────────────────────
  function onKeyDown(e) {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) { typed = ''; return; }

    typed += key;
    if (typed.length > TARGET.length + 2) typed = typed.slice(-TARGET.length);

    clearTimeout(timeout);
    timeout = setTimeout(() => { typed = ''; }, 2500);

    if (typed.endsWith(TARGET) && !triggered) {
      triggered = true;
      startAankhein();
      setTimeout(() => { triggered = false; }, 10000);
    }
  }

  function init() {
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();