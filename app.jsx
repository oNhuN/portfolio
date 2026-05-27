// Main composition for Nuno Zhan's portfolio.
const { useState, useEffect, useRef } = React;

// --- BIO in three languages. Plain prose, no italics, no em-dashes.
const BIO = {
  en: {
    hello: 'Hello',
    p1: (
      <p className="first">
        I'm Nuno. I start my third year of straight physics at the University of Edinburgh
        this September. I grew up and was schooled entirely in Spain, so I write a derivation
        as readily in Spanish as I do in English.
      </p>
    ),
    p2: (
      <p>
        The parts of physics that move are the ones I keep coming back to: turbulent flow over
        a wing, gravitational systems that refuse to settle, and the aerodynamics that decide
        where a Formula 1 car ends up in qualifying. Right now that means a CFD aerofoil
        simulation on one screen and an N-body solver on the other.
      </p>
    ),
    p3: (
      <p className="muted">
        Off the desk: the volleyball court, F1 race weekends, and tracking down whichever café
        in Edinburgh has the slowest wifi and the strongest coffee.
      </p>
    ),
  },
  es: {
    hello: 'Hola',
    p1: (
      <p className="first">
        Soy Nuno. Empiezo el tercer curso de Física en la Universidad de Edimburgo en septiembre.
        Crecí y estudié íntegramente en España, así que escribo una derivación con la misma
        naturalidad en español que en inglés.
      </p>
    ),
    p2: (
      <p>
        Las partes de la física que se mueven son las que persigo: el flujo turbulento sobre un
        perfil alar, los sistemas gravitatorios que no se dejan estabilizar, y la aerodinámica
        que decide dónde acaba un Fórmula 1 en clasificación. Ahora mismo, eso es una simulación
        CFD de un perfil en una pantalla y un solver N-cuerpos en la otra.
      </p>
    ),
    p3: (
      <p className="muted">
        Fuera del escritorio: voleibol, los fines de semana de F1, y buscar la cafetería de
        Edimburgo con el wifi más lento y el café más fuerte.
      </p>
    ),
  },
  zh: {
    hello: '你好',
    p1: (
      <p className="first">
        我是 Nuno. 今年九月我将进入爱丁堡大学物理系大三. 我在西班牙长大、求学，
        所以无论用中文、西班牙文还是英文写一段推导，对我来说都一样自然.
      </p>
    ),
    p2: (
      <p>
        物理中那些"动起来"的部分最吸引我：机翼上的湍流、不肯安分的引力多体系统，
        以及决定 F1 赛车排位结果的空气动力学. 目前我的两块屏幕上，一边是
        CFD 翼型仿真，一边是 N-body 求解器.
      </p>
    ),
    p3: (
      <p className="muted">
        电脑之外：排球场、F1 比赛周末，以及在爱丁堡寻找网速最慢、咖啡最浓的那家小店.
      </p>
    ),
  },
};

const LANG_LABELS = { en: 'English', es: 'Español', zh: '中文' };

// --- Tweakable defaults ---
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#f4a261"
}/*EDITMODE-END*/;

// --- Fade-in hook. Defensive: always falls back to visible after 1.2s.
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fades = el.querySelectorAll('.fade');
    if (!('IntersectionObserver' in window)) return;
    fades.forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.top > window.innerHeight) n.classList.add('pre');
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    fades.forEach(n => obs.observe(n));
    const fallback = setTimeout(() => {
      fades.forEach(n => n.classList.remove('pre'));
      obs.disconnect();
    }, 1200);
    return () => { clearTimeout(fallback); obs.disconnect(); };
  }, []);
  return ref;
}

