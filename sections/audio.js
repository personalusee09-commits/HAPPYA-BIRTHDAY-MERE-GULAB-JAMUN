/* ============================================================
   AUDIO.JS — Background music manager
   Uses Howler.js for smooth fade-in and control
============================================================ */

(function () {

  let bgMusic = null;
  let isMuted = false;
  let isLoaded = false;

  // ── Init background music ─────────────────────────────────────
  function initMusic() {
    const toggleBtn = document.getElementById('musicToggle');

    // ✏️ EDIT: Background music file path is set in config.js
    // Drop your mp3 in assets/audio/ and update BG_MUSIC_FILE in config.js

    bgMusic = new Howl({
      src: [CONFIG.BG_MUSIC_FILE],
      loop: true,
      volume: 0,        // Start at 0, fade in
      autoplay: false,
      onload: function () {
        isLoaded = true;
      },
      onloaderror: function () {
        // Music file not found — hide the toggle button gracefully
        if (toggleBtn) toggleBtn.style.opacity = '0.2';
        console.info('Background music file not found. Add your mp3 to assets/audio/');
      }
    });

    // Try to autoplay (browsers may block — handled below)
    tryAutoplay();

    // Toggle button
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleMusic);
    }

    // Unlock audio on first interaction (mobile/browser policy)
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
  }

  // ── Try autoplay ─────────────────────────────────────────────
  function tryAutoplay() {
    if (!bgMusic) return;

    bgMusic.play();

    // Fade in gently over 3 seconds
    setTimeout(() => {
      if (bgMusic.playing()) {
        bgMusic.fade(0, 0.35, 3000);
      }
    }, 500);
  }

  // ── Unlock on interaction (browser policy) ───────────────────
  function unlockAudio() {
    if (!bgMusic || bgMusic.playing() || isMuted) return;

    bgMusic.play();
    bgMusic.fade(0, 0.35, 3000);
  }

  // ── Toggle music on/off ───────────────────────────────────────
  function toggleMusic() {
    const toggleBtn = document.getElementById('musicToggle');

    if (isMuted) {
      // Unmute
      isMuted = false;
      if (!bgMusic.playing()) bgMusic.play();
      bgMusic.fade(bgMusic.volume(), 0.35, 800);
      if (toggleBtn) toggleBtn.classList.remove('muted');
    } else {
      // Mute
      isMuted = true;
      bgMusic.fade(bgMusic.volume(), 0, 800);
      setTimeout(() => {
        if (isMuted) bgMusic.pause();
      }, 800);
      if (toggleBtn) toggleBtn.classList.add('muted');
    }
  }

  // ── Expose globally so radio.js can manage audio too ─────────
  window.AudioManager = {
    duck: function (volume = 0.05, duration = 1000) {
      // Reduce bg music when voice note plays
      if (bgMusic && bgMusic.playing()) {
        bgMusic.fade(bgMusic.volume(), volume, duration);
      }
    },
    restore: function (duration = 1500) {
      if (bgMusic && !isMuted) {
        bgMusic.fade(bgMusic.volume(), 0.35, duration);
      }
    }
  };

  // ── Init ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
  } else {
    initMusic();
  }

})();
