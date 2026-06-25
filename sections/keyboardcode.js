/* ============================================================
   KEYBOARDCODE.JS — Type her name anywhere → magic happens
   Listens globally, matches CONFIG.HER_NAME (letters only)
   Triggers: heart burst + golden ripple + special message
============================================================ */

(function () {

  let typed = '';
  let target = '';
  let timeout = null;
  let triggered = false;

  function buildTarget() {
    // Strip emojis and non-alpha, lowercase
    target = "fizu";
  }

  // ── Heart burst animation ────────────────────────────────────
  function heartBurst(x, y) {
    const hearts = ['💗', '💖', '💕', '✨', '🌸', '💫'];
    const count = 14;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${16 + Math.random() * 18}px;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: none;
        user-select: none;
      `;
      document.body.appendChild(el);

      const angle = (Math.PI * 2 * i) / count;
      const distance = 80 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const dur = 800 + Math.random() * 400;

      requestAnimationFrame(() => {
        el.style.transition = `transform ${dur}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${dur}ms ease`;
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.3)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), dur + 100);
    }
  }

  // ── Ripple from center ───────────────────────────────────────
  function goldenRipple() {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      width: 10px;
      height: 10px;
      border: 2px solid rgba(200, 168, 130, 0.8);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(1);
      pointer-events: none;
      z-index: 99998;
      transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.4s ease;
    `;
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(120)';
      ripple.style.opacity = '0';
    });

    setTimeout(() => ripple.remove(), 1500);
  }

  // ── Secret message overlay — word by word ────────────────────
  function showToast() {
    const overlay = document.createElement('div');
    overlay.id = 'keySecretOverlay';
    
    /* FIXED CSS HERE: 
      Changed justify-content to flex-start so tall text starts at the top.
      Added padding so it doesn't hug the edges of the screen.
    */
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start; 
      padding: 10vh 24px; 
      cursor: pointer;
      transition: background 0.8s ease;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    `;

    const label = document.createElement('p');
    label.textContent = 'you found it';
    label.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #C8A882;
      margin-bottom: 24px;
      opacity: 0;
      transition: opacity 0.8s ease 0.4s;
      flex-shrink: 0;
    `;

    const messageEl = document.createElement('p');
    messageEl.style.cssText = `
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(1.1rem, 3.5vw, 1.8rem);
      font-weight: 300;
      font-style: italic;
      color: #FFFFFF;
      line-height: 1.6;
      text-align: center;
      max-width: 800px;
      letter-spacing: 0.01em;
    `;

    const hint = document.createElement('p');
    hint.textContent = 'tap anywhere to continue';
    hint.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 400;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(153,153,153,0.5);
      margin-top: 32px;
      margin-bottom: 50px; /* Added extra space at the very bottom so it doesn't cut off */
      opacity: 0;
      transition: opacity 1s ease;
      flex-shrink: 0;
    `;

    overlay.appendChild(label);
    overlay.appendChild(messageEl);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    // Fade in dark background
    requestAnimationFrame(() => {
      overlay.style.background = 'rgba(10, 10, 10, 0.96)';
    });

    // Fade in label
    setTimeout(() => { label.style.opacity = '0.7'; }, 400);

    // Keyboard custom message with Dua
    setTimeout(() => {
      const duaText = `Bismillah hir-Rahman nir-Raheem. Ya Allah, Al-Wadud (The Most Loving) and Ar-Rahman (The Most Merciful), I turn to You today with a heart full of gratitude for the beautiful gift of Fiza's existence. Ya Rabb, on this day You brought her into this world, I ask You to wrap her heart in Your infinite Sakinah (peace). Protect her beautiful smile from ever fading, and guard her eyes from any tears of sorrow. Whenever she feels overwhelmed or alone, let her feel Your divine comfort, and remind her of how deeply cherished she is. Ya Allah, shower her life with unending Barakah (blessings). Make her path in this Dunya easy, fill her days with light, and elevate her ranks in the Akhirah. Ya Allah, Al-Jami’ (The Gatherer), You are the One who brings hearts together. I ask You to bridge the miles between us and bless us with a beautiful, righteous reunion. Make the waiting easy on our hearts and reward our patience with the joy of finally being in each other’s presence. Just as You connected our souls from far away, please remove the hurdles of this distance. Grant us the day where we wake up under the exact same sky, no longer having to say goodbye through a screen. Fulfill the silent duas her heart makes that no one else hears. Make me a constant source of peace, joy, and strength for her, and let our bond always be blessed, pure, and grounded in love for Your sake. Ameen, Ya Rabbal Alameen.`;
      
      const words = duaText.split(' ');
      messageEl.innerHTML = words
        .map(w => `<span style="display:inline-block; opacity:0; transition: opacity 0.45s ease;">${w}</span>`)
        .join(' ');

      const spans = messageEl.querySelectorAll('span');
      spans.forEach((span, i) => {
        // Slightly faster reveal because the dua is beautifully long
        setTimeout(() => { span.style.opacity = '1'; }, i * 65);
      });

      // Show hint after all words appear
      const totalDelay = words.length * 65 + 800;
      setTimeout(() => { hint.style.opacity = '1'; }, totalDelay);
    }, 700);

    // Close on click
    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 1s ease';
      setTimeout(() => {
        overlay.remove();
        if (window.AudioManager) window.AudioManager.restore(1500);
      }, 1000);
    });
  }

  // ── Keyboard listener ────────────────────────────────────────
  function onKeyDown(e) {
    // Ignore if typing in an input/textarea
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) {
      // Non-letter resets
      typed = '';
      return;
    }

    typed += key;

    // Keep only last N chars to avoid memory buildup
    if (typed.length > target.length + 2) {
      typed = typed.slice(-target.length);
    }

    // Reset idle timer
    clearTimeout(timeout);
    timeout = setTimeout(() => { typed = ''; }, 2500);

    // Check match
    if (typed.endsWith(target) && !triggered) {
      triggered = true;
      fire();

      // Allow re-trigger after 6 seconds
      setTimeout(() => { triggered = false; }, 6000);
    }
  }

  function fire() {
    // Burst from center of screen
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    goldenRipple();

    // Staggered heart bursts
    heartBurst(cx, cy);
    setTimeout(() => heartBurst(cx - 120, cy + 60), 150);
    setTimeout(() => heartBurst(cx + 120, cy + 60), 280);

    setTimeout(showToast, 300);

    // Also duck and restore music for drama
    if (window.AudioManager) {
      window.AudioManager.duck(0.05, 600);
      setTimeout(() => window.AudioManager.restore(1500), 3500);
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    buildTarget();
    if (!target) return; // safety — no target, no listener

    document.addEventListener('keydown', onKeyDown);

    // Small hint — barely visible, appears on hero after 8 seconds
    setTimeout(() => {
      const hint = document.createElement('p');
      hint.id = 'keyHint';
      hint.textContent = 'psst... try typing something';
      hint.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        font-family: 'Inter', sans-serif;
        font-size: 0.55rem;
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(153, 153, 153, 0.4);
        pointer-events: none;
        z-index: 9997;
        opacity: 0;
        transition: opacity 2s ease;
      `;
      document.body.appendChild(hint);
      setTimeout(() => { hint.style.opacity = '1'; }, 100);
      // Fade out after 5s
      setTimeout(() => { hint.style.opacity = '0'; }, 5000);
      setTimeout(() => hint.remove(), 7500);
    }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();