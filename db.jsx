/* db.jsx  Supabase client + helpers */
const { createClient } = window.supabase;
const db = createClient(
  'https://cebwrcwdnzqpofqojwmb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYndyY3dkbnpxcG9mcW9qd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mzg1MjMsImV4cCI6MjA5NjQxNDUyM30.lVfExwhslkUZuApBZLX5mn_ldEkZrr4vK_rpt6ykNSo'
);
window.db = db;

window.dbSalvarLead = (telefone, cupom) =>
  db.from('leads').insert({ telefone, cupom, fonte: 'popup' })
    .then(() => {}).catch(e => console.warn('lead:', e));

window.dbSalvarCliente = (c) =>
  db.from('clientes').upsert({
    telefone: c.telefone,
    nome: c.nome,
    cep: c.cep || '',
    endereco: c.endereco || '',
    ultima_visita: new Date().toISOString(),
  }, { onConflict: 'telefone' })
    .then(() => {}).catch(e => console.warn('cliente:', e));

window.dbSalvarPedido = async (pedido) => {
  try {
    await db.from('pedidos').insert({
      id: pedido.id,
      data: pedido.date,
      itens: pedido.items,
      total: pedido.total,
      status: 'pendente',
      cliente_nome: pedido.customer.name,
      cliente_telefone: pedido.customer.phone,
      cliente_cep: pedido.customer.cep || '',
      cliente_endereco: pedido.customer.address || '',
      pagamento: pedido.payment,
    });
    const { data: c } = await db.from('clientes')
      .select('num_pedidos,total_gasto')
      .eq('telefone', pedido.customer.phone)
      .single();
    await db.from('clientes').upsert({
      telefone: pedido.customer.phone,
      nome: pedido.customer.name,
      cep: pedido.customer.cep || '',
      endereco: pedido.customer.address || '',
      num_pedidos: ((c && c.num_pedidos) || 0) + 1,
      total_gasto: ((c && c.total_gasto) || 0) + pedido.total,
      ultima_visita: new Date().toISOString(),
    }, { onConflict: 'telefone' });
  } catch (e) { console.warn('pedido:', e); }
};

window.dbSalvarSessao = (sessao) =>
  db.from('sessoes_checkout').upsert({
    id: sessao.id,
    telefone: sessao.phone || null,
    cart: sessao.cart || [],
    total: sessao.total || 0,
    status: sessao.status || 'abandoned',
    atualizado_em: new Date().toISOString(),
  }, { onConflict: 'id' })
    .then(() => {}).catch(e => console.warn('sessao:', e));

window.dbAtualizarStatusSessao = (id, status) =>
  db.from('sessoes_checkout')
    .update({ status, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .then(() => {}).catch(e => console.warn('sessao status:', e));

window.dbAtualizarStatusPedido = (id, status) =>
  db.from('pedidos').update({ status }).eq('id', id)
    .then(() => {}).catch(e => console.warn('pedido status:', e));

window.dbBuscarCliente = (telefone) =>
  db.from('clientes').select('*').eq('telefone', telefone).single()
    .then(({ data }) => data).catch(() => null);
