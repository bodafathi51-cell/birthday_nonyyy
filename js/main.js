/* =====================================================================
   Romantic Birthday Website — behaviour & animations
   You do NOT need to edit this file. Everything personal lives in:
       src/data/content.js
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------ helpers & config ------------------------------ */
  var C = window.birthdayContent || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : ms); }); };
  var NAME = (C.recipientName || '').trim() || 'Beautiful';
  var fill = function (t) { return String(t == null ? '' : t).replace(/\{name\}/gi, NAME); };
  var get = function (obj, key, fallback) { return obj && obj[key] != null ? obj[key] : fallback; };
  var hero = C.hero || {}, intro = C.intro || {}, gallery = C.gallery || {}, letter = C.letter || {}, finale = C.finale || {}, music = C.music || {};

  var el = {
    body: document.body, intro: $('#intro'), main: $('#main'), hero: $('#hero'),
    openBtn: $('#openBtn'), startBtn: $('#startBtn'),
    grid: $('#photoGrid'), envelope: $('#envelopeBtn'), envHint: $('#envHint'),
    modal: $('#letterModal'), paperScroll: $('#paperScroll'), closeLetter: $('#letterClose'),
    candle: $('#candleBtn'), after: $('#finaleAfter'), replay: $('#replayBtn'),
    musicBtn: $('#musicBtn'), bgm: $('#bgm'), lightbox: $('#lightbox')
  };

  /* ------------------------------ fill in the text ------------------------------ */
  /* Arabic support: text that is mostly Arabic gets the class "ar" (font/size tweaks in the CSS)
     and dir="auto" so punctuation and emojis land on the correct side. */
  var AR_RE = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g;
  function isAr(t) { t = String(t == null ? '' : t); return (t.match(AR_RE) || []).length > (t.match(/[A-Za-z]/g) || []).length; }
  function mark(n, t) { if (!n) return; n.setAttribute('dir', 'auto'); n.classList.toggle('ar', isAr(t)); }
  function setText(sel, txt) { var n = $(sel); if (n) { n.textContent = fill(txt); mark(n, n.textContent); } }
  function setTitle(sel, txt) { var n = $(sel + ' span'); if (n) { n.textContent = fill(txt); mark($(sel), n.textContent); } }
  function setBtn(n, txt) { n.textContent = fill(txt); mark(n, n.textContent); }
  function setEnvHint(txt) { el.envHint.textContent = fill(txt); mark(el.envHint, el.envHint.textContent); }

  document.title = fill(C.pageTitle || 'Happy Birthday ❤️');
  setText('#introEyebrow', get(intro, 'eyebrow', 'Something special is waiting for you…'));
  setText('#introTitle', get(intro, 'title', 'A little surprise for {name}'));
  setBtn(el.openBtn, get(intro, 'button', 'Open Your Surprise ❤️'));

  var HERO_TEXT = fill(get(hero, 'greeting', 'Happy Birthday, {name}!'));
  $('#heroTitle').setAttribute('aria-label', HERO_TEXT); mark($('#heroTitle'), HERO_TEXT);
  setText('#heroSubtitle', get(hero, 'subtitle', ''));
  setBtn(el.startBtn, get(hero, 'button', 'Start the Celebration ✨'));
  if (C.specialDate) { var d = $('#heroDate'); d.textContent = C.specialDate; mark(d, C.specialDate); d.hidden = false; }

  setTitle('#galleryTitle', get(gallery, 'title', 'Our Beautiful Memories'));
  setText('#gallerySub', get(gallery, 'subtitle', ''));
  setTitle('#letterHeading', get(letter, 'sectionTitle', 'A Letter Just For You'));
  setEnvHint(get(letter, 'hint', 'Tap the envelope to open it'));
  setTitle('#finaleTitle', get(finale, 'title', 'Make a Wish'));
  setText('#finaleHint', get(finale, 'hint', ''));
  setText('#finaleWish', get(finale, 'wish', ''));
  setBtn(el.replay, get(finale, 'replayButton', '↻ Replay the surprise'));
  setText('#footerText', get(finale, 'footer', ''));
  el.envelope.setAttribute('aria-label', fill(get(letter, 'sectionTitle', 'Letter')) + ' — ' + fill(get(letter, 'hint', 'open the envelope')));

  /* ------------------------------ canvas particles (hearts · petals · sparkles) ------------------------------ */
  var fx = (function () {
    var cv = $('#fx'), ctx = cv.getContext('2d');
    var W = 0, H = 0, P = [], mode = 'intro', last = 0, running = false;
    var HEARTS = ['#ff6f91', '#ff9fbb', '#f4617f', '#ffb3c9', '#e8436b'];
    var PETALS = ['#ff9fbb', '#ffb3c9', '#f78fb3', '#ffc9d9'];
    var SPARK = ['#fff', '#ffe9a8', '#ffd36e', '#ffffff'];
    var small = function () { return W < 640; };
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var pick = function (arr) { return arr[(Math.random() * arr.length) | 0]; };

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function target() { // how many ambient particles of each kind
      var k = small() ? .55 : 1;
      return mode === 'intro'
        ? { heart: 6 * k, petal: 3 * k, spark: 6 * k }
        : { heart: 9 * k, petal: 11 * k, spark: 9 * k };
    }
    function count(type) { var n = 0; for (var i = 0; i < P.length; i++) if (P[i].type === type && !P[i].burst) n++; return n; }

    function make(type, initial) {
      var p = { type: type, rot: rnd(-.5, .5), vr: rnd(-.02, .02), phase: rnd(0, 6.28), sway: rnd(.4, 1.2), life: 0, max: 0, alpha: 1, burst: false };
      if (type === 'heart') {
        p.size = rnd(9, 22); p.x = rnd(0, W); p.y = initial ? rnd(0, H) : H + 30; p.vy = -rnd(.35, .95); p.vx = 0; p.color = pick(HEARTS); p.alpha = rnd(.45, .85);
      } else if (type === 'petal') {
        p.size = rnd(9, 17); p.x = rnd(0, W); p.y = initial ? rnd(0, H) : -24; p.vy = rnd(.55, 1.3); p.vx = rnd(-.2, .3); p.vr = rnd(-.05, .05); p.color = pick(PETALS); p.alpha = rnd(.55, .9);
      } else { // sparkle
        p.size = rnd(5, 11); p.x = rnd(0, W); p.y = rnd(0, H); p.vx = 0; p.vy = rnd(-.08, .08); p.color = pick(SPARK); p.max = rnd(2.4, 5); p.life = initial ? rnd(0, p.max) : 0;
      }
      return p;
    }
    function top(type) { P.push(make(type, false)); }

    function burst(x, y, n) {
      if (reduceMotion) return;
      n = n || 26; if (small()) n = Math.round(n * .7);
      for (var i = 0; i < n; i++) {
        var a = rnd(0, 6.283), s = rnd(2, 7.5), isHeart = Math.random() < .7;
        P.push({
          type: isHeart ? 'heart' : (Math.random() < .5 ? 'petal' : 'spark'), burst: true, x: x, y: y,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2.5, size: isHeart ? rnd(10, 22) : rnd(8, 14),
          rot: rnd(-1, 1), vr: rnd(-.12, .12), phase: 0, sway: 0, life: 0, max: rnd(1.3, 2.4), alpha: 1,
          color: isHeart ? pick(HEARTS) : pick(PETALS.concat(SPARK))
        });
      }
    }

    function drawHeart(s) {
      ctx.beginPath(); ctx.moveTo(0, s * .3);
      ctx.bezierCurveTo(-s, -s * .25, -s * .55, -s * .95, 0, -s * .42);
      ctx.bezierCurveTo(s * .55, -s * .95, s, -s * .25, 0, s * .3); ctx.fill();
    }
    function drawPetal(s) {
      ctx.beginPath(); ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * .9, -s * .5, s * .6, s * .6, 0, s);
      ctx.bezierCurveTo(-s * .6, s * .6, -s * .9, -s * .5, 0, -s); ctx.fill();
    }
    function drawSpark(s) {
      ctx.beginPath(); ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
    }

    function frame(t) {
      if (!running) return;
      var dt = Math.min((t - last) / 16.67, 3) || 1; last = t;
      ctx.clearRect(0, 0, W, H);

      var tg = target(), types = ['heart', 'petal', 'spark'], keys = ['heart', 'petal', 'spark'];
      for (var k = 0; k < 3; k++) if (count(types[k]) < tg[keys[k]] && Math.random() < .06 * dt) top(types[k]);

      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i];
        p.life += dt / 60;
        if (p.burst) { p.vy += .13 * dt; p.vx *= .985; p.alpha = Math.max(0, 1 - p.life / p.max); }
        else if (p.type === 'spark') { p.alpha = Math.sin(Math.PI * Math.min(p.life / p.max, 1)); }
        p.phase += .02 * dt;
        p.x += (p.vx + (p.burst ? 0 : Math.sin(p.phase) * p.sway)) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        var dead = p.burst ? p.life >= p.max : (p.type === 'spark' ? p.life >= p.max : (p.y < -40 || p.y > H + 40 || p.x < -60 || p.x > W + 60));
        if (dead) { P.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.type === 'heart' && !p.burst ? Math.sin(p.phase) * .25 : p.rot);
        ctx.fillStyle = p.color;
        if (p.type === 'heart') drawHeart(p.size);
        else if (p.type === 'petal') drawPetal(p.size);
        else { ctx.shadowColor = p.color; ctx.shadowBlur = 8; drawSpark(p.size); }
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (reduceMotion || running) return;
      running = true; last = performance.now();
      for (var i = 0; i < 6; i++) P.push(make('spark', true));
      requestAnimationFrame(frame);
    }
    function setMode(m) { mode = m; }

    window.addEventListener('resize', resize); resize();
    return { start: start, burst: burst, setMode: setMode };
  })();

  /* ------------------------------ background music ------------------------------ */
  var musicOk = false, musicOn = false;
  (function initMusic() {
    if (!music.file) return;
    el.bgm.volume = Math.max(0, Math.min(1, get(music, 'volume', .6)));
    el.bgm.preload = 'metadata';
    el.bgm.addEventListener('loadedmetadata', function () { musicOk = true; });
    el.bgm.addEventListener('error', function () { musicOk = false; el.musicBtn.hidden = true; });
    el.bgm.src = music.file;
  })();
  function setMusic(on) {
    musicOn = on;
    el.musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.musicBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    if (on) { var pr = el.bgm.play(); if (pr && pr.catch) pr.catch(function () { setMusic(false); }); } else el.bgm.pause();
  }
  el.musicBtn.addEventListener('click', function () { setMusic(!musicOn); });

  /* ------------------------------ gallery ------------------------------ */
  var placeholder = function (n) {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffd6e2'/><stop offset='1' stop-color='#ffaac4'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><text x='400' y='470' font-size='170' text-anchor='middle'>❤</text><text x='400' y='620' font-family='sans-serif' font-size='42' fill='#963255' text-anchor='middle'>Photo not found</text><text x='400' y='680' font-family='monospace' font-size='28' fill='#963255' text-anchor='middle'>" + String(n).replace(/[<>&']/g, '') + "</text></svg>";
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };
  var photoObserver = null;
  function buildGallery() {
    el.grid.innerHTML = '';
    var photos = Array.isArray(gallery.photos) ? gallery.photos : [];
    photos.forEach(function (ph, i) {
      var caption = fill(ph.caption || '');
      var fig = document.createElement('figure'); fig.className = 'photo-card';
      var frame = document.createElement('div'); frame.className = 'photo-frame';
      var open = document.createElement('button'); open.type = 'button'; open.className = 'photo-open';
      open.setAttribute('aria-label', 'View photo larger' + (caption ? ': ' + caption : ''));
      var img = document.createElement('img'); img.alt = caption || ('Photo ' + (i + 1)); img.decoding = 'async';
      img.addEventListener('load', function () { img.classList.add('is-loaded'); });
      img.addEventListener('error', function () { if (img.dataset.fallback) return; img.dataset.fallback = '1'; img.src = placeholder(ph.src); });
      img.src = ph.src;
      open.appendChild(img);
      if (caption) { var cap = document.createElement('span'); cap.className = 'photo-caption'; cap.textContent = caption; mark(cap, caption); open.appendChild(cap); }
      var like = document.createElement('button'); like.type = 'button'; like.className = 'like-btn'; like.textContent = '♥';
      like.setAttribute('aria-pressed', 'false'); like.setAttribute('aria-label', 'Like this photo');
      like.addEventListener('click', function () {
        var on = like.getAttribute('aria-pressed') !== 'true';
        like.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) { var r = like.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height / 2, 12); }
      });
      open.addEventListener('click', function () { openLightbox(img.currentSrc || img.src, caption, open); });
      frame.appendChild(open); frame.appendChild(like); fig.appendChild(frame); el.grid.appendChild(fig);
    });
    observePhotos();
  }
  function observePhotos() {
    if (photoObserver) photoObserver.disconnect();
    var cards = Array.prototype.slice.call(el.grid.children);
    if (reduceMotion || !('IntersectionObserver' in window)) { cards.forEach(function (c) { c.classList.add('is-in'); }); return; }
    photoObserver = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return cards.indexOf(a.target) - cards.indexOf(b.target); });
      vis.forEach(function (e, i) { // reveal one by one
        photoObserver.unobserve(e.target);
        setTimeout(function () { e.target.classList.add('is-in'); }, i * 170);
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    cards.forEach(function (c) { photoObserver.observe(c); });
  }

  /* ------------------------------ focus-trapped dialogs ------------------------------ */
  var lastFocus = null;
  function trap(container, e) {
    if (e.key !== 'Tab') return;
    var f = container.querySelectorAll('button:not([hidden]),[tabindex="0"]');
    if (!f.length) return;
    var first = f[0], lastEl = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
  }

  /* photo viewer */
  function openLightbox(src, caption, opener) {
    lastFocus = opener; var img = $('#lightboxImg');
    img.src = src; img.alt = caption || ''; $('#lightboxCap').textContent = caption; mark($('#lightboxCap'), caption);
    el.lightbox.hidden = false; el.body.classList.add('modal-open');
    void el.lightbox.offsetWidth; el.lightbox.classList.add('is-visible'); $('#lightboxClose').focus();
  }
  async function closeLightbox() {
    el.lightbox.classList.remove('is-visible'); await wait(350);
    el.lightbox.hidden = true; if (!el.modal.classList.contains('is-visible')) el.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  el.lightbox.addEventListener('click', function (e) { if (e.target === el.lightbox || e.target.tagName === 'FIGURE') closeLightbox(); });
  el.lightbox.addEventListener('keydown', function (e) { trap(el.lightbox, e); });

  /* ------------------------------ envelope & letter ------------------------------ */
  var envBusy = false;
  function paragraphs(text) { // blank line → new paragraph, single line break → <br>
    return String(text || '').replace(/\r\n?/g, '\n').split(/\n[ \t]*\n+/).map(function (blk) {
      return blk.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    }).filter(function (lines) { return lines.length; });
  }
  function buildLetter() {
    $('#letterTitle').textContent = fill(get(letter, 'title', 'A Letter For You')); mark($('#letterTitle'), $('#letterTitle').textContent);
    var sal = $('#letterSalutation'); sal.textContent = fill(get(letter, 'salutation', '')); sal.hidden = !sal.textContent; mark(sal, sal.textContent);
    var body = $('#letterBody'); body.innerHTML = '';
    var paras = paragraphs(fill(get(letter, 'message', '')));
    var step = Math.min(.55, 3.2 / Math.max(paras.length, 1)), t = .9; // keeps long letters from taking forever
    var title = $('#letterTitle'); title.classList.add('line'); title.style.setProperty('--d', '.5s');
    sal.classList.add('line'); sal.style.setProperty('--d', '.8s');
    paras.forEach(function (lines) {
      var p = document.createElement('p'); p.className = 'line'; mark(p, lines.join(' ')); p.style.setProperty('--d', t.toFixed(2) + 's');
      lines.forEach(function (l, i) { if (i) p.appendChild(document.createElement('br')); p.appendChild(document.createTextNode(l)); });
      body.appendChild(p); t += step;
    });
    var sig = $('#letterSignature'); sig.textContent = fill(get(letter, 'signature', '')); sig.hidden = !sig.textContent; mark(sig, sig.textContent);
    sig.classList.add('line'); sig.style.setProperty('--d', (t + .1).toFixed(2) + 's');
    var dt = $('#letterDate'); dt.textContent = fill(get(letter, 'date', '')); dt.hidden = !dt.textContent; mark(dt, dt.textContent);
    dt.classList.add('line'); dt.style.setProperty('--d', (t + .3).toFixed(2) + 's');
    var seal = $('.paper__seal'); seal.classList.add('line'); seal.style.setProperty('--d', (t + .5).toFixed(2) + 's');
    el.paperScroll.scrollTop = 0;
  }
  async function showLetter() {
    lastFocus = el.envelope; buildLetter();
    el.modal.hidden = false; el.body.classList.add('modal-open');
    void el.modal.offsetWidth; el.modal.classList.add('is-visible');
    var r = el.envelope.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height * .3, 22);
    await wait(300); el.closeLetter.focus({ preventScroll: true });
  }
  async function hideLetter() {
    if (el.modal.hidden) return;
    el.modal.classList.remove('is-visible'); await wait(520);
    el.modal.hidden = true; el.body.classList.remove('modal-open'); envBusy = false;
    setEnvHint(get(letter, 'reopenHint', 'Tap to read it again'));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  async function openEnvelope() {
    if (envBusy) return; envBusy = true;
    if (el.envelope.classList.contains('is-open')) { showLetter(); return; }
    el.envelope.classList.add('is-open'); el.envelope.setAttribute('aria-expanded', 'true');
    await wait(1900); showLetter();
  }
  el.envelope.addEventListener('click', openEnvelope);
  el.closeLetter.addEventListener('click', hideLetter);
  el.modal.addEventListener('click', function (e) { if (e.target === el.modal) hideLetter(); });
  el.modal.addEventListener('keydown', function (e) { trap(el.modal, e); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!el.lightbox.hidden) closeLightbox(); else if (!el.modal.hidden) hideLetter();
  });

  /* ------------------------------ finale: candle ------------------------------ */
  el.candle.addEventListener('click', function () {
    if (el.candle.classList.contains('is-out')) return;
    el.candle.classList.add('is-out');
    var r = el.candle.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + 30, 46);
    setTimeout(function () { fx.burst(window.innerWidth * .25, r.top, 22); fx.burst(window.innerWidth * .75, r.top, 22); }, reduceMotion ? 0 : 350);
    el.after.textContent = fill(get(finale, 'afterWish', 'Your wish is on its way ✨')); mark(el.after, el.after.textContent);
    el.after.classList.add('is-shown');
  });

  /* ------------------------------ typewriter ------------------------------ */
  var typeToken = 0;
  async function typeHero() {
    var my = ++typeToken, out = $('#heroTitle .typed'); out.textContent = '';
    el.hero.classList.remove('is-typed');
    if (reduceMotion) { out.textContent = HERO_TEXT; el.hero.classList.add('is-typed'); return; }
    var chars = (window.Intl && Intl.Segmenter) // keeps emojis & Arabic letters with their marks together
      ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(HERO_TEXT), function (s) { return s.segment; })
      : Array.from(HERO_TEXT);
    for (var i = 0; i < chars.length; i++) {
      if (my !== typeToken) return;
      out.textContent += chars[i];
      await wait(chars[i] === ',' ? 260 : 70);
    }
    await wait(250); if (my === typeToken) el.hero.classList.add('is-typed');
  }

  /* ------------------------------ parallax ------------------------------ */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-speed]')), ticking = false;
  function parallax() {
    ticking = false; var y = window.scrollY;
    if (y > window.innerHeight * 1.5) return;
    parallaxEls.forEach(function (n) { n.style.translate = '0 ' + (y * parseFloat(n.dataset.speed)).toFixed(1) + 'px'; });
  }
  if (!reduceMotion) window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });

  /* ------------------------------ twinkling stars ------------------------------ */
  (function stars() {
    var box = $('#stars'), n = window.innerWidth < 640 ? 18 : 34;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('i');
      s.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;--s:' + (6 + Math.random() * 12).toFixed(0) + 'px;--t:' + (2 + Math.random() * 3).toFixed(1) + 's;--dl:-' + (Math.random() * 4).toFixed(1) + 's';
      box.appendChild(s);
    }
  })();

  /* ------------------------------ intro → main ------------------------------ */
  var opened = false;
  async function openSurprise() {
    if (opened) return; opened = true;
    var r = el.openBtn.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height / 2, 44);
    fx.setMode('main');
    if (musicOk) { el.musicBtn.hidden = false; setMusic(true); }
    el.main.hidden = false;
    el.intro.classList.add('is-leaving');
    await wait(500); el.body.classList.remove('is-locked');
    window.scrollTo(0, 0); typeHero();
    await wait(800); el.intro.hidden = true;
  }
  el.openBtn.addEventListener('click', openSurprise);
  el.startBtn.addEventListener('click', function () {
    var r = el.startBtn.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top + r.height / 2, 26);
    $('#gallery').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------ replay ------------------------------ */
  el.replay.addEventListener('click', async function () {
    var r = el.replay.getBoundingClientRect(); fx.burst(r.left + r.width / 2, r.top, 30);
    await wait(500);
    // reset everything
    typeToken++; opened = false; envBusy = false; setMusic(false); el.bgm.currentTime = 0;
    el.musicBtn.hidden = true;
    el.modal.classList.remove('is-visible'); el.modal.hidden = true; el.lightbox.hidden = true; el.lightbox.classList.remove('is-visible');
    el.envelope.classList.remove('is-open'); el.envelope.setAttribute('aria-expanded', 'false');
    setEnvHint(get(letter, 'hint', 'Tap the envelope to open it'));
    el.candle.classList.remove('is-out'); el.after.classList.remove('is-shown'); el.after.textContent = '';
    el.hero.classList.remove('is-typed'); $('#heroTitle .typed').textContent = '';
    Array.prototype.forEach.call(el.grid.querySelectorAll('.like-btn'), function (b) { b.setAttribute('aria-pressed', 'false'); });
    Array.prototype.forEach.call(el.grid.children, function (c) { c.classList.remove('is-in'); });
    parallaxEls.forEach(function (n) { n.style.translate = ''; });
    fx.setMode('intro');
    el.body.classList.add('is-locked'); el.body.classList.remove('modal-open');
    window.scrollTo({ top: 0, behavior: 'auto' });
    el.main.hidden = true; el.intro.hidden = false;
    void el.intro.offsetWidth; el.intro.classList.remove('is-leaving');
    observePhotos(); el.openBtn.focus({ preventScroll: true });
  });

  /* ------------------------------ go! ------------------------------ */
  buildGallery();
  fx.start();
})();
