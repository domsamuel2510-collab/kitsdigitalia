'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { hoje, addDias, gerarMsgConfirmacao } from '@/lib/utils';
import toast from 'react-hot-toast';

const PRODUTOS = ['ChatGPT Plus', 'ChatGPT Pro', 'Outro'];

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export function AdicionarClienteModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    nome: '', email: '', whatsapp: '', produto: PRODUTOS[0], observacoes: '',
  });
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function salvar() {
    if (!form.nome || !form.email || !form.whatsapp) {
      toast.error('Preencha nome, email e WhatsApp');
      return;
    }
    setLoading(true);
    const dataCompra     = hoje();
    const dataVencimento = addDias(dataCompra, 30);
    const msg = gerarMsgConfirmacao(
      form.nome, form.produto, form.email, form.whatsapp, dataCompra, dataVencimento
    );

    const { error } = await supabase.from('clientes').insert({
      nome: form.nome,
      email: form.email,
      whatsapp: form.whatsapp,
      produto: form.produto,
      observacoes: form.observacoes || null,
      data_compra: dataCompra,
      data_vencimento: dataVencimento,
      status: 'ativo',
      msg_confirmacao: msg,
    });

    setLoading(false);
    if (error) { toast.error('Erro ao salvar: ' + error.message); return; }
    toast.success('Cliente adicionado!');
    onSaved();
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">➕ Novo cliente</h2>

      <div className="space-y-3">
        <Field label="Nome completo *">
          <input autoFocus value={form.nome} onChange={e => set('nome', e.target.value)}
            className={INPUT} placeholder="João Silva" />
        </Field>
        <Field label="Email *">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className={INPUT} placeholder="joao@email.com" />
        </Field>
        <Field label="WhatsApp (com DDD) *">
          <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
            className={INPUT} placeholder="11999990000" />
        </Field>
        <Field label="Produto">
          <select value={form.produto} onChange={e => set('produto', e.target.value)} className={INPUT}>
            {PRODUTOS.map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Observações">
          <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)}
            className={`${INPUT} h-20 resize-none`} placeholder="Opcional..." />
        </Field>
      </div>

      <div className="mt-5 flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={salvar}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-60"
        >
          {loading ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </Overlay>
  );
}

// ---- helpers ----
const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
