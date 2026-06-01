/* Main App — composes the page, cart state, tweaks */

const { useState, useEffect, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewMode": "desktop",
  "showUrgencyBar": true,
  "heroAutoplay": true,
  "accent": "olive"
}/*EDITMODE-END*/;

const ACCENT_THEMES = {
  olive:   { "--green-700": "#4a5a30", "--green-800": "#3d4a2a", "--green-900": "#2a3618", "--green-600": "#5a6e3a", "--gold": "#b89938" },
  forest:  { "--green-700": "#2f5a3a", "--green-800": "#1f4329", "--green-900": "#13301a", "--green-600": "#3f6a48", "--gold": "#b89938" },
  earth:   { "--green-700": "#5a4a2a", "--green-800": "#4a3a1d", "--green-900": "#2e2412", "--green-600": "#6a5a3a", "--gold": "#c89938" },
  amazon:  { "--green-700": "#3a6648", "--green-800": "#234d30", "--green-900": "#13351e", "--green-600": "#4a7657", "--gold": "#d4a836" },
};

/* ---------- Cart drawer ---------- */
function CartDrawer({ open, items, setItems, onClose, onCheckout }) {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const fretGoal = 150;
  const fretProgress = Math.min(100, (total / fretGoal) * 100);
  const remaining = Math.max(0, fretGoal - total);

  const updateQty = (id, delta) => {
    setItems(items.map(it => it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0));
  };
  const remove = (id) => setItems(items.filter(it => it.id !== id));

  return (
    <>
      <div className={"cart-backdrop " + (open ? "open" : "")} onClick={onClose}></div>
      <aside className={"cart-drawer " + (open ? "open" : "")}>
        <div className="cart-header">
          <h3>Seu carrinho ({items.length})</h3>
          <button className="icon-btn" onClick={onClose}><Icon.X size={20} /></button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <Icon.Cart size={36} />
              <p>Seu carrinho está vazio.<br/>Comece pelos kits mais pedidos.</p>
            </div>
          ) : items.map(it => (
            <div key={it.id} className="cart-item">
              <div className={"cart-item-img" + (it.img ? " has-photo" : "")}>
                {it.img ? <img src={it.img} alt={it.name} /> : <ProductArt kind={it.art} />}
              </div>
              <div>
                <div className="cart-item-name">{it.name}</div>
                <div className="cart-item-meta">3x de {BRL(it.parcela)}</div>
                <div className="qty">
                  <button onClick={() => updateQty(it.id, -1)}><Icon.Minus size={14} /></button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, +1)}><Icon.Plus size={14} /></button>
                </div>
              </div>
              <div>
                <div className="cart-item-price">{BRL(it.price * it.qty)}</div>
                <button onClick={() => remove(it.id)} style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-frete-progress">
              <div className="lbl">
                {remaining > 0
                  ? <>Falta <b style={{ color: 'var(--green-800)' }}>{BRL(remaining)}</b> para o frete grátis 🚚</>
                  : <><Icon.Check size={12} /> <b style={{ color: 'var(--green-800)' }}>Você ganhou frete grátis!</b></>
                }
              </div>
              <div className="bar"><div style={{ width: fretProgress + '%' }}></div></div>
            </div>
            <div className="cart-total">
              <small>Total · {items.reduce((s, i) => s + i.qty, 0)} itens</small>
              <b>{BRL(total)}</b>
            </div>
            <button className="btn btn-dark" onClick={onCheckout}>Finalizar compra <Icon.ArrowRight size={16} /></button>
          </div>
        )}
      </aside>
    </>
  );
}

/* ---------- Tweaks (built on starter helpers exposed on window) ---------- */
function Tweaks() {
  const [t, set] = window.useTweaks(TWEAK_DEFAULTS);

  // apply accent theme + mobile-preview class to body
  useEffect(() => {
    const root = document.documentElement;
    const theme = ACCENT_THEMES[t.accent] || ACCENT_THEMES.olive;
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [t.accent]);

  useEffect(() => {
    document.body.classList.toggle("mobile-preview", t.viewMode === "mobile");
  }, [t.viewMode]);

  // share with app via window
  useEffect(() => {
    window.__tweaks = t;
    window.dispatchEvent(new CustomEvent("tweaks-changed"));
  }, [t]);

  const TP = window.TweaksPanel;
  const TS = window.TweakSection;
  const TR = window.TweakRadio;
  const TT = window.TweakToggle;

  return (
    <TP title="Tweaks">
      <TS label="Visualização">
        <TR label="Modo" value={t.viewMode} onChange={v => set("viewMode", v)} options={[
          { value: "desktop", label: "Desktop" },
          { value: "mobile", label: "Mobile" },
        ]} />
      </TS>
      <TS label="Hero">
        <TT label="Carrossel automático" value={t.heroAutoplay} onChange={v => set("heroAutoplay", v)} />
        <TT label="Barra de urgência" value={t.showUrgencyBar} onChange={v => set("showUrgencyBar", v)} />
      </TS>
      <TS label="Paleta de verdes">
        <TR label="Tom" value={t.accent} onChange={v => set("accent", v)} options={[
          { value: "olive", label: "Oliva" },
          { value: "forest", label: "Floresta" },
          { value: "earth", label: "Terra" },
          { value: "amazon", label: "Amazônia" },
        ]} />
      </TS>
    </TP>
  );
}

/* ---------- App ---------- */
function App() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("amazo_cart") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [tweakState, setTweakState] = useState(() => window.__tweaks || TWEAK_DEFAULTS);
  const [waPopup, setWaPopup] = useState(false);

  // sync with tweaks
  useEffect(() => {
    const handler = () => setTweakState({ ...window.__tweaks });
    window.addEventListener("tweaks-changed", handler);
    return () => window.removeEventListener("tweaks-changed", handler);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("amazo_cart", JSON.stringify(items));
  }, [items]);

  // show WA popup after 12s (once per session)
  useEffect(() => {
    if (localStorage.getItem("amazo_popup_shown")) return;
    const t = setTimeout(() => setWaPopup(true), 12000);
    return () => clearTimeout(t);
  }, []);

  const addToCart = useCallback((p) => {
    setItems(prev => {
      const found = prev.find(i => i.id === p.id);
      if (found) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    setRecentlyAdded(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setRecentlyAdded(prev => { const n = { ...prev }; delete n[p.id]; return n; });
    }, 2000);
    setTimeout(() => setCartOpen(true), 350);
  }, []);


  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="site-shell" data-screen-label="Homepage">
      {tweakState.showUrgencyBar && <UrgencyBar />}
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero autoplay={tweakState.heroAutoplay} viewMode={tweakState.viewMode} />
      <Credibility />
      <Why />
      <Products onAdd={addToCart} addedMap={recentlyAdded} />
      <BenefitsShowcase />
      <Benefits />
      <HowToUse />
      <AudioTestimonials />
      <Testimonials />
      <Kits onAdd={addToCart} addedMap={recentlyAdded} />
      <Guarantee />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
      <CartDrawer
        open={cartOpen}
        items={items}
        setItems={setItems}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { window.location.href = "checkout.html"; }}
      />
      {waPopup && <WhatsAppPopup onClose={() => setWaPopup(false)} />}
    </div>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <Tweaks />
  </>
);
