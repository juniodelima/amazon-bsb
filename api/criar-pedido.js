export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const token = process.env.PAGBANK_TOKEN;
  if (!token) return res.status(500).json({ error: 'Token PagBank não configurado' });

  const { cart, total, customer, orderId, paymentMethod } = req.body;
  if (!cart || !total || !orderId) return res.status(400).json({ error: 'Dados incompletos' });

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

  const items = cart.map(item => ({
    reference_id: String(item.id),
    name: String(item.name).slice(0, 100),
    quantity: Number(item.qty),
    unit_amount: Math.round(item.price * 100),
  }));

  // Payment methods mapping
  const methodsMap = {
    pix:    [{ type: 'PIX' }],
    cartao: [{ type: 'CREDIT_CARD', installments: { min: 1, max: 3 } }],
    boleto: [{ type: 'BOLETO' }],
  };
  const paymentMethods = methodsMap[paymentMethod] || [
    { type: 'PIX' },
    { type: 'CREDIT_CARD', installments: { min: 1, max: 3 } },
    { type: 'BOLETO' },
  ];

  const payload = {
    reference_id: orderId,
    items,
    payment_methods: paymentMethods,
    redirect_url: `${siteUrl}/obrigado.html`,
    notification_urls: [`${siteUrl}/api/webhook-pagbank`],
    expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('Z', '-03:00').slice(0, 19) + '-03:00',
  };

  try {
    const response = await fetch('https://api.pagseguro.com/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PagBank error:', JSON.stringify(data));
      return res.status(502).json({ error: 'Erro ao criar checkout PagBank', details: data });
    }

    const payLink = data.links?.find(l => l.rel === 'PAY') || data.links?.[0];
    if (!payLink) {
      return res.status(502).json({ error: 'Link de pagamento não encontrado na resposta', data });
    }

    return res.status(200).json({ checkoutUrl: payLink.href, checkoutId: data.id });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
