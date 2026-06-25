/* ============================================================
   THEATRE.JS — Type "cinema" anywhere → theatre mode begins
   Popcorn moment → lights dim → screen goes black →
   "feature presentation" → your video plays → lights back up
============================================================ */

(function () {

  let typed = '';
  const target = 'cinema';
  let timeout = null;
  let triggered = false;

  // ── CONFIG ───────────────────────────────────────────────────
  // ✏️ Drop your video file in assets/video/ and update this path
  const VIDEO_SRC = 'assets/video/mymessage.mp4';

  // ✏️ Text shown before video starts (after the black screen)
  const OPENING_LINE = 'a message, just for you';

  // ✏️ Popcorn message on entry
  const POPCORN_TEXT = 'grab your popcorn 🍿';

  // ── Build theatre overlay ────────────────────────────────────
  function buildTheatre() {
    const el = document.createElement('div');
    el.id = 'theatreOverlay';
    el.innerHTML = `

      <!-- Step 1: Popcorn toast -->
      <div class="th-popcorn" id="thPopcorn">
        <span class="th-popcorn-emoji">🍿</span>
        <p class="th-popcorn-text">${POPCORN_TEXT}</p>
      </div>

      <!-- Step 2: Curtains -->
      <div class="th-curtain th-curtain-left"  id="thCurtainL"></div>
      <div class="th-curtain th-curtain-right" id="thCurtainR"></div>

      <!-- Step 3: Black screen content -->
      <div class="th-screen" id="thScreen">

        <!-- Classic cert card -->
        <div class="th-cert" id="thCert">
          <p class="th-cert-label">a film by</p>
          <p class="th-cert-name">Ayaz</p><!-- ✏️ your name -->
        </div>

        <!-- Feature presentation text -->
        <div class="th-feature" id="thFeature">
          <p class="th-feature-sub">now presenting</p>
          <p class="th-feature-title">${OPENING_LINE}</p>
        </div>

        <!-- The video -->
        <div class="th-video-wrap" id="thVideoWrap">
          <video
            id="thVideo"
            src="${VIDEO_SRC}"
            playsinline
            preload="metadata"
          ></video>
          <!-- Tap to play overlay (mobile safe) -->
          <div class="th-play-btn" id="thPlayBtn">
            <div class="th-play-icon">▶</div>
          </div>
        </div>

        <!-- Exit button — appears after video starts -->
        <button class="th-exit" id="thExit" aria-label="Exit theatre">✕ exit</button>
      </div>

    `;
    document.body.appendChild(el);
    return el;
  }

  // ── Theatre sequence ─────────────────────────────────────────
  function startTheatre() {
    if (document.getElementById('theatreOverlay')) return;

    // Duck music immediately
    if (window.AudioManager) window.AudioManager.duck(0, 1000);

    const overlay = buildTheatre();

    // Refs
    const popcorn   = document.getElementById('thPopcorn');
    const curtainL  = document.getElementById('thCurtainL');
    const curtainR  = document.getElementById('thCurtainR');
    const screen    = document.getElementById('thScreen');
    const cert      = document.getElementById('thCert');
    const feature   = document.getElementById('thFeature');
    const videoWrap = document.getElementById('thVideoWrap');
    const video     = document.getElementById('thVideo');
    const playBtn   = document.getElementById('thPlayBtn');
    const exitBtn   = document.getElementById('thExit');

    // ── PHASE 1: Overlay fades in (transparent) ──
    requestAnimationFrame(() => {
      overlay.classList.add('th-visible');
    });

    // ── PHASE 2: Popcorn toast appears ──
    setTimeout(() => {
      popcorn.classList.add('th-popcorn-in');
    }, 300);

    // ── PHASE 3: Lights start dimming (page darkens) ──
    setTimeout(() => {
      overlay.classList.add('th-dimming');
    }, 1800);

    // ── PHASE 4: Curtains close ──
    setTimeout(() => {
      curtainL.classList.add('th-curtain-close');
      curtainR.classList.add('th-curtain-close');
      popcorn.classList.remove('th-popcorn-in');
    }, 2800);

    // ── PHASE 5: Full black, show "a film by" cert ──
    setTimeout(() => {
      overlay.classList.add('th-black');
      screen.classList.add('th-screen-visible');
      cert.classList.add('th-cert-in');
    }, 3800);

    // ── PHASE 6: Cert out, feature presentation in ──
    setTimeout(() => {
      cert.classList.remove('th-cert-in');
      cert.classList.add('th-cert-out');
    }, 5800);

    setTimeout(() => {
      feature.classList.add('th-feature-in');
    }, 6400);

    // ── PHASE 7: Feature out, video appears ──
    setTimeout(() => {
      feature.classList.remove('th-feature-in');
      feature.classList.add('th-feature-out');
    }, 8400);

    setTimeout(() => {
      videoWrap.classList.add('th-video-in');
      exitBtn.classList.add('th-exit-in');

      // Autoplay attempt (works on most browsers after interaction)
      video.play().then(() => {
        playBtn.style.display = 'none';
      }).catch(() => {
        // Autoplay blocked — show tap-to-play
        playBtn.classList.add('th-play-visible');
      });
    }, 9200);

    // ── Play button (mobile fallback) ──
    playBtn.addEventListener('click', () => {
      video.play();
      playBtn.classList.remove('th-play-visible');
      setTimeout(() => { playBtn.style.display = 'none'; }, 400);
    });

    // ── PHASE 8: Video ends → lights come back up ──
    video.addEventListener('ended', () => {
      lightsUp(overlay);
    });

    // ── Exit button ──
    exitBtn.addEventListener('click', () => {
      video.pause();
      lightsUp(overlay);
    });
  }

  // ── Lights up sequence ───────────────────────────────────────
  function lightsUp(overlay) {
    overlay.classList.add('th-lights-up');

    setTimeout(() => {
      overlay.remove();
      if (window.AudioManager) window.AudioManager.restore(2000);
    }, 1200);
  }

  // ── Keyboard listener ────────────────────────────────────────
  function onKeyDown(e) {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) { typed = ''; return; }

    typed += key;
    if (typed.length > target.length + 2) typed = typed.slice(-target.length);

    clearTimeout(timeout);
    timeout = setTimeout(() => { typed = ''; }, 2500);

    if (typed.endsWith(target) && !triggered) {
      triggered = true;
      startTheatre();
      setTimeout(() => { triggered = false; }, 12000);
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
