/* Página de produto — produto.html?id=caps-60 */
const { useState, useEffect } = React;

const getCart = () => { try { return JSON.parse(localStorage.getItem("amazo_cart") || "[]"); } catch { return []; } };
const saveCart = (c) => localStorage.setItem("amazo_cart", JSON.stringify(c));
const getCartCount = () => getCart().reduce((s, i) => s + i.qty, 0);

function cartAdd(product, qty) {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);
  if (found) found.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, parcela: product.parcela, qty, img: product.img || null, art: product.art });
  saveCart(cart);
}

/* ---- Header ---- */
function Header({ cartCount }) {
  return (
    <header className="ph">
      <div className="ph-inner">
        <a href="index.html" className="ph-logo">
          AMAZON<span style={{ color:"#7a8f4a" }}>BSB</span>
          <span className="ph-logo-tag">Óleo de Avestruz</span>
        </a>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <a href="index.html" className="ph-back">← Voltar à loja</a>
          <a href="checkout.html" className="ph-cart-btn">
            🛒&nbsp;
            {cartCount > 0 && <span className="ph-cart-count">{cartCount}</span>}
            Carrinho
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---- Product page ---- */
function ProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = PRODUCTS.find(p => p.id === id);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount);

  const upsellInfo = product ? UPSELL_MAP[product.id] : null;
  const upsellProd = upsellInfo ? PRODUCTS.find(p => p.id === upsellInfo.kitId) : null;
  const others = product
    ? PRODUCTS.filter(p => p.id !== product.id && p.id !== (upsellInfo?.kitId)).slice(0, 4)
    : [];

  // Update page title
  useEffect(() => {
    if (product) document.title = product.name + " — Amazon BSB";
  }, [product]);

  if (!product) {
    return (
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <h2 style={{ color:"#2a3618" }}>Produto não encontrado</h2>
        <a href="index.html" style={{ color:"#4a5a30" }}>← Voltar à loja</a>
      </div>
    );
  }

  const handleAdd = () => {
    cartAdd(product, qty);
    setCartCount(getCartCount());
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleAddUpsell = () => {
    cartAdd(upsellProd, 1);
    window.location.href = "checkout.html";
  };

  return (
    <div>
      <Header cartCount={cartCount} />

      <div className="breadcrumb">
        <a href="index.html">Início</a>
        <span style={{ color:"#c8c4b0" }}>›</span>
        <a href="index.html#produtos">Produtos</a>
        <span style={{ color:"#c8c4b0" }}>›</span>
        <span style={{ color:"#3b4128" }}>{product.name}</span>
      </div>

      {/* Hero */}
      <div className="pp-hero">
        <div className="pp-hero-grid">
          {/* Image */}
          <div className="pp-img-wrap">
            <img src={product.img} alt={product.name} />
          </div>

          {/* Info */}
          <div className="pp-info">
            <div className="pp-tags">
              {product.tag === "best"  && <span className="tag tag-best">🔥 Mais vendido</span>}
              {product.tag === "value" && <span className="tag tag-value">Melhor custo-benefício</span>}
              {product.tag === "frete" && <span className="tag tag-frete">🚚 Frete grátis</span>}
            </div>

            <div className="pp-rating">
              <span className="pp-stars">{"★".repeat(Math.round(product.rating))}</span>
              <span>{product.rating.toFixed(1)} · {product.reviews} avaliações</span>
            </div>

            <h1 className="pp-name">{product.name}</h1>

            <div className="pp-price-block">
              {product.was && <div className="pp-was">De {BRL(product.was)}</div>}
              <div className="pp-price">{BRL(product.price * qty)}</div>
              <div className="pp-installment">ou 3x de <b>{BRL(product.parcela)}</b> sem juros</div>
            </div>

            {product.details && <p className="pp-desc">{product.details.description}</p>}

            {product.details?.benefits && (
              <ul className="pp-benefits">
                {product.details.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}

            {product.details?.howToUse && (
              <div>
                <span className="pp-how-label">Como usar</span>
                <p className="pp-how-text">{product.details.howToUse}</p>
              </div>
            )}

            <div className="pp-actions">
              <div className="pp-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button className={"pp-add-btn" + (added ? " added" : "")} onClick={handleAdd}>
                {added ? "✓ Adicionado!" : "🛒 Adicionar ao carrinho"}
              </button>
            </div>

            {added && (
              <div className="pp-added-bar">
                <span>Produto adicionado ao carrinho!</span>
                <a href="checkout.html">Finalizar compra →</a>
              </div>
            )}

            {product.details?.composition && (
              <p className="pp-composition">{product.details.composition}</p>
            )}
          </div>
        </div>
      </div>

      {/* Upsell */}
      {upsellProd && upsellInfo && (
        <div className="pp-upsell">
          <div className="pp-upsell-inner">
            <div className="pp-upsell-img">
              <img src={upsellProd.img} alt={upsellProd.name} />
            </div>
            <div className="pp-upsell-content">
              <span className="pp-upsell-badge">🔥 Oferta especial</span>
              <h3>{upsellInfo.headline}</h3>
              <p>{upsellInfo.sub}</p>
              <div className="pp-upsell-row">
                <div className="pp-upsell-price">
                  {BRL(upsellProd.price)}
                  <small>3x de {BRL(upsellProd.parcela)} sem juros · Frete grátis</small>
                </div>
                <button className="pp-upsell-btn" onClick={handleAddUpsell}>
                  Quero o kit →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other products */}
      {others.length > 0 && (
        <div className="pp-others">
          <div className="pp-others-inner">
            <h2>Você também pode gostar</h2>
            <div className="pp-others-grid">
              {others.map(p => (
                <a key={p.id} href={"produto.html?id=" + p.id} className="pp-other-card">
                  <div className="pp-other-img">
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div className="pp-other-info">
                    <div className="pp-other-name">{p.name}</div>
                    <div className="pp-other-price">{BRL(p.price)}</div>
                    <div style={{ fontSize:11, color:"#6b6f56" }}>3x de {BRL(p.parcela)} s/juros</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="pf">
        <div className="pf-inner">
          <span>© 2025 Amazon BSB — Todos os direitos reservados</span>
          <a href="index.html">← Voltar à loja</a>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProductPage />);
