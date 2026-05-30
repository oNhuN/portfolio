// Main composition for Nuno Zhan's portfolio.
const { useState, useEffect, useRef } = React;

// --- Site copy in three languages. Plain prose, no italics, no em-dashes.
const COPY = {
  en: {
    hello: 'Hello',
    aboutHeadline: <>I'm a physicist in&nbsp;motion.</>,
    bio: {
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
    hero: {
      eyebrow: 'Edinburgh · Physics · Class of 2028',
      tagline: 'Physics undergrad chasing turbulence, gravity, and the corner-exit downforce of Formula 1 cars.',
      metaCurrently: 'currently',
      metaCurrentlyVal: 'Yr 2 → 3, Edinburgh',
      metaBuilding: 'building',
      metaBuildingVal: 'aerofoil CFD',
      metaWriting: 'writing',
      metaWritingVal: 'n-body solver',
      scroll: 'scroll',
    },
    nav: { site: 'site', intro: 'Intro', about: 'About', research: 'Research', projects: 'Projects', coursework: 'Coursework', contact: 'Contact' },
    about: {
      label: 'About',
      timeline: [
        { yr: '2026 →', place: 'University of Edinburgh', text: 'BSc Physics, Year 3 starts September' },
        { yr: '2024 / 26', place: 'University of Edinburgh', text: 'BSc Physics, Years 1 and 2' },
        { yr: '/ 2024', place: 'Spain', text: 'Full pre-university education. Bachillerato (honours).' },
      ],
    },
    langs: {
      hintCollapsed: 'click the language to choose another',
      hintExpanded: 'click a language to switch the entire site',
      hintFrench: 'B2 listener only — no bio in french yet',
      hintSwitch: (label) => `click to switch site to ${label}`,
      badgeActive: 'active',
      badgeChange: 'click to change',
      lvlNative: 'native',
      lvlFluent: 'fluent',
      lvlB2: 'B2 · listener',
    },
    research: {
      label: 'Research interests',
      title: <>Where the math refuses<br/>to sit&nbsp;still.</>,
      cards: [
        {
          tag: 'In progress · CFD',
          title: 'Aerofoil flow simulation',
          body: 'Building a 2D incompressible solver around a NACA profile, pressure / velocity coupled, with the long-term goal of resolving the boundary-layer transition that decides downforce on a Formula 1 floor.',
          foot: 'NumPy · SciPy · pyFoam · matplotlib',
        },
        {
          tag: 'Long game · Motorsport eng.',
          title: 'Formula 1 simulation engineering',
          body: 'Why I picked the aerofoil work in the first place. Track-side lap-time simulation sits at the intersection of CFD, vehicle dynamics, and tyre modelling. The plan is to keep stacking physics and numerical methods modules toward that.',
          foot: 'aero · vehicle dyn · tyres',
        },
      ],
    },
    projects: {
      label: 'Projects',
      title: <>Things I've built.</>,
      items: [
        {
          year: '2026 →', order: 3,
          title: 'Aerofoil CFD Solver',
          blurb: '2D incompressible Navier / Stokes around a NACA section, with the goal of pulling clean Cp distributions and a path toward boundary-layer transition modelling. Ongoing independent project for Summer 2026.',
          tags: ['CFD', 'NumPy', 'Aerodynamics', 'F1 prep'],
        },
        {
          year: '2026', order: 2,
          title: 'Solar System Simulation',
          blurb: 'A Python N-body simulation of a chaotic gravitational system. Variable-timestep integrator, energy diagnostics, animation pipeline. The original solver behind the interactive demo above.',
          tags: ['Python', 'N-body', 'Numerical methods', 'matplotlib'],
        },
        {
          year: '2025/2026', order: 1,
          title: 'Lab notebooks · year 2',
          blurb: "Selected writeups: acceleration due to gravity via Kater's and compound pendulums, and the doublet splitting of sodium using a Michelson interferometer. Available on request.",
          tags: ['Lab', 'LaTeX', 'Data analysis'],
        },
      ],
    },
    coursework: {
      label: 'Coursework',
      title: <>The reading list.</>,
      lede: "Modules taken at the University of Edinburgh through Year 2. Year 3 picks up Quantum Mechanics, Thermal Physics, and computational methods. Grades shown are Edinburgh's honours scale, A1 / A3 = first.",
      year1Label: 'Year 1 · 2024/25 · 120 credits',
      year2Label: 'Year 2 · 2025/26 · in progress',
      skills: [
        ['Languages', 'Spanish · English · 中文 · français (B2)'],
        ['Code', 'Python'],
        ['Scientific', 'NumPy · SciPy · matplotlib'],
        ['Tools', 'LaTeX · Git · Linux'],
        ['Off-screen', 'Volleyball · F1'],
      ],
    },
    contact: {
      eyebrow: '05 / 05 · Get in touch',
      title: <>Let's talk.<br/>Internships, research, F1.</>,
      lede: "I'm looking for summer 2026 / 2027 internships in computational physics, aerospace, or motorsport simulation. Equally happy to chat about a problem, a paper, or where to find decent paella in Edinburgh.",
      email: 'Email',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      cvLabel: 'CV · PDF',
      cvOpen: 'Open CV ↗',
    },
    footer: {
      copy: '© 2026 · Nuno Zhan',
      location: 'Edinburgh ↔ Spain',
      avail: 'available 2026 summer',
      built: 'built with html, css, and gravity',
    },
  },
  es: {
    hello: 'Hola',
    aboutHeadline: <>Soy un físico en&nbsp;movimiento.</>,
    bio: {
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
    hero: {
      eyebrow: 'Edimburgo · Física · Promoción 2028',
      tagline: 'Estudiante de física persiguiendo la turbulencia, la gravedad y el downforce en curva de los coches de Fórmula 1.',
      metaCurrently: 'actualmente',
      metaCurrentlyVal: '2.º → 3.º curso, Edimburgo',
      metaBuilding: 'construyendo',
      metaBuildingVal: 'CFD de perfil alar',
      metaWriting: 'escribiendo',
      metaWritingVal: 'solver N-cuerpos',
      scroll: 'desplazar',
    },
    nav: { site: 'sitio', intro: 'Inicio', about: 'Sobre mí', research: 'Investigación', projects: 'Proyectos', coursework: 'Estudios', contact: 'Contacto' },
    about: {
      label: 'Sobre mí',
      timeline: [
        { yr: '2026 →', place: 'Universidad de Edimburgo', text: 'Grado en Física, empieza el 3.er curso en septiembre' },
        { yr: '2024 / 26', place: 'Universidad de Edimburgo', text: 'Grado en Física, 1.er y 2.º curso' },
        { yr: '/ 2024', place: 'España', text: 'Educación preuniversitaria completa. Bachillerato (honores).' },
      ],
    },
    langs: {
      hintCollapsed: 'haz clic en el idioma para elegir otro',
      hintExpanded: 'haz clic en un idioma para cambiar todo el sitio',
      hintFrench: 'solo B2 de escucha — aún no hay bio en francés',
      hintSwitch: (label) => `clic para cambiar el sitio a ${label}`,
      badgeActive: 'activo',
      badgeChange: 'clic para cambiar',
      lvlNative: 'nativo',
      lvlFluent: 'fluido',
      lvlB2: 'B2 · escucha',
    },
    research: {
      label: 'Intereses de investigación',
      title: <>Donde las matemáticas se niegan<br/>a quedarse&nbsp;quietas.</>,
      cards: [
        {
          tag: 'En curso · CFD',
          title: 'Simulación de flujo en perfil alar',
          body: 'Construyendo un solver 2D incompresible alrededor de un perfil NACA, acoplado presión / velocidad, con el objetivo a largo plazo de resolver la transición de capa límite que decide el downforce del suelo de un Fórmula 1.',
          foot: 'NumPy · SciPy · pyFoam · matplotlib',
        },
        {
          tag: 'A largo plazo · Ing. motorsport',
          title: 'Ingeniería de simulación en Fórmula 1',
          body: 'Por eso elegí el trabajo del perfil alar. La simulación de tiempos por vuelta en pista une CFD, dinámica del vehículo y modelado de neumáticos. El plan es seguir acumulando módulos de física y métodos numéricos hacia eso.',
          foot: 'aero · dinámica · neumáticos',
        },
      ],
    },
    projects: {
      label: 'Proyectos',
      title: <>Cosas que he&nbsp;construido.</>,
      items: [
        {
          year: '2026 →', order: 3,
          title: 'Solver CFD de perfil alar',
          blurb: 'Navier / Stokes 2D incompresible alrededor de una sección NACA, con el objetivo de obtener distribuciones limpias de Cp y un camino hacia el modelado de transición de capa límite. Proyecto independiente en curso para el verano de 2026.',
          tags: ['CFD', 'NumPy', 'Aerodinámica', 'prep. F1'],
        },
        {
          year: '2026', order: 2,
          title: 'Simulación del sistema solar',
          blurb: 'Simulación N-cuerpos en Python de un sistema gravitatorio caótico. Integrador de paso variable, diagnósticos de energía, pipeline de animación. El solver original detrás de la demo interactiva de arriba.',
          tags: ['Python', 'N-cuerpos', 'Métodos numéricos', 'matplotlib'],
        },
        {
          year: '2025/2026', order: 1,
          title: 'Cuadernos de laboratorio · 2.º curso',
          blurb: 'Apuntes seleccionados: aceleración de la gravedad con péndulos de Kater y compuesto, y el desdoblamiento del doblete del sodio con un interferómetro de Michelson. Disponibles bajo petición.',
          tags: ['Lab', 'LaTeX', 'Análisis de datos'],
        },
      ],
    },
    coursework: {
      label: 'Estudios',
      title: <>La lista de&nbsp;lectura.</>,
      lede: 'Asignaturas cursadas en la Universidad de Edimburgo hasta el 2.º curso. El 3.er curso incluye Mecánica Cuántica, Física Térmica y métodos computacionales. Las notas siguen la escala de honores de Edimburgo; A1 / A3 = primera.',
      year1Label: '1.er curso · 2024/25 · 120 créditos',
      year2Label: '2.º curso · 2025/26 · en curso',
      skills: [
        ['Idiomas', 'Español · Inglés · 中文 · français (B2)'],
        ['Código', 'Python'],
        ['Científico', 'NumPy · SciPy · matplotlib'],
        ['Herramientas', 'LaTeX · Git · Linux'],
        ['Fuera de pantalla', 'Voleibol · F1'],
      ],
    },
    contact: {
      eyebrow: '05 / 05 · Contacto',
      title: <>Hablemos.<br/>Prácticas, investigación, F1.</>,
      lede: 'Busco prácticas de verano 2026 / 2027 en física computacional, aeroespacial o simulación de motorsport. También me apetece charlar de un problema, un artículo o dónde encontrar buena paella en Edimburgo.',
      email: 'Correo',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      cvLabel: 'CV · PDF',
      cvOpen: 'Abrir CV ↗',
    },
    footer: {
      copy: '© 2026 · Nuno Zhan',
      location: 'Edimburgo ↔ España',
      avail: 'disponible verano 2026',
      built: 'hecho con html, css y gravedad',
    },
  },
  zh: {
    hello: '你好',
    aboutHeadline: <>我是一名始终在运动的物理学者.</>,
    bio: {
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
    hero: {
      eyebrow: '爱丁堡 · 物理 · 2028 届',
      tagline: '物理本科生，追逐湍流、引力，以及 F1 赛车弯心出弯时的下压力.',
      metaCurrently: '目前',
      metaCurrentlyVal: '大二 → 大三，爱丁堡',
      metaBuilding: '在做',
      metaBuildingVal: '翼型 CFD',
      metaWriting: '在写',
      metaWritingVal: 'N-body 求解器',
      scroll: '向下',
    },
    nav: { site: '站点', intro: '首页', about: '关于', research: '研究', projects: '项目', coursework: '课程', contact: '联系' },
    about: {
      label: '关于',
      timeline: [
        { yr: '2026 →', place: '爱丁堡大学', text: '物理学学士，九月进入大三' },
        { yr: '2024 / 26', place: '爱丁堡大学', text: '物理学学士，大一与大二' },
        { yr: '/ 2024', place: '西班牙', text: '完整的大学前教育. 高中荣誉课程 (Bachillerato).' },
      ],
    },
    langs: {
      hintCollapsed: '点击语言以选择其他语言',
      hintExpanded: '点击一种语言以切换整个站点',
      hintFrench: '仅 B2 听力水平 — 暂无法语简介',
      hintSwitch: (label) => `点击以将站点切换为${label}`,
      badgeActive: '当前',
      badgeChange: '点击更换',
      lvlNative: '母语',
      lvlFluent: '流利',
      lvlB2: 'B2 · 听力',
    },
    research: {
      label: '研究兴趣',
      title: <>数学拒绝<br/>安分&nbsp;的地方.</>,
      cards: [
        {
          tag: '进行中 · CFD',
          title: '翼型流动仿真',
          body: '围绕 NACA 翼型构建二维不可压求解器，压力与速度耦合，长期目标是解析决定 F1 底板下压力的边界层转捩.',
          foot: 'NumPy · SciPy · pyFoam · matplotlib',
        },
        {
          tag: '长远 · 赛车工程',
          title: 'F1 仿真工程',
          body: '这是我选择翼型工作的初衷. 赛道旁的圈速仿真处于 CFD、车辆动力学与轮胎建模的交汇处. 计划继续积累物理与数值方法课程，朝这个方向推进.',
          foot: '气动 · 车辆动力学 · 轮胎',
        },
      ],
    },
    projects: {
      label: '项目',
      title: <>我做过的东西.</>,
      items: [
        {
          year: '2026 →', order: 3,
          title: '翼型 CFD 求解器',
          blurb: '围绕 NACA 剖面的二维不可压 Navier / Stokes，目标是得到清晰的 Cp 分布，并为边界层转捩建模铺路. 2026 年夏季进行中的独立项目.',
          tags: ['CFD', 'NumPy', '空气动力学', 'F1 预备'],
        },
        {
          year: '2026', order: 2,
          title: '太阳系仿真',
          blurb: '用 Python 实现的混沌引力多体仿真. 可变时间步积分器、能量诊断、动画管线. 上方交互 demo 背后的原始求解器.',
          tags: ['Python', 'N-body', '数值方法', 'matplotlib'],
        },
        {
          year: '2025/2026', order: 1,
          title: '实验记录 · 大二',
          blurb: '精选报告：用 Kater 摆与复合摆测量重力加速度，以及用 Michelson 干涉仪观测钠双线分裂. 可应要求提供.',
          tags: ['实验', 'LaTeX', '数据分析'],
        },
      ],
    },
    coursework: {
      label: '课程',
      title: <>阅读清单.</>,
      lede: '截至大二在爱丁堡大学修读的课程. 大三将学习量子力学、热力学与计算方法. 成绩为爱丁堡荣誉制，A1 / A3 = 一等.',
      year1Label: '大一 · 2024/25 · 120 学分',
      year2Label: '大二 · 2025/26 · 进行中',
      skills: [
        ['语言', '西班牙语 · 英语 · 中文 · français (B2)'],
        ['编程', 'Python'],
        ['科学计算', 'NumPy · SciPy · matplotlib'],
        ['工具', 'LaTeX · Git · Linux'],
        ['屏幕外', '排球 · F1'],
      ],
    },
    contact: {
      eyebrow: '05 / 05 · 取得联系',
      title: <>聊聊吧.<br/>实习、研究、F1.</>,
      lede: '正在寻找 2026 / 2027 年夏季实习，方向为计算物理、航空航天或赛车仿真. 也欢迎聊一个问题、一篇论文，或爱丁堡哪里有好吃的海鲜饭.',
      email: '邮箱',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      cvLabel: '简历 · PDF',
      cvOpen: '打开简历 ↗',
    },
    footer: {
      copy: '© 2026 · Nuno Zhan',
      location: '爱丁堡 ↔ 西班牙',
      avail: '2026 年夏季可实习',
      built: '由 html、css 与引力构建',
    },
  },
};

const LANG_LABELS = { en: 'English', es: 'Español', zh: '中文' };
const tFor = (lang) => COPY[lang] || COPY.en;

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
  const t = tFor(lang);
  return (
    <nav className="top">
      <a href="#top" className="monogram">
        <span>Nuno Zhan</span>
      </a>
      <ScrollSpy lang={lang} />
      <div className="nav-right">
        <span className="lang-indicator" title="Set language in the About section">
          <span className="dim">{t.nav.site}</span> {LANG_LABELS[lang]}
        </span>
      </div>
    </nav>
  );
}

// --- Hero ---
function Hero({ lang }) {
  const h = tFor(lang).hero;
  return (
    <section id="top" className="hero wrap">
      <div className="hero-inner">
        <div className="eyebrow">{h.eyebrow}</div>
        <h1>
          Nuno<br/>
          <span style={{color:'var(--sun)'}}>Zhan.</span>
        </h1>
        <div className="greeting">
          <span>Hola.</span>
          <span>Hello.</span>
          <span>你好.</span>
        </div>
        <div className="tagline">{h.tagline}</div>
        <div className="meta">
          <div><span className="k">{h.metaCurrently}</span>{h.metaCurrentlyVal}</div>
          <div><span className="k">{h.metaBuilding}</span>{h.metaBuildingVal}</div>
          <div><span className="k">{h.metaWriting}</span>{h.metaWritingVal}</div>
        </div>
      </div>
      <div className="scroll-cue">
        <span>{h.scroll}</span>
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
  const t = tFor(lang);
  return (
    <section id="about" ref={ref} className="wrap">
      <SecHead num="01 / 05" label={t.about.label}>
        {t.hello}.<br/>
        {t.aboutHeadline}
      </SecHead>
      <div className="about-grid fade">
        <div>
          {t.bio.p1}
          {t.bio.p2}
          {t.bio.p3}

          <div className="timeline">
            {t.about.timeline.map((row, i) => (
              <React.Fragment key={i}>
                <div className="yr">{row.yr}</div>
                <div className="ev"><span className="place">{row.place}</span>{row.text}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <LanguageConstellation lang={lang} setLang={setLang} />
      </div>
    </section>
  );
}

// --- Languages as a constellation (also the language switcher).
// Click en / es / zh to switch the whole site; collapses to the active language.
// Click the active node again to re-expand. French is display-only (B2).
function LanguageConstellation({ lang, setLang }) {
  const lc = tFor(lang).langs;
  const langs = [
    { x: 50, y: 18, word: 'Español',  iso: 'ES', lvl: lc.lvlNative, size: 1.0, code: 'es' },
    { x: 22, y: 58, word: '中文',      iso: 'ZH', lvl: lc.lvlNative, size: 0.95, code: 'zh' },
    { x: 78, y: 54, word: 'English',  iso: 'EN', lvl: lc.lvlFluent, size: 0.95, code: 'en' },
    { x: 50, y: 84, word: 'Français', iso: 'FR', lvl: lc.lvlB2, size: 0.7, code: null },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [hint, setHint] = useState(null);
  const [flash, setFlash] = useState(null);

  const onNodeClick = (e, l) => {
    e.preventDefault();
    if (collapsed) {
      setCollapsed(false);
      return;
    }
    if (!l.code) {
      setHint({ msg: lc.hintFrench, t: Date.now() });
      setTimeout(() => setHint(null), 1800);
      return;
    }
    setLang(l.code);
    setFlash(l.code);
    setCollapsed(true);
    setTimeout(() => setFlash(null), 700);
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
        {collapsed ? lc.hintCollapsed : lc.hintExpanded}
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
                {active && !collapsed && <span className="badge"> · {lc.badgeActive}</span>}
                {collapsed && <span className="badge"> · {lc.badgeChange}</span>}
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
function Research({ lang }) {
  const ref = useFadeIn();
  const r = tFor(lang).research;
  return (
    <section id="research" ref={ref} className="wrap">
      <SecHead num="02 / 05" label={r.label}>
        {r.title}
      </SecHead>
      <div className="research-grid fade">
        {r.cards.map((card, i) => (
          <article key={i} className="rcard">
            <div className="rtag">{card.tag}</div>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <p className="dim mono" style={{fontSize:11, letterSpacing:'0.1em'}}>{card.foot}</p>
          </article>
        ))}
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
const PROJECT_HREFS = {
  3: '#',
  2: 'https://github.com/oNhuN/solar-system-simulation',
  1: '#',
};

function Projects({ lang }) {
  const ref = useFadeIn();
  const p = tFor(lang).projects;
  const items = p.items
    .map((item) => ({ ...item, href: PROJECT_HREFS[item.order] }))
    .sort((a, b) => b.order - a.order);
  return (
    <section id="work" ref={ref} className="wrap">
      <SecHead num="03 / 05" label={p.label}>
        {p.title}
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
function Coursework({ lang }) {
  const ref = useFadeIn();
  const c = tFor(lang).coursework;
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
      <SecHead num="04 / 05" label={c.label}>
        {c.title}
      </SecHead>
      <p className="lede fade" style={{maxWidth: 720, marginBottom: 56, color: 'var(--ink-2)'}}>
        {c.lede}
      </p>
      <div className="courses-grid fade">
        <div>
          <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--sun)', marginBottom: 16, textTransform:'uppercase'}}>{c.year1Label}</div>
          {yr1.map((c, i) => (
            <div key={i} className="course">
              <div className="code">{c[0]}</div>
              <div className="name">{c[1]}</div>
              <div className="gr">{c[3]}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--sun)', marginBottom: 16, textTransform:'uppercase'}}>{c.year2Label}</div>
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
        {c.skills.map(([label, value]) => (
          <div key={label} className="chip"><strong>{label}</strong> {value}</div>
        ))}
      </div>
    </section>
  );
}

// --- Contact ---
function Contact({ lang }) {
  const ref = useFadeIn();
  const c = tFor(lang).contact;
  return (
    <section id="contact" ref={ref} className="wrap contact">
      <div className="eyebrow fade">{c.eyebrow}</div>
      <h2 className="fade" style={{marginTop: 18}}>
        {c.title}
      </h2>
      <p className="lede fade" style={{maxWidth: 640, color: 'var(--ink-2)'}}>
        {c.lede}
      </p>
      <div className="contact-grid fade">
        <a href="mailto:mingyang7777@gmail.com">
          <div className="clabel">{c.email}</div>
          <div className="cv">mingyang7777<br/>@gmail.com</div>
        </a>
        <a href="https://github.com/oNhuN" target="_blank" rel="noopener noreferrer">
          <div className="clabel">{c.github}</div>
          <div className="cv">@oNhuN</div>
        </a>
        <a href="https://www.linkedin.com/in/nuno-zhan-668650267" target="_blank" rel="noopener noreferrer">
          <div className="clabel">{c.linkedin}</div>
          <div className="cv">in/nuno-zhan</div>
        </a>
        <a href="/Nuno_Zhan_CV.pdf" target="_blank" rel="noopener noreferrer">
          <div className="clabel">{c.cvLabel}</div>
          <div className="cv">{c.cvOpen}</div>
        </a>
      </div>
    </section>
  );
}

// --- Footer ---
function FooterBar({ lang }) {
  const f = tFor(lang).footer;
  return (
    <footer>
      <span>{f.copy}</span>
      <span>{f.location} · <span style={{color:'var(--sun)'}}>●</span> {f.avail}</span>
      <span>{f.built}</span>
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
function ScrollSpy({ lang }) {
  const n = tFor(lang).nav;
  const sections = [
    { id: 'top',        num: '00', label: n.intro },
    { id: 'about',      num: '01', label: n.about },
    { id: 'research',   num: '02', label: n.research },
    { id: 'work',       num: '03', label: n.projects },
    { id: 'coursework', num: '04', label: n.coursework },
    { id: 'contact',    num: '05', label: n.contact },
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
// --- Vercel Web Analytics + Speed Insights (/_vercel/* on Vercel deploys only) ---
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

function VercelSpeedInsights() {
  useEffect(() => {
    if (document.querySelector('script[data-vercel-speed-insights]')) return;
    window.si = window.si || function () {
      (window.siq = window.siq || []).push(arguments);
    };
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/speed-insights/script.js';
    script.setAttribute('data-vercel-speed-insights', '');
    document.head.appendChild(script);
  }, []);
  return null;
}

const LANG_STORAGE_KEY = 'portfolio-lang';

// --- Root ---
function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && COPY[saved]) return saved;
    } catch (_) { /* private browsing */ }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
    try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (_) { /* ignore */ }
  }, [lang]);

  return (
    <>
      <TopNav lang={lang} />
      <Hero lang={lang} />
      <About lang={lang} setLang={setLang} />
      <Research lang={lang} />
      <Projects lang={lang} />
      <Coursework lang={lang} />
      <Contact lang={lang} />
      <FooterBar lang={lang} />
      <Tweaks />
      <VercelAnalytics />
      <VercelSpeedInsights />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
