/* ============================================================
   REELS.JS — Vertical swiper for local videos
============================================================ */

(function () {
  let swiper = null;
  let isMuted = true; // Start muted so browsers allow autoplay

  // ── Build slides from config ─────────────────────────────────
  function buildReels() {
    const wrapper = document.getElementById('reelsWrapper');
    if (!wrapper || !CONFIG.REELS) return;

    wrapper.innerHTML = '';

    CONFIG.REELS.forEach((reel) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide reel-slide';

      slide.innerHTML = `
        <video class="reel-video" src="${reel.video}" loop muted playsinline preload="metadata"></video>
        <div class="reel-overlay">
          <p class="reel-caption">${reel.caption}</p>
        </div>
      `;
      wrapper.appendChild(slide);
    });
  }

  // ── Initialize Swiper & Video Logic ──────────────────────────
  function initSwiper() {
    swiper = new Swiper('.reelsSwiper', {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      mousewheel: true,
      grabCursor: true,
      speed: 500,
      on: {
        init: function () {
          setTimeout(handleSlideChange, 100);
        },
        slideChange: handleSlideChange
      }
    });

    const muteBtn = document.getElementById('reelsMuteBtn');
    if (muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }

    // Pause completely when section scrolls out of view
    const section = document.getElementById('reels');
    if (section && window.IntersectionObserver) {
      new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
          pauseAllVideos();
        } else {
          handleSlideChange(); // Play active video when scrolled back into view
        }
      }, { threshold: 0.3 }).observe(section);
    }
  }

  // ── Play Active / Pause Others ───────────────────────────────
  function handleSlideChange() {
    if (!swiper) return;
    const slides = document.querySelectorAll('.reel-slide video');
    
    slides.forEach((vid, index) => {
      if (index === swiper.activeIndex) {
        vid.muted = isMuted;
        vid.play().catch(() => {}); // Catch autoplay rejections
      } else {
        vid.pause();
        vid.currentTime = 0; // Reset off-screen videos to start
      }
    });
  }

  function pauseAllVideos() {
    document.querySelectorAll('.reel-slide video').forEach(vid => vid.pause());
  }

  // ── Audio Management ─────────────────────────────────────────
  function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('reelsMuteBtn');
    if (btn) btn.textContent = isMuted ? '🔇' : '🔊';

    const activeVid = document.querySelectorAll('.reel-slide video')[swiper.activeIndex];
    if (activeVid) {
      activeVid.muted = isMuted;
    }

    // Manage main background music based on reel audio
    if (window.AudioManager) {
      if (!isMuted) {
        window.AudioManager.duck(0.05, 500); // Duck main music
      } else {
        window.AudioManager.restore(1000);   // Restore main music
      }
    }
  }

  // ── Scroll Reveal ────────────────────────────────────────────
  function initScrollReveal() {
    gsap.to('.reels-header', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#reels', start: 'top 75%' }
    });
    
    gsap.to('.reels-container', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: '#reels', start: 'top 65%' }
    });
    
    gsap.to('.swipe-hint', {
      opacity: 1, duration: 0.8, delay: 0.6,
      scrollTrigger: { trigger: '#reels', start: 'top 60%' }
    });
  }

  // ── Boot ─────────────────────────────────────────────────────
  function init() {
    buildReels();
    setTimeout(() => {
      initSwiper();
      initScrollReveal();
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();