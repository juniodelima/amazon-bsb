/* All page sections live here. Composed in app.jsx. */

const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Bottle / Capsule placeholder art ---------- */
function ProductArt({ kind }) {
  // Stylized bottle / capsule silhouette — placeholder for real product photography
  if (kind === "drop") {
    return (
      <svg className="product-art" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bottleG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a4528" />
            <stop offset="0.5" stopColor="#7a5e36" />
            <stop offset="1" stopColor="#3d2f1a" />
          </linearGradient>
          <linearGradient id="labelG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ebe4c2" />
            <stop offset="1" stopColor="#d6cfa6" />
          </linearGradient>
        </defs>
        {/* dropper cap */}
        <rect x="58" y="10" width="44" height="36" rx="4" fill="#2a2418" />
        <rect x="68" y="20" width="24" height="6" rx="1" fill="#1a1610" />
        {/* neck */}
        <rect x="64" y="46" width="32" height="14" fill="#1a1610" />
        {/* body */}
        <path d="M40 64 Q40 60 44 60 H116 Q120 60 120 64 V216 Q120 224 112 224 H48 Q40 224 40 216 Z" fill="url(#bottleG)" />
        {/* label */}
        <rect x="48" y="90" width="64" height="100" rx="3" fill="url(#labelG)" />
        <text x="80" y="118" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="700" fill="#3d4a2a">Óleo de</text>
        <text x="80" y="132" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="700" fill="#3d4a2a">Avestruz</text>
        <line x1="58" y1="146" x2="102" y2="146" stroke="#7a8f4a" strokeWidth="0.8" />
        <text x="80" y="166" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="6.5" fill="#5a6e3a">AMAZON BSB</text>
        <text x="80" y="180" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="8" fontWeight="600" fill="#3d4a2a">50ml</text>
        {/* highlight */}
        <ellipse cx="54" cy="120" rx="4" ry="40" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }
  return (
    /* pill / capsule bottle */
    <svg className="product-art" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pillG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1610" />
          <stop offset="0.5" stopColor="#2a2418" />
          <stop offset="1" stopColor="#0d0a06" />
        </linearGradient>
        <linearGradient id="plabelG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ebe4c2" />
          <stop offset="1" stopColor="#c9c290" />
        </linearGradient>
      </defs>
      {/* cap */}
      <path d="M38 18 Q38 10 46 10 H114 Q122 10 122 18 V52 H38 Z" fill="#0d0a06" />
      <rect x="38" y="50" width="84" height="4" fill="#000" />
      {/* body */}
      <path d="M32 56 Q32 54 34 54 H126 Q128 54 128 56 V222 Q128 232 118 232 H42 Q32 232 32 222 Z" fill="url(#pillG)" />
      {/* green band */}
      <rect x="32" y="68" width="96" height="12" fill="#4a5a30" />
      {/* label */}
      <rect x="40" y="80" width="80" height="120" rx="2" fill="url(#plabelG)" />
      <text x="80" y="104" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="800" fill="#3d4a2a">Óleo de</text>
      <text x="80" y="118" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="800" fill="#3d4a2a">Avestruz</text>
      <text x="80" y="134" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="9" fontWeight="600" fill="#7a8f4a">em cápsulas</text>
      <ellipse cx="80" cy="158" rx="14" ry="7" fill="#b89938" />
      <ellipse cx="72" cy="156" rx="6" ry="3" fill="#d4b65a" />
      <text x="80" y="184" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="6.5" fill="#3d4a2a">AMAZON BSB</text>
      <text x="80" y="196" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="8" fontWeight="700" fill="#3d4a2a">500mg</text>
      <ellipse cx="42" cy="130" rx="3" ry="50" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

/* ---------- Urgency bar ---------- */
function UrgencyBar() {
  return (
    <div className="urgency-bar">
      <span><Icon.Truck size={14} /> Frete GRÁTIS acima de R$ 150</span>
      <span className="dot"></span>
      <span><Icon.Box size={14} /> Entrega em todo o Brasil</span>
      <span className="dot"></span>
      <span><Icon.Card size={14} /> 3x sem juros no cartão</span>
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ cartCount, onCartOpen }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="#">
          <span className="logo-mark">
            AMAZON<Icon.Tree size={20} color="#7a8f4a" /><b>BSB</b>
          </span>
          <span className="logo-tag">Óleo de Avestruz</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
          <nav className="nav">
            <a href="#" className="active">Início</a>
            <a href="#produtos">Óleo de Avestruz</a>
            <a href="#kits">Kits</a>
            <a href="#">Atacado</a>
            <a href="#">Blog</a>
            <a href="#">Fale Conosco</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search" style={{ marginRight: 8 }}>
            <span className="search-icon"><Icon.Search size={14} /></span>
            <input type="text" placeholder="Buscar produtos…" />
          </div>
          <button className="account-btn">
            <Icon.User size={16} /> <span>Minha conta</span>
          </button>
          <button className="icon-btn" onClick={onCartOpen} aria-label="Abrir carrinho">
            <Icon.Cart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero carousel ---------- */
function Hero({ autoplay = true, viewMode = "desktop" }) {
  const [idx, setIdx] = useState(0);
  const dragRef = useRef({ active: false, startX: 0, deltaX: 0, moved: false });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slides = [
    {
      kind: "photo",
      img: "assets/hero-desktop-gotas.png",
      mobileImg: "assets/hero-mobile-gotas.png",
      title: "Óleo de Avestruz natural",
      text: "Gotas, cápsulas e kits com entrega em todo o Brasil.",
      button: "Conhecer produtos",
      href: "#produtos",
      actions: true,
    },
    {
      kind: "photo",
      img: "assets/hero-desktop-capsulas.png",
      mobileImg: "assets/hero-mobile-capsulas.png",
      title: "Kits com até 37% off",
      text: "Leve mais, pague menos e mantenha sua rotina por mais tempo.",
      button: "Ver kits",
      href: "#kits",
      actions: true,
    },
  ];

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [autoplay, slides.length]);

  const go = (n) => setIdx((n + slides.length) % slides.length);

  const startDrag = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { active: true, startX: event.clientX, deltaX: 0, moved: false };
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const deltaX = event.clientX - drag.startX;
    drag.deltaX = deltaX;
    drag.moved = Math.abs(deltaX) > 6;
    dragRef.current = drag;

    if (drag.moved) {
      event.preventDefault();
      setDragOffset(deltaX);
    }
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragOffset(0);
    setIsDragging(false);

    if (drag.moved && Math.abs(drag.deltaX) > 48) {
      go(drag.deltaX < 0 ? idx + 1 : idx - 1);
    }

    dragRef.current = { active: false, startX: 0, deltaX: 0, moved: false };
  };

  return (
    <section
      className="hero"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="hero-track"
        style={{
          transform: `translateX(calc(-${idx * 100}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : undefined,
        }}
      >
        {slides.map((s, i) => (
          <div key={i} className="hero-slide">
            {s.kind === "photo" && (
              <div className="hero-image-wrap desktop-only">
                <img src={s.img} alt="Óleo de Avestruz Natural — Amazon BSB" />
                {s.actions && (
                  <>
                    <div className="hero-actions">
                      <a href="#produtos" className="btn btn-primary">
                        Quero meu Óleo de Avestruz <Icon.ArrowRight size={16} />
                      </a>
                      <a href="#kits" className="btn btn-ghost">Ver kits</a>
                    </div>
                    <div className="hero-microcopy">
                      <span><Icon.Check size={12} /> Frete grátis acima de R$150</span>
                      <span><Icon.Check size={12} /> 3x sem juros</span>
                      <span><Icon.Check size={12} /> 100% Natural</span>
                    </div>
                  </>
                )}
              </div>
            )}
            {s.kind === "photo" && (
              <div className="hero-image-wrap mobile-only">
                <img src={s.mobileImg} alt="" />
                <div className="mobile-hero-copy">
                  <span className="mobile-hero-kicker">Amazon BSB</span>
                  <h1>{s.title}</h1>
                  <p>{s.text}</p>
                  <a href={s.href} className="btn btn-primary">
                    {s.button} <Icon.ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={i === idx ? "active" : ""} onClick={() => go(i)} aria-label={`Slide ${i+1}`} />
        ))}
      </div>
      <div className="hero-controls">
        <button onClick={() => go(idx - 1)} aria-label="Anterior"><Icon.ChevronLeft size={18} /></button>
        <button onClick={() => go(idx + 1)} aria-label="Próximo"><Icon.ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

/* ---------- Credibility strip ---------- */
function Credibility() {
  const items = [
    { icon: <Icon.Leaf size={22} />, t: "100% Natural", s: "e sem glúten" },
    { icon: <Icon.Flask size={22} />, t: "Ômegas 3,6,7,9", s: "Vitaminas A e E" },
    { icon: <Icon.Truck size={22} />, t: "Frete grátis", s: "acima de R$ 150" },
    { icon: <Icon.Shield size={22} />, t: "Qualidade garantida", s: "Processo rigoroso" },
    { icon: <Icon.Card size={22} />, t: "3x sem juros", s: "no cartão" },
  ];
  return (
    <div className="credibility">
      <div className="credibility-inner">
        {items.map((it, i) => (
          <div key={i} className="cred-item">
            <div className="cred-icon">{it.icon}</div>
            <div className="cred-text">{it.t}<small>{it.s}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Why ---------- */
function Why() {
  const cards = [
    {
      icon: <Icon.Flask size={28} />,
      title: "Ômegas completos",
      text: "Ômegas 3, 6, 7 e 9 em uma única fonte natural — algo raro em suplementos. Suporte direto à saúde cardiovascular e cerebral.",
      num: "01",
    },
    {
      icon: <Icon.Drop size={28} />,
      title: "Vitaminas A e E",
      text: "Antioxidantes naturais que ajudam na imunidade, na saúde da pele e no combate aos radicais livres do dia a dia.",
      num: "02",
    },
    {
      icon: <Icon.Shield size={28} />,
      title: "Pureza Amazônica",
      text: "Extraído da banha do avestruz com processo rigoroso de qualidade. Sem glúten, sem aditivos artificiais — 100% natural.",
      num: "03",
    },
  ];
  return (
    <section className="why section" id="sobre">
      <div className="section-head">
        <span className="section-kicker">Por que o Óleo de Avestruz?</span>
        <h2 className="section-title">O suplemento natural que <em>seu corpo</em> estava esperando.</h2>
        <p className="section-sub">Uma fonte rara, completa e familiar de Ômegas e vitaminas — pensada para quem busca vitalidade com origem confiável.</p>
      </div>
      <div className="why-grid">
        {cards.map((c, i) => (
          <div key={i} className="why-card">
            <div className="num">{c.num} / 03</div>
            <div className="icon-circle">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="why-cta">
        <a href="#produtos" className="btn btn-dark">Conheça nossos produtos <Icon.ArrowRight size={16} /></a>
      </div>
    </section>
  );
}

/* ---------- Product card ---------- */
function ProductCard({ p, onAdd, added }) {
  return (
    <div className="product-card">
      <div className="product-tags">
        {p.tag === "best" && <span className="tag tag-best"><Icon.Fire size={11} /> Mais vendido</span>}
        {p.tag === "value" && <span className="tag tag-value">Melhor custo-benefício</span>}
        {p.tag === "frete" && <span className="tag tag-frete"><Icon.Truck size={11} /> Frete grátis</span>}
      </div>
      <div className={"product-img" + (p.img ? " product-img-photo" : "")}>
        {p.img ? (
          <img src={p.img} alt={p.name} loading="lazy" />
        ) : (
          <ProductArt kind={p.art} />
        )}
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span className="stars">
            {[1,2,3,4,5].map(i => <Icon.Star key={i} size={11} filled />)}
          </span>
          <span>{p.rating.toFixed(1)} · {p.reviews}</span>
        </div>
        <h3 className="product-name">{p.name}</h3>
        <div className="product-price-row">
          <div>
            {p.was && <div style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through', lineHeight: 1, marginBottom: 2 }}>{BRL(p.was)}</div>}
            <div className="product-price">{BRL(p.price)}</div>
            <div className="product-installment">ou <b>3x de {BRL(p.parcela)}</b> sem juros</div>
          </div>
        </div>
        <div className="product-actions">
          <button className={"product-btn " + (added ? "added" : "")} onClick={() => onAdd(p)}>
            {added ? <><Icon.Check size={14} /> Adicionado</> : <><Icon.Bag size={14} /> Adicionar</>}
          </button>
          <button className="product-btn-secondary" aria-label="Ver detalhes">
            <Icon.ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Products grid ---------- */
function Products({ onAdd, addedMap }) {
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Gotas", "Cápsulas", "Kits"];
  const filtered = PRODUCTS.filter(p => filter === "Todos" || p.type === filter);

  return (
    <section className="products section" id="produtos">
      <div className="section-head">
        <span className="section-kicker">Linha completa</span>
        <h2 className="section-title">Escolha o formato ideal <em>para sua rotina.</em></h2>
        <p className="section-sub">Cápsulas para praticidade. Gotas para uso direto e culinário. Kits para quem quer continuidade e economia.</p>
      </div>
      <div className="product-filters">
        {filters.map(f => (
          <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="product-grid">
        {filtered.map(p => (
          <ProductCard key={p.id} p={p} onAdd={onAdd} added={!!addedMap[p.id]} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Benefits ---------- */
function Benefits() {
  const list = [
    { h: "Mais energia e disposição", t: "Ômegas naturais para o seu dia a dia render mais." },
    { h: "Apoio cardiovascular", t: "Suporte à saúde do coração com gorduras boas." },
    { h: "Pele mais saudável", t: "Vitaminas A e E que cuidam por dentro e por fora." },
    { h: "Para toda a família", t: "Suplemento natural seguro e bem tolerado." },
    { h: "Sem glúten", t: "Adequado para celíacos e sensíveis ao glúten." },
    { h: "Cápsulas ou gotas", t: "Versátil — escolha o que combina com você." },
  ];
  return (
    <section className="benefits section">
      <div className="benefits-grid">
        <div>
          <span className="section-kicker">Para a sua saúde</span>
          <h2 className="section-title" style={{ marginTop: 12 }}>Cuide do que <em>importa</em>: você e quem você ama.</h2>
          <p className="section-sub" style={{ marginTop: 16 }}>Um suplemento natural pensado para a rotina real — sem promessas vazias, com a riqueza dos Ômegas 3, 6, 7 e 9 e o cuidado de quem entende de pureza amazônica.</p>
          <div className="benefits-list">
            {list.map((b, i) => (
              <div key={i} className="benefit-item">
                <span className="benefit-check"><Icon.Check size={14} /></span>
                <div>
                  <h4>{b.h}</h4>
                  <p>{b.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="benefits-visual">
          <span className="stat-label">Composição rica em</span>
          <span className="stat-num">4</span>
          <span className="stat-label">Ômegas naturais</span>
          <div className="vit-list">
            <span className="vit-chip">Ômega 3</span>
            <span className="vit-chip">Ômega 6</span>
            <span className="vit-chip">Ômega 7</span>
            <span className="vit-chip">Ômega 9</span>
            <span className="vit-chip">Vitamina A</span>
            <span className="vit-chip">Vitamina E</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How to use ---------- */
function HowToUse() {
  const steps = [
    { n: "Passo 01", icon: <Icon.Drop size={26} />, h: "Escolha seu formato", t: "Cápsulas para praticidade ou gotas para uso direto, em saladas e pratos do dia a dia." },
    { n: "Passo 02", icon: <Icon.Pill size={26} />, h: "Use diariamente", t: "Siga a indicação do rótulo — em torno de 1 a 2 cápsulas ou 5 a 10 gotas por dia, com refeições." },
    { n: "Passo 03", icon: <Icon.Leaf size={26} />, h: "Sinta a diferença", t: "Mantenha o uso contínuo por pelo menos 60 dias para sentir resultados consistentes." },
  ];
  return (
    <section className="how section">
      <div className="section-head">
        <span className="section-kicker">Como usar</span>
        <h2 className="section-title">Simples como deve ser. <em>Em 3 passos.</em></h2>
      </div>
      <div className="how-steps">
        {steps.map((s, i) => (
          <div key={i} className="how-step">
            <div className="how-num">{s.n}</div>
            <div className="icon-square">{s.icon}</div>
            <h3>{s.h}</h3>
            <p>{s.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="testi-stat">
        <div className="big">+12.400</div>
        <div className="lbl">clientes satisfeitos no Brasil</div>
      </div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="section-kicker">Prova social</span>
        <h2 className="section-title">Quem usa, <em>recomenda.</em></h2>
      </div>
      <div className="testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testi-card">
            <span className="stars">
              {Array.from({length: t.rating}).map((_, k) => <Icon.Star key={k} size={14} filled />)}
            </span>
            <p className="testi-quote">{t.text}</p>
            <div className="testi-foot">
              <div className={"avatar " + t.cls}>{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-city">{t.city}</div>
              </div>
              <span className="testi-verified"><Icon.Check size={11} /> Verificado</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Kits ---------- */
function Kits({ onAdd, addedMap }) {
  const kits = [
    {
      id: "kit3-caps60",
      title: "Kit 3 unidades",
      desc: "Para 90 dias contínuos",
      price: 219.90,
      was: 227.70,
      saving: "Economize R$ 7,80",
      parcela: 73.30,
      bullets: ["3 frascos de 60 cápsulas", "500mg por cápsula", "Frete grátis incluso"],
    },
    {
      id: "kit3-caps90",
      title: "Kit 3x 90 cápsulas",
      desc: "Mais pedido pelos clientes",
      price: 274.90,
      was: 284.70,
      saving: "Economize R$ 9,80",
      parcela: 91.63,
      featured: true,
      bullets: ["3 frascos de 90 cápsulas", "135 dias de uso contínuo", "Frete grátis + brinde surpresa"],
    },
    {
      id: "kit5-caps90",
      title: "Kit 5 unidades",
      desc: "Maior economia • toda a família",
      price: 424.90,
      was: 474.50,
      saving: "Economize R$ 49,60",
      parcela: 141.63,
      bullets: ["5 frascos de 90 cápsulas", "225 dias de uso", "Frete grátis em todo Brasil"],
    },
  ];

  return (
    <section className="kits section" id="kits">
      <div className="section-head">
        <span className="section-kicker">Compre em kit</span>
        <h2 className="section-title">Economize mais <em>comprando em kit.</em></h2>
        <p className="section-sub">Quem compra em kit usa por mais tempo e sente resultados mais consistentes — com até 12% de desconto e frete grátis.</p>
      </div>
      <div className="kit-grid">
        {kits.map((k) => {
          const prod = PRODUCTS.find(p => p.id === k.id);
          return (
          <div key={k.id} className={"kit-card " + (k.featured ? "featured" : "")}>
            {k.featured && <span className="kit-badge"><Icon.Fire size={11} /> Mais pedido</span>}
            {prod && prod.img && (
              <div className="kit-img">
                <img src={prod.img} alt={k.title} loading="lazy" />
              </div>
            )}
            <h3>{k.title}</h3>
            <p className="kit-desc">{k.desc}</p>
            <span className="kit-savings">{k.saving}</span>
            <div className="kit-price-block">
              <span className="kit-was">{BRL(k.was)}</span>
              <span className="kit-price">{BRL(k.price)}</span>
              <span className="kit-meta">ou 3x de {BRL(k.parcela)} sem juros</span>
            </div>
            <div className="kit-line"></div>
            <div className="kit-bullets">
              {k.bullets.map((b, i) => (
                <span key={i} className="kit-bullet"><Icon.Check size={14} /> {b}</span>
              ))}
            </div>
            <button
              className={"btn kit-cta " + (k.featured ? "btn-gold" : "btn-dark")}
              onClick={() => onAdd({ ...PRODUCTS.find(p => p.id === k.id) })}
            >
              {addedMap[k.id] ? "Adicionado ao carrinho" : "Quero meu kit"} <Icon.ArrowRight size={16} />
            </button>
          </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Guarantee ---------- */
function Guarantee() {
  const seals = [
    { icon: <Icon.Lock size={20} />, h: "Pagamento Seguro", t: "Criptografia SSL e processadores confiáveis." },
    { icon: <Icon.Truck size={20} />, h: "Entrega Garantida", t: "Rastreio em tempo real para todo o Brasil." },
    { icon: <Icon.Check size={20} />, h: "Produto Original", t: "Direto da Amazon BSB — selo de qualidade." },
    { icon: <Icon.WhatsApp size={20} />, h: "Suporte por WhatsApp", t: "Atendimento humano, de segunda a sábado." },
  ];
  return (
    <section className="guarantee section">
      <div className="guarantee-card">
        <div>
          <div className="guarantee-shield"><Icon.Shield size={48} /></div>
          <h2>Compra 100% segura<br/>e garantida.</h2>
          <p>Sua tranquilidade vem antes de tudo. Pagamento protegido, entrega rastreada e suporte humano sempre que precisar.</p>
        </div>
        <div className="guarantee-seals">
          {seals.map((s, i) => (
            <div key={i} className="seal">
              <div className="seal-icon">{s.icon}</div>
              <div>
                <h4>{s.h}</h4>
                <p>{s.t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const [open, setOpen] = useState(0);
  const refs = useRef([]);

  return (
    <section className="faq section narrow">
      <div className="section-head">
        <span className="section-kicker">Perguntas frequentes</span>
        <h2 className="section-title">Tudo o que você precisa <em>saber antes de pedir.</em></h2>
      </div>
      <div className="faq-list">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={"faq-item " + (isOpen ? "open" : "")}>
              <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-q-icon"><Icon.Plus size={14} /></span>
              </button>
              <div className="faq-a" style={{ maxHeight: isOpen ? (refs.current[i]?.scrollHeight || 400) + 'px' : 0 }}>
                <div className="faq-a-inner" ref={el => (refs.current[i] = el)}>{f.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- WhatsApp float ---------- */
function WhatsAppFloat() {
  return (
    <a href="https://wa.me/5561999545567" className="whatsapp-float" target="_blank" rel="noreferrer">
      <Icon.WhatsApp size={20} />
      Tire dúvidas pelo WhatsApp
    </a>
  );
}

/* ---------- Audio testimonials carousel ---------- */
function AudioTestimonials() {
  const items = [
    { name: "Lucia", city: "Brasília, DF", initials: "LU", tone: "tone-a", audio: "assets/depoimento-lucia.mp3" },
    { name: "Neusa", city: "Goiânia, GO", initials: "NE", tone: "tone-b", audio: "assets/depoimento-neusa.mp3" },
    { name: "DR. Mauro", city: "São Paulo, SP", initials: "DM", tone: "tone-c", audio: "assets/depoimento-mauro.mp3" },
    { name: "Maria Ferreira", city: "Goiânia, GO", initials: "MF", tone: "tone-d", audio: "assets/depoimento-maria-ferreira.mp3" },
    { name: "Teresa", city: "Brasília, DF", initials: "TE", tone: "tone-e", audio: "assets/depoimento-teresa.mp3" },
  ];

  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [durations, setDurations] = useState({});
  const viewportRef = useRef(null);
  const audioRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, deltaX: 0, moved: false });
  const suppressClickRef = useRef(false);
  const [perPage, setPerPage] = useState(4);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds)) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const mobile = document.body.classList.contains("mobile-preview");
      if (mobile) return setPerPage(1);
      if (w < 720) return setPerPage(1);
      if (w < 1100) return setPerPage(2);
      if (w < 1400) return setPerPage(3);
      setPerPage(4);
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("tweaks-changed", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("tweaks-changed", calc);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loaders = items.map((it, i) => {
      const audio = new Audio(it.audio);
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        if (!active) return;
        setDurations((prev) => ({ ...prev, [i]: formatDuration(audio.duration) }));
      };
      return audio;
    });
    return () => {
      active = false;
      loaders.forEach((audio) => {
        audio.onloadedmetadata = null;
        audio.src = "";
      });
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const maxPage = Math.max(0, items.length - perPage);
  const safe = Math.min(page, maxPage);
  const cardWidth = 280;
  const gap = 20;
  const offset = safe * (cardWidth + gap);

  const startDrag = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { active: true, startX: event.clientX, deltaX: 0, moved: false };
    setIsDragging(true);
    viewportRef.current?.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const deltaX = event.clientX - drag.startX;
    drag.deltaX = deltaX;
    drag.moved = Math.abs(deltaX) > 6;
    dragRef.current = drag;

    if (drag.moved) {
      event.preventDefault();
      setDragOffset(deltaX);
    }
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    viewportRef.current?.releasePointerCapture?.(event.pointerId);
    setDragOffset(0);
    setIsDragging(false);

    if (drag.moved) {
      suppressClickRef.current = true;
      if (Math.abs(drag.deltaX) > 48) {
        setPage((current) => {
          const currentSafe = Math.min(current, maxPage);
          return drag.deltaX < 0
            ? Math.min(maxPage, currentSafe + 1)
            : Math.max(0, currentSafe - 1);
        });
      }
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    }

    dragRef.current = { active: false, startX: 0, deltaX: 0, moved: false };
  };

  const togglePlay = (i) => {
    if (suppressClickRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (playing === i) {
      audio.pause();
      setPlaying(null);
      return;
    }

    audio.src = items[i].audio;
    audio.currentTime = 0;
    setPlaying(i);

    const play = audio.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => setPlaying(null));
    }
  };

  return (
    <section className="audios section">
      <audio ref={audioRef} preload="metadata" onEnded={() => setPlaying(null)} />
      <div className="section-head">
        <span className="section-kicker">Depoimentos em áudio</span>
        <h2 className="section-title">Ouça quem usa, <em>em primeira pessoa.</em></h2>
        <p className="section-sub">Depoimentos reais de clientes que incluíram o Óleo de Avestruz Amazon BSB na rotina. Toque no card para escutar.</p>
      </div>
      <div
        className="audio-viewport"
        ref={viewportRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="audio-track"
          style={{
            transform: `translateX(${dragOffset - offset}px)`,
            justifyContent: maxPage === 0 ? "center" : "flex-start",
            transition: isDragging ? "none" : undefined,
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className={"audio-card " + it.tone + (playing === i ? " playing" : "")}
              onClick={() => togglePlay(i)}
            >
              <div className="audio-card-img"></div>
              <div className="placeholder-portrait">
                <div className="grain"></div>
                <div className="initials">{it.initials}</div>
              </div>
              <div className="grad"></div>
              <div className="top">
                <span className="badge">
                  <Icon.WhatsApp size={11} /> Áudio
                </span>
                <span className="duration">{durations[i] || "--:--"}</span>
              </div>
              <button className="play-center" aria-label={playing === i ? "Pausar" : "Tocar"}>
                {playing === i ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1"/>
                    <rect x="14" y="5" width="4" height="14" rx="1"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20"/>
                  </svg>
                )}
              </button>
              <div className="bottom">
                <span className="stars">
                  {Array.from({length: 5}).map((_, k) => <Icon.Star key={k} size={11} filled />)}
                </span>
                <div>
                  <div className="name">{it.name}</div>
                  <div className="city">{it.city}</div>
                </div>
                <div className="waveform">
                  {Array.from({length: 32}).map((_, k) => (
                    <span key={k} style={{ height: `${10 + Math.abs(Math.sin(k * 0.7 + i)) * 22}px` }}></span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="audio-controls">
        <button onClick={() => setPage(Math.max(0, safe - 1))} disabled={safe === 0} aria-label="Anterior">
          <Icon.ChevronLeft size={20} />
        </button>
        <div className="audio-progress">
          <div style={{ width: `${maxPage === 0 ? 100 : ((safe / maxPage) * 100)}%` }}></div>
        </div>
        <button onClick={() => setPage(Math.min(maxPage, safe + 1))} disabled={safe >= maxPage} aria-label="Próximo">
          <Icon.ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
/* ---------- Benefits Showcase (photo mosaic) ---------- */
function BenefitsShowcase() {
  return (
    <section className="showcase section">
      <div className="section-head">
        <span className="section-kicker">O que ele faz pelo seu corpo</span>
        <h2 className="section-title">Benefícios visíveis, <em>de dentro para fora.</em></h2>
        <p className="section-sub">Cada cápsula concentra os benefícios do óleo de avestruz — anti-inflamatório, antioxidante e regenerador natural.</p>
      </div>
      <div className="showcase-grid">
        <div className="showcase-cell intro">
          <div>
            <div className="kicker">Composição ativa</div>
            <h2>4 ômegas + vitaminas A e E em <em>uma única fonte.</em></h2>
            <p>Rico em ácidos graxos essenciais e vitaminas lipossolúveis, o óleo de avestruz tem composição semelhante à da pele humana — o que explica sua eficiência em hidratar, cicatrizar e regenerar.</p>
          </div>
          <div className="pills">
            <span>Anti-inflamatório</span>
            <span>Imunidade</span>
            <span>Pele e cabelos</span>
            <span>Cardiovascular</span>
            <span>Cicatrização</span>
            <span>Antioxidante</span>
          </div>
        </div>
        <div className="showcase-cell square">
          <img src="assets/benefit-callouts.png" alt="Quatro benefícios do Óleo de Avestruz: ação anti-inflamatória, regeneração da pele, saúde cardiovascular e imunidade" />
        </div>
        <div className="showcase-cell wide">
          <span className="corner-tag"><Icon.Shield size={12} /> Sistema Imunológico</span>
          <img src="assets/benefit-imune.png" alt="Óleo de Avestruz Amazon BSB com benefício para o sistema imunológico — alquilgliceróis e vitamina D₃" />
        </div>
        <div className="showcase-cell wide">
          <span className="corner-tag"><Icon.Drop size={12} /> Pele e Cabelos</span>
          <img src="assets/benefit-pele.png" alt="Óleo de Avestruz Amazon BSB — saúde da pele e cabelos com hidratação profunda" />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AudioTestimonials, BenefitsShowcase });

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-mark">
              AMAZON<Icon.Tree size={22} color="#a6b87a" /><b>BSB</b>
            </span>
            <p>O poder da natureza em cada gota. Suplemento natural rico em Ômegas 3, 6, 7 e 9 com a pureza da Amazônia.</p>
            <a href="https://wa.me/5561999545567" className="footer-whatsapp" target="_blank" rel="noreferrer">
              <Icon.WhatsApp size={16} /> (61) 99954-5567
            </a>
          </div>
          <div>
            <h5>Navegação</h5>
            <ul>
              <li><a href="#">Início</a></li>
              <li><a href="#produtos">Produtos</a></li>
              <li><a href="#kits">Kits</a></li>
              <li><a href="#">Atacado</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5>Atendimento</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Trocas e Devoluções</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">Fale Conosco</a></li>
            </ul>
          </div>
          <div>
            <h5>Pagamento</h5>
            <div className="footer-payments" style={{ flexWrap: 'wrap' }}>
              <span className="pay-badge">VISA</span>
              <span className="pay-badge">MASTER</span>
              <span className="pay-badge">PIX</span>
              <span className="pay-badge">BOLETO</span>
              <span className="pay-badge">ELO</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copy">© 2025 Amazon BSB — Todos os direitos reservados</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(245,240,216,0.5)' }}>
            <span>CNPJ 00.000.000/0001-00</span>
            <span>Brasília, DF</span>
          </div>
        </div>
        <div className="footer-legal">
          Suplemento alimentar. Não contém glúten. Mantenha fora do alcance de crianças. Não deve ser consumido por gestantes, lactantes e crianças sem orientação médica. Ao usar nosso site, você concorda com nossa Política de Privacidade.
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  ProductArt, UrgencyBar, Header, Hero, Credibility, Why, ProductCard, Products,
  Benefits, HowToUse, Testimonials, Kits, Guarantee, FAQ, WhatsAppFloat, Footer
});
