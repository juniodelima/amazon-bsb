/* pagamento.jsx — Seleção de pagamento */
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
  const pending = (() => {
    try { return JSON.parse(localStorage.getItem("amazo_pending_order") || "null"); } catch { return null; }
  })();

  const [method, setMethod] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

  const fmtCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d; };

  const handleConfirm = () => {
    const orderId = "PED-" + Date.now();

    // Save final order
    const orders = JSON.parse(localStorage.getItem("amazo_orders") || "[]");
    orders.unshift({
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      status: "pendente",
      customer,
      payment: method,
    });
    localStorage.setItem("amazo_orders", JSON.stringify(orders));

    // Update customer orderCount
    const db = JSON.parse(localStorage.getItem("amazo_customers") || "{}");
    const prev = db[customer.phone] || {};
    db[customer.phone] = { ...prev, ...customer, orderCount: (prev.orderCount || 0) + 1, lastSeen: new Date().toISOString() };
    localStorage.setItem("amazo_customers", JSON.stringify(db));

    // Mark session as completed
    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem("amazo_checkout_sessions") || "[]");
      const s = sessions.find(s => s.id === sessionId);
      if (s) { s.status = "completed"; s.orderId = orderId; localStorage.setItem("amazo_checkout_sessions", JSON.stringify(sessions)); }
    }

    // Clear cart + pending
    localStorage.removeItem("amazo_cart");
    localStorage.removeItem("amazo_pending_order");

    // Save order id for obrigado page
    localStorage.setItem("amazo_last_order", JSON.stringify({ orderId, customer, total, cart, payment: method }));

    window.location.href = "obrigado.html";
  };

  return (
    <div>
      <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
      <Progress />

      <div className="pg-wrap">
        {/* Order summary */}
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

        {/* Payment */}
        <div className="pg-card">
          <div className="pg-card-head">Forma de pagamento</div>
          <div className="pg-card-body">
            <div className="pay-options">
              {/* PIX */}
              <div className={"pay-opt" + (method==="pix" ? " selected" : "")} onClick={() => setMethod("pix")}>
                <div className="pay-opt-radio" />
                <div>
                  <div className="pay-opt-label">💚 Pix — Aprovação imediata</div>
                  <div className="pay-opt-sub">Escaneie o QR Code ou copie a chave. Prazo: imediato.</div>
                  {method === "pix" && (
                    <div className="pix-box">
                      <div style={{ fontSize:13, color:"#6b6f56", marginBottom:6 }}>Chave Pix:</div>
                      <div className="pix-key">amazo.bsb@pagamento.com.br</div>
                      <div className="pix-note">Após o pagamento, nossa equipe confirmará e enviará o pedido em até 1 dia útil.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cartão */}
              <div className={"pay-opt" + (method==="cartao" ? " selected" : "")} onClick={() => setMethod("cartao")}>
                <div className="pay-opt-radio" />
                <div style={{ width:"100%" }}>
                  <div className="pay-opt-label">💳 Cartão de crédito — 3x sem juros</div>
                  <div className="pay-opt-sub">Visa, Mastercard, Elo, Amex</div>
                  {method === "cartao" && (
                    <div className="card-form">
                      <div className="f-field">
                        <label>Número do cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(fmtCard(e.target.value))} />
                      </div>
                      <div className="f-field">
                        <label>Nome no cartão</label>
                        <input type="text" placeholder="NOME SOBRENOME" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                      </div>
                      <div className="f-row2">
                        <div className="f-field">
                          <label>Validade</label>
                          <input type="text" placeholder="MM/AA" value={cardExpiry} onChange={e => setCardExpiry(fmtExpiry(e.target.value))} />
                        </div>
                        <div className="f-field">
                          <label>CVV</label>
                          <input type="text" placeholder="123" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,"").slice(0,4))} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Boleto */}
              <div className={"pay-opt" + (method==="boleto" ? " selected" : "")} onClick={() => setMethod("boleto")}>
                <div className="pay-opt-radio" />
                <div>
                  <div className="pay-opt-label">📄 Boleto bancário</div>
                  <div className="pay-opt-sub">Prazo: 1–3 dias úteis após pagamento. Gerado após a confirmação.</div>
                </div>
              </div>
            </div>

            <button className="confirm-btn" style={{ marginTop:24 }} onClick={handleConfirm}>
              {method === "pix" ? "Confirmar — já fiz o Pix" : method === "cartao" ? "Confirmar pagamento" : "Confirmar — gerar boleto"} →
            </button>
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
