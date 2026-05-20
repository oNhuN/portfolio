// Interactive N-body gravity simulation.
// - Click+drag on canvas to add a new body with initial velocity (drag direction)
// - Presets for solar / binary / figure8 / chaos
// - Velocity Verlet integration with softened gravity

const { useEffect, useRef, useState, useCallback } = React;

function makeBody(x, y, vx, vy, mass, color, trail = true) {
  return {
    x, y, vx, vy,
    ax: 0, ay: 0,
    mass,
    radius: Math.cbrt(mass) * 2.4 + 2,
    color,
    trail: trail ? [] : null,
    alive: true,
  };
}

function presetSolar(W, H) {
  const cx = W / 2, cy = H / 2;
  const sun = makeBody(cx, cy, 0, 0, 4000, '#f4a261', false);
  sun.radius = 18;
  const bodies = [sun];
  // place planets at varying radii with circular orbital velocity
  const G = 0.6;
  const defs = [
    { r: 70,  m: 8,  c: '#e8e4d8' },
    { r: 120, m: 14, c: '#8ecae6' },
    { r: 180, m: 22, c: '#e76f51' },
    { r: 250, m: 12, c: '#b9b09b' },
  ];
  for (const d of defs) {
    const v = Math.sqrt((G * sun.mass) / d.r);
    const ang = Math.random() * Math.PI * 2;
    const px = cx + Math.cos(ang) * d.r;
    const py = cy + Math.sin(ang) * d.r;
    bodies.push(makeBody(px, py, -Math.sin(ang) * v, Math.cos(ang) * v, d.m, d.c));
  }
  return bodies;
}

function presetBinary(W, H) {
  const cx = W / 2, cy = H / 2;
  const sep = 90;
  const m = 1200;
  const G = 0.6;
  const v = Math.sqrt(G * m / (sep * 2)) * 0.95;
  const bodies = [
    makeBody(cx - sep, cy, 0, -v, m, '#f4a261'),
    makeBody(cx + sep, cy, 0,  v, m, '#e76f51'),
  ];
  bodies[0].radius = 14; bodies[1].radius = 14;
  // a handful of small witnesses
  for (let i = 0; i < 6; i++) {
    const r = 240 + Math.random() * 100;
    const a = Math.random() * Math.PI * 2;
    const sv = Math.sqrt(G * m * 2 / r) * 0.85;
    bodies.push(makeBody(
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      -Math.sin(a) * sv,
      Math.cos(a) * sv,
      2 + Math.random() * 4,
      i % 2 === 0 ? '#8ecae6' : '#e8e4d8'
    ));
  }
  return bodies;
}

function presetFigure8(W, H) {
  // Classical figure-8 (Chenciner-Montgomery) approximate
  const cx = W / 2, cy = H / 2;
  const s = 80;
  const m = 600;
  // Scaled positions/velocities — softened
  const p = [
    { x:  0.97000436, y: -0.24308753, vx:  0.466203685, vy:  0.43236573 },
    { x: -0.97000436, y:  0.24308753, vx:  0.466203685, vy:  0.43236573 },
    { x:  0,          y:  0,          vx: -0.93240737,  vy: -0.86473146 },
  ];
  const colors = ['#f4a261', '#8ecae6', '#e76f51'];
  // The known solution is for G=1, m=1. We scale.
  const scale = s;
  const vscale = Math.sqrt(0.6 * m / scale) * 0.78;
  return p.map((b, i) => makeBody(
    cx + b.x * scale,
    cy + b.y * scale,
    b.vx * vscale,
    b.vy * vscale,
    m,
    colors[i]
  ));
}

function presetChaos(W, H) {
  const cx = W / 2, cy = H / 2;
  const bodies = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
    const r = 90 + Math.random() * 80;
    const m = 250 + Math.random() * 350;
    const colors = ['#f4a261', '#e76f51', '#8ecae6', '#e8e4d8', '#ffd093', '#b9b09b'];
    bodies.push(makeBody(
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      -Math.sin(a) * (0.4 + Math.random() * 0.4),
      Math.cos(a) * (0.4 + Math.random() * 0.4),
      m,
      colors[i % colors.length]
    ));
  }
  return bodies;
}