// --- Top nav with embedded scroll spy.
function TopNav({ lang }) {
  return (
    <nav className="top">
      <a href="#top" className="monogram">
        <span>Nuno Zhan</span>
      </a>
      <ScrollSpy />
      <div className="nav-right">
        <span className="lang-indicator" title="Set language in the About section">
          <span className="dim">site</span> {LANG_LABELS[lang]}
        </span>
      </div>
    </nav>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section id="top" className="hero wrap">
      <div className="hero-inner">
        <div className="eyebrow">Edinburgh · Physics · Class of 2028</div>
        <h1>
          Nuno<br/>
          <span style={{color:'var(--sun)'}}>Zhan.</span>
        </h1>
        <div className="greeting">
          <span>Hola.</span>
          <span>Hello.</span>
          <span>你好.</span>
        </div>
        <div className="tagline">
          Physics undergrad chasing turbulence, gravity, and the corner-exit
          downforce of Formula 1 cars.
        </div>
        <div className="meta">
          <div><span className="k">currently</span>Yr 2 → 3, Edinburgh</div>
          <div><span className="k">building</span>aerofoil CFD</div>
          <div><span className="k">writing</span>n-body solver</div>
        </div>
      </div>
      <div className="scroll-cue">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

// --- Section header ---
function SecHead({ num, label, children }) {
  return (
    <div className="sec-head fade">
      <div className="sec-num">
        {num}
        <span className="label">{label}</span>
      </div>
      <h2 className="h-section">{children}</h2>
    </div>
  );
}

// --- About ---
function About({ lang, setLang }) {
  const ref = useFadeIn();
  const t = BIO[lang];
  return (
    <section id="about" ref={ref} className="wrap">
      <SecHead num="01 / 05" label="About">
        {t.hello}.<br/>
        I'm a physicist in&nbsp;motion.
      </SecHead>
      <div className="about-grid fade">
        <div>
          {t.p1}
          {t.p2}
          {t.p3}

          <div className="timeline">
            <div className="yr">2026 →</div>
            <div className="ev"><span className="place">University of Edinburgh</span>BSc Physics, Year 3 starts September</div>
            <div className="yr">2024 / 26</div>
            <div className="ev"><span className="place">University of Edinburgh</span>BSc Physics, Years 1 and 2</div>
            <div className="yr">/ 2024</div>
            <div className="ev"><span className="place">Spain</span>Full pre-university education. Bachillerato (honours).</div>
          </div>
        </div>
        <LanguageConstellation lang={lang} setLang={setLang} />
      </div>
    </section>
  );
}

// --- Languages as a constellation (also the language switcher).
// Behavior: shows all 4 until the user picks a language. After ctrl/⌘+click,
// it collapses to just the active language. Clicking the active language
// re-expands the constellation.
function LanguageConstellation({ lang, setLang }) {
  const langs = [
    { x: 50, y: 18, word: 'Español',  iso: 'ES', lvl: 'native',  size: 1.0, code: 'es' },
    { x: 22, y: 58, word: '中文',      iso: 'ZH', lvl: 'native',  size: 0.95, code: 'zh' },
    { x: 78, y: 54, word: 'English',  iso: 'EN', lvl: 'fluent',  size: 0.95, code: 'en' },
    { x: 50, y: 84, word: 'Français', iso: 'FR', lvl: 'B2 · listener', size: 0.7, code: null },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [hint, setHint] = useState(null);
  const [flash, setFlash] = useState(null);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'ctrl';

  const onNodeClick = (e, l) => {
    e.preventDefault();
    if (collapsed) {
      // Tap on the lone visible language to re-expand.
      setCollapsed(false);
      return;
    }
    if (!l.code) {
      setHint({ msg: 'B2 listener only — no bio in french yet', t: Date.now() });
      setTimeout(() => setHint(null), 1800);
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      setLang(l.code);
      setFlash(l.code);
      setCollapsed(true);
      setTimeout(() => setFlash(null), 700);
    } else {
      setHint({ msg: `hold ${modKey} and click to switch site to ${LANG_LABELS[l.code]}`, t: Date.now() });
      setTimeout(() => setHint(null), 2200);
    }
  };

  const visibleLangs = collapsed ? langs.filter(l => l.code === lang) : langs;

  // When collapsed, recenter the active node to the middle of the chart so it doesn't
  // sit in an off-center spot.
  const positionFor = (l) => collapsed ? { x: 50, y: 50, size: 1.2 } : l;

  const edges = [];
  if (!collapsed) {
    for (let i = 0; i < langs.length; i++) {
      for (let j = i + 1; j < langs.length; j++) {
        edges.push([langs[i], langs[j]]);
      }
    }
  }

  return (
    <div className="langs-wrap">
      <div className="langs-hint mono">
        <span className="dot-blink"></span>
        {collapsed
          ? <>click the language to choose another</>
          : <>hold <kbd>{modKey}</kbd> + click a language to switch the entire site</>
        }
      </div>
      <div className="langs">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map((e, i) => (
            <line key={i}
              x1={e[0].x} y1={e[0].y} x2={e[1].x} y2={e[1].y}
              stroke="rgba(236,230,214,0.15)" strokeWidth="0.15"
              strokeDasharray="0.5 0.8"
            />
          ))}
          {visibleLangs.map((l, i) => {
            const p = positionFor(l);
            return (
              <g key={l.iso}>
                <circle cx={p.x} cy={p.y} r={p.size * 4} fill="var(--sun)" opacity={lang === l.code ? 0.18 : 0.06} />
                {lang === l.code && (
                  <circle cx={p.x} cy={p.y} r={p.size * 2.8} fill="none" stroke="var(--sun)" strokeWidth="0.25" opacity="0.85" />
                )}
                <circle cx={p.x} cy={p.y} r={p.size * 1.2} fill="var(--sun)" opacity="0.9" />
              </g>
            );
          })}
        </svg>
        {visibleLangs.map((l) => {
          const p = positionFor(l);
          const active = lang === l.code;
          const flashed = flash === l.code;
          return (
            <button
              key={l.iso}
              className={`lang-node ${active ? 'active' : ''} ${flashed ? 'flash' : ''} ${collapsed || l.code ? 'clickable' : 'static'}`}
              style={{ left: p.x + '%', top: p.y + '%', opacity: p.size }}
              onClick={(e) => onNodeClick(e, l)}
              type="button"
              aria-label={collapsed ? 'Expand language picker' : `Switch site to ${l.word}`}
              aria-pressed={active}
            >
              <div className="word" style={{ fontSize: collapsed
                ? `clamp(40px, 5.6vw, 72px)`
                : `clamp(20px, ${l.size * 2.6}vw, ${l.size * 38}px)` }}>{l.word}</div>
              <div className="lvl">
                <span className="iso">{l.iso}</span> · {l.lvl}
                {active && !collapsed && <span className="badge"> · active</span>}
                {collapsed && <span className="badge"> · click to change</span>}
              </div>
            </button>
          );
        })}
        {hint && (
          <div className="lang-tooltip mono" key={hint.t}>{hint.msg}</div>
        )}
      </div>
    </div>
  );
}

// --- Research ---
function Research() {
  const ref = useFadeIn();
  return (
    <section id="research" ref={ref} className="wrap">
      <SecHead num="02 / 05" label="Research interests">
        Where the math refuses<br/>to sit&nbsp;still.
      </SecHead>
      <div className="research-grid fade">
        <article className="rcard">
          <div className="rtag">In progress · CFD</div>
          <h3>Aerofoil flow simulation</h3>
          <p>
            Building a 2D incompressible solver around a NACA profile, pressure / velocity
            coupled, with the long-term goal of resolving the boundary-layer transition that
            decides downforce on a Formula 1 floor.
          </p>
          <p className="dim mono" style={{fontSize:11, letterSpacing:'0.1em'}}>NumPy · SciPy · pyFoam · matplotlib</p>
        </article>
        <article className="rcard">
          <div className="rtag">Long game · Motorsport eng.</div>
          <h3>Formula 1 simulation engineering</h3>
          <p>
            Why I picked the aerofoil work in the first place. Track-side lap-time simulation
            sits at the intersection of CFD, vehicle dynamics, and tyre modelling. The plan is
            to keep stacking physics and numerical methods modules toward that.
          </p>
          <p className="dim mono" style={{fontSize:11, letterSpacing:'0.1em'}}>aero · vehicle dyn · tyres</p>
        </article>
      </div>
    </section>
  );
}

// --- Aerofoil visualization (streamlines + airfoil silhouette)
function AerofoilVis() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H;
    const resize = () => {
      const r = c.getBoundingClientRect();
      W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);

    let t0 = performance.now();
    let raf;
    const draw = (now) => {
      const t = (now - t0) / 1000;
      ctx.fillStyle = 'rgba(7,9,15,0.18)';
      ctx.fillRect(0, 0, W, H);

      const lines = 14;
      for (let i = 0; i < lines; i++) {
        const y0 = (i + 0.5) / lines * H;
        ctx.strokeStyle = `rgba(142,202,230,${0.18 + (i % 3) * 0.06})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const cx = W * 0.45, cy = H * 0.6;
          const dx = x - cx;
          const distSq = dx * dx;
          const phase = t * 1.2 + x * 0.02 + i * 0.6;
          let y = y0 - 18 * Math.exp(-distSq / 12000) * Math.sign(cy - y0) * Math.max(0.2, Math.abs((cy - y0) / H));
          y += Math.sin(phase) * 1.2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = '#ece6d6';
      ctx.beginPath();
      const cx = W * 0.25, cy = H * 0.6;
      const chord = W * 0.5;
      ctx.moveTo(cx, cy);
      for (let i = 0; i <= 30; i++) {
        const u = i / 30;
        const x = cx + u * chord;
        const camber = Math.sin(u * Math.PI) * H * 0.05;
        const thickness = Math.sin(u * Math.PI) * H * 0.09 * (1 - u * 0.6);
        const yUp = cy - camber - thickness * 0.5;
        ctx.lineTo(x, yUp);
      }
      for (let i = 30; i >= 0; i--) {
        const u = i / 30;
        const x = cx + u * chord;
        const camber = Math.sin(u * Math.PI) * H * 0.05;
        const thickness = Math.sin(u * Math.PI) * H * 0.09 * (1 - u * 0.6);
        const yLo = cy - camber + thickness * 0.5;
        ctx.lineTo(x, yLo);
      }
      ctx.closePath();
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
}

function F1Vis() {
  return (
    <svg viewBox="0 0 320 160" style={{width:'100%',height:'100%',display:'block'}}>
      <defs>
        <linearGradient id="track" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(236,230,214,0.06)"/>
          <stop offset="1" stopColor="rgba(236,230,214,0.18)"/>
        </linearGradient>
        <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8ecae6" stopOpacity="0.2"/>
          <stop offset="0.5" stopColor="#f4a261"/>
          <stop offset="1" stopColor="#e76f51"/>
        </linearGradient>
      </defs>
      <path d="M-10 110 C 60 110, 110 110, 150 80 S 240 30, 330 30" stroke="url(#track)" strokeWidth="36" fill="none" strokeLinecap="round" />
      <path d="M-10 118 C 70 118, 100 118, 140 80 S 250 38, 330 22" stroke="url(#line)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="3s" repeatCount="indefinite"/>
      </path>
      <circle cx="160" cy="76" r="3" fill="#f4a261"/>
      <text x="170" y="74" fill="#f4a261" fontSize="9" fontFamily="JetBrains Mono">apex</text>
      <text x="14" y="142" fill="#6e6857" fontSize="9" fontFamily="JetBrains Mono">braking</text>
      <text x="230" y="18" fill="#6e6857" fontSize="9" fontFamily="JetBrains Mono">throttle</text>
    </svg>
  );
}

// --- Projects ---
function Projects() {
  const ref = useFadeIn();
  const items = [
    {
      year: '2026 →',
      sortYear: 2026,
      title: 'Aerofoil CFD Solver',
      blurb: '2D incompressible Navier / Stokes around a NACA section, with the goal of pulling clean Cp distributions and a path toward boundary-layer transition modelling. Independent project this summer.',
      tags: ['CFD', 'NumPy', 'Aerodynamics', 'F1 prep'],
      href: '#',
    },
    {
      year: '2025',
      sortYear: 2025,
      title: 'Lab notebooks · year 2',
      blurb: "Selected writeups: acceleration due to gravity via Kater's and compound pendulums, and the doublet splitting of sodium using a Michelson interferometer. Available on request.",
      tags: ['Lab', 'LaTeX', 'Data analysis'],
      href: '#',
    },
    {
      year: '2024 / 25',
      sortYear: 2024,
      title: 'Solar System Simulation',
      blurb: "A Python N-body simulation of a chaotic gravitational system. Variable-timestep integrator, energy diagnostics, animation pipeline. The original solver behind the interactive demo above.",
      tags: ['Python', 'N-body', 'Numerical methods', 'matplotlib'],
      href: 'https://github.com/oNhuN/solar-system-simulation',
    },
  ].sort((a, b) => b.sortYear - a.sortYear);
  return (
    <section id="work" ref={ref} className="wrap">
      <SecHead num="03 / 05" label="Projects">
        Things I've built.
      </SecHead>
      <div className="fade">
        {items.map((p, i) => (
          <a key={i} href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="proj">
            <div className="pyr">{p.year}</div>
            <div>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <div className="tags">{p.tags.map(tg => <span key={tg}>{tg}</span>)}</div>
            </div>
            <div className="arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 12L12 4M12 4H6M12 4V10"/></svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// --- Coursework — sourced from the official HEAR transcript (May 2026).
function Coursework() {
  const ref = useFadeIn();
  const yr1 = [
    ['PHYS07001', 'Transition to University Mathematics for Physics', '', 'A1'],
    ['PHYS08016', 'Physics 1A: Foundations',                           '', 'A3'],
    ['PHYS08017', 'Physics 1B: The Stuff of the Universe',             '', 'A3'],
    ['PHYS08035', 'Mathematics for Physics 1',                         '', 'A3'],
    ['MATH08058', 'Calculus and its Applications',                     '', 'A3'],
    ['PHYS08036', 'Mathematics for Physics 2',                         '', 'C'],
  ];
  const yr2 = [
    ['MATH08068', 'Facets of Mathematics',                              '', 'A2'],
    ['MATH08066', 'Probability',                                        '', 'A3'],
    ['PHYS08042', 'Linear Algebra & Several Variable Calculus',         '', 'B'],
    ['PHYS08049', 'Programming and Data Analysis',                      '', 'Pass'],
    ['PHYS08045', 'Modern Physics',                                     '', 'C'],
  ];
  return (
    <section id="coursework" ref={ref} className="wrap">
      <SecHead num="04 / 05" label="Coursework">
        The reading list.
      </SecHead>
      <p className="lede fade" style={{maxWidth: 720, marginBottom: 56, color: 'var(--ink-2)'}}>
        Modules taken at the University of Edinburgh through Year 2.
        Year 3 picks up Quantum Mechanics, Thermal Physics, and computational
        methods. Grades shown are Edinburgh's honours scale, A1 / A3 = first.
      </p>
      <div className="courses-grid fade">
        <div>
          <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--sun)', marginBottom: 16, textTransform:'uppercase'}}>Year 1 · 2024/25 · 120 credits</div>
          {yr1.map((c, i) => (
            <div key={i} className="course">
              <div className="code">{c[0]}</div>
              <div className="name">{c[1]}</div>
              <div className="gr">{c[3]}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--sun)', marginBottom: 16, textTransform:'uppercase'}}>Year 2 · 2025/26 · in progress</div>
          {yr2.map((c, i) => (
            <div key={i} className="course">
              <div className="code">{c[0]}</div>
              <div className="name">{c[1]}</div>
              <div className="gr">{c[3]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="skills fade">
        <div className="chip"><strong>Languages</strong> Spanish · English · 中文 · français (B2)</div>
        <div className="chip"><strong>Code</strong> Python</div>
        <div className="chip"><strong>Scientific</strong> NumPy · SciPy · matplotlib</div>
        <div className="chip"><strong>Tools</strong> LaTeX · Git · Linux</div>
        <div className="chip"><strong>Off-screen</strong> Volleyball · F1</div>
      </div>
    </section>
  );
}

// --- Contact ---
function Contact() {
  const ref = useFadeIn();
  return (
    <section id="contact" ref={ref} className="wrap contact">
      <div className="eyebrow fade">05 / 05 · Get in touch</div>
      <h2 className="fade" style={{marginTop: 18}}>
        Let's talk.<br/>
        Internships, research, F1.
      </h2>
      <p className="lede fade" style={{maxWidth: 640, color: 'var(--ink-2)'}}>
        I'm looking for summer 2026 / 2027 internships in computational physics,
        aerospace, or motorsport simulation. Equally happy to chat about a problem,
        a paper, or where to find decent paella in Edinburgh.
      </p>
      <div className="contact-grid fade">
        <a href="mailto:mingyang7777@gmail.com">
          <div className="clabel">Email</div>
          <div className="cv">mingyang7777<br/>@gmail.com</div>
        </a>
        <a href="https://github.com/oNhuN" target="_blank" rel="noopener noreferrer">
          <div className="clabel">GitHub</div>
          <div className="cv">@oNhuN</div>
        </a>
        <a href="https://www.linkedin.com/in/nuno-zhan-668650267" target="_blank" rel="noopener noreferrer">
          <div className="clabel">LinkedIn</div>
          <div className="cv">in/nuno-zhan</div>
        </a>
        <a href="https://drive.google.com/file/d/12sSRxiGWAMb25VwYjfN8Xhw6c68h7jSH/view?usp=sharing" target="_blank" rel="noopener noreferrer">
          <div className="clabel">CV · PDF</div>
          <div className="cv">Download ↓</div>
        </a>
      </div>
    </section>
  );
}

// --- Footer ---
function FooterBar() {
  return (
    <footer>
      <span>© 2026 · Nuno Zhan</span>
      <span>Edinburgh ↔ Spain · <span style={{color:'var(--sun)'}}>●</span> available 2026 summer</span>
      <span>built with html, css, and gravity</span>
    </footer>
  );
}

// --- Tweaks panel ---
function Tweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--sun', tweaks.accent);
  }, [tweaks.accent]);

  return (
    <TweaksPanel>
      <TweakSection label="Accent">
        <TweakColor
          label="Color"
          options={['#f4a261', '#e76f51', '#8ecae6', '#a78bfa', '#5eead4']}
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// --- Scroll-spy (lives inline inside the top nav)
function ScrollSpy() {
  const sections = [
    { id: 'top',        num: '00', label: 'Intro' },
    { id: 'about',      num: '01', label: 'About' },
    { id: 'research',   num: '02', label: 'Research' },
    { id: 'work',       num: '03', label: 'Projects' },
    { id: 'coursework', num: '04', label: 'Coursework' },
    { id: 'contact',    num: '05', label: 'Contact' },
  ];
  const [active, setActive] = useState('top');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const ratios = new Map();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => ratios.set(e.target.id, e.intersectionRatio));
      let best = null, bestR = -1;
      ratios.forEach((r, id) => { if (r > bestR) { bestR = r; best = id; } });
      if (best) setActive(best);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.05, 0.25, 0.6, 1] });
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const onClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
  };

  return (
    <nav className="spy" aria-label="Section navigation">
      {sections.map(s => (
        <a key={s.id} href={`#${s.id}`}
           className={`spy-item ${active === s.id ? 'on' : ''}`}
           onClick={(e) => onClick(e, s.id)}>
          <span className="spy-num">{s.num}</span>
          <span className="spy-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
// --- Vercel Web Analytics (served at /_vercel/insights/* on Vercel deploys) ---
function VercelAnalytics() {
  useEffect(() => {
    if (document.querySelector('script[data-vercel-analytics]')) return;
    window.va = window.va || function () {
      (window.vaq = window.vaq || []).push(arguments);
    };
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    script.setAttribute('data-vercel-analytics', '');
    document.head.appendChild(script);
  }, []);
  return null;
}

// --- Root ---
function App() {
  const [lang, setLang] = useState('en');
  return (
    <>
      <TopNav lang={lang} />
      <Hero />
      <About lang={lang} setLang={setLang} />
      <Research />
      <Projects />
      <Coursework />
      <Contact />
      <FooterBar />
      <Tweaks />
      <VercelAnalytics />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
