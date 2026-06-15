export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const token   = process.env.PAGBANK_TOKEN;
  const sandbox = process.env.PAGBANK_SANDBOX === 'true';

  if (!token) return res.status(500).json({ error: 'Token PagBank não configurado' });

  const { cart, total, customer, orderId } = req.body;
  if (!cart || !orderId) return res.status(400).json({ error: 'Dados incompletos' });

  const apiBase = sandbox
    ? 'https://sandbox.api.pagseguro.com'
    : 'https://api.pagseguro.com';

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

  // Monta itens (valores em centavos)
  const items = cart.map((item) => ({
    reference_id: String(item.id).slice(0, 36),
    name: String(item.name).slice(0, 100),
    quantity: Number(item.qty),
    unit_amount: Math.round(Number(item.price) * 100),
  }));

  const body = {
    reference_id: orderId,
    items,
    payment_methods: [
      { type: 'CREDIT_CARD' },
      { type: 'DEBIT_CARD' },
      { type: 'PIX' },
      { type: 'BOLETO' },
    ],
    redirect_url: `${siteUrl}/obrigado.html`,
    payment_notification_urls: [`${siteUrl}/api/webhook-pagbank`],
    soft_descriptor: 'Amazon BSB',
  };

  // Adiciona dados do cliente se disponíveis
  if (customer?.name) {
    const phone = (customer.phone || '').replace(/\D/g, '');
    body.customer = {
      name: customer.name,
      email: customer.email || `cliente_${Date.now()}@noemail.com`,
      tax_id: customer.cpf ? customer.cpf.replace(/\D/g, '') : '00000000191',
    };
    if (phone.length >= 10) {
      body.customer.phones = [{
        country: '55',
        area: phone.slice(0, 2),
        number: phone.slice(2, 11),
        type: 'MOBILE',
      }];
    }
  }

  try {
    const response = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('PagBank response status:', response.status);
    console.log('PagBank response:', JSON.stringify(data));

    if (!response.ok) {
      return res.status(502).json({ error: 'Erro PagBank', details: JSON.stringify(data) });
    }

    // Link com rel "PAY" é a URL do checkout
    const payLink = data.links?.find(l => l.rel === 'PAY');
    if (!payLink?.href) {
      return res.status(502).json({ error: 'URL de pagamento não encontrada', details: JSON.stringify(data) });
    }

    return res.status(200).json({ checkoutUrl: payLink.href, code: data.id });
  } catch (err) {
    console.error('Erro criar-pedido:', err);
    return res.status(500).json({ error: err.message });
  }
}
