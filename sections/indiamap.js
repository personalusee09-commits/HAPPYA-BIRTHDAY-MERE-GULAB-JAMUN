/* ============================================================
   INDIAMAP.JS — Real India map from GeoJSON data
   Kerala (Kozhikode) → Faridabad (Haryana)
   SVG viewBox: 0 0 500 600
============================================================ */

(function () {

  function buildMap() {
    const container = document.querySelector('.map-container');
    if (!container) return;

    container.innerHTML = `
      <svg id="indiaMapSvg" viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">

        <!-- ── Real India outline from GeoJSON ── -->
        <path class="india-fill" d="M175.4,30.0 L191.6,53.0 L190.1,69.0 L196.1,79.0 L195.6,89.0 L184.8,86.4 L189.0,108.0 L203.8,120.5 L224.7,134.2 L215.2,143.1 L209.3,161.4 L223.9,168.8 L238.1,178.5 L257.7,189.5 L278.4,192.0 L287.1,202.0 L298.7,203.9 L316.8,208.4 L329.4,208.1 L331.1,200.3 L329.1,187.9 L330.3,179.4 L339.4,175.3 L340.7,190.7 L341.0,194.7 L354.7,202.1 L364.2,199.1 L376.9,200.4 L389.2,199.8 L390.2,187.7 L384.1,181.5 L396.2,179.0 L409.9,164.4 L427.3,151.9 L439.9,156.8 L450.7,148.5 L457.7,160.7 L452.6,168.9 L468.9,171.9 L470.0,179.3 L464.7,182.9 L466.0,195.0 L455.2,191.4 L435.7,205.0 L436.2,216.2 L427.9,232.7 L427.1,242.2 L420.4,258.4 L408.6,253.9 L408.0,274.2 L404.6,280.9 L406.2,289.2 L398.8,293.9 L390.9,262.8 L386.7,262.8 L384.2,275.4 L376.0,265.2 L380.7,254.0 L387.4,252.9 L394.3,236.3 L385.6,233.0 L371.7,233.2 L357.4,230.6 L356.0,216.9 L348.8,216.0 L336.9,207.5 L331.6,220.8 L342.5,231.2 L333.1,238.5 L329.7,245.6 L339.0,250.9 L336.4,262.7 L341.6,277.5 L344.0,293.6 L341.8,300.8 L331.6,300.5 L313.0,304.6 L313.9,319.4 L305.9,331.0 L284.2,344.2 L267.3,367.2 L256.0,379.6 L241.0,392.5 L241.0,401.5 L233.5,406.3 L219.9,413.3 L212.9,414.4 L208.4,429.3 L211.5,454.8 L212.3,471.1 L205.9,489.8 L205.9,523.1 L198.1,524.0 L191.2,539.0 L195.8,545.5 L182.1,551.0 L177.0,564.4 L171.0,570.0 L156.7,551.7 L149.7,524.2 L144.0,504.4 L138.7,495.2 L130.7,476.3 L127.0,451.8 L124.4,439.5 L110.7,412.6 L104.4,374.6 L99.9,349.5 L100.0,325.7 L97.1,307.3 L75.1,319.1 L64.5,316.7 L44.9,292.9 L52.1,285.9 L47.7,278.2 L30.0,261.5 L40.0,248.4 L73.2,248.5 L70.2,231.6 L61.7,221.7 L60.0,206.6 L50.1,197.8 L66.7,177.2 L84.2,178.7 L100.0,158.1 L109.4,138.2 L124.0,118.6 L123.8,104.6 L136.6,93.2 L124.5,83.5 L119.2,70.3 L113.9,53.1 L121.3,44.6 L144.1,49.4 L160.9,46.5 L175.4,30.0 Z" />
        <path class="india-outline" d="M175.4,30.0 L191.6,53.0 L190.1,69.0 L196.1,79.0 L195.6,89.0 L184.8,86.4 L189.0,108.0 L203.8,120.5 L224.7,134.2 L215.2,143.1 L209.3,161.4 L223.9,168.8 L238.1,178.5 L257.7,189.5 L278.4,192.0 L287.1,202.0 L298.7,203.9 L316.8,208.4 L329.4,208.1 L331.1,200.3 L329.1,187.9 L330.3,179.4 L339.4,175.3 L340.7,190.7 L341.0,194.7 L354.7,202.1 L364.2,199.1 L376.9,200.4 L389.2,199.8 L390.2,187.7 L384.1,181.5 L396.2,179.0 L409.9,164.4 L427.3,151.9 L439.9,156.8 L450.7,148.5 L457.7,160.7 L452.6,168.9 L468.9,171.9 L470.0,179.3 L464.7,182.9 L466.0,195.0 L455.2,191.4 L435.7,205.0 L436.2,216.2 L427.9,232.7 L427.1,242.2 L420.4,258.4 L408.6,253.9 L408.0,274.2 L404.6,280.9 L406.2,289.2 L398.8,293.9 L390.9,262.8 L386.7,262.8 L384.2,275.4 L376.0,265.2 L380.7,254.0 L387.4,252.9 L394.3,236.3 L385.6,233.0 L371.7,233.2 L357.4,230.6 L356.0,216.9 L348.8,216.0 L336.9,207.5 L331.6,220.8 L342.5,231.2 L333.1,238.5 L329.7,245.6 L339.0,250.9 L336.4,262.7 L341.6,277.5 L344.0,293.6 L341.8,300.8 L331.6,300.5 L313.0,304.6 L313.9,319.4 L305.9,331.0 L284.2,344.2 L267.3,367.2 L256.0,379.6 L241.0,392.5 L241.0,401.5 L233.5,406.3 L219.9,413.3 L212.9,414.4 L208.4,429.3 L211.5,454.8 L212.3,471.1 L205.9,489.8 L205.9,523.1 L198.1,524.0 L191.2,539.0 L195.8,545.5 L182.1,551.0 L177.0,564.4 L171.0,570.0 L156.7,551.7 L149.7,524.2 L144.0,504.4 L138.7,495.2 L130.7,476.3 L127.0,451.8 L124.4,439.5 L110.7,412.6 L104.4,374.6 L99.9,349.5 L100.0,325.7 L97.1,307.3 L75.1,319.1 L64.5,316.7 L44.9,292.9 L52.1,285.9 L47.7,278.2 L30.0,261.5 L40.0,248.4 L73.2,248.5 L70.2,231.6 L61.7,221.7 L60.0,206.6 L50.1,197.8 L66.7,177.2 L84.2,178.7 L100.0,158.1 L109.4,138.2 L124.0,118.6 L123.8,104.6 L136.6,93.2 L124.5,83.5 L119.2,70.3 L113.9,53.1 L121.3,44.6 L144.1,49.4 L160.9,46.5 L175.4,30.0 Z" />

        <!-- ── Animated route: Kerala → Faridabad ── -->
        <path class="distance-path" id="routePath"
          d="M151.8,513.4 C200,400 190,280 167.5,169.0" />

        <!-- ── Glow layer behind route ── -->
        <path class="route-glow" id="routeGlow"
          d="M151.8,513.4 C200,400 190,280 167.5,169.0" />

        <!-- ── Kerala dot (south) ── -->
        <circle class="city-dot kerala-dot" cx="151.8" cy="513.4" r="5" />
        <circle class="city-dot-pulse" cx="151.8" cy="513.4" r="5" />
        <text class="city-label" x="162" y="511" font-size="11">Kerala</text>

        <!-- ── Faridabad dot (north, Haryana) ── -->
        <circle class="city-dot faridabad-dot" cx="167.5" cy="169.0" r="5" />
        <circle class="city-dot-pulse faridabad-pulse" cx="167.5" cy="169.0" r="5" />
        <text class="city-label" x="178" y="167" font-size="11">Faridabad</text>
        <text class="city-sublabel" x="178" y="179" font-size="8">Haryana</text>

        <!-- ── Heart at midpoint of route (t=0.5) ── -->
        <path class="distance-heart" id="distanceHeart"
          d="M186,350 C186,350 175,340 175,332 C175,326 179,322 184,322 C186,322 188,323 189,325 C190,323 192,322 194,322 C199,322 203,326 203,332 C203,340 186,350 186,350 Z"
        />

        <!-- ── Distance label ── -->
        <text class="distance-label-map" x="210" y="342" font-size="10">2,847 km</text>

        <!-- ── Subtle waypoint dots along route ── -->
        <circle cx="170" cy="450" r="2.5" class="waypoint-dot" />
        <circle cx="178" cy="360" r="2.5" class="waypoint-dot" />
        <circle cx="174" cy="270" r="2.5" class="waypoint-dot" />
        <circle cx="169" cy="210" r="2.5" class="waypoint-dot" />

      </svg>
    `;

    // Re-attach secret heart click handler
    setTimeout(attachHeartHandler, 200);
  }

  function attachHeartHandler() {
    const heart = document.querySelector('.distance-heart');
    const overlay = document.getElementById('secretOverlay');
    const messageEl = document.getElementById('secretMessage');
    if (!heart || !overlay || !messageEl) return;

    messageEl.textContent = CONFIG.SECRET_MESSAGE;
    let isOpen = false;

    heart.addEventListener('click', () => {
      if (isOpen) return;
      isOpen = true;

      gsap.to(overlay, {
        opacity: 1, visibility: 'visible', duration: 0.8, ease: 'power2.inOut',
        onComplete: () => {
          const words = CONFIG.SECRET_MESSAGE.split(' ');
          messageEl.innerHTML = words.map(w => `<span class="secret-word">${w}</span>`).join(' ');
          gsap.to('.secret-word', { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power1.out' });
          const totalDelay = words.length * 0.08 * 1000 + 800;
          setTimeout(() => {
            const hint = document.getElementById('secretHint');
            if (hint) gsap.to(hint, { opacity: 0.5, duration: 1 });
          }, totalDelay);
        }
      });

      if (window.AudioManager) window.AudioManager.duck(0.12, 1000);
    });

    function closeSecret() {
      gsap.to(overlay, {
        opacity: 0, duration: 1.2, ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.visibility = 'hidden';
          if (window.AudioManager) window.AudioManager.restore(1500);
        }
      });
    }

    overlay.addEventListener('click', closeSecret);
    overlay.addEventListener('wheel', closeSecret, { once: true });
    overlay.addEventListener('touchmove', closeSecret, { once: true });
  }

  function animatePath() {
    const path = document.getElementById('routePath');
    const glow = document.getElementById('routeGlow');
    if (!path) return;

    const length = path.getTotalLength();

    [path, glow].forEach(el => {
      if (!el) return;
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    });

    [path, glow].forEach(el => {
      if (!el) return;
      gsap.to(el, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.map-container',
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: true,
          onComplete: () => {
            const heart = document.querySelector('.distance-heart');
            if (heart) heart.classList.add('found');
          }
        }
      });
    });
  }

  function init() {
    buildMap();
    setTimeout(animatePath, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