function NBodySim({ preset = 'solar', height = 560, showHint = true, autoStartPreset = null }) {
  const canvasRef = useRef(null);
  const bodiesRef = useRef([]);
  const runningRef = useRef(true);
  const [running, setRunning] = useState(true);
  const [activePreset, setActivePreset] = useState(preset);
  const dragRef = useRef(null); // { x0, y0, x, y }
  const [, force] = useState(0);
  const dprRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0 });
  const trailLenRef = useRef(140);

  const loadPreset = useCallback((name) => {
    const c = canvasRef.current;
    if (!c) return;
    const w = sizeRef.current.w;
    const h = sizeRef.current.h;
    let b;
    if (name === 'solar') b = presetSolar(w, h);
    else if (name === 'binary') b = presetBinary(w, h);
    else if (name === 'figure8') b = presetFigure8(w, h);
    else if (name === 'chaos') b = presetChaos(w, h);
    else b = [];
    bodiesRef.current = b;
    setActivePreset(name);
  }, []);

  // resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const prevW = sizeRef.current.w;
      const prevH = sizeRef.current.h;
      sizeRef.current = { w: rect.width, h: rect.height };
      // if first resize, load preset
      if (prevW === 0 || prevH === 0) {
        loadPreset(preset);
      } else if (bodiesRef.current.length) {
        // shift bodies relative to size change
        const dx = (rect.width - prevW) / 2;
        const dy = (rect.height - prevH) / 2;
        for (const b of bodiesRef.current) { b.x += dx; b.y += dy; }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [loadPreset, preset]);

  // animation loop
  useEffect(() => {
    let raf;
    const G = 0.6;
    const softening = 9;
    const dt = 0.55;
    const step = () => {
      const ctx = canvasRef.current?.getContext('2d');
      const { w, h } = sizeRef.current;
      if (!ctx || !w || !h) { raf = requestAnimationFrame(step); return; }

      // fade trail buffer slightly
      ctx.fillStyle = 'rgba(7, 9, 15, 0.18)';
      ctx.fillRect(0, 0, w, h);

      const bodies = bodiesRef.current;
      if (runningRef.current) {
        // accelerations
        for (const b of bodies) { b.ax = 0; b.ay = 0; }
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], c = bodies[j];
            const dx = c.x - a.x, dy = c.y - a.y;
            const r2 = dx*dx + dy*dy + softening*softening;
            const inv = 1 / Math.sqrt(r2);
            const inv3 = inv * inv * inv;
            const fx = G * dx * inv3;
            const fy = G * dy * inv3;
            a.ax += fx * c.mass;
            a.ay += fy * c.mass;
            c.ax -= fx * a.mass;
            c.ay -= fy * a.mass;
          }
        }
        // integrate (semi-implicit Euler — simple and stable enough)
        for (const b of bodies) {
          b.vx += b.ax * dt;
          b.vy += b.ay * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.trail) {
            b.trail.push(b.x, b.y);
            if (b.trail.length > trailLenRef.current * 2) b.trail.splice(0, b.trail.length - trailLenRef.current * 2);
          }
        }

        // remove bodies that fly too far away
        const margin = Math.max(w, h) * 2;
        bodiesRef.current = bodies.filter(b => b.x > -margin && b.x < w + margin && b.y > -margin && b.y < h + margin);
      }

      // draw trails
      for (const b of bodiesRef.current) {
        if (!b.trail || b.trail.length < 4) continue;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        const n = b.trail.length / 2;
        for (let i = 0; i < n; i++) {
          const x = b.trail[i*2], y = b.trail[i*2+1];
          const alpha = i / n;
          ctx.globalAlpha = alpha * 0.55;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // draw bodies
      for (const b of bodiesRef.current) {
        // glow
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 4);
        g.addColorStop(0, b.color + (b.mass > 500 ? 'aa' : '66'));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // draw drag preview
      if (dragRef.current) {
        const d = dragRef.current;
        ctx.strokeStyle = '#f4a261';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(d.x0, d.y0);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f4a261';
        ctx.beginPath();
        ctx.arc(d.x0, d.y0, 5, 0, Math.PI * 2);
        ctx.fill();
        // arrowhead
        const ang = Math.atan2(d.y - d.y0, d.x - d.x0);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, -4);
        ctx.lineTo(-8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // pointer handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const getXY = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e) => {
      const p = getXY(e);
      dragRef.current = { x0: p.x, y0: p.y, x: p.x, y: p.y };
      force(n => n + 1);
    };
    const move = (e) => {
      if (!dragRef.current) return;
      const p = getXY(e);
      dragRef.current.x = p.x;
      dragRef.current.y = p.y;
    };
    const up = (e) => {
      if (!dragRef.current) return;
      const d = dragRef.current;
      const vx = (d.x - d.x0) * 0.04;
      const vy = (d.y - d.y0) * 0.04;
      const colors = ['#f4a261', '#8ecae6', '#e76f51', '#e8e4d8', '#ffd093'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      bodiesRef.current.push(makeBody(d.x0, d.y0, vx, vy, 30, c));
      dragRef.current = null;
      force(n => n + 1);
    };
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  useEffect(() => { runningRef.current = running; }, [running]);

  const presets = [
    ['solar', 'Solar'],
    ['binary', 'Binary'],
    ['figure8', 'Figure 8'],
    ['chaos', 'Chaos'],
  ];

  return (
    <div className="nbody-stage">
      <canvas ref={canvasRef} style={{ height: height + 'px' }} />
      <div className="sim-overlay">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="sim-tag">
            <span className="live">LIVE · N = {bodiesRef.current.length}</span>
            <span>G = 0.6 · softened</span>
            <span>verlet step</span>
          </div>
          <div className="sim-controls">
            {presets.map(([k, label]) => (
              <button key={k} className={activePreset === k ? 'active' : ''} onClick={() => loadPreset(k)}>{label}</button>
            ))}
            <button onClick={() => { bodiesRef.current = []; force(n=>n+1); }}>Clear</button>
            <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Play'}</button>
          </div>
        </div>
        {showHint && (
          <div className="sim-hint">
            Click + drag inside the field to launch a new body. Drag length = initial velocity.
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { NBodySim });
