/* ============================================================
   DISTANCE.JS — Animated path Kerala → Haryana → Heart
   This is also home to the SECRET HEART (riddle answer)
============================================================ */

(function () {

  function injectContent() {
    const kmEl = document.getElementById('distanceKm');
    const factEl = document.getElementById('distanceFact');
    const startLabel = document.getElementById('cityStartLabel');
    const endLabel = document.getElementById('cityEndLabel');
    const riddle = document.getElementById('riddleText');

    if (kmEl) kmEl.textContent = CONFIG.DISTANCE_KM;
    if (factEl) factEl.textContent = CONFIG.DISTANCE_FACT;
    if (startLabel) startLabel.textContent = CONFIG.HER_CITY;
    if (endLabel) endLabel.textContent = CONFIG.YOUR_CITY;
    if (riddle) riddle.textContent = CONFIG.RIDDLE;
  }

  function initScrollAnimation() {
    gsap.to('.distance-header', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#distance',
        start: 'top 70%',
      }
    });

    // Draw the dotted path as she scrolls
    const path = document.querySelector('.distance-path');
    if (path) {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.map-container',
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: true,
        },
        onComplete: () => {
          const heart = document.querySelector('.distance-heart');
          if (heart) heart.classList.add('found');
        }
      });
    }

    // City dots fade in
    gsap.from('.city-dot, .city-label', {
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.map-container',
        start: 'top 75%',
      }
    });

    // Fact line
    gsap.to('.distance-fact', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3,
      scrollTrigger: {
        trigger: '.map-container',
        start: 'top 50%',
      }
    });

    // Riddle appears subtly, after everything else
    gsap.to('.riddle-text', {
      opacity: 1,
      duration: 1.5,
      delay: 0.5,
      scrollTrigger: {
        trigger: '.riddle-text',
        start: 'top 90%',
      }
    });
  }

  // ── SECRET HEART — click to reveal hidden message ────────────
  function initSecretHeart() {
    const heart = document.querySelector('.distance-heart');
    const overlay = document.getElementById('secretOverlay');
    const messageEl = document.getElementById('secretMessage');

    if (!heart || !overlay || !messageEl) return;

    // Set message text from config
    messageEl.textContent = CONFIG.SECRET_MESSAGE;

    let isOpen = false;

    heart.addEventListener('click', () => {
      if (isOpen) return;
      isOpen = true;
      openSecret();
    });

    function openSecret() {
      // Darken screen
      gsap.to(overlay, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Fade in message word by word
          revealMessageWords();
        }
      });

      // Duck background music slightly for the moment
      if (window.AudioManager) window.AudioManager.duck(0.12, 1000);
    }

    function revealMessageWords() {
      const words = CONFIG.SECRET_MESSAGE.split(' ');
      messageEl.innerHTML = words
        .map(w => `<span class="secret-word">${w}</span>`)
        .join(' ');

      gsap.to('.secret-word', {
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power1.out',
      });

      // Show "scroll to continue" hint after message appears
      const totalDelay = words.length * 0.08 * 1000 + 800;
      setTimeout(() => {
        const hint = document.getElementById('secretHint');
        if (hint) gsap.to(hint, { opacity: 0.5, duration: 1 });
      }, totalDelay);
    }

    // Closing — scroll/click anywhere fades it out
    overlay.addEventListener('click', closeSecret);
    overlay.addEventListener('wheel', closeSecret, { once: true });
    overlay.addEventListener('touchmove', closeSecret, { once: true });

    function closeSecret() {
      gsap.to(overlay, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.visibility = 'hidden';
          if (window.AudioManager) window.AudioManager.restore(1500);
        }
      });
    }
  }

  function init() {
    injectContent();
    setTimeout(() => {
      initScrollAnimation();
      initSecretHeart();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
