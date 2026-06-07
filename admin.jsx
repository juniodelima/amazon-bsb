/* Admin Panel  Amazon BSB */
const { useState, useEffect, useMemo, useCallback } = React;

const BRL = (n) => "R$ " + Number(n).toFixed(2).replace(".", ",");
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};
const fmtPhone = (v) => {
  const d = String(v || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

// ---- Mock data seeded once ----
const MOCK_ORDERS = [
  { id:"PED-001", date:"2025-05-28T10:23:00Z", status:"entregue",  total:75.90,  customer:{name:"Marina Souza",   phone:"61999001001",email:"marina@email.com"},  items:[{id:"caps-60",   name:"Cápsulas 60un",      qty:1,price:75.90}] },
  { id:"PED-002", date:"2025-05-27T14:10:00Z", status:"enviado",   total:274.90, customer:{name:"Carlos Ribeiro", phone:"62988002002",email:"carlos@email.com"},  items:[{id:"kit3-caps90",name:"Kit 3x 90 caps",     qty:1,price:274.90}] },
  { id:"PED-003", date:"2025-05-26T09:45:00Z", status:"entregue",  total:219.90, customer:{name:"Patrícia Lima",  phone:"11977003003",email:"patricia@email.com"}, items:[{id:"kit3-gotas", name:"Kit 3x Gotas 50ml",  qty:1,price:219.90}] },
  { id:"PED-004", date:"2025-05-25T16:30:00Z", status:"pendente",  total:94.90,  customer:{name:"João Mendes",   phone:"61966004004",email:"joao@email.com"},    items:[{id:"caps-90",   name:"Cápsulas 90un",      qty:1,price:94.90}] },
  { id:"PED-005", date:"2025-05-24T11:55:00Z", status:"entregue",  total:424.90, customer:{name:"Fernanda Costa", phone:"21955005005",email:"fern@email.com"},    items:[{id:"kit5-caps90",name:"Kit 5x 90 caps",     qty:1,price:424.90}] },
  { id:"PED-006", date:"2025-05-23T08:20:00Z", status:"cancelado", total:75.90,  customer:{name:"Roberto Silva",  phone:"31944006006",email:"rob@email.com"},     items:[{id:"gotas-50ml", name:"Gotas 50ml",         qty:1,price:75.90}] },
  { id:"PED-007", date:"2025-05-22T13:00:00Z", status:"enviado",   total:359.90, customer:{name:"Ana Paula",     phone:"61933007007",email:"ana@email.com"},     items:[{id:"kit5-caps60",name:"Kit 5x 60 caps",     qty:1,price:359.90}] },
  { id:"PED-008", date:"2025-05-21T17:40:00Z", status:"entregue",  total:151.80, customer:{name:"Marcos Neto",   phone:"61922008008",email:"marcos@email.com"},  items:[{id:"caps-60",   name:"Cápsulas 60un",      qty:2,price:75.90}] },
];

const MOCK_LEADS = [
  { id:1, phone:"61999111001", coupon:"PRIMEIRACOMPRA10", date:"2025-05-28T10:00:00Z", source:"popup" },
  { id:2, phone:"62988222002", coupon:"PRIMEIRACOMPRA10", date:"2025-05-27T14:00:00Z", source:"popup" },
  { id:3, phone:"11977333003", coupon:"PRIMEIRACOMPRA10", date:"2025-05-26T09:00:00Z", source:"popup" },
  { id:4, phone:"61966444004", coupon:"PRIMEIRACOMPRA10", date:"2025-05-25T16:00:00Z", source:"popup" },
  { id:5, phone:"21955555005", coupon:"PRIMEIRACOMPRA10", date:"2025-05-24T11:00:00Z", source:"popup" },
];

const DEFAULT_STOCK = {
  "gotas-50ml":  { name:"Gotas 50ml",         qty:48, min:10 },
  "caps-60":     { name:"Cápsulas 60un",       qty:12, min:15 },
  "caps-90":     { name:"Cápsulas 90un",       qty:75, min:10 },
  "kit3-gotas":  { name:"Kit 3x Gotas",        qty:22, min:5  },
  "kit3-caps60": { name:"Kit 3x Cáps 60un",   qty:18, min:5  },
  "kit3-caps90": { name:"Kit 3x Cáps 90un",   qty:31, min:5  },
  "kit5-caps60": { name:"Kit 5x Cáps 60un",   qty:9,  min:3  },
  "kit5-gotas":  { name:"Kit 5x Gotas",        qty:14, min:3  },
  "kit5-caps90": { name:"Kit 5x Cáps 90un",   qty:6,  min:3  },
};

function seedIfEmpty() {
  if (!localStorage.getItem("amazo_stock")) localStorage.setItem("amazo_stock", JSON.stringify(DEFAULT_STOCK));
}

// ---- Helpers ----
const STATUS_LABEL = { pendente:"Pendente", enviado:"Enviado", entregue:"Entregue", cancelado:"Cancelado" };
const STATUS_COLOR = { pendente:"#b89938", enviado:"#4a5a30", entregue:"#25d366", cancelado:"#e53e3e" };

// ---- Login ----
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw === "admin123") { localStorage.setItem("amazo_admin_token","1"); onLogin(); }
    else setErr(true);
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f0d8" }}>
      <div style={{ background:"white", borderRadius:20, padding:"44px 36px", width:360, boxShadow:"0 16px 40px rgba(35,40,18,.12)", textAlign:"center" }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"#3d4a2a", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ margin:"0 0 4px 0", fontSize:22, color:"#2a3618" }}>Área administrativa</h2>
        <p style={{ margin:"0 0 24px 0", fontSize:14, color:"#6b6f56" }}>Amazon BSB</p>
        <input
          type="password" placeholder="Senha"
          value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width:"100%", padding:"13px 16px", borderRadius:10, border: err ? "1.5px solid #e53e3e" : "1.5px solid #e3decb", fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:10, textAlign:"center", letterSpacing:4 }}
        />
        {err && <p style={{ color:"#e53e3e", fontSize:13, margin:"0 0 10px 0" }}>Senha incorreta.</p>}
        <button onClick={submit} style={{ width:"100%", padding:14, borderRadius:10, background:"#3d4a2a", color:"white", fontSize:15, fontWeight:700, cursor:"pointer", border:"none" }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

// ---- Metric card ----
function Metric({ label, value, sub, color }) {
  return (
    <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, padding:"24px 22px" }}>
      <div style={{ fontSize:12, color:"#6b6f56", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:800, color: color || "#2a3618", letterSpacing:"-0.02em", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:13, color:"#6b6f56", marginTop:6 }}>{sub}</div>}
    </div>
  );
}

