/* ============================================================
   PLAYLIST.JS — Vinyl tracklist, scroll reveal
============================================================ */

(function () {

  function buildPlaylist() {
    const container = document.getElementById('playlistTracks');
    if (!container) return;
    container.innerHTML = '';
    CONFIG.PLAYLIST.forEach((track, i) => {
      const row = document.createElement('div');
      row.className = 'track-row reveal';
      const num = String(i + 1).padStart(2, '0');
      row.dataset.audio = `assets/audio/track${i + 1}.mp3`;
      row.innerHTML = `
        <div class="track-num">${num}</div>
        <div class="track-vinyl"></div>
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <div class="track-note">♪</div>
        <div class="track-pulse">
          <div class="pulse-bar"></div>
          <div class="pulse-bar"></div>
          <div class="pulse-bar"></div>
          <div class="pulse-bar"></div>
        </div>
      `;
      container.appendChild(row);
    });
  }

  // ── Audio state ──────────────────────────────────────────────
  // We track EVERY audio instance we create so nothing leaks
  const allAudio   = new Set();
  let   activeRow  = null;   // the row currently highlighted
  let   hoverTimer = null;

  // Kill absolutely everything — no exceptions
  function killAll() {
    clearTimeout(hoverTimer);
    allAudio.forEach(a => {
      try { a.pause(); a.src = ''; } catch (e) {}
    });
    allAudio.clear();

    document.querySelectorAll('.track-row.playing')
      .forEach(r => r.classList.remove('playing'));

    activeRow = null;
    if (window.AudioManager) window.AudioManager.restore(400);
  }

  function startClip(row) {
    // Kill everything before starting — guarantees no overlap
    killAll();

    activeRow = row;
    row.classList.add('playing');
    if (window.AudioManager) window.AudioManager.duck(0.08, 400);

    const audio  = new Audio();
    audio.volume = 0;
    audio.src    = row.dataset.audio;
    allAudio.add(audio);

    let started = false;

    audio.addEventListener('canplaythrough', () => {
      if (!allAudio.has(audio)) return; // was killed before loading
      if (started) return;
      started = true;
      audio.play().catch(() => killAll());
      // Fade in
      let v = 0;
      const fi = setInterval(() => {
        v = Math.min(0.8, v + 0.08);
        audio.volume = v;
        if (v >= 0.8) clearInterval(fi);
      }, 30);
    }, { once: true });

    audio.addEventListener('error',  () => killAll(), { once: true });
    audio.addEventListener('ended',  () => killAll(), { once: true });
    audio.load();
  }

  function initTrackAudio() {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const rows    = document.querySelectorAll('.track-row');

    rows.forEach(row => {
      if (isTouch) {
        row.addEventListener('click', () => {
          activeRow === row ? killAll() : startClip(row);
        });
      } else {
        row.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => startClip(row), 250);
        });

        row.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimer);   // cancel pending start
          killAll();                  // always kill on leave — no stale state possible
        });
      }
    });

    // Kill when scrolled away
    const section = document.getElementById('playlist');
    if (section) {
      new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) killAll();
      }, { threshold: 0 }).observe(section);
    }
  }

  function initScrollReveal() {
    gsap.to('.playlist-header', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#playlist', start: 'top 75%' }
    });
    gsap.utils.toArray('.track-row').forEach((row, i) => {
      gsap.to(row, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: i * 0.06,
        scrollTrigger: { trigger: row, start: 'top 88%' }
      });
    });
  }

  function init() {
    buildPlaylist();
    setTimeout(() => {
      initScrollReveal();
      initTrackAudio();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();