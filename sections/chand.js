/* ============================================================
   CHAND.JS — Type "chand" anywhere → romantic night sky
   Moon rises · Stars shimmer · Soft message · Video plays
   Picks a random video from VIDEOS list each time
============================================================ */

(function () {

  // ── CONFIG ───────────────────────────────────────────────────

  const TARGET = 'chand';

  // ✏️ Add as many videos as you want here.
  // Each time "chand" is typed, a different one plays at random.
  // Format: 'assets/video/filename.mp4'
  const VIDEOS = [
    'assets/video/chand1.mp4'
    // add more: 'assets/video/chand4.mp4',
  ];

  // ✏️ The romantic message shown under the moon, before video
  const MESSAGE_TOP  = 'dekh, ek hi chand dekhte hain hum dono';
  const MESSAGE_MAIN = 'chahe jitni bhi door ho...';

  // Moon vertical position (% from top of screen)
  // Adjust if moon overlaps message on your screen size
  const MOON_TOP_PERCENT = 12;

  // Message vertical position (% from top)
  const MESSAGE_TOP_PERCENT = 32;

  // Video vertical position (% from top)
  const VIDEO_TOP_PERCENT = 22;

  // ── State ────────────────────────────────────────────────────
  let typed     = '';
  let timeout   = null;
  let triggered = false;

  // ── Random video picker ──────────────────────────────────────
  function pickVideo() {
    return VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  }

  // ── Build overlay DOM ────────────────────────────────────────
  function buildOverlay(videoSrc) {
    const el = document.createElement('div');
    el.id = 'chandOverlay';

    el.innerHTML = `
      <div class="ch-sky"></div>
      <canvas id="chandStarCanvas"></canvas>

      <!-- Moon -->
      <div class="ch-moon" id="chandMoon" style="top:${MOON_TOP_PERCENT}%">
        <svg class="ch-moon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Full circle -->
          <circle cx="50" cy="50" r="46" fill="#FFF5D2"/>
          <!-- Shadow mask — creates crescent -->
          <circle cx="66" cy="44" r="38" fill="#000" opacity="0.88"/>
          <!-- Soft inner glow -->
          <circle cx="38" cy="50" r="30" fill="rgba(255,252,230,0.12)"/>
          <!-- Subtle crater details -->
          <circle cx="32" cy="38" r="4.5" fill="rgba(200,185,140,0.18)"/>
          <circle cx="24" cy="56" r="3"   fill="rgba(200,185,140,0.14)"/>
          <circle cx="42" cy="64" r="5.5" fill="rgba(200,185,140,0.12)"/>
          <circle cx="18" cy="40" r="2.5" fill="rgba(200,185,140,0.1)"/>
        </svg>
      </div>

      <!-- Message -->
      <div class="ch-message" id="chandMessage" style="top:${MESSAGE_TOP_PERCENT}%">
        <p class="ch-message-urdu">${MESSAGE_TOP}</p>
        <p class="ch-message-main">${MESSAGE_MAIN}</p>
      </div>

      <!-- Video -->
      <div class="ch-video-wrap" id="chandVideoWrap" style="top:${VIDEO_TOP_PERCENT}%">
        <video
          id="chandVideo"
          src="${videoSrc}"
          playsinline
          preload="metadata"
        ></video>
        <div class="ch-video-glow"></div>
        <div class="ch-play-btn" id="chandPlayBtn">
          <div class="ch-play-icon">▶</div>
        </div>
      </div>

      <!-- Exit -->
      <button class="ch-exit" id="chandExit" aria-label="Close">✕ close</button>
    `;

    document.body.appendChild(el);
    return el;
  }

  // ── Star field ───────────────────────────────────────────────
  function initStars(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const STAR_COUNT = 130;
    const stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height * 0.75, // top 75% of screen
        r:       0.4 + Math.random() * 1.4,
        opacity: 0,                                    // start invisible
        target:  0.3 + Math.random() * 0.7,           // final opacity
        delay:   Math.random() * 3000,                 // stagger appearance
        twinkle: Math.random() * Math.PI * 2,          // twinkle phase
        speed:   0.4 + Math.random() * 0.8,
      });
    }

    const startTime = performance.now();
    let running = true;

    function draw(now) {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        const elapsed = now - startTime;
        if (elapsed < s.delay) return; // not yet appeared

        // Fade in
        const fadeProgress = Math.min((elapsed - s.delay) / 1200, 1);
        s.opacity = fadeProgress * s.target;

        // Twinkle
        s.twinkle += 0.012 * s.speed;
        const twinkleMod = 0.75 + 0.25 * Math.sin(s.twinkle);
        const finalOpacity = s.opacity * twinkleMod;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 220, ${finalOpacity})`;
        ctx.fill();

        // Tiny glow for brighter stars
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 245, 200, ${finalOpacity * 0.15})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    // Return stop function
    return () => { running = false; };
  }

  // ── Main sequence ────────────────────────────────────────────
  function startChand() {
    if (document.getElementById('chandOverlay')) return;

    const videoSrc = pickVideo();
    const overlay  = buildOverlay(videoSrc);

    const moon      = document.getElementById('chandMoon');
    const message   = document.getElementById('chandMessage');
    const videoWrap = document.getElementById('chandVideoWrap');
    const video     = document.getElementById('chandVideo');
    const playBtn   = document.getElementById('chandPlayBtn');
    const exitBtn   = document.getElementById('chandExit');
    const canvas    = document.getElementById('chandStarCanvas');

    let stopStars = null;

    // Duck music
    if (window.AudioManager) window.AudioManager.duck(0.08, 1000);

    // ── PHASE 1: Overlay fades in (black) ──
    requestAnimationFrame(() => {
      overlay.classList.add('ch-visible');
    });

    // ── PHASE 2: Sky gradient appears ──
    setTimeout(() => {
      overlay.classList.add('ch-sky-in');
    }, 600);

    // ── PHASE 3: Stars begin appearing ──
    setTimeout(() => {
      stopStars = initStars(canvas);
    }, 1000);

    // ── PHASE 4: Moon rises ──
    setTimeout(() => {
      moon.classList.add('ch-moon-in');
    }, 1400);

    // ── PHASE 5: Message fades in ──
    setTimeout(() => {
      message.classList.add('ch-message-in');
    }, 3000);

    // ── PHASE 6: Message fades out, video appears ──
    setTimeout(() => {
      message.style.transition = 'opacity 1s ease';
      message.style.opacity = '0';
    }, 5800);

    setTimeout(() => {
      moon.style.transition = 'opacity 1s ease, transform 1s ease';
      moon.style.opacity = '0.18'; // moon dims but stays — ambient glow
    }, 6200);

    setTimeout(() => {
      videoWrap.classList.add('ch-video-in');
      exitBtn.classList.add('ch-exit-in');

      video.play().then(() => {
        playBtn.style.display = 'none';
      }).catch(() => {
        playBtn.classList.add('ch-play-visible');
      });
    }, 6800);

    // ── Play button (mobile fallback) ──
    playBtn.addEventListener('click', () => {
      video.play();
      playBtn.classList.remove('ch-play-visible');
      setTimeout(() => { playBtn.style.display = 'none'; }, 400);
    });

    // ── Video ends → close ──
    video.addEventListener('ended', () => {
      closeOverlay(overlay, stopStars);
    });

    // ── Exit button ──
    exitBtn.addEventListener('click', () => {
      video.pause();
      closeOverlay(overlay, stopStars);
    });
  }

  // ── Close sequence ───────────────────────────────────────────
  function closeOverlay(overlay, stopStars) {
    overlay.classList.add('ch-fade-out');

    setTimeout(() => {
      if (stopStars) stopStars();
      overlay.remove();
      if (window.AudioManager) window.AudioManager.restore(1800);
    }, 1500);
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
      startChand();
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