// ---- Dashboard tab ----
function Dashboard({ orders, leads, stock, sessions }) {
  const revenue = orders.filter(o => o.status !== "cancelado").reduce((s, o) => s + o.total, 0);
  const lowStock = Object.values(stock).filter(s => s.qty <= s.min).length;

  const localSessions = JSON.parse(localStorage.getItem("amazo_checkout_sessions") || "[]");
  const allSessions = (sessions && sessions.length > 0) ? sessions : localSessions;
  const abandoned = allSessions.filter(s => {
    if (s.status !== "abandoned") return false;
    return (Date.now() - new Date(s.startedAt).getTime()) > 30 * 60 * 1000;
  }).slice(0, 20);

  // Sales by product
  const prodSales = {};
  orders.filter(o => o.status !== "cancelado").forEach(o => {
    o.items.forEach(it => {
      prodSales[it.name] = (prodSales[it.name] || 0) + it.qty;
    });
  });
  const ranking = Object.entries(prodSales).sort((a,b) => b[1]-a[1]).slice(0,6);
  const maxSales = ranking[0]?.[1] || 1;

  // Revenue last 7 days
  const days = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0,10);
  });
  const revenueByDay = days.map(day => ({
    label: new Date(day + "T12:00:00").toLocaleDateString("pt-BR", { weekday:"short", day:"numeric" }),
    value: orders.filter(o => o.status !== "cancelado" && o.date.slice(0,10) === day).reduce((s,o) => s+o.total, 0),
  }));
  const maxDay = Math.max(...revenueByDay.map(d => d.value), 1);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <Metric label="Total de pedidos" value={orders.length} sub={`${orders.filter(o=>o.status==="pendente").length} pendentes`} />
        <Metric label="Receita total" value={BRL(revenue)} sub="excluindo cancelados" color="#3d4a2a" />
        <Metric label="Leads coletados" value={leads.length} sub="via popup WhatsApp" />
        <Metric label="Estoque baixo" value={lowStock} sub="produtos abaixo do mínimo" color={lowStock > 0 ? "#e53e3e" : "#25d366"} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16 }}>
        {/* Abandoned carts alert */}
      {abandoned.length > 0 && (
        <div style={{ background:"white", border:"1.5px solid #fed7d7", borderRadius:16, padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>⚠️</span>
            <div style={{ fontSize:14, fontWeight:700, color:"#c53030" }}>
              {abandoned.length} carrinho{abandoned.length > 1 ? "s" : ""} abandonado{abandoned.length > 1 ? "s" : ""} nas últimas horas
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {abandoned.slice(0,5).map((s, i) => {
              const ago = Math.round((Date.now() - new Date(s.startedAt).getTime()) / 60000);
              const hours = Math.floor(ago / 60);
              const mins = ago % 60;
              const timeAgo = hours > 0 ? `${hours}h ${mins}min atrás` : `${mins}min atrás`;
              const items = (s.cart || []).map(it => `${it.name} ×${it.qty}`).join(", ");
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#fff5f5", borderRadius:10, fontSize:13 }}>
                  <div style={{ flex:1 }}>
                    <span style={{ fontWeight:700, color:"#2a3618" }}>
                      {s.phone ? (
                        <a href={`https://wa.me/55${s.phone}`} target="_blank" rel="noreferrer" style={{ color:"#25d366" }}>
                          {fmtPhone(s.phone)}
                        </a>
                      ) : "Anônimo"}
                    </span>
                    <span style={{ color:"#6b6f56", marginLeft:8 }}>· {items || ""}</span>
                  </div>
                  <div style={{ fontWeight:700, color:"#c53030", whiteSpace:"nowrap" }}>{BRL(s.total || 0)}</div>
                  <div style={{ color:"#6b6f56", fontSize:11, whiteSpace:"nowrap" }}>{timeAgo}</div>
                  {s.phone && (
                    <a href={`https://wa.me/55${s.phone}?text=${encodeURIComponent("Oi! Vi que você deixou itens no carrinho da Amazon BSB. Posso te ajudar a finalizar seu pedido? 😊")}`}
                      target="_blank" rel="noreferrer"
                      style={{ padding:"6px 12px", borderRadius:8, background:"#25d366", color:"white", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>
                      Recuperar
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Revenue chart */}
        <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, padding:"24px 22px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#2a3618", marginBottom:20 }}>Receita  últimos 7 dias</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
            {revenueByDay.map((d, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", background: d.value > 0 ? "#3d4a2a" : "#e3decb", borderRadius:"4px 4px 0 0", height: (d.value / maxDay * 100) + "px", minHeight: d.value > 0 ? 4 : 0, transition:"height .3s" }} />
                <div style={{ fontSize:10, color:"#6b6f56", whiteSpace:"nowrap" }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product ranking */}
        <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, padding:"24px 22px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#2a3618", marginBottom:16 }}>Ranking de produtos</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {ranking.map(([name, qty], i) => (
              <div key={name}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <span style={{ color:"#3b4128", fontWeight:600 }}>{i+1}. {name}</span>
                  <span style={{ color:"#6b6f56" }}>{qty} un.</span>
                </div>
                <div style={{ height:6, background:"#e8edd4", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width: (qty/maxSales*100) + "%", height:"100%", background:"#4a5a30", borderRadius:3 }} />
                </div>
              </div>
            ))}
            {ranking.length === 0 && <div style={{ fontSize:13, color:"#6b6f56" }}>Nenhum pedido ainda.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Orders tab ----
function Orders({ orders, setOrders }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = filter === "todos" || o.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q || o.id.toLowerCase().includes(q)
        || (o.customer.name || "").toLowerCase().includes(q)
        || (o.customer.phone || "").includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, filter, search]);

  const updateStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem("amazo_orders", JSON.stringify(updated));
    if (window.dbAtualizarStatusPedido) window.dbAtualizarStatusPedido(id, status);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
        <input
          type="text" placeholder="Buscar por ID, nome ou telefone…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:10, border:"1.5px solid #e3decb", fontSize:14, fontFamily:"inherit", outline:"none" }}
        />
        {["todos","pendente","enviado","entregue","cancelado"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:"8px 14px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer", border: filter===s ? "none" : "1px solid #e3decb", background: filter===s ? "#3d4a2a" : "white", color: filter===s ? "white" : "#3b4128" }}>
            {s === "todos" ? "Todos" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#faf7e8", borderBottom:"1px solid #e3decb" }}>
              {["Pedido","Data","Cliente","Telefone","Produtos","Total","Status","Ação"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:700, color:"#3b4128", fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding:"32px 16px", textAlign:"center", color:"#6b6f56" }}>Nenhum pedido encontrado.</td></tr>
            )}
            {filtered.map(o => (
              <tr key={o.id} style={{ borderBottom:"1px solid #e3decb" }}>
                <td style={{ padding:"12px 16px", fontWeight:700, color:"#2a3618" }}>{o.id}</td>
                <td style={{ padding:"12px 16px", color:"#6b6f56", whiteSpace:"nowrap" }}>{fmtDate(o.date)}</td>
                <td style={{ padding:"12px 16px", fontWeight:600, color:"#3b4128" }}>{o.customer.name || ""}</td>
                <td style={{ padding:"12px 16px" }}>
                  {o.customer.phone ? (
                    <a href={`https://wa.me/55${o.customer.phone}`} target="_blank" rel="noreferrer" style={{ color:"#25d366", fontWeight:600 }}>
                      {fmtPhone(o.customer.phone)}
                    </a>
                  ) : ""}
                </td>
                <td style={{ padding:"12px 16px", color:"#3b4128" }}>{o.items.map(it => `${it.name} ×${it.qty}`).join(", ")}</td>
                <td style={{ padding:"12px 16px", fontWeight:700, color:"#2a3618", whiteSpace:"nowrap" }}>{BRL(o.total)}</td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background: STATUS_COLOR[o.status] + "22", color: STATUS_COLOR[o.status] }}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #e3decb", fontSize:12, fontFamily:"inherit", cursor:"pointer", background:"white" }}>
                    {Object.entries(STATUS_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Customers/Leads tab ----
function Customers({ leads, orders, customers }) {
  const [search, setSearch] = useState("");

  // merge amazo_customers + leads + order customers by phone
  const allCustomers = useMemo(() => {
    const map = {};

    // 1. Base: registered customers (have name + address from checkout)
    Object.values(customers || {}).forEach(c => {
      map[c.phone] = {
        phone: c.phone, name: c.name || "", cep: c.cep || "",
        address: c.address || "", coupon: "", firstSeen: c.lastSeen || "",
        source: "compra", orders: [], orderCount: c.orderCount || 0,
      };
    });

    // 2. Leads from popup (may not have ordered yet)
    leads.forEach(l => {
      const k = l.phone;
      if (!map[k]) map[k] = { phone: k, name:"", cep:"", address:"", coupon: l.coupon, firstSeen: l.date, source: "popup", orders: [], orderCount: 0 };
      else if (!map[k].coupon) map[k].coupon = l.coupon;
      if (!map[k].firstSeen || new Date(l.date) < new Date(map[k].firstSeen)) map[k].firstSeen = l.date;
    });

    // 3. Orders (ensure all order customers appear)
    orders.forEach(o => {
      const k = (o.customer.phone || "").replace(/\D/g,"");
      if (!k) return;
      if (!map[k]) map[k] = { phone: k, name: o.customer.name || "", cep:"", address:"", coupon:"", firstSeen: o.date, source:"pedido", orders: [], orderCount: 0 };
      else {
        if (o.customer.name && !map[k].name) map[k].name = o.customer.name;
        if (!map[k].firstSeen || new Date(o.date) < new Date(map[k].firstSeen)) map[k].firstSeen = o.date;
      }
      map[k].orders.push(o);
    });

    return Object.values(map).sort((a,b) => new Date(b.firstSeen) - new Date(a.firstSeen));
  }, [leads, orders, customers]);

  const filtered = allCustomers.filter(c => {
    const q = search.toLowerCase();
    return !q || (c.name||"").toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <input
        type="text" placeholder="Buscar por nome ou telefone…"
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", maxWidth:360, padding:"10px 14px", borderRadius:10, border:"1.5px solid #e3decb", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
      />
      <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#faf7e8", borderBottom:"1px solid #e3decb" }}>
              {["WhatsApp","Nome","Endereço","Cupom","Pedidos","Total gasto","Origem","Desde"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:700, color:"#3b4128", fontSize:12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding:"32px 16px", textAlign:"center", color:"#6b6f56" }}>Nenhum cliente encontrado.</td></tr>
            )}
            {filtered.map(c => {
              const spent = c.orders.filter(o => o.status !== "cancelado").reduce((s,o) => s+o.total, 0);
              const totalOrders = c.orders.length || c.orderCount || 0;
              const sourceLabel = { compra:"Compra", popup:"Popup WA", pedido:"Pedido" }[c.source] || c.source;
              const sourceColor = c.source === "popup"
                ? { bg:"#e8f4fd", color:"#2b6cb0" }
                : c.source === "compra"
                ? { bg:"#e8edd4", color:"#3d4a2a" }
                : { bg:"#fef3c7", color:"#92400e" };
              return (
                <tr key={c.phone} style={{ borderBottom:"1px solid #e3decb" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <a href={`https://wa.me/55${c.phone}`} target="_blank" rel="noreferrer" style={{ color:"#25d366", fontWeight:700 }}>
                      {fmtPhone(c.phone)}
                    </a>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#3b4128", fontWeight:600 }}>{c.name || ""}</td>
                  <td style={{ padding:"12px 16px", color:"#6b6f56", fontSize:12 }}>
                    {c.address ? (
                      <span title={c.address}>
                        {c.cep ? <b style={{ color:"#3b4128" }}>{c.cep} · </b> : null}
                        {c.address.length > 28 ? c.address.slice(0,28) + "…" : c.address}
                      </span>
                    ) : ""}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    {c.coupon ? <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, background:"#e8edd4", padding:"3px 8px", borderRadius:6, color:"#3d4a2a" }}>{c.coupon}</span> : ""}
                  </td>
                  <td style={{ padding:"12px 16px", textAlign:"center", fontWeight:700, color:"#2a3618" }}>{totalOrders}</td>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:"#2a3618" }}>{spent > 0 ? BRL(spent) : ""}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background: sourceColor.bg, color: sourceColor.color }}>
                      {sourceLabel}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#6b6f56", whiteSpace:"nowrap" }}>{c.firstSeen ? new Date(c.firstSeen).toLocaleDateString("pt-BR") : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Stock tab ----
function Stock({ stock, setStock }) {
  const adjust = (id, delta) => {
    const updated = { ...stock, [id]: { ...stock[id], qty: Math.max(0, stock[id].qty + delta) } };
    setStock(updated);
    localStorage.setItem("amazo_stock", JSON.stringify(updated));
  };
  const setMin = (id, val) => {
    const updated = { ...stock, [id]: { ...stock[id], min: Math.max(0, parseInt(val) || 0) } };
    setStock(updated);
    localStorage.setItem("amazo_stock", JSON.stringify(updated));
  };

  return (
    <div style={{ background:"white", border:"1px solid #e3decb", borderRadius:16, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#faf7e8", borderBottom:"1px solid #e3decb" }}>
            {["Produto","Estoque atual","Estoque mín.","Status","Ajustar"].map(h => (
              <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:700, color:"#3b4128", fontSize:12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(stock).map(([id, s]) => {
            const low = s.qty <= s.min;
            return (
              <tr key={id} style={{ borderBottom:"1px solid #e3decb", background: low ? "#fff5f5" : "white" }}>
                <td style={{ padding:"12px 16px", fontWeight:600, color:"#3b4128" }}>{s.name}</td>
                <td style={{ padding:"12px 16px", fontWeight:800, fontSize:18, color: low ? "#e53e3e" : "#2a3618" }}>{s.qty}</td>
                <td style={{ padding:"12px 16px" }}>
                  <input
                    type="number" min={0} value={s.min}
                    onChange={e => setMin(id, e.target.value)}
                    style={{ width:60, padding:"6px 8px", borderRadius:8, border:"1px solid #e3decb", fontSize:13, fontFamily:"inherit", textAlign:"center" }}
                  />
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background: low ? "#fed7d7" : "#e8edd4", color: low ? "#c53030" : "#3d4a2a" }}>
                    {low ? "⚠ Baixo" : "OK"}
                  </span>
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => adjust(id, -1)} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e3decb", background:"white", cursor:"pointer", fontSize:16, fontWeight:700, color:"#e53e3e", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <button onClick={() => adjust(id, +1)} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e3decb", background:"white", cursor:"pointer", fontSize:16, fontWeight:700, color:"#3d4a2a", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>+</button>
                    <button onClick={() => adjust(id, +10)} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid #e3decb", background:"white", cursor:"pointer", fontSize:12, fontWeight:700, color:"#3d4a2a" }}>+10</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---- Admin App ----
function AdminApp() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("amazo_admin_token"));
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders]     = useState([]);
  const [leads, setLeads]       = useState([]);
  const [stock, setStock]       = useState({});
  const [customers, setCustomers] = useState({});
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!authed) return;
    seedIfEmpty();
    setStock(JSON.parse(localStorage.getItem("amazo_stock") || JSON.stringify(DEFAULT_STOCK)));

    if (!window.db) {
      setOrders(JSON.parse(localStorage.getItem("amazo_orders") || "[]"));
      setLeads(JSON.parse(localStorage.getItem("amazo_leads") || "[]"));
      setCustomers(JSON.parse(localStorage.getItem("amazo_customers") || "{}"));
      return;
    }

    Promise.all([
      window.db.from('pedidos').select('*').order('data', { ascending: false }).limit(500),
      window.db.from('leads').select('*').order('criado_em', { ascending: false }).limit(1000),
      window.db.from('clientes').select('*').limit(1000),
      window.db.from('sessoes_checkout').select('*').order('iniciado_em', { ascending: false }).limit(200),
    ]).then(([{ data: pedidos }, { data: leadsData }, { data: clientesData }, { data: sessoesData }]) => {
      if (pedidos) setOrders(pedidos.map(p => ({
        id: p.id, date: p.data, items: p.itens, total: Number(p.total),
        status: p.status, payment: p.pagamento,
        customer: { name: p.cliente_nome, phone: p.cliente_telefone, cep: p.cliente_cep, address: p.cliente_endereco },
      })));

      if (leadsData) setLeads(leadsData.map(l => ({
        id: l.id, phone: l.telefone, coupon: l.cupom, date: l.criado_em, source: l.fonte,
      })));

      if (clientesData) {
        const cm = {};
        clientesData.forEach(c => {
          cm[c.telefone] = { phone: c.telefone, name: c.nome, cep: c.cep, address: c.endereco, orderCount: c.num_pedidos };
        });
        setCustomers(cm);
      }

      if (sessoesData) setSessions(sessoesData.map(s => ({
        id: s.id, phone: s.telefone, cart: s.cart, total: Number(s.total), status: s.status, startedAt: s.iniciado_em,
      })));
    }).catch(e => {
      console.warn('Supabase load error:', e);
      setOrders(JSON.parse(localStorage.getItem("amazo_orders") || "[]"));
      setLeads(JSON.parse(localStorage.getItem("amazo_leads") || "[]"));
      setCustomers(JSON.parse(localStorage.getItem("amazo_customers") || "{}"));
    });
  }, [authed]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const tabs = [
    { key:"dashboard", label:"Dashboard" },
    { key:"orders",    label:`Pedidos (${orders.length})` },
    { key:"customers", label:`Clientes (${leads.length + [...new Set(orders.map(o => o.customer.phone).filter(Boolean))].length})` },
    { key:"stock",     label:"Estoque" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f5f0d8", fontFamily:"'Manrope', system-ui, sans-serif" }}>
      {/* Topbar */}
      <header style={{ background:"#2a3618", color:"#ebe4c2", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontWeight:800, fontSize:18, letterSpacing:"0.04em" }}>AMAZON<span style={{ color:"#a6b87a" }}>BSB</span></span>
          <span style={{ fontSize:11, color:"rgba(245,240,216,.5)", borderLeft:"1px solid rgba(245,240,216,.15)", paddingLeft:12, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em" }}>ADMIN</span>
        </div>
        <button onClick={() => { localStorage.removeItem("amazo_admin_token"); setAuthed(false); }} style={{ fontSize:12, color:"rgba(245,240,216,.6)", background:"none", border:"none", cursor:"pointer", padding:"6px 10px" }}>
          Sair
        </button>
      </header>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"28px 24px" }}>
        {/* Tabs */}
        <nav style={{ display:"flex", gap:4, marginBottom:24, borderBottom:"1px solid #e3decb", paddingBottom:0 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:"10px 18px", borderRadius:"8px 8px 0 0", border:"1px solid " + (tab===t.key ? "#e3decb" : "transparent"), borderBottom: tab===t.key ? "1px solid #f5f0d8" : "none", background: tab===t.key ? "#f5f0d8" : "transparent", fontWeight:700, fontSize:13, color: tab===t.key ? "#2a3618" : "#6b6f56", cursor:"pointer", marginBottom: tab===t.key ? -1 : 0, position:"relative" }}>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "dashboard" && <Dashboard orders={orders} leads={leads} stock={stock} sessions={sessions} />}
        {tab === "orders"    && <Orders    orders={orders} setOrders={setOrders} />}
        {tab === "customers" && <Customers leads={leads} orders={orders} customers={customers} />}
        {tab === "stock"     && <Stock     stock={stock} setStock={setStock} />}
      </div>
    </div>
  );
}

const adminRoot = ReactDOM.createRoot(document.getElementById("root"));
adminRoot.render(<AdminApp />);
