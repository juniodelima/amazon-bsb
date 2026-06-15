const SUPABASE_URL  = 'https://cebwrcwdnzqpofqojwmb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYndyY3dkbnpxcG9mcW9qd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mzg1MjMsImV4cCI6MjA5NjQxNDUyM30.lVfExwhslkUZuApBZLX5mn_ldEkZrr4vK_rpt6ykNSo';

// PagBank novo: status dos charges
const STATUS_MAP = {
  PAID: 'pago',
  AUTHORIZED: 'pago',
  IN_ANALYSIS: 'pendente',
  DECLINED: 'cancelado',
  CANCELLED: 'cancelado',
  REFUNDED: 'cancelado',
  WAITING: 'pendente',
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
    const payload = req.body;
    console.log('PagBank webhook recebido:', JSON.stringify(payload));

    // Novo formato PagBank: { event: "CHARGE_UPDATED", charge: { status, reference_id } }
    // ou { event: "ORDER_PAID", order: { reference_id, charges: [...] } }
    let orderId = null;
    let newStatus = null;

    if (payload.event?.startsWith('CHARGE')) {
      const charge = payload.charge || payload.data;
      orderId = charge?.reference_id || charge?.metadata?.reference_id;
      newStatus = STATUS_MAP[charge?.status];
    } else if (payload.event?.startsWith('ORDER')) {
      const order = payload.order || payload.data;
      orderId = order?.reference_id;
      const chargeStatus = order?.charges?.[0]?.status;
      newStatus = STATUS_MAP[chargeStatus] || (payload.event === 'ORDER_PAID' ? 'pago' : null);
    }

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
