// Multi-layer parallax starfield with subtle twinkle and slow drift.
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let stars = [];
  let nebula = [];
  let scrollY = 0;
  let density = 1.0; // controlled by tweaks
  let running = true;

  function rng(seed) {
    let s = seed | 0;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }
  const rand = rng(420691);

  function build() {
    stars = [];
    const area = W * H;
    const count = Math.floor((area / 1800) * density);
    for (let i = 0; i < count; i++) {
      const layer = Math.floor(rand() * 3); // 0 far, 1 mid, 2 near
      const r = layer === 2 ? rand() * 1.4 + 0.6 : layer === 1 ? rand() * 0.9 + 0.4 : rand() * 0.6 + 0.25;
      stars.push({
        x: rand() * W,
        y: rand() * H,
        r,
        layer,
        baseAlpha: 0.25 + rand() * 0.65,
        twinkleSpeed: 0.4 + rand() * 1.6,
        twinklePhase: rand() * Math.PI * 2,
        hue: rand() < 0.08 ? (rand() < 0.5 ? 'warm' : 'cool') : 'white'
      });
    }
    // Nebula blobs (subtle)
    nebula = [
      { x: W * 0.18, y: H * 0.22, r: Math.max(W, H) * 0.45, color: 'rgba(244,162,97,0.045)' },
      { x: W * 0.85, y: H * 0.78, r: Math.max(W, H) * 0.5, color: 'rgba(142,202,230,0.035)' },
      { x: W * 0.55, y: H * 1.4, r: Math.max(W, H) * 0.6, color: 'rgba(231,111,81,0.03)' },
    ];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  let t0 = performance.now();
  function frame(now) {
    if (!running) { requestAnimationFrame(frame); return; }
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    // Nebula
    for (const n of nebula) {
      const g = ctx.createRadialGradient(n.x, n.y - scrollY * 0.05, 0, n.x, n.y - scrollY * 0.05, n.r);
      g.addColorStop(0, n.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Stars
    for (const s of stars) {
      const parallax = s.layer === 0 ? 0.02 : s.layer === 1 ? 0.08 : 0.18;
      const py = s.y - scrollY * parallax;
      const wrappedY = ((py % H) + H) % H;
      const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      const a = s.baseAlpha * (0.55 + 0.45 * tw);
      if (s.hue === 'warm') ctx.fillStyle = `rgba(255, 208, 147, ${a})`;
      else if (s.hue === 'cool') ctx.fillStyle = `rgba(170, 210, 235, ${a})`;
      else ctx.fillStyle = `rgba(236, 230, 214, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x, wrappedY, s.r, 0, Math.PI * 2);
      ctx.fill();
      // glow on the biggest
      if (s.layer === 2 && s.r > 1.4) {
        ctx.fillStyle = `rgba(236, 230, 214, ${a * 0.18})`;
        ctx.beginPath();
        ctx.arc(s.x, wrappedY, s.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Density API for tweaks
  window.__starfield = {
    setDensity(d) { density = d; build(); },
    pause() { running = false; },
    resume() { running = true; },
  };

  resize();
  requestAnimationFrame(frame);
})();
