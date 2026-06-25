/* ============================================================
   PHOTOS.JS — Swipeable polaroid cards with tilt effect
============================================================ */

(function () {

  // ── Build photo cards from config ────────────────────────────
  function buildPhotoCards() {
    const wrapper = document.getElementById('photoCards');
    if (!wrapper) return;

    // Clear placeholder slides and rebuild from config
    wrapper.innerHTML = '';

    CONFIG.PHOTO_CAPTIONS.forEach((caption, i) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      slide.innerHTML = `
        <div class="photo-card">
          <div class="photo-frame">
            <img src="assets/photos/photo${i + 1}.jpg" alt="memory ${i + 1}" class="us-photo" />
          </div>
          <p class="photo-caption">${caption}</p>
        </div>
      `;

      wrapper.appendChild(slide);
    });
  }

  // ── Init Swiper ───────────────────────────────────────────────
  function initSwiper() {
    new Swiper('.photoSwiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 32,
      grabCursor: true,
      loop: true,

      // Smooth momentum
      freeMode: false,

      // Keyboard support
      keyboard: {
        enabled: true,
      },

      // Navigation
      navigation: {
        nextEl: '.photo-next',
        prevEl: '.photo-prev',
      },

      // Pagination dots
      pagination: {
        el: '.photo-pagination',
        clickable: true,
      },

      // Smooth transition
      speed: 600,
      effect: 'slide',

      // 3D depth feel
      watchSlidesProgress: true,

      on: {
        progress(swiper) {
          swiper.slides.forEach((slide) => {
            const progress = slide.progress;
            const scale = 1 - Math.abs(progress) * 0.08;
            const opacity = 1 - Math.abs(progress) * 0.35;
            gsap.set(slide, {
              scale: scale,
              opacity: opacity,
            });
          });
        },
        setTransition(swiper, duration) {
          swiper.slides.forEach((slide) => {
            gsap.to(slide, {
              duration: duration / 1000,
              ease: 'power2.out'
            });
          });
        }
      }
    });
  }

  // ── Card tilt on mouse move (desktop) ────────────────────────
  function initCardTilt() {
    document.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  // ── GSAP Scroll reveal ────────────────────────────────────────
  function initScrollReveal() {
    gsap.to('.photos-header', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#photos',
        start: 'top 70%',
      }
    });

    gsap.to('.swipe-hint', {
      opacity: 1,
      duration: 0.8,
      delay: 0.4,
      scrollTrigger: {
        trigger: '#photos',
        start: 'top 60%',
      }
    });
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    buildPhotoCards();
    initSwiper();

    // Tilt needs cards to exist
    setTimeout(() => {
      initCardTilt();
      initScrollReveal();
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
