/* ============================================================
   TERMS.JS — CAPTCHA gate + Legal Document reveal
============================================================ */

(function () {

  // ─── CONFIG ──────────────────────────────────────────────────
  // 0-8 grid. '4' is the center tile. 
  // Make sure your photo is at: assets/photos/photo1.jpg
  const CORRECT_TILE = 4; 
  const PLACEHOLDERS = ['🌴', '🍵', '🌙', '✈️', '💌', '🌸', '🎵', '⭐'];

  function init() {
    const section = document.getElementById('terms');
    if (!section) return;
    buildCaptcha(section);
  }

  function buildCaptcha(section) {
    const gate = section.querySelector('#terms-captcha-gate');
    const grid = gate.querySelector('.captcha-image-grid');
    const verifyBtn = gate.querySelector('.captcha-verify-btn');
    const errorEl = gate.querySelector('.captcha-error');
    const captchaBox = gate.querySelector('.captcha-box');
    const successBox = gate.querySelector('.captcha-success');

    let selectedTileIndex = null;
    let placeholderIdx = 0;

    grid.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      const tile = document.createElement('div');
      tile.classList.add('captcha-tile');
      tile.dataset.index = i;

      if (i === CORRECT_TILE) {
        // This tile shows your photo
        const img = document.createElement('img');
        img.src = 'assets/photos/captcha.jpeg'; // Ensure this file exists!
        tile.appendChild(img);
      } else {
        // These tiles show emojis
        tile.classList.add('placeholder');
        tile.textContent = PLACEHOLDERS[placeholderIdx % PLACEHOLDERS.length];
        placeholderIdx++;
      }

      tile.addEventListener('click', () => {
        grid.querySelectorAll('.captcha-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        selectedTileIndex = i;
        if (errorEl) errorEl.textContent = '';
      });

      grid.appendChild(tile);
    }

    verifyBtn.addEventListener('click', () => {
      if (selectedTileIndex === null) {
        if (errorEl) errorEl.textContent = 'Please select an image.';
        return;
      }

      if (selectedTileIndex !== CORRECT_TILE) {
        if (errorEl) errorEl.textContent = 'Incorrect. Try again.';
        grid.querySelectorAll('.captcha-tile').forEach(t => t.classList.remove('selected'));
        selectedTileIndex = null;
        return;
      }

      // Success
      captchaBox.style.display = 'none';
      successBox.classList.add('show');
      setTimeout(() => revealDocument(section), 1400);
    });
  }

  function revealDocument(section) {
    const gate = section.querySelector('#terms-captcha-gate');
    const doc = section.querySelector('#terms-document');
    const stamp = section.querySelector('.legal-stamp');

    if (gate) gate.style.display = 'none';
    if (doc) {
      doc.style.display = 'block';
      setTimeout(() => {
        doc.classList.add('visible', 'revealed');
        if (stamp) stamp.classList.add('show');
      }, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();