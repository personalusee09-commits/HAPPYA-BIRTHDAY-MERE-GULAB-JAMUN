/* ============================================================
   WEATHER.JS — Live weather particles matching Thengana's sky
   Fetches Open-Meteo (free, no key needed) for Thengana weather
   Shows rain / thunderstorm / clear petals accordingly
============================================================ */

(function () {

 
  // Thengana coordinates
  const LAT = 9.4265;
  const LON = 76.5321;

  let canvas, ctx;
  let particles = [];
  let weatherType = 'petals'; // default
  let animRunning = false;
  let weatherLabel = '';

  // WMO weather code → our type
  function decodeWeather(code) {
    if (code >= 95) return { type: 'thunder', label: '⛈ Storm in Thengana' };
    if (code >= 61) return { type: 'rain', label: '🌧 Raining in Thengana' };
    if (code >= 51) return { type: 'drizzle', label: '🌦 Drizzling in Thengana' };
    if (code >= 71) return { type: 'snow', label: '❄ Snow in Thengana' };   // unlikely but handled
    return { type: 'petals', label: '🌸 Clear skies in Thengana' };
  }

  async function fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weathercode&timezone=Asia%2FKolkata`;
      const res = await fetch(url);
      const data = await res.json();
      const code = data?.current?.weathercode ?? 0;
      return decodeWeather(code);
    } catch (e) {
      return { type: 'petals', label: '🌸 Thengana skies' };
    }
  }

  // ── Particle factories ────────────────────────────────────────
  function makeRainDrop(heavy = false) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: heavy ? (12 + Math.random() * 10) : (6 + Math.random() * 6),
      speed: heavy ? (12 + Math.random() * 6) : (7 + Math.random() * 4),
      opacity: 0.3 + Math.random() * 0.4,
      width: heavy ? 1.5 : 0.8,
    };
  }

  function makePetal() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -80,
      size: 4 + Math.random() * 5,
      speedY: 0.8 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.5 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function makeSnow() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -80,
      r: 1.5 + Math.random() * 3,
      speedY: 0.5 + Math.random() * 1,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.4 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function spawnParticle() {
    switch (weatherType) {
      case 'rain': return makeRainDrop(false);
      case 'drizzle': return makeRainDrop(false);
      case 'thunder': return makeRainDrop(true);
      case 'snow': return makeSnow();
      default: return makePetal();
    }
  }

  // ── Drawing ───────────────────────────────────────────────────
  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;

    if (weatherType === 'rain' || weatherType === 'thunder' || weatherType === 'drizzle') {
      const alpha = weatherType === 'thunder' ? 0.6 : 0.35;
      ctx.strokeStyle = `rgba(160, 200, 255, ${alpha})`;
      ctx.lineWidth = p.width;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 1, p.y + p.length);
      ctx.stroke();

    } else if (weatherType === 'snow') {
      ctx.fillStyle = `rgba(220, 240, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Petal — soft warm oval
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(200, 168, 130, ${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function updateParticle(p) {
    if (p.speedY !== undefined) {
      p.y += p.speedY;
      p.x += p.speedX || 0;
    }
    if (p.wobble !== undefined) {
      p.wobble += 0.02;
      p.x += Math.sin(p.wobble) * 0.4;
    }
    if (p.rotation !== undefined) {
      p.rotation += p.rotSpeed || 0;
    }
    if (p.length) {
      p.y += p.speed;
    }
  }

  function isOffScreen(p) {
    return p.y > canvas.height + 40 || p.x < -40 || p.x > canvas.width + 40;
  }

  // ── Main loop ─────────────────────────────────────────────────
  function animate() {
    if (!animRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn
    const maxCount = weatherType === 'petals' ? 30 : weatherType === 'thunder' ? 120 : 80;
    if (particles.length < maxCount) {
      const toSpawn = weatherType === 'thunder' ? 4 : weatherType === 'rain' ? 3 : 1;
      for (let i = 0; i < toSpawn; i++) particles.push(spawnParticle());
    }

    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });

    particles = particles.filter(p => !isOffScreen(p));

    requestAnimationFrame(animate);
  }

  // ── UI — weather badge ────────────────────────────────────────
  function showWeatherBadge(label) {
    let badge = document.getElementById('weatherBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'weatherBadge';
      badge.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 9998;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(200,168,130,0.3);
        border-radius: 100px;
        padding: 8px 16px;
        font-family: 'Inter', sans-serif;
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #1A1A1A;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.8s ease, transform 0.8s ease;
        cursor: default;
      `;
      document.body.appendChild(badge);
    }

    badge.textContent = label;

    setTimeout(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 100);

    // Fade out after 5 seconds
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(8px)';
    }, 5000);
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    // Create overlay canvas that sits above hero but below UI
    canvas = document.createElement('canvas');
    canvas.id = 'weatherCanvas';
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
      opacity: 0.7;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Fetch weather
    const weather = await fetchWeather();
    weatherType = weather.type;
    weatherLabel = weather.label;

    animRunning = true;
    animate();

    // Show badge shortly after page loads
    setTimeout(() => showWeatherBadge(weatherLabel), 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
