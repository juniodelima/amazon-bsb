export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const token  = process.env.PAGBANK_TOKEN;
  const email  = process.env.PAGBANK_EMAIL;
  const sandbox = process.env.PAGBANK_SANDBOX === 'true';

  if (!token || !email) return res.status(500).json({ error: 'Credenciais PagSeguro não configuradas' });

  const { cart, total, customer, orderId } = req.body;
  if (!cart || !orderId) return res.status(400).json({ error: 'Dados incompletos' });

  const wsBase  = sandbox ? 'https://ws.sandbox.pagseguro.uol.com.br' : 'https://ws.pagseguro.uol.com.br';
  const payBase = sandbox ? 'https://sandbox.pagseguro.uol.com.br' : 'https://pagseguro.uol.com.br';
  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

  // Monta payload form-encoded (formato antigo PagSeguro)
  const params = new URLSearchParams();
  params.append('currency', 'BRL');
  params.append('reference', orderId);
  params.append('redirectURL', `${siteUrl}/obrigado.html`);
  params.append('notificationURL', `${siteUrl}/api/webhook-pagbank`);

  cart.forEach((item, i) => {
    const n = i + 1;
    params.append(`itemId${n}`, String(item.id).slice(0, 36));
    params.append(`itemDescription${n}`, String(item.name).slice(0, 100));
    params.append(`itemAmount${n}`, Number(item.price).toFixed(2));
    params.append(`itemQuantity${n}`, String(item.qty));
  });

  try {
    const response = await fetch(
      `${wsBase}/v2/checkout?email=${encodeURIComponent(email)}&token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params.toString(),
      }
    );

    const text = await response.text();
    console.log('PagSeguro response:', text);

    if (!response.ok) {
      return res.status(502).json({ error: 'Erro PagSeguro', details: text });
    }

    const codeMatch = text.match(/<code>(.+?)<\/code>/);
    if (!codeMatch) {
      return res.status(502).json({ error: 'Código de checkout não encontrado', details: text });
    }

    const code = codeMatch[1];
    const checkoutUrl = `${payBase}/v2/checkout/payment.html?code=${code}`;

    return res.status(200).json({ checkoutUrl, code });
  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ error: err.message });
  }
}
