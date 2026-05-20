// Decorative "orbital chart" for the hero.
// - Outer reticle with degree ticks and mono labels
// - 5 planets on Keplerian orbits (eccentricity, periapsis rotation)
// - One planet has a small moon
// - A comet on a highly eccentric orbit with a particle tail pointing away from the sun
// - Sun with corona, solar prominences, and a subtle illumination on each planet
// - Mono annotations (perihelion, T = ..., a ≈ ..., M☉)
const { useEffect, useRef } = React;

function HeroOrbit() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let raf;

    // Orbits in normalized units. a = semi-major (in % of half-min-dim), e = eccentricity,
    // omega = argument of periapsis (radians), T = period (seconds), color, radius,
    // M0 = initial mean anomaly.
    const bodies = [
      { name: 'a',     a: 0.18, e: 0.05, omega: 0.10, T: 4.8,  color: '#e8e4d8', r: 3.0, M0: 0.3 },
      { name: 'b',     a: 0.27, e: 0.20, omega: 1.20, T: 8.1,  color: '#8ecae6', r: 4.2, M0: 1.7,
        moon: { a: 0.035, T: 1.3, r: 1.4, color: '#b9b09b', M0: 0.0 } },
      { name: 'c',     a: 0.40, e: 0.08, omega: 2.40, T: 13.5, color: '#e76f51', r: 3.6, M0: 3.0 },
      { name: 'd',     a: 0.56, e: 0.04, omega: 4.10, T: 21.0, color: '#b9b09b', r: 2.4, M0: 4.6 },
    ];

    // The comet: very eccentric.
    const comet = {
      a: 0.62, e: 0.74, omega: 5.4, T: 17.0, color: '#ffd093', r: 2.0, M0: 2.1,
      tail: [], // particle trail
    };

    // small foreground stars sprinkled within the chart frame for depth
    const innerStars = [];
    const rngS = (() => { let s = 7331; return () => (s = (s*16807) % 2147483647) / 2147483647; })();
    for (let i = 0; i < 60; i++) {
      innerStars.push({
        ang: rngS() * Math.PI * 2,
        rad: 0.05 + rngS() * 0.92,
        s: rngS() * 0.7 + 0.2,
        tw: rngS() * Math.PI * 2,
        speed: 0.4 + rngS() * 1.6,
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Solve Kepler: E - e sin E = M  (Newton iter)
    function solveKepler(M, e) {
      let E = M;
      for (let i = 0; i < 5; i++) {
        E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      }
      return E;
    }
    function positionOnOrbit(b, t, scale) {
      const n = (Math.PI * 2) / b.T;
      const M = b.M0 + n * t;
      const E = solveKepler(M, b.e);
      // orbit-frame coords
      const x0 = b.a * (Math.cos(E) - b.e) * scale;
      const y0 = b.a * Math.sqrt(1 - b.e * b.e) * Math.sin(E) * scale;
      // rotate by argument of periapsis (omega)
      const cs = Math.cos(b.omega), sn = Math.sin(b.omega);
      return { x: x0 * cs - y0 * sn, y: x0 * sn + y0 * cs, E };
    }

    let t0 = performance.now();

    const draw = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.46;       // chart radius
      const scale = R;                        // unit → pixels

      // ── outer reticle ring with degree ticks ────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      const reticleRot = t * 0.04;             // slow drift
      ctx.rotate(reticleRot);

      // dotted outer ring
      ctx.strokeStyle = 'rgba(236,230,214,0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.04, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // tick marks every 15°, longer every 90°
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let deg = 0; deg < 360; deg += 15) {
        const a = (deg * Math.PI) / 180;
        const r1 = R * 1.04;
        const isMajor = deg % 90 === 0;
        const r2 = r1 + (isMajor ? 9 : 5);
        ctx.strokeStyle = isMajor ? 'rgba(236,230,214,0.55)' : 'rgba(236,230,214,0.22)';
        ctx.lineWidth = isMajor ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
        if (isMajor) {
          ctx.fillStyle = 'rgba(236,230,214,0.45)';
          const lr = r1 + 18;
          ctx.fillText(deg.toString().padStart(3, '0'), Math.cos(a) * lr, Math.sin(a) * lr);
        }
      }
      ctx.restore();

      // inner faint stars
      for (const s of innerStars) {
        const x = cx + Math.cos(s.ang) * R * s.rad;
        const y = cy + Math.sin(s.ang) * R * s.rad;
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.tw);
        ctx.fillStyle = `rgba(236,230,214,${0.12 + tw * 0.22})`;
        ctx.beginPath();
        ctx.arc(x, y, s.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── orbit paths ─────────────────────────────────────────────────────
      for (const b of bodies.concat([comet])) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(b.omega);
        ctx.strokeStyle = b === comet ? 'rgba(255,208,147,0.20)' : 'rgba(236,230,214,0.13)';
        ctx.lineWidth = 1;
        if (b === comet) ctx.setLineDash([3, 4]);
        ctx.beginPath();
        const aPx = b.a * scale;
        const bPx = b.a * Math.sqrt(1 - b.e * b.e) * scale;
        // ellipse focus is at origin (sun) — so center of ellipse is shifted by -a*e in x
        ctx.ellipse(-b.a * b.e * scale, 0, aPx, bPx, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        // periapsis tick
        if (b === comet) {
          ctx.fillStyle = 'rgba(255,208,147,0.55)';
          const px = b.a * (1 - b.e) * scale;
          ctx.beginPath();
          ctx.arc(px, 0, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // ── sun ─────────────────────────────────────────────────────────────
      const sunR = Math.max(11, R * 0.06);
      // outer corona
      const corona = ctx.createRadialGradient(cx, cy, sunR * 0.4, cx, cy, sunR * 8);
      corona.addColorStop(0,    'rgba(244,162,97,0.55)');
      corona.addColorStop(0.2,  'rgba(244,162,97,0.22)');
      corona.addColorStop(0.6,  'rgba(244,162,97,0.05)');
      corona.addColorStop(1,    'rgba(244,162,97,0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 8, 0, Math.PI * 2);
      ctx.fill();
      // solar prominences (subtle flickering arcs)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t * 0.15;
        const len = sunR * (1.15 + 0.15 * Math.sin(t * 1.7 + i));
        ctx.strokeStyle = `rgba(255,208,147,${0.18 + 0.12 * Math.sin(t * 2 + i)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * sunR * 1.05, cy + Math.sin(a) * sunR * 1.05);
        ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
        ctx.stroke();
      }
      // sun body
      const sunGrad = ctx.createRadialGradient(cx - sunR*0.2, cy - sunR*0.2, 0, cx, cy, sunR);
      sunGrad.addColorStop(0, '#fff6df');
      sunGrad.addColorStop(0.5, '#ffd093');
      sunGrad.addColorStop(1, '#f4a261');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fill();

      // ── planets ─────────────────────────────────────────────────────────
      for (const b of bodies) {
        const p = positionOnOrbit(b, t, scale);
        const x = cx + p.x, y = cy + p.y;
        // glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r * 5);
        g.addColorStop(0, b.color + 'cc');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, b.r * 5, 0, Math.PI * 2);
        ctx.fill();
        // body w/ sun-side illumination
        const sunDx = cx - x, sunDy = cy - y;
        const sunDist = Math.hypot(sunDx, sunDy) || 1;
        const lx = x + (sunDx / sunDist) * b.r * 0.4;
        const ly = y + (sunDy / sunDist) * b.r * 0.4;
        const bGrad = ctx.createRadialGradient(lx, ly, 0, x, y, b.r * 1.4);
        bGrad.addColorStop(0, b.color);
        bGrad.addColorStop(0.65, b.color);
        bGrad.addColorStop(1, 'rgba(20,20,28,0.85)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // moon
        if (b.moon) {
          const mn = (Math.PI * 2) / b.moon.T;
          const mAng = b.moon.M0 + mn * t;
          const mx = x + Math.cos(mAng) * b.moon.a * scale;
          const my = y + Math.sin(mAng) * b.moon.a * scale * 0.6; // squashed
          // mini orbit
          ctx.strokeStyle = 'rgba(236,230,214,0.10)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(x, y, b.moon.a * scale, b.moon.a * scale * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = b.moon.color;
          ctx.beginPath();
          ctx.arc(mx, my, b.moon.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── comet with tail ─────────────────────────────────────────────────
      const cp = positionOnOrbit(comet, t, scale);
      const cxp = cx + cp.x, cyp = cy + cp.y;
      // tail direction = radially away from sun
      const sunDx = cxp - cx, sunDy = cyp - cy;
      const sunDist = Math.hypot(sunDx, sunDy) || 1;
      const tx = sunDx / sunDist, ty = sunDy / sunDist;
      // tail emits particles when comet is near periapsis (sunDist < midpoint)
      const periapsisDist = comet.a * (1 - comet.e) * scale;
      const apoapsisDist = comet.a * (1 + comet.e) * scale;
      const activity = Math.max(0, 1 - (sunDist - periapsisDist) / (apoapsisDist - periapsisDist));
      // emit particles
      if (Math.random() < 0.5 + activity * 0.5) {
        const speedMag = 18 + activity * 35;
        comet.tail.push({
          x: cxp, y: cyp,
          vx: tx * speedMag * (0.6 + Math.random() * 0.6) + (Math.random() - 0.5) * 8,
          vy: ty * speedMag * (0.6 + Math.random() * 0.6) + (Math.random() - 0.5) * 8,
          life: 0,
          maxLife: 0.9 + Math.random() * 0.9,
        });
      }
      // update + draw particles
      const dt = 1/60;
      comet.tail = comet.tail.filter(p => p.life < p.maxLife);
      for (const p of comet.tail) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = 1 - p.life / p.maxLife;
        ctx.fillStyle = `rgba(255,208,147,${a * 0.65})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * a + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      // comet head with bright glow
      const cg = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, comet.r * 6);
      cg.addColorStop(0, 'rgba(255,235,180,0.95)');
      cg.addColorStop(0.4, 'rgba(255,208,147,0.4)');
      cg.addColorStop(1, 'rgba(255,208,147,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cxp, cyp, comet.r * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff5dd';
      ctx.beginPath();
      ctx.arc(cxp, cyp, comet.r, 0, Math.PI * 2);
      ctx.fill();

      // ── annotations ─────────────────────────────────────────────────────
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // sun label
      ctx.fillStyle = 'rgba(255,208,147,0.75)';
      ctx.fillText('SUN', cx + sunR + 6, cy - 2);
      ctx.fillStyle = 'rgba(236,230,214,0.35)';
      ctx.fillText('focus', cx + sunR + 6, cy + 9);

      // periapsis crosshair near sun (top-left)
      ctx.strokeStyle = 'rgba(236,230,214,0.3)';
      ctx.lineWidth = 0.8;
      const cross = 6;
      ctx.beginPath();
      ctx.moveTo(cx - cross, cy); ctx.lineTo(cx + cross, cy);
      ctx.moveTo(cx, cy - cross); ctx.lineTo(cx, cy + cross);
      ctx.stroke();

      // chart corners with metadata
      ctx.fillStyle = 'rgba(236,230,214,0.42)';
      ctx.textAlign = 'left';
      ctx.fillText('N-BODY · 5 +', 8, 18);
      ctx.fillStyle = 'rgba(236,230,214,0.25)';
      ctx.fillText('ECLIPTIC PLOT', 8, 30);

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,208,147,0.55)';
      ctx.fillText('t = ' + t.toFixed(2) + 's', W - 8, 18);
      ctx.fillStyle = 'rgba(236,230,214,0.25)';
      ctx.fillText('G = 6.674e-11', W - 8, 30);

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(236,230,214,0.32)';
      ctx.fillText('e = 0.74', 8, H - 18);
      ctx.textAlign = 'right';
      ctx.fillText('a = ' + comet.a.toFixed(2), W - 8, H - 18);

      // periapsis indicator label near comet's periapsis
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(comet.omega);
      const pxa = comet.a * (1 - comet.e) * scale;
      ctx.restore();
      const px = cx + Math.cos(comet.omega) * pxa;
      const py = cy + Math.sin(comet.omega) * pxa;
      ctx.strokeStyle = 'rgba(255,208,147,0.55)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 14, py - 12);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,208,147,0.75)';
      ctx.textAlign = 'left';
      ctx.fillText('perihelion', px + 16, py - 14);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="orbit-wrap">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

Object.assign(window, { HeroOrbit });
