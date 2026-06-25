(function () {

  // ─── TEXT ────────────────────────────────────────────────────
  // Edit this paragraph to change what gets typed out.
  // Keep it as one string — line breaks become natural pauses.
  const PARAGRAPH =
    "I don't know how to explain what it feels like to love someone " +
    "across 2,847 kilometres — to carry a person so completely inside you " +
    "that their absence isn't emptiness, it's a kind of presence. " +
    "You have made quiet mornings feel warmer without being in them. " +
    "You have made ordinary days feel like they were worth writing down. " +
    "I look at the distance between us and I don't see the space — " +
    "I see everything I would cross, without hesitation, without a map, " +
    "just to stand beside you for one ordinary moment. " +
    "That is what you are to me, Fizu. " +
    "Not a chapter. The whole book.";

  // ─── TYPING CONFIG ───────────────────────────────────────────
  const BASE_SPEED    = 38;   // ms per character (avg)
  const JITTER        = 22;   // ± random variance in ms (human feel)
  const PAUSE_COMMA   = 220;  // extra pause after commas
  const PAUSE_PERIOD  = 420;  // extra pause after . ! ?
  const PAUSE_DASH    = 300;  // extra pause after —

  // ─── KEYBOARD SOUND ──────────────────────────────────────────
  // Generates a tiny percussive click using the Web Audio API.
  // No external file needed — pure synthesis.
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playKeyClick() {
    try {
      const ctx  = getAudioCtx();
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);

      // Noise burst — short, brown-ish
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.5);
      }

      const src    = ctx.createBufferSource();
      src.buffer   = buf;

      // Very slight pitch randomisation — different keys feel different
      src.playbackRate.value = 0.85 + Math.random() * 0.3;

      // Low-pass to make it feel mechanical, not hissy
      const filter       = ctx.createBiquadFilter();
      filter.type        = 'lowpass';
      filter.frequency.value = 1800 + Math.random() * 600;

      // Gain — keep it subtle so it doesn't clash with bg music
      const gain      = ctx.createGain();
      gain.gain.value = 0.12;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start();
    } catch (e) {
      // Silently fail if audio context is unavailable
    }
  }

  // Heavier thud for space bar
  function playSpaceClick() {
    try {
      const ctx  = getAudioCtx();
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.055, ctx.sampleRate);
      const data = buf.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
      }

      const src              = ctx.createBufferSource();
      src.buffer             = buf;
      src.playbackRate.value = 0.7 + Math.random() * 0.15;

      const filter           = ctx.createBiquadFilter();
      filter.type            = 'lowpass';
      filter.frequency.value = 900;

      const gain             = ctx.createGain();
      gain.gain.value        = 0.16;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start();
    } catch (e) {}
  }

  // ─── INIT ────────────────────────────────────────────────────
  function init() {
    const section   = document.getElementById('typewriter');
    const inner     = section && section.querySelector('.tw-inner');
    const label     = section && section.querySelector('.tw-label');
    const paraEl    = section && section.querySelector('.tw-paragraph');
    const cursor    = section && section.querySelector('.tw-cursor');
    const signature = section && section.querySelector('.tw-signature');

    if (!section || !inner || !paraEl || !cursor) return;

    let started = false;

    // ── Scroll reveal — trigger when section enters viewport ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Reveal container
          inner.classList.add('revealed');
          if (label) {
            setTimeout(() => label.classList.add('visible'), 400);
          }

          // Start typing after a short breath
          if (!started) {
            started = true;
            setTimeout(() => startTyping(paraEl, cursor, signature), 900);
          }

          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(section);
  }

  // ─── TYPING ENGINE ───────────────────────────────────────────
  function startTyping(paraEl, cursor, signature) {
    const chars  = PARAGRAPH.split('');
    let   index  = 0;
    let   text   = '';

    cursor.classList.add('typing');

    // Duck the background music while typing
    if (window.AudioManager) {
      window.AudioManager.duck(0.12, 600);
    }

    function typeNext() {
      if (index >= chars.length) {
        // Typing done
        cursor.classList.remove('typing'); // resume blink

        // Restore music after a pause
        setTimeout(() => {
          if (window.AudioManager) window.AudioManager.restore(1200);
        }, 800);

        // Show signature
        if (signature) {
          setTimeout(() => signature.classList.add('visible'), 600);
        }
        return;
      }

      const char = chars[index];
      text      += char;
      index++;

      // Update DOM — append text node before cursor
      paraEl.textContent = text;
      paraEl.appendChild(cursor);

      // Play sound (skip sound on spaces ~40% of the time for naturalness)
      if (char === ' ') {
        if (Math.random() > 0.4) playSpaceClick();
      } else if (char !== '\n') {
        // playKeyClick();
      }

      // Calculate delay for next character
      let delay = BASE_SPEED + (Math.random() * JITTER * 2 - JITTER);

      if (char === ',' || char === ';') delay += PAUSE_COMMA;
      if (char === '.' || char === '!' || char === '?') delay += PAUSE_PERIOD;
      if (char === '—') delay += PAUSE_DASH;

      // Occasional human micro-pause (thinking, hesitation)
      if (Math.random() < 0.03) delay += 180 + Math.random() * 250;

      setTimeout(typeNext, Math.max(delay, 18));
    }

    typeNext();
  }

  // ─── BOOT ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
