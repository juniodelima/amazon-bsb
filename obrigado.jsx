/* obrigado.jsx  Página de confirmação do pedido */
const BRL = (n) => "R$ " + Number(n).toFixed(2).replace(".", ",");
const fmtPhone = (v) => {
  const d = String(v || "").replace(/\D/g,"").slice(0,11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};
const PAY_LABEL = { pix:"Pix", cartao:"Cartão de crédito", boleto:"Boleto bancário" };

function Progress() {
  return (
    <div className="progress">
      <div className="progress-inner">
        {[["✓","Dados","done"],["✓","Pagamento","done"],["✓","Obrigado","done"]].map(([n,l,s]) => (
          <div key={l} className={"step active"}>
            <div className={"step-num " + s}>{n}</div>
            <div className="step-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObrigadoPage() {
  const data = (() => {
    try { return JSON.parse(localStorage.getItem("amazo_last_order") || "null"); } catch { return null; }
  })();

  if (!data) {
    return (
      <div>
        <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <p style={{ color:"#6b6f56", marginBottom:20 }}>Nenhum pedido encontrado.</p>
          <a href="index.html" style={{ padding:"12px 24px", borderRadius:10, background:"#3d4a2a", color:"white", fontWeight:700, fontSize:14 }}>Voltar à loja</a>
        </div>
      </div>
    );
  }

  const { orderId, customer, total, cart, payment } = data;
  const summary = cart.map(i => `${i.name} ×${i.qty}`).join(", ");
  const msg = encodeURIComponent(
    `Olá Amazon BSB! Acabei de finalizar meu pedido.\n\nCódigo: ${orderId}\nNome: ${customer.name}\nItens: ${summary}\nTotal: ${BRL(total)}\nPagamento: ${PAY_LABEL[payment] || payment}\n\nAguardo confirmação! 😊`
  );

  return (
    <div>
      <header className="fh"><div className="fh-logo">AMAZON<span>BSB</span></div></header>
      <Progress />

      <div className="ob-wrap">
        <div className="ob-card">
          <div className="ob-icon">✅</div>
          <h1>Pedido confirmado!</h1>
          <p className="ob-sub">
            Obrigado, <b>{customer.name.split(" ")[0]}</b>! Seu pedido foi recebido com sucesso.
          </p>
          <div className="ob-code">{orderId}</div>

          <div className="ob-detail">
            <div className="ob-detail-row"><span>Comprador</span><b>{customer.name}</b></div>
            <div className="ob-detail-row"><span>WhatsApp</span><b>{fmtPhone(customer.phone)}</b></div>
            {customer.cep && <div className="ob-detail-row"><span>CEP</span><b>{customer.cep}</b></div>}
            <div className="ob-detail-row"><span>Pagamento</span><b>{PAY_LABEL[payment] || payment}</b></div>
            <div className="ob-detail-row"><span>Total</span><b>{BRL(total)}</b></div>
          </div>

          <a href={"https://wa.me/5561999545567?text=" + msg} target="_blank" rel="noreferrer" className="ob-wa-btn">
            💬 Falar com a equipe pelo WhatsApp
          </a>

          <p style={{ fontSize:13, color:"#6b6f56", lineHeight:1.5, marginBottom:20 }}>
            Nossa equipe entrará em contato pelo WhatsApp <b>{fmtPhone(customer.phone)}</b> em até 30 minutos para confirmar o envio.
          </p>

          <a href="index.html" className="ob-home">← Continuar comprando</a>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ObrigadoPage />);
