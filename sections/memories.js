/* ============================================================
   MEMORIES.JS — Timeline with drawing progress line
============================================================ */

(function () {

  function buildMemories() {
    const container = document.getElementById('timelineItems');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.MEMORIES.forEach((memory, i) => {
      const item = document.createElement('div');
      item.className = 'memory-item';

      item.innerHTML = `
        <div class="memory-dot"></div>
        <p class="memory-year">${memory.year}</p>
        <p class="memory-text">${memory.text}</p>
      `;

      container.appendChild(item);
    });
  }

  function initScrollReveal() {
    gsap.to('.memories-header', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#memories',
        start: 'top 75%',
      }
    });

    const items = gsap.utils.toArray('.memory-item');

    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          onEnter: () => item.classList.add('active'),
        }
      });
    });

    // Animated progress line drawing down the timeline
    gsap.to('.timeline-progress', {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: true,
      }
    });
  }

  function init() {
    buildMemories();
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
