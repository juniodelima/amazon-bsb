/* checkout.jsx — Dados do cliente + rastreio de abandono */
const { useState, useEffect } = React;

const BRL = window.BRL || ((n) => "R$ " + Number(n).toFixed(2).replace(".", ","));
const getCart = () => { try { return JSON.parse(localStorage.getItem("amazo_cart") || "[]"); } catch { return []; } };
const saveCart = (c) => localStorage.setItem("amazo_cart", JSON.stringify(c));

function startAbandonSession(cart, total) {
  const sessions = JSON.parse(localStorage.getItem("amazo_checkout_sessions") || "[]");
  const id = "CS-" + Date.now();
  sessions.unshift({ id, cart, total, startedAt: new Date().toISOString(), phone: "", status: "abandoned" });
  localStorage.setItem("amazo_checkout_sessions", JSON.stringify(sessions.slice(0, 200)));
  return id;
}

function updateSessionPhone(sessionId, phone) {
  const sessions = JSON.parse(localStorage.getItem("amazo_checkout_sessions") || "[]");
  const s = sessions.find(s => s.id === sessionId);
  if (s) { s.phone = phone; localStorage.setItem("amazo_checkout_sessions", JSON.stringify(sessions)); }
}

function Progress() {
  return (
    <div className="progress">
      <div className="progress-inner">
        {[["1","Dados","active"],["2","Pagamento","pending"],["3","Obrigado","pending"]].map(([n,l,s]) => (
          <div key={n} className={"step " + (s === "active" ? "active" : "")}>
            <div className={"step-num " + s}>{n}</div>
            <div className="step-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Checkout upsell: shown when total < R$150 ---- */
function CheckoutUpsell({ cart, setCart }) {
  // Find first single item that has a kit upsell
  const singleItem = cart.find(i => UPSELL_MAP && UPSELL_MAP[i.id]);
  if (!singleItem) return null;

  const info = UPSELL_MAP[singleItem.id];
  const kit = PRODUCTS && PRODUCTS.find(p => p.id === info.kitId);
  if (!kit) return null;

  // Don't show if kit already in cart
  if (cart.some(i => i.id === info.kitId)) return null;

  const mkCartItem = (p) => ({ id: p.id, name: p.name, price: p.price, parcela: p.parcela, qty: 1, img: p.img || null });

  const handleAdd = () => {
    const updated = [...cart, mkCartItem(kit)];
    setCart(updated);
    saveCart(updated);
  };

  const handleSwap = () => {
    // Replace the single item with the kit, keep other items
    const updated = cart.filter(i => i.id !== singleItem.id).concat([mkCartItem(kit)]);
    setCart(updated);
    saveCart(updated);
  };

  return (
    <div className="co-upsell">
      <div className="co-upsell-head">
        🚚 Ganhe frete grátis! Veja a oferta:
      </div>
      <div className="co-upsell-body">
        <div className="co-upsell-img">
          {kit.img && <img src={kit.img} alt={kit.name} />}
        </div>
        <div className="co-upsell-info">
          <div className="co-upsell-name">{kit.name}</div>
          <div className="co-upsell-sub">
            🎁 Economize R$ {info.savings.toFixed(2).replace(".", ",")} + frete grátis incluso
          </div>
          <div className="co-upsell-price">{BRL(kit.price)}</div>
          <div className="co-upsell-parcela">3x de {BRL(kit.parcela)} s/juros</div>
        </div>
        <div className="co-upsell-btns">
          <button className="co-upsell-add" onClick={handleAdd}>+ Adicionar</button>
          <button className="co-upsell-swap" onClick={handleSwap}>Trocar pelo kit</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const [cart, setCart] = useState(getCart);
  const [phone, setPhone]     = useState("");
  const [name, setName]       = useState("");
  const [cep, setCep]         = useState("");
  const [address, setAddress] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [errors, setErrors]   = useState({});
  const [sessionId]           = useState(() => {
    const c = getCart();
    const t = c.reduce((s, i) => s + i.price * i.qty, 0);
    return startAbandonSession(c, t);
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const freteFree = total >= 150;

  const fmtPhone = (v) => {
    const d = v.replace(/\D/g,"").slice(0,11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };
  const fmtCep = (v) => {
    const d = v.replace(/\D/g,"").slice(0,8);
    return d.length <= 5 ? d : `${d.slice(0,5)}-${d.slice(5)}`;
  };

  const lookupCustomer = (digits) => {
    const db = JSON.parse(localStorage.getItem("amazo_customers") || "{}");
    const c = db[digits];
    if (c) {
      if (c.name)    setName(c.name);
      if (c.cep)     setCep(c.cep);
      if (c.address) setAddress(c.address);
      setAutoFilled(true);
    } else {
      setAutoFilled(false);
    }
  };

  const handlePhone = (v) => {
    const fmt = fmtPhone(v);
    setPhone(fmt);
    setErrors(e => ({ ...e, phone: "" }));
    const d = fmt.replace(/\D/g,"");
    if (d.length >= 10) {
      lookupCustomer(d);
      updateSessionPhone(sessionId, d);
    } else setAutoFilled(false);
  };

  const updateQty = (id, delta) => {
    const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
    setCart(updated);
    saveCart(updated);
  };

  const validate = () => {
    const e = {};
    if (phone.replace(/\D/g,"").length < 10) e.phone = "WhatsApp obrigatório (com DDD).";
    if (!name.trim()) e.name = "Nome obrigatório.";
    return e;
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const digits = phone.replace(/\D/g,"");

    // Update customer profile
    const db = JSON.parse(localStorage.getItem("amazo_customers") || "{}");
    const prev = db[digits] || {};
    db[digits] = { ...prev, phone: digits, name: name.trim(), cep, address: address.trim(), lastSeen: new Date().toISOString() };
    localStorage.setItem("amazo_customers", JSON.stringify(db));

    // Save pending order data for payment page
    localStorage.setItem("amazo_pending_order", JSON.stringify({
      cart,
      total,
      customer: { name: name.trim(), phone: digits, cep, address: address.trim() },
      sessionId,
    }));

    window.location.href = "pagamento.html";
  };

  if (cart.length === 0) {
    return (
      <div>
        <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <p style={{ fontSize:16, color:"#6b6f56", marginBottom:20 }}>Seu carrinho está vazio.</p>
          <a href="index.html" style={{ padding:"12px 24px", borderRadius:10, background:"#3d4a2a", color:"white", fontWeight:700, fontSize:14 }}>Voltar à loja</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
      <Progress />

      <div className="co-wrap">
        {/* Form */}
        <div>
          <div className="co-card">
            <div className="co-card-head">Seus dados</div>
            <div className="co-card-body">
              {autoFilled && (
                <div className="autofill-badge">✓ Dados preenchidos automaticamente</div>
              )}
              <div className="f-field">
                <label>WhatsApp com DDD *</label>
                <input type="tel" placeholder="(61) 99999-9999" value={phone} onChange={e => handlePhone(e.target.value)} className={errors.phone ? "err" : ""} autoFocus />
                {errors.phone && <span className="f-err">{errors.phone}</span>}
              </div>
              <div className="f-field">
                <label>Nome completo *</label>
                <input type="text" placeholder="Seu nome" value={name} onChange={e => { setName(e.target.value); setErrors(er => ({...er,name:""})); }} className={errors.name ? "err" : ""} />
                {errors.name && <span className="f-err">{errors.name}</span>}
              </div>
              <div className="f-row2">
                <div className="f-field">
                  <label>CEP</label>
                  <input type="text" placeholder="00000-000" value={cep} onChange={e => setCep(fmtCep(e.target.value))} />
                </div>
                <div className="f-field">
                  <label>Endereço</label>
                  <input type="text" placeholder="Rua, número, bairro" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
              <button className="submit-btn" onClick={handleSubmit}>
                Ir para pagamento →
              </button>
              <p className="co-note">Seus dados ficam salvos para facilitar a próxima compra.</p>
            </div>
          </div>
          <a href="index.html" className="back-link">← Continuar comprando</a>
        </div>

        {/* Cart summary */}
        <div>
          <div className="co-card">
            <div className="co-card-head">Resumo do pedido</div>
            <div className="co-card-body">
              {cart.map(it => (
                <div key={it.id} className="cart-line">
                  <div className="cart-line-img">
                    {it.img ? <img src={it.img} alt={it.name} /> : <div style={{ width:"100%", height:"100%", background:"#e8edd4" }} />}
                  </div>
                  <div style={{ flex:1 }}>
                    <div className="cart-line-name">{it.name}</div>
                    <div className="cart-line-meta">3x de {BRL(it.parcela)} s/juros</div>
                    <div className="qty-ctrl">
                      <button onClick={() => updateQty(it.id, -1)}>−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => updateQty(it.id, +1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-line-price">{BRL(it.price * it.qty)}</div>
                </div>
              ))}
              <div style={{ marginTop:16, padding:"12px 14px", background: freteFree ? "#e8edd4" : "#fef3c7", borderRadius:10, fontSize:13, fontWeight:600, color: freteFree ? "#3d4a2a" : "#92400e" }}>
                {freteFree ? "🚚 Frete grátis incluso!" : `Falta ${BRL(150 - total)} para frete grátis 🚚`}
              </div>
              {!freteFree && <CheckoutUpsell cart={cart} setCart={setCart} />}
              <div className="total-row">
                <span style={{ fontSize:14, color:"#6b6f56" }}>Total</span>
                <b>{BRL(total)}</b>
              </div>
            </div>
          </div>
          <div className="guarantee-row">
            <span>🔒 Pagamento seguro</span>
            <span>·</span>
            <span>📦 Entrega rastreada</span>
            <span>·</span>
            <span>✅ Produto original</span>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CheckoutPage />);
