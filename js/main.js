/**
 * Portfolio interactions — vanilla JS replacement for Next.js/React
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initSpotlight() {
    const container = document.querySelector('.group\\/spotlight, [class*="group/spotlight"]');
    if (!container) return;

    let spotlight = container.querySelector('[data-spotlight]');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.setAttribute('data-spotlight', '');
      spotlight.className =
        'pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute';
      container.insertBefore(spotlight, container.firstChild);
    }

    const update = (x, y) => {
      spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
    };

    update(0, 0);

    if (prefersReducedMotion) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      update(e.clientX - rect.left, e.clientY - rect.top);
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', () => update(0, 0));
  }

  function initScrollSpy() {
    const nav = document.querySelector('.nav');
    if (!nav || window.innerWidth < 1024) return;

    const sections = ['about', 'experience', 'projects']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const links = nav.querySelectorAll('a[href*="#"]');
    const activeClass = 'active';

    const setActive = (id) => {
      links.forEach((link) => {
        const hash = link.getAttribute('href').split('#')[1];
        link.classList.toggle(activeClass, hash === id);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) observer.disconnect();
    });
  }

  function initTimeTravel() {
    const trigger = document.getElementById('time-travel-trigger');
    const modal = document.getElementById('time-travel-modal');
    if (!trigger || !modal) return;

    const overlay = modal.querySelector('.DialogOverlay');
    const content = modal.querySelector('.DialogContent');
    const closeBtn = modal.querySelector('[data-dialog-close]');

    const versions = [
      { title: 'v1', label: 'version 1', url: 'https://v1.brittanychiang.com', image: 'images/old/v1.png' },
      { title: 'v2', label: 'version 2', url: 'https://v2.brittanychiang.com', image: 'images/old/v2.png' },
      { title: 'v3', label: 'version 3', url: 'https://v3.brittanychiang.com', image: 'images/old/v3.png' },
      { title: 'v4', label: 'version 4', url: 'https://v4.brittanychiang.com', image: 'images/old/v4.png' },
    ];

    const closeIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7" aria-hidden="true"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"></path></svg>';

    const versionList = versions
      .map(
        (v) => `
      <li>
        <a class="group relative block transition-all" href="${v.url}" aria-label="brittanychiang.com ${v.label}" target="_blank" rel="noreferrer noopener">
          <img class="mx-auto rounded border-2 border-zinc-900/30 drop-shadow-md group-hover:drop-shadow-xl" src="${v.image}" alt="Screenshot of brittanychiang.com ${v.label}" width="180" height="48" loading="lazy" />
          <div class="absolute left-0 top-0 hidden h-full w-full items-center justify-center rounded border-4 border-teal-400/0 bg-zinc-900/30 align-middle opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:flex">
            <h3 class="not-sr-only text-xl font-semibold text-white">${v.title}</h3>
          </div>
        </a>
      </li>`
      )
      .join('');

    modal.innerHTML = `
      <div class="DialogOverlay portal fixed left-0 top-0 z-40 h-screen w-screen bg-slate-900/10 backdrop-blur transition" data-state="closed" data-dialog-overlay>
        <div class="portal-inner">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
      <div class="DialogContent fixed left-1/2 top-1/2 z-40 flex h-full w-full -translate-x-1/2 -translate-y-1/2 justify-center rounded sm:items-center" data-state="closed" role="dialog" aria-modal="true" aria-labelledby="time-travel-title">
        <button type="button" class="absolute right-0 top-0 p-4 hover:text-slate-200 focus-visible:text-slate-200" aria-label="Close" data-dialog-close>${closeIcon}</button>
        <div style="perspective:400px">
          <div class="star-wars-skew">
            <h2 id="time-travel-title" class="mx-auto mb-12 max-w-xs text-center text-2xl font-semibold leading-tight tracking-tight text-slate-700 sm:text-3xl lg:max-w-md lg:text-4xl">Looking for a different site? Go back in time...</h2>
            <div class="flex justify-center">
              <ul class="inline-grid grid-cols-1 gap-2 md:grid-cols-2" aria-label="Previous iterations of brittanychiang.com">${versionList}</ul>
            </div>
          </div>
        </div>
        <a class="absolute inset-x-0 bottom-0 z-40 block p-8 text-center text-xs text-slate-500 underline hover:text-slate-200 focus-visible:text-slate-200 sm:left-auto md:p-4" href="https://codepen.io/jasesmith/pen/qqgvZe" target="_blank" rel="noreferrer noopener" aria-label="Credit: A Portal to Tomorrow by @jasesmith (opens in a new tab)">Credit: A Portal to Tomorrow by @jasesmith</a>
      </div>`;

    const overlayEl = modal.querySelector('[data-dialog-overlay]');
    const contentEl = modal.querySelector('.DialogContent');
    const closeEl = modal.querySelector('[data-dialog-close]');

    const open = () => {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      overlayEl.setAttribute('data-state', 'open');
      contentEl.setAttribute('data-state', 'open');
      document.body.style.overflow = 'hidden';
      closeEl.focus();
    };

    const close = () => {
      overlayEl.setAttribute('data-state', 'closed');
      contentEl.setAttribute('data-state', 'closed');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      const duration = prefersReducedMotion ? 0 : 500;
      window.setTimeout(() => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        trigger.focus();
      }, duration);
    };

    trigger.addEventListener('click', open);
    closeEl.addEventListener('click', close);
    overlayEl.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });
  }

  function init() {
    initSpotlight();
    initScrollSpy();
    initTimeTravel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
