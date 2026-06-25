/* ============================================================
   RADIO.JS — Vintage radio with 4 hidden stations
   Main:   25.6 → your voice note   (assets/audio/voicenote.mp3)
   Hidden: 14.4 → her audio 1       (assets/audio/her1.mp3)
   Hidden: 07.2 → her audio 2       (assets/audio/her2.mp3)
   Hidden: 11.1 → her audio 3       (assets/audio/her3.mp3)
============================================================ */

(function () {

  let voiceAudio = null;
  let isPoweredOn = false;
  let isTuned = false;
  let staticInterval = null;
  let staticNode = null;
  let currentStation = null;

  // ── All stations ──────────────────────────────────────────────
  const STATIONS = {
    '25.6': {
      file: 'assets/audio/voicenote.mp3',
      label: '24 AUG 2025 THESE AKWARD CALLSS💗',
      color: '#8FD9A8',    // green — main station
    },
    '14.4': {
      file: 'assets/audio/her1.mp3',
      label: 'ALWAYSS EXCITEDD WHILE TALKING TO YOUU💗 ✨',
      color: '#A8D8FF',    // blue
    },
    '07.2': {
      file: 'assets/audio/her2.mp3',
      label: 'there\'s more 💗 , aap toh call krti nhi mujhe yahi sab sunna padta hai :(',
      color: '#FFD9A0',    // warm yellow
    },
    '11.1': {
      file: 'assets/audio/her3.mp3',
      label: 'last one 🌸',
      color: '#FF8FA3',    // pink
    },
  };

  function injectContent() {
    const hint = document.getElementById('radioHintNum');
    if (hint) hint.textContent = CONFIG.RADIO_STATION;
  }

  // ── Static bars ───────────────────────────────────────────────
  function buildStaticBars() {
    const container = document.getElementById('staticBars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const bar = document.createElement('div');
      bar.className = 'static-bar';
      bar.style.height = '4px';
      container.appendChild(bar);
    }
  }

  function animateStatic(active) {
    const bars = document.querySelectorAll('.static-bar');
    if (staticInterval) clearInterval(staticInterval);
    if (!active) { bars.forEach(b => b.style.height = '4px'); return; }
    staticInterval = setInterval(() => {
      bars.forEach(b => { b.style.height = (Math.random() * 18 + 2) + 'px'; });
    }, 100);
  }

  // ── Web Audio static noise ────────────────────────────────────
  function createStaticNoise() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.15;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      return { ctx, source, gainNode, started: false };
    } catch (e) { return null; }
  }

  function startStaticAudio() {
    if (!staticNode) staticNode = createStaticNoise();
    if (!staticNode) return;
    if (!staticNode.started) { staticNode.source.start(); staticNode.started = true; }
    staticNode.gainNode.gain.setTargetAtTime(0.08, staticNode.ctx.currentTime, 0.3);
  }

  function stopStaticAudio() {
    if (staticNode) staticNode.gainNode.gain.setTargetAtTime(0, staticNode.ctx.currentTime, 0.3);
  }

  // ── Power button ──────────────────────────────────────────────
  function initPowerButton() {
    const powerBtn = document.getElementById('radioPower');
    const frequency = document.getElementById('radioFrequency');
    const status = document.getElementById('radioStatus');

    if (!powerBtn) return;

    powerBtn.addEventListener('click', () => {
      isPoweredOn = !isPoweredOn;

      if (isPoweredOn) {
        powerBtn.classList.add('on');
        if (status) status.textContent = 'searching...';
        if (frequency) frequency.textContent = '— — . —';
        animateStatic(true);
        startStaticAudio();
        gsap.fromTo('.radio-screen', { opacity: 0.6 }, { opacity: 1, duration: 0.6 });
      } else {
        powerBtn.classList.remove('on');
        if (status) status.textContent = 'off';
        if (frequency) { frequency.textContent = '— — . —'; frequency.style.color = ''; }
        animateStatic(false);
        stopStaticAudio();
        stopCurrentAudio();
        isTuned = false;
        currentStation = null;
        hideMessage();
      }
    });
  }

  // ── Tuner ─────────────────────────────────────────────────────
  function initTuner() {
    const input = document.getElementById('tunerInput');
    const submit = document.getElementById('tunerSubmit');
    const frequency = document.getElementById('radioFrequency');
    const status = document.getElementById('radioStatus');
    const radioBody = document.querySelector('.radio-body');

    if (!input || !submit) return;

    function tryTune() {
      if (!isPoweredOn) {
        radioBody.classList.add('shake');
        setTimeout(() => radioBody.classList.remove('shake'), 400);
        return;
      }

      const value = input.value.trim();
      const station = STATIONS[value];

      if (station) {
        // Stop previous station if switching
        if (currentStation && currentStation !== value) {
          stopCurrentAudio();
          hideMessage();
        }

        isTuned = true;
        currentStation = value;

        if (frequency) {
          frequency.textContent = value;
          frequency.style.color = station.color;
        }
        if (status) status.textContent = 'connected';

        animateStatic(false);
        if (staticNode) staticNode.gainNode.gain.setTargetAtTime(0.01, staticNode.ctx.currentTime, 0.8);
        if (window.AudioManager) window.AudioManager.duck(0.08, 1200);

        playStation(station, value);

      } else {
        // Wrong frequency — shake + static
        radioBody.classList.add('shake');
        if (status) status.textContent = 'static...';
        if (frequency) { frequency.textContent = value || '— — . —'; frequency.style.color = ''; }
        setTimeout(() => radioBody.classList.remove('shake'), 400);
        isTuned = false;
      }
    }

    submit.addEventListener('click', tryTune);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryTune(); });
  }

  // ── Play a station ────────────────────────────────────────────
  function playStation(station, key) {
    stopCurrentAudio();

    const messageEl = document.getElementById('radioMessage');
    const labelEl = document.getElementById('radioMessageLabel');

    if (messageEl) messageEl.classList.add('visible');
    if (labelEl) labelEl.textContent = station.label;

    voiceAudio = new Howl({
      src: [station.file],
      volume: 0.9,
      html5: true,
      onload: function () { voiceAudio.play(); },
      onend: function () {
        if (window.AudioManager) window.AudioManager.restore(2000);
        // Mark station as heard
        markStationHeard(key);
      },
      onloaderror: function () {
        console.info(`Audio not found: ${station.file}`);
        if (window.AudioManager) window.AudioManager.restore(1000);
      }
    });
  }

  function stopCurrentAudio() {
    if (voiceAudio) {
      voiceAudio.fade(voiceAudio.volume(), 0, 400);
      const v = voiceAudio;
      setTimeout(() => v.stop(), 420);
      voiceAudio = null;
    }
  }

  function hideMessage() {
    const messageEl = document.getElementById('radioMessage');
    if (messageEl) messageEl.classList.remove('visible');
  }

  // ── Mark station as heard (lights up dot) ────────────────────
  function markStationHeard(key) {
    const dot = document.querySelector(`.station-dot[data-station="${key}"]`);
    if (dot) dot.classList.add('heard');
  }

  // ── Station dots display (shows 4 dots, lights up when found) ─
  function buildStationDots() {
    let dotsEl = document.getElementById('stationDots');
    if (!dotsEl) {
      dotsEl = document.createElement('div');
      dotsEl.id = 'stationDots';
      const radioBody = document.querySelector('.radio-body');
      if (radioBody) radioBody.appendChild(dotsEl);
    }

    dotsEl.innerHTML = '';

    Object.keys(STATIONS).forEach(key => {
      const dot = document.createElement('div');
      dot.className = 'station-dot';
      dot.dataset.station = key;
      dot.title = key;
      dotsEl.appendChild(dot);
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────
  function initScrollReveal() {
    gsap.to('.radio-header', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#radio', start: 'top 70%' }
    });
    gsap.to('.radio-body', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#radio', start: 'top 65%' }
    });
    gsap.to('.radio-hint', {
      opacity: 1, duration: 1, delay: 0.3,
      scrollTrigger: { trigger: '.radio-hint', start: 'top 85%' }
    });
  }

  function init() {
    injectContent();
    buildStaticBars();
    buildStationDots();
    initPowerButton();
    initTuner();
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
