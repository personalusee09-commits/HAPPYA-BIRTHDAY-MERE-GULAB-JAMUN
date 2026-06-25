/* ============================================================
   REASONS.JS — Numbered reasons, scroll reveal
============================================================ */

(function () {

  function buildReasons() {
    const container = document.getElementById('reasonsList');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.REASONS.forEach((reason, i) => {
      const row = document.createElement('div');
      row.className = 'reason-row reveal';

      const num = String(i + 1).padStart(2, '0');

      row.innerHTML = `
        <div class="reason-num">${num}</div>
        <div class="reason-text">${reason}</div>
      `;

      container.appendChild(row);
    });
  }

  function initScrollReveal() {
    gsap.to('.reasons-header', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#reasons',
        start: 'top 75%',
      }
    });

    gsap.utils.toArray('.reason-row').forEach((row, i) => {
      gsap.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
        }
      });
    });
  }

  function init() {
    buildReasons();
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
