/* Healora — page behaviour. No dependencies; Lenis is loaded lazily. */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* ---------- GSAP motion: subtle, transform + opacity only ---------- */
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const motion = !reduceMotion && gsap && ScrollTrigger;

  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'expo.out', duration: 1.1 });
    const $ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
    // CSS hover transitions on transform would fight the tween, so pause them while it runs.
    const guard = (targets) => ({
      onStart: () => targets.forEach((t) => t.classList.add('is-tweening')),
      onComplete: () => targets.forEach((t) => { t.classList.remove('is-tweening'); gsap.set(t, { clearProps: 'transform,opacity' }); }),
    });
    const rise = (targets, trigger, vars = {}) => {
      const list = (Array.isArray(targets) ? targets : [targets])
        .flatMap((t) => (typeof t === 'string' ? $(t) : [t])).filter(Boolean);
      if (!list.length) return null;
      return gsap.from(list, {
        y: 32, autoAlpha: 0, stagger: 0.09, ...guard(list), ...vars,
        scrollTrigger: { trigger: document.querySelector(trigger) || list[0], start: 'top 82%', once: true },
      });
    };

    /* hero intro */
    const hero = document.querySelector('.hero');
    const intro = gsap.timeline({ defaults: { duration: 1.2 } });
    intro
      .from('.hero__bg', { scale: 1.08, duration: 2.2, ease: 'power3.out' }, 0)
      .from('.nav', { y: -24, autoAlpha: 0, ...guard([document.querySelector('.nav')]) }, 0.1)
      .from('.hero__title', { y: 46, autoAlpha: 0 }, 0.2)
      .from('.hero__lead', { y: 30, autoAlpha: 0 }, 0.34)
      .from('.hero__cta', { y: 26, autoAlpha: 0, ...guard([document.querySelector('.hero__cta')]) }, 0.44)
      .from('.hero__stat', { y: 30, autoAlpha: 0 }, 0.56)
      .from('.tags li:not(.tags__break)', { y: 18, autoAlpha: 0, stagger: 0.06 }, 0.6)
      .from(['.hero__side-title', '.hero__side p'], { y: 20, autoAlpha: 0, stagger: 0.08 }, 0.75);
    root.classList.remove('anim-pending');
    // gentle parallax as the hero scrolls away
    gsap.to('.hero__bg', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner', { y: -40, autoAlpha: 0.4, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: true } });

    /* about */
    rise('.about__copy > *', '.about__copy', { stagger: 0.1 });
    rise(['.about__img--a'], '.about', { y: 50, rotate: -2 });
    rise(['.about__img--b'], '.about__img--b', { y: 50, rotate: 2 });

    /* services */
    gsap.from('.services__media img', { scale: 1.12, duration: 1.8, scrollTrigger: { trigger: '.services__media', start: 'top 85%', once: true } });
    rise(['.services__media'], '.services__media', { y: 40 });
    rise('.services__badge > *', '.services__media', { x: -16, y: 0, delay: 0.35 });
    rise('.services__body > :not(.scards)', '.services__body');
    rise('.scard', '.scards', { y: 40, stagger: 0.12 });

    /* experts */
    rise(['.experts__hero'], '.experts__media', { y: 40 });
    rise('.experts__tiles > *', '.experts__tiles', { y: 36, stagger: 0.12 });
    gsap.from('.sarah img', { scale: 1.12, duration: 1.8, scrollTrigger: { trigger: '.sarah', start: 'top 88%', once: true } });
    rise('.experts__body > :not(.team)', '.experts__body');
    rise('.pcard', '.team', { y: 30, stagger: 0.08 });

    /* testimonial */
    rise(['.story'], '.testimonial', { x: -40, y: 0 });
    rise(['.testimonial__img'], '.testimonial', { y: 50, delay: 0.1 });
    rise(['.testimonial .person'], '.testimonial__body', { delay: 0.2 });
    gsap.from('.rating__stars svg', { scale: 0, autoAlpha: 0, stagger: 0.07, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: '.rating', start: 'top 88%', once: true } });
    rise(['.rating > span:last-child', '.testimonial blockquote'], '.testimonial__quote', { delay: 0.15 });

    /* blog */
    rise(['.blog .eyebrow', '.blog__title'], '.blog');
    rise(['.post'], '.post', { y: 50 });
    rise('.post__body > *', '.post', { y: 22, stagger: 0.08, delay: 0.25 });

    /* contact */
    rise(['.contact .eyebrow', '.contact__title'], '.contact');
    rise(['.form'], '.contact__grid', { x: -36, y: 0 });
    rise(['.contact__media'], '.contact__grid', { x: 36, y: 0 });
    gsap.from('.contact__media img', { scale: 1.1, duration: 1.8, scrollTrigger: { trigger: '.contact__media', start: 'top 85%', once: true } });
    rise(['.quote-card'], '.contact__media', { y: 30, delay: 0.35 });

    /* footer */
    rise('.footer__cell', '.footer', { y: 28, stagger: 0.1 });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    root.classList.remove('anim-pending');
  }

  /* ---------- fixed header state ---------- */
  const navEl = document.querySelector('.nav');
  const onScroll = () => navEl.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  const closeBtn = menu.querySelector('.menu__close');
  const focusables = () => [...menu.querySelectorAll('a, button')];

  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };
  menu.inert = true;
  burger.addEventListener('click', () => {
    setMenu(true);
    requestAnimationFrame(() => closeBtn.focus());
  });
  closeBtn.addEventListener('click', () => { setMenu(false); burger.focus(); });
  menu.addEventListener('click', (e) => {
    if (e.target === menu || e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setMenu(false); burger.focus(); return; }
    if (e.key !== 'Tab') return;
    const list = focusables();
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- service cards: hover / focus moves the active state ---------- */
  const cards = [...document.querySelectorAll('.scard')];
  const activate = (card) => cards.forEach((c) => c.classList.toggle('is-active', c === card));
  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => activate(card));
    card.addEventListener('focusin', () => activate(card));
  });

  /* ---------- blog carousel ---------- */
  const posts = [
    { img: 'assets/img/blog.webp', alt: 'Nurse walking with an older patient down a bright hospital corridor', date: '2025-05-05', label: '05, May 2025',
      title: 'The therapy sessions helped me rediscover <br class="br-lg">hope, build emotional strength, and find a sense <br class="br-lg">of peace and clarity I never thought possible before.',
      author: 'Brooklyn Simmons', role: 'Behavioral Therapist', avatar: 'assets/img/av-author.webp' },
    { img: 'assets/img/expert.webp', alt: 'Therapist gesturing while speaking during a session', date: '2025-04-18', label: '18, Apr 2025',
      title: 'Five small daily habits that quietly protect your mental health — and how to make them stick when life gets busy.',
      author: 'Emily Roberts', role: 'Clinical Psychologist', avatar: 'assets/img/av-emily.webp' },
    { img: 'assets/img/contact.webp', alt: 'Doctor consulting with a girl and her father in a clinic', date: '2025-03-29', label: '29, Mar 2025',
      title: 'Talking to children about anxiety: gentle, practical ways families can open the conversation and keep it going.',
      author: 'Dr. Daniel Hoque', role: 'Behavioral Therapist', avatar: 'assets/img/av-daniel.webp' },
  ];
  const post = document.querySelector('.post');
  if (post) {
    const el = {
      img: post.querySelector('.post__img'), date: post.querySelector('.post__date'), title: post.querySelector('.post__title'),
      author: post.querySelector('.post__author'), role: post.querySelector('.post__role'), avatar: post.querySelector('.post__avatar'),
    };
    let index = 0;
    const render = (p) => {
      el.img.src = p.img; el.img.alt = p.alt;
      el.date.dateTime = p.date; el.date.textContent = p.label;
      el.title.innerHTML = p.title; // static, trusted strings defined above
      el.author.textContent = p.author; el.role.textContent = p.role;
      el.avatar.src = p.avatar;
    };
    post.querySelectorAll('.post__btn').forEach((btn) => btn.addEventListener('click', () => {
      index = (index + Number(btn.dataset.dir) + posts.length) % posts.length;
      if (reduceMotion) { render(posts[index]); return; }
      post.classList.add('is-swapping');
      setTimeout(() => { render(posts[index]); post.classList.remove('is-swapping'); }, 280);
    }));
    posts.slice(1).forEach((p) => { const i = new Image(); i.loading = 'lazy'; i.src = p.img; });
  }

  /* ---------- forms ---------- */
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const contact = document.querySelector('.form');
  if (contact) {
    const status = contact.querySelector('.form__status');
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstBad = null;
      contact.querySelectorAll('input, textarea').forEach((f) => {
        const bad = !f.value.trim() || (f.type === 'email' && !isEmail(f.value));
        f.classList.toggle('is-invalid', bad);
        f.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) { status.textContent = 'Please complete every field with a valid email.'; firstBad.focus(); return; }
      status.textContent = 'Thank you — a member of our care team will reply within one working day.';
      contact.reset();
    });
    contact.addEventListener('input', (e) => { e.target.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); });
  }

  const subscribe = document.querySelector('.subscribe');
  if (subscribe) {
    subscribe.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = subscribe.querySelector('input');
      if (!isEmail(input.value)) { input.focus(); input.setAttribute('aria-invalid', 'true'); return; }
      input.removeAttribute('aria-invalid');
      input.value = '';
      input.placeholder = 'Subscribed — thank you!';
      subscribe.classList.add('is-done');
    });
  }

  /* ---------- smooth scroll (deferred, skipped for reduced motion) ---------- */
  if (reduceMotion) return;
  const loadLenis = () => {
    const s = document.createElement('script');
    s.src = 'assets/vendor/lenis.min.js';
    s.async = true;
    s.onload = () => {
      if (!window.Lenis) return;
      const lenis = new window.Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
      window.__lenis = lenis;
      if (motion) {
        // drive Lenis from GSAP's ticker so ScrollTrigger and smooth scroll share one clock
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
      document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      }));
    };
    document.head.appendChild(s);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(loadLenis, { timeout: 2500 });
  else setTimeout(loadLenis, 1500);
})();
