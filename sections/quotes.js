/* ============================================================
   QUOTES.JS — Cinematic full-bleed quote reveals
============================================================ */

(function () {

  function buildQuotes() {
    const container = document.getElementById('quotesContainer');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.QUOTES.forEach((quote, i) => {
      const slide = document.createElement('div');
      slide.className = 'quote-slide';

      const num = String(i + 1).padStart(2, '0');
      const total = String(CONFIG.QUOTES.length).padStart(2, '0');

      slide.innerHTML = `
        <div>
          <div class="quote-mark">"</div>
          <p class="quote-text">${quote.replace(/^"|"$/g, '')}</p>
        </div>
        <p class="quote-index">${num} / ${total}</p>
      `;

      container.appendChild(slide);
    });
  }

  function initScrollReveal() {
    gsap.utils.toArray('.quote-slide').forEach((slide) => {
      const text = slide.querySelector('.quote-text');
      const mark = slide.querySelector('.quote-mark');
      const index = slide.querySelector('.quote-index');

      gsap.to(mark, {
        opacity: 0.3,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: slide,
          start: 'top 60%',
        }
      });

      gsap.fromTo(text,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 65%',
            end: 'top 20%',
            scrub: false,
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.to(index, {
        opacity: 0.6,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: slide,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }

  function init() {
    buildQuotes();
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
