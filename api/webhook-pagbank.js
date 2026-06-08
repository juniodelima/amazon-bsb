const SUPABASE_URL  = 'https://cebwrcwdnzqpofqojwmb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYndyY3dkbnpxcG9mcW9qd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mzg1MjMsImV4cCI6MjA5NjQxNDUyM30.lVfExwhslkUZuApBZLX5mn_ldEkZrr4vK_rpt6ykNSo';

const STATUS_MAP = {
  PAID:        'pago',
  AUTHORIZED:  'pago',
  IN_ANALYSIS: 'pendente',
  DECLINED:    'cancelado',
  CANCELED:    'cancelado',
  REFUNDED:    'cancelado',
};

async function updateOrderStatus(orderId, status) {
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
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const event = req.body;
    console.log('PagBank webhook:', JSON.stringify(event));

    // PagBank can send order or charge events
    const orderId = event.reference_id
      || event.charges?.[0]?.reference_id
      || event.order?.reference_id;

    const rawStatus = event.charges?.[0]?.status
      || event.status
      || event.order?.charges?.[0]?.status;

    const newStatus = STATUS_MAP[rawStatus];

    if (orderId && newStatus) {
      await updateOrderStatus(orderId, newStatus);
      console.log(`Pedido ${orderId} -> ${newStatus}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).json({ ok: true }); // sempre 200 para PagBank não reenviar
  }
}
