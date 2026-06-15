const SUPABASE_URL  = 'https://cebwrcwdnzqpofqojwmb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYndyY3dkbnpxcG9mcW9qd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mzg1MjMsImV4cCI6MjA5NjQxNDUyM30.lVfExwhslkUZuApBZLX5mn_ldEkZrr4vK_rpt6ykNSo';

// PagSeguro status codes -> nosso status
const STATUS_MAP = {
  3: 'pago',       // Paga
  4: 'pago',       // Disponível
  5: 'pendente',   // Em disputa
  6: 'cancelado',  // Devolvida
  7: 'cancelado',  // Cancelada
};

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.error('Supabase update error:', e);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // PagSeguro envia form-encoded
    const raw = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString();
    const params = typeof req.body === 'object'
      ? req.body
      : Object.fromEntries(new URLSearchParams(raw));

    const notificationCode = params.notificationCode;
    const notificationType = params.notificationType;

    console.log('PagBank webhook:', { notificationCode, notificationType });

    if (notificationType !== 'transaction' || !notificationCode) {
      return res.status(200).json({ ok: true });
    }

    const token   = process.env.PAGBANK_TOKEN;
    const email   = process.env.PAGBANK_EMAIL;
    const sandbox = process.env.PAGBANK_SANDBOX === 'true';
    const wsBase  = sandbox ? 'https://ws.sandbox.pagseguro.uol.com.br' : 'https://ws.pagseguro.uol.com.br';

    // Busca detalhes da transação no PagSeguro
    const resp = await fetch(
      `${wsBase}/v3/transactions/notifications/${notificationCode}?email=${encodeURIComponent(email)}&token=${token}`
    );
    const text = await resp.text();
    console.log('PagSeguro transaction:', text);

    const statusMatch    = text.match(/<status>(\d+)<\/status>/);
    const referenceMatch = text.match(/<reference>(.+?)<\/reference>/);

    const orderId    = referenceMatch?.[1];
    const statusCode = parseInt(statusMatch?.[1] || '0');
    const newStatus  = STATUS_MAP[statusCode];

    if (orderId && newStatus) {
      await updateOrderStatus(orderId, newStatus);
      console.log(`Pedido ${orderId} -> ${newStatus} (status PagSeguro: ${statusCode})`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).json({ ok: true }); // sempre 200 para PagSeguro não reenviar
  }
}
