/* ============================================================
   NEWSPAPER.JS — Hidden button after radio section
   Click → full broadsheet unrolls with Fiza's photo + article
============================================================ */

(function () {

  // ── CONFIG ───────────────────────────────────────────────────
  const PHOTO_SRC  = 'assets/photos/fiza-news.jpg'; // ✏️ change filename if needed
  const PUB_DATE   = 'Sunday, April 14, 2024';
  const EDITION    = 'Vol. 1, No. 1 · Special Edition';
  const PAPER_NAME = 'The Kerala Gazette';

  // ── Inject button after #radio ───────────────────────────────
  function injectButton() {
    const radio = document.getElementById('radio');
    if (!radio) return;

    const btn = document.createElement('button');
    btn.id = 'newsBtn';
    btn.innerHTML = `
      <span class="news-btn-icon">🗞️</span>
      <span class="news-btn-label">Breaking News</span>
    `;
    btn.setAttribute('aria-label', 'Open The Kerala Gazette');

    // Insert after radio section
    radio.insertAdjacentElement('afterend', btn);

    btn.addEventListener('click', openNewspaper);

    // Animate button in after short delay
    setTimeout(() => btn.classList.add('news-btn-visible'), 600);
  }

  // ── Build newspaper overlay ──────────────────────────────────
  function buildNewspaper() {
    const el = document.createElement('div');
    el.id = 'newspaperOverlay';
    el.innerHTML = `
      <div class="np-paper" id="npPaper">

        <!-- Close -->
        <button class="np-close" id="npClose" aria-label="Close">✕</button>

        <!-- Masthead -->
        <div class="np-masthead">
          <div class="np-masthead-top">
            <span class="np-edition">${EDITION}</span>
            <span class="np-price">Price: One Heartbeat</span>
          </div>
          <h1 class="np-title">${PAPER_NAME}</h1>
          <div class="np-masthead-bottom">
            <span class="np-date">${PUB_DATE}</span>
            <span class="np-tagline">"All the love that's fit to print"</span>
            <span class="np-weather">Weather: Warm, always</span>
          </div>
        </div>

        <div class="np-rule"></div>

        <!-- Main headline -->
        <div class="np-headline-block">
          <p class="np-kicker">BREAKING · LOVE & AFFAIRS</p>
          <h2 class="np-headline">Kerala Girl Steals Faridabad Boy's Heart;<br>Refuses to Return It</h2>
          <p class="np-deck">Sources confirm the theft was intentional, premeditated, and entirely worth it. The victim is reportedly not pressing charges.</p>
        </div>

        <div class="np-rule np-rule-thin"></div>

        <!-- Body columns -->
        <div class="np-body">

          <!-- Left column — article -->
          <div class="np-col np-col-main">

            <p class="np-byline">By Our Correspondent, Ayaz · Faridabad Bureau</p>

            <p class="np-drop">
              <span class="np-dropcap">F</span>IZA HAREES, 
              a resident of Kerala, has been formally identified as the primary suspect 
              in the ongoing case of one Faridabad boy's missing heart. 
              The incident, which began on April 14, 2024, 
              has since grown into what experts are calling 
              <em>"the most elaborate heist of the decade."</em>
            </p>

            <p class="np-para">
              Witnesses report that the accused deployed a series of highly sophisticated 
              tactics including — but not limited to — laughing at exactly the right moments, 
              saying things that made absolutely no sense and somehow made perfect sense, 
              and existing in a way that made 2,847 kilometres feel like a minor inconvenience.
            </p>

            <p class="np-para">
              "We have never seen anything like it," said one unnamed source close to the victim. 
              "One day he was fine. The next, he was checking Kerala weather at 2am 
              and calling it 'just curiosity.'"
            </p>

            <p class="np-subhead">THE INVESTIGATION</p>

            <p class="np-para">
              Authorities traced the first point of contact to a conversation that, 
              by all accounts, should have been ordinary. 
              It was not. 
              The victim has declined to comment, 
              except to say — and this is a direct quote — 
              <em>"she started it."</em>
            </p>

            <p class="np-para">
              Ms. Harees, when reached for comment via voice note 
              (she does not type when she can talk, sources confirm), 
              allegedly laughed and said nothing further. 
              Legal experts say this is, technically, an admission.
            </p>

            <p class="np-subhead">IMPACT ASSESSMENT</p>

            <p class="np-para">
              The full extent of the damage remains unclear. 
              What is clear is that the victim now notices Kerala 
              on every map he sees, checks her city's time zone before planning anything, 
              and has been observed smiling at his phone 
              in a manner described by colleagues as "suspicious and constant."
            </p>

            <p class="np-para">
              When asked if he wanted his heart back, 
              the victim stared for a long moment and said: 
              <em>"No. She can keep it."</em>
            </p>

            <p class="np-continued">Continued on Page 2 — he means it.</p>

          </div>

          <!-- Right column — photo + sidebar -->
          <div class="np-col np-col-side">

            <!-- Photo -->
            <figure class="np-photo-block">
              <div class="np-photo-frame">
                <img src="/assets/photos/newspaper-photo.jpg" alt="Fiza Harees" class="np-photo" />
              </div>
              <figcaption class="np-caption">
                Fiza Harees, pictured above, has not commented 
                on the allegations. Her expression suggests she is aware. 
                <span class="np-caption-credit">Photo: The Kerala Gazette Archive</span>
              </figcaption>
            </figure>

            <!-- Sidebar box -->
            <div class="np-sidebar-box">
              <p class="np-sidebar-label">FAST FACTS</p>
              <ul class="np-sidebar-list">
                <li>Distance of theft: <strong>2,847 km</strong></li>
                <li>Duration: <strong>Since April 14, 2024</strong></li>
                <li>Heart condition: <strong>Missing, happy</strong></li>
                <li>Suspect's location: <strong>Kerala</strong></li>
                <li>Victim's status: <strong>Hopelessly in love</strong></li>
                <li>Return expected: <strong>Never</strong></li>
              </ul>
            </div>

            <!-- Pull quote -->
            <blockquote class="np-pullquote">
              "She started it."
              <cite>— The Victim, Faridabad</cite>
            </blockquote>

          </div>

        </div>

        <div class="np-rule"></div>

        <!-- Footer -->
        <div class="np-footer">
          <p>The Kerala Gazette is published once, for one person, on one very important birthday.</p>
          <p>© ${new Date().getFullYear()} · All rights reserved · Especially the heart.</p>
        </div>

      </div>
    `;

    document.body.appendChild(el);
    return el;
  }

  // ── Open ─────────────────────────────────────────────────────
  function openNewspaper() {
    if (document.getElementById('newspaperOverlay')) return;

    if (window.AudioManager) window.AudioManager.duck(0.15, 800);

    const overlay = buildNewspaper();

    requestAnimationFrame(() => {
      overlay.classList.add('np-visible');
      setTimeout(() => {
        document.getElementById('npPaper').classList.add('np-paper-in');
      }, 100);
    });

    document.getElementById('npClose').addEventListener('click', closeNewspaper);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeNewspaper();
    });
  }

  // ── Close ────────────────────────────────────────────────────
  function closeNewspaper() {
    const overlay = document.getElementById('newspaperOverlay');
    if (!overlay) return;
    overlay.classList.add('np-closing');
    setTimeout(() => {
      overlay.remove();
      if (window.AudioManager) window.AudioManager.restore(1500);
    }, 700);
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    injectButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
