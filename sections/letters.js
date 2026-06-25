/* ============================================================
   LETTERS.JS — Type "future" anywhere → unsent letter appears
   A different kind of secret. No hearts. No gold ripple.
   Just silence, paper, and the things that were too hard to send.
============================================================ */

(function () {

  let typed = '';
  const target = 'future';
  let timeout = null;
  let triggered = false;

  // ── The letter content ───────────────────────────────────────
  // ✏️  THIS IS YOURS TO WRITE.
  // Use <span class="lns-cross">word</span> for crossed-out text
  // Use <span class="lns-margin">note</span> for margin scribbles
  // Use <br><br> for paragraph breaks
  // Keep it real. Keep it scared. Keep it you.

  const LETTER = {

    date: 'sometime in december, 2023',   // ✏️ when you almost sent it

    salutation: 'Fizu,',                   // ✏️ or however you'd start it

    body: `
      I've started this letter <span class="lns-cross">four</span> <span class="lns-cross">six</span> too many times.
      <br><br>
      I don't know how to say this without it sounding like too much —
      <span class="lns-cross">and maybe it is too much</span> — but I think about you
      in ways that <span class="lns-cross">scare me a little.</span>
      <br><br>
      ✏️ <em>[Write your real unsent thought here. The one you typed and deleted. The one that was too honest.]</em>
      <br><br>
      There were nights I wanted to call you just to hear you breathe.
      <span class="lns-cross">That's weird, I know.</span>
      <span class="lns-margin">← not weird</span>
      <br><br>
      ✏️ <em>[Another paragraph. What did you never admit? What did you hold back because you were scared she'd run?]</em>
      <br><br>
      I think what I'm trying to say is —
      <span class="lns-cross">I love you more than I've shown.</span>
      <span class="lns-cross">I love you more than I know how to.</span>
      I love you in ways I'm still figuring out.
      <br><br>
      ✏️ <em>[End it however you would have ended it, back then, if you'd been brave enough to send it.]</em>
    `,

    closing: 'yours, always —',           // ✏️
    sign: 'Ayaz'                           // ✏️

  };

  // ── Build the overlay ────────────────────────────────────────
  function showLetter() {
    // Prevent duplicate
    if (document.getElementById('lnsOverlay')) return;

    // Music — deep duck, long
    if (window.AudioManager) window.AudioManager.duck(0.03, 800);

    const overlay = document.createElement('div');
    overlay.id = 'lnsOverlay';
    overlay.innerHTML = `
      <div class="lns-paper" id="lnsPaper">

        <p class="lns-label">letters i never sent</p>

        <div class="lns-letter">
          <p class="lns-date">${LETTER.date}</p>
          <p class="lns-salutation">${LETTER.salutation}</p>
          <div class="lns-body">${LETTER.body}</div>
          <p class="lns-closing">${LETTER.closing}<br><em>${LETTER.sign}</em></p>
        </div>

        <p class="lns-hint">tap anywhere to fold this away</p>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate in — staggered
    requestAnimationFrame(() => {
      overlay.classList.add('lns-visible');
      setTimeout(() => {
        document.getElementById('lnsPaper').classList.add('lns-paper-in');
      }, 200);
    });

    // Close
    overlay.addEventListener('click', closeLetter);
  }

  function closeLetter() {
    const overlay = document.getElementById('lnsOverlay');
    if (!overlay) return;

    overlay.classList.remove('lns-visible');
    overlay.classList.add('lns-closing');

    setTimeout(() => {
      overlay.remove();
      if (window.AudioManager) window.AudioManager.restore(2000);
    }, 900);
  }

  // ── Keyboard listener ────────────────────────────────────────
  function onKeyDown(e) {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) { typed = ''; return; }

    typed += key;
    if (typed.length > target.length + 2) typed = typed.slice(-target.length);

    clearTimeout(timeout);
    timeout = setTimeout(() => { typed = ''; }, 2500);

    if (typed.endsWith(target) && !triggered) {
      triggered = true;
      fire();
      setTimeout(() => { triggered = false; }, 8000);
    }
  }

  function fire() {
    // No fanfare. Just a slow ink-bleed into existence.
    setTimeout(showLetter, 180);
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
