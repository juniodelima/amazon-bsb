/* pagamento.jsx  Seleção de pagamento + integração PagBank */
const { useState } = React;
const BRL = (n) => "R$ " + Number(n).toFixed(2).replace(".", ",");

function Progress() {
  return (
    <div className="progress">
      <div className="progress-inner">
        {[["1","Dados","done"],["2","Pagamento","active"],["3","Obrigado","pending"]].map(([n,l,s]) => (
          <div key={n} className={"step " + (s === "active" ? "active" : "")}>
            <div className={"step-num " + s}>{s === "done" ? "✓" : n}</div>
            <div className="step-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PagamentoPage() {
  // useState garante que pending não some ao re-renderizar
  const [pending] = useState(() => {
    try { return JSON.parse(localStorage.getItem("amazo_pending_order") || "null"); } catch { return null; }
  });

  const [method, setMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (!pending) {
    return (
      <div>
        <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <p style={{ color:"#6b6f56", marginBottom:20 }}>Nenhum pedido em andamento.</p>
          <a href="index.html" style={{ padding:"12px 24px", borderRadius:10, background:"#3d4a2a", color:"white", fontWeight:700, fontSize:14 }}>Voltar à loja</a>
        </div>
      </div>
    );
  }

  const { cart, total, customer, sessionId } = pending;

  const handleConfirm = async () => {
    setErro("");
    setLoading(true);

    const orderId = "PED-" + Date.now();
    const pedido = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      status: "pendente",
      customer,
      payment: method,
    };

    // Salva localmente antes de ir para PagBank
    const orders = JSON.parse(localStorage.getItem("amazo_orders") || "[]");
    orders.unshift(pedido);
    localStorage.setItem("amazo_orders", JSON.stringify(orders));

    const localDb = JSON.parse(localStorage.getItem("amazo_customers") || "{}");
    const prev = localDb[customer.phone] || {};
    localDb[customer.phone] = { ...prev, ...customer, orderCount: (prev.orderCount || 0) + 1, lastSeen: new Date().toISOString() };
    localStorage.setItem("amazo_customers", JSON.stringify(localDb));

    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem("amazo_checkout_sessions") || "[]");
      const s = sessions.find(s => s.id === sessionId);
      if (s) { s.status = "completed"; s.orderId = orderId; localStorage.setItem("amazo_checkout_sessions", JSON.stringify(sessions)); }
      if (window.dbAtualizarStatusSessao) window.dbAtualizarStatusSessao(sessionId, "completed");
    }

    // Chama API para criar checkout no PagBank PRIMEIRO
    try {
      const resp = await fetch("/api/criar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, total, customer, orderId, paymentMethod: method }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.checkoutUrl) {
        console.error("Erro PagBank:", data);
        setErro("Não foi possível conectar com o PagBank. Tente novamente.");
        setLoading(false);
        return;
      }

      // Só salva e limpa depois de confirmar que a URL chegou
      if (window.dbSalvarPedido) window.dbSalvarPedido(pedido);
      localStorage.setItem("amazo_last_order", JSON.stringify({ orderId, customer, total, cart, payment: method }));
      localStorage.removeItem("amazo_cart");
      localStorage.removeItem("amazo_pending_order");

      // Redireciona para o checkout PagBank
      window.location.href = data.checkoutUrl;

    } catch (err) {
      console.error("Erro de rede:", err);
      setErro("Erro de conexão. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
      <Progress />

      <div className="pg-wrap">
        {/* Resumo */}
        <div className="pg-card">
          <div className="pg-card-head">Resumo do pedido</div>
          <div className="pg-card-body">
            {cart.map(it => (
              <div key={it.id} className="order-summary-line">
                <span>{it.name} <span style={{ color:"#6b6f56", fontSize:13 }}>×{it.qty}</span></span>
                <span>{BRL(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="order-summary-line" style={{ fontSize:13, color:"#6b6f56" }}>
              <span>Frete</span>
              <span style={{ color: total >= 150 ? "#3d4a2a" : "#6b6f56", fontWeight:600 }}>{total >= 150 ? "Grátis 🚚" : "A calcular"}</span>
            </div>
            <div className="order-summary-line total">
              <span>Total</span>
              <span>{BRL(total)}</span>
            </div>
            <div style={{ fontSize:13, color:"#6b6f56", marginTop:8 }}>
              Destinatário: <b style={{ color:"#3b4128" }}>{customer.name}</b>
              {customer.cep && <> · CEP: {customer.cep}</>}
            </div>
          </div>
        </div>

        {/* Forma de pagamento */}
        <div className="pg-card">
          <div className="pg-card-head">Prefere pagar com…</div>
          <div className="pg-card-body">
            <div className="pay-options">
              <div className={"pay-opt" + (method==="pix" ? " selected" : "")} onClick={() => setMethod("pix")}>
                <div className="pay-opt-radio" />
                <div>
                  <div className="pay-opt-label">💚 Pix  Aprovação imediata</div>
                  <div className="pay-opt-sub">Pague via Pix e tenha confirmação na hora.</div>
                </div>
              </div>

              <div className={"pay-opt" + (method==="cartao" ? " selected" : "")} onClick={() => setMethod("cartao")}>
                <div className="pay-opt-radio" />
                <div>
                  <div className="pay-opt-label">💳 Cartão de crédito  3x sem juros</div>
                  <div className="pay-opt-sub">Visa, Mastercard, Elo, Amex e outros.</div>
                </div>
              </div>

              <div className={"pay-opt" + (method==="boleto" ? " selected" : "")} onClick={() => setMethod("boleto")}>
                <div className="pay-opt-radio" />
                <div>
                  <div className="pay-opt-label">📄 Boleto bancário</div>
                  <div className="pay-opt-sub">Prazo: 1–3 dias úteis após pagamento.</div>
                </div>
              </div>
            </div>

            {erro && (
              <div style={{ marginTop:16, padding:"12px 16px", background:"#fff5f5", border:"1px solid #fed7d7", borderRadius:10, fontSize:13, color:"#c53030" }}>
                ⚠️ {erro}
              </div>
            )}

            <button
              className="confirm-btn"
              style={{ marginTop:24, opacity: loading ? 0.7 : 1 }}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "⏳ Conectando ao PagBank…" : "Continuar para pagamento →"}
            </button>

            <div style={{ marginTop:14, padding:"12px 16px", background:"#f5f0d8", borderRadius:10, fontSize:12, color:"#6b6f56", textAlign:"center", lineHeight:1.5 }}>
              🔒 Você será redirecionado para o ambiente seguro do <b>PagBank</b> para concluir o pagamento.
            </div>

            <div className="guarantee-row" style={{ marginTop:16 }}>
              <span>🔒 Ambiente seguro</span><span>·</span><span>SSL criptografado</span>
            </div>
          </div>
        </div>

        <a href="checkout.html" style={{ textAlign:"center", display:"block", fontSize:13, color:"#6b6f56" }}>← Voltar e editar dados</a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PagamentoPage />);
