/* ============================================================
   HEARTS.JS — Hidden heart pieces collection game
   6 small hearts scattered across sections. Click to collect.
   Tracker icon shows progress. All 6 → fullscreen reveal.
============================================================ */

(function () {

  const TOTAL_HEARTS = 6;
  let collected = 0;
  let hearts = [];

  // Sections to place a heart in, with rough position hints
  const PLACEMENTS = [
    { sectionId: 'hero',      top: '18%', left: '85%' },
    { sectionId: 'letter',    top: '12%', left: '8%'  },
    { sectionId: 'photos',    top: '85%', left: '90%' },
    { sectionId: 'memories',  top: '8%',  left: '92%' },
    { sectionId: 'distance',  top: '88%', left: '6%'  },
    { sectionId: 'playlist',  top: '10%', left: '6%'  },
  ];

  // ── Build tracker icon (fixed corner, like music toggle) ─────
  function buildTracker() {
    const tracker = document.createElement('div');
    tracker.id = 'heartTracker';
    tracker.className = 'heart-tracker';
    tracker.innerHTML = `
      <span class="heart-tracker-icon">💗</span>
      <span class="heart-tracker-count" id="heartTrackerCount">0/${TOTAL_HEARTS}</span>
    `;
    document.body.appendChild(tracker);
  }

  // ── Build hidden heart pieces ─────────────────────────────────
  function buildHearts() {
    PLACEMENTS.forEach((place, i) => {
      const section = document.getElementById(place.sectionId);
      if (!section) return;

      const heart = document.createElement('div');
      heart.className = 'heart-piece';
      heart.dataset.index = i;
      heart.style.top = place.top;
      heart.style.left = place.left;
      heart.innerHTML = '💗';

      // Ensure section can host an absolutely positioned child
      const computed = window.getComputedStyle(section);
      if (computed.position === 'static') {
        section.style.position = 'relative';
      }

      section.appendChild(heart);
      hearts.push(heart);

      heart.addEventListener('click', () => collectHeart(heart, i));
    });
  }

  // ── Collect a heart ────────────────────────────────────────────
  function collectHeart(heart, index) {
    if (heart.classList.contains('collected')) return;
    heart.classList.add('collected');
    collected++;

    // Fly animation toward tracker
    const tracker = document.getElementById('heartTracker');
    if (tracker) {
      const heartRect = heart.getBoundingClientRect();
      const trackerRect = tracker.getBoundingClientRect();

      const flyer = document.createElement('div');
      flyer.className = 'heart-flyer';
      flyer.innerHTML = '💗';
      flyer.style.left = heartRect.left + 'px';
      flyer.style.top = heartRect.top + 'px';
      document.body.appendChild(flyer);

      requestAnimationFrame(() => {
        flyer.style.left = trackerRect.left + trackerRect.width / 2 - 10 + 'px';
        flyer.style.top = trackerRect.top + trackerRect.height / 2 - 10 + 'px';
        flyer.style.transform = 'scale(0.3)';
        flyer.style.opacity = '0';
      });

      setTimeout(() => flyer.remove(), 900);

      // Pulse tracker
      tracker.classList.add('pulse');
      setTimeout(() => tracker.classList.remove('pulse'), 600);
    }

    // Update count
    const countEl = document.getElementById('heartTrackerCount');
    if (countEl) countEl.textContent = `${collected}/${TOTAL_HEARTS}`;

    // Fade out the heart piece
    setTimeout(() => {
      heart.style.opacity = '0';
      heart.style.transform = 'scale(0.4)';
      setTimeout(() => heart.remove(), 500);
    }, 100);

    if (window.AudioManager) window.AudioManager.duck(0.15, 300);
    setTimeout(() => { if (window.AudioManager) window.AudioManager.restore(800); }, 400);

    // All collected → reveal
    if (collected >= TOTAL_HEARTS) {
      setTimeout(showReveal, 800);
    }
  }

  // ── Fullscreen reveal ────────────────────────────────────────
  function showReveal() {
    const overlay = document.createElement('div');
    overlay.id = 'heartsRevealOverlay';
    overlay.className = 'hearts-reveal-overlay';

    overlay.innerHTML = `
      <div class="hearts-reveal-content">
        <svg class="hearts-shape-svg" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
          <path class="hearts-shape-path" d="M100 170
            C 100 170, 10 110, 10 55
            C 10 25, 32 8, 58 8
            C 78 8, 94 20, 100 38
            C 106 20, 122 8, 142 8
            C 168 8, 190 25, 190 55
            C 190 110, 100 170, 100 170 Z" />
        </svg>
        <p class="hearts-reveal-label">six pieces, one heart</p>
        <p class="hearts-reveal-message" id="heartsRevealMessage"></p>
        <p class="hearts-reveal-hint">tap anywhere to continue</p>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    if (window.AudioManager) window.AudioManager.duck(0.1, 800);

    // Reveal message word by word after shape draws
    setTimeout(() => {
      const msgEl = document.getElementById('heartsRevealMessage');
      if (!msgEl) return;
      const words = (CONFIG.HEARTS_MESSAGE || '').split(' ');
      msgEl.innerHTML = words
        .map(w => `<span class="hearts-word">${w}</span>`)
        .join(' ');

      const spans = msgEl.querySelectorAll('.hearts-word');
      spans.forEach((span, i) => {
        setTimeout(() => { span.style.opacity = '1'; }, i * 90);
      });

      const totalDelay = words.length * 90 + 600;
      setTimeout(() => {
        const hint = overlay.querySelector('.hearts-reveal-hint');
        if (hint) hint.style.opacity = '0.5';
      }, totalDelay);
    }, 1400);

    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      setTimeout(() => {
        overlay.remove();
        if (window.AudioManager) window.AudioManager.restore(1500);
      }, 1000);
    });

    // Mark tracker as complete
    const tracker = document.getElementById('heartTracker');
    if (tracker) tracker.classList.add('complete');
  }

  function init() {
    buildTracker();
    // Small delay so other sections have rendered/injected content
    setTimeout(buildHearts, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
