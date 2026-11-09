/* ==========================================================================
   site.js — shared interaction layer for drsusanbesman.com
   Works on every page with no HTML changes. Each feature checks that the
   elements it needs exist, so a page missing one simply skips it.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var header = document.querySelector('header.site');
    var nav = document.querySelector('nav.main');
    var main = document.querySelector('main');

    /* 1. Skip-to-content link for keyboard & screen-reader users */
    if (main && !document.querySelector('.skip')) {
      if (!main.id) main.id = 'main';
      main.setAttribute('tabindex', '-1');
      var skip = document.createElement('a');
      skip.className = 'skip';
      skip.href = '#' + main.id;
      skip.textContent = 'Skip to content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    /* 2. Phone number in the header, taken from the footer's tel: link */
    if (nav && !nav.querySelector('.nav-phone')) {
      var tel = document.querySelector('footer a[href^="tel:"]');
      if (tel) {
        var ph = document.createElement('a');
        ph.className = 'nav-phone';
        ph.href = tel.getAttribute('href');
        ph.innerHTML = PHONE_ICON + '<span>' + tel.textContent.trim() + '</span>';
        ph.setAttribute('aria-label', 'Call ' + tel.textContent.trim());
        var cta = nav.querySelector('.btn');
        nav.insertBefore(ph, cta || null);
      }
    }

    /* 3. Mobile menu */
    if (header && nav) {
      if (!nav.id) nav.id = 'site-nav';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-toggle';
      btn.setAttribute('aria-controls', nav.id);
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span>';
      header.insertBefore(btn, nav);

      var setOpen = function (open) {
        nav.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
      };
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        setOpen(open);
        if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
      });
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('open') && !header.contains(e.target)) setOpen(false);
      });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
      window.matchMedia('(min-width: 1301px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
    }

    /* 4. Header tightens once the page scrolls */
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 24); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* 5. Let screen-reader users know which links open a new tab */
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      if (a.querySelector('.sr-only')) return;
      var s = document.createElement('span');
      s.className = 'sr-only';
      s.textContent = ' (opens in a new tab)';
      a.appendChild(s);
    });

    /* 6. Animated arrows: wrap a trailing "→" so it can slide on hover */
    document.querySelectorAll('.more, .ghost').forEach(function (el) {
      var last = el.lastChild;
      if (last && last.nodeType === 3 && /→\s*$/.test(last.nodeValue)) {
        last.nodeValue = last.nodeValue.replace(/\s*→\s*$/, ' ');
        var arr = document.createElement('span');
        arr.className = 'arr';
        arr.setAttribute('aria-hidden', 'true');
        arr.textContent = '→';
        el.appendChild(arr);
      }
    });

    /* 7. Hero video: pause/play button (WCAG 2.2.2) and pause when off-screen */
    var vhero = document.querySelector('.vhero');
    var video = vhero && vhero.querySelector('video');
    if (video && !reduceMotion) {
      var userPaused = false;
      var PAUSE = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>';
      var PLAY = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5z"/></svg>';
      var vbtn = document.createElement('button');
      vbtn.type = 'button';
      vbtn.className = 'vctl';
      var paint = function () {
        var paused = video.paused;
        vbtn.innerHTML = paused ? PLAY : PAUSE;
        vbtn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
      };
      vbtn.addEventListener('click', function () {
        if (video.paused) { userPaused = false; video.play(); } else { userPaused = true; video.pause(); }
      });
      video.addEventListener('play', paint);
      video.addEventListener('pause', paint);
      vhero.appendChild(vbtn);
      paint();
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) { if (!userPaused) { var p = video.play(); if (p && p.catch) p.catch(function () {}); } }
            else video.pause();
          });
        }).observe(vhero);
      }
    }

    /* 8. Forms: show "Sending…" so people know it worked */
    document.querySelectorAll('form.nform').forEach(function (f) {
      f.addEventListener('submit', function () {
        var b = f.querySelector('button[type="submit"]');
        if (b) { b.disabled = true; b.dataset.label = b.textContent; b.textContent = 'Sending…'; }
      });
    });
    window.addEventListener('pageshow', function () {
      document.querySelectorAll('form.nform button[disabled]').forEach(function (b) {
        b.disabled = false; if (b.dataset.label) b.textContent = b.dataset.label;
      });
    });

    /* 9. Mobile "Schedule" bar steps aside when the main booking section is on screen */
    var mcta = document.querySelector('.mcta');
    var bigCta = document.querySelector('section.cta');
    if (mcta && bigCta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { mcta.classList.toggle('hide', e.isIntersecting); });
      }, { threshold: 0.2 }).observe(bigCta);
    }

    /* 10. Gentle fade-up of content as it scrolls into view */
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var groups = ['.cards', '.steps', '.paths', '.pills', '.facts'];
      var singles = '.split > *, .pillar, .meet, .soon, .faq, .lede, .med, .pull, .postimg';
      var targets = [];
      groups.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (g) {
          Array.prototype.forEach.call(g.children, function (c, i) {
            c.style.setProperty('--d', Math.min(i, 6) * 0.08 + 's');
            targets.push(c);
          });
        });
      });
      document.querySelectorAll(singles).forEach(function (el) { targets.push(el); });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach(function (el) {
        // Anything already on screen at load stays visible: no flash
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) return;
        el.classList.add('rv');
        io.observe(el);
      });
    }
  });
})();
