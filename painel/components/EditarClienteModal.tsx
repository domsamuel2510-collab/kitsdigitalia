'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { PRODUTOS } from '@/lib/utils';
import toast from 'react-hot-toast';

const PAISES = ['Brasil', 'Exterior'];

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

export function EditarClienteModal({ cliente, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    nome:                cliente.nome,
    email:               cliente.email,
    whatsapp:            cliente.whatsapp,
    produto:             cliente.produto,
    pais:                cliente.pais ?? 'Brasil',
    observacoes:         cliente.observacoes ?? '',
    data_compra:         cliente.data_compra,
    data_vencimento:     cliente.data_vencimento,
    data_ativacao:       cliente.data_ativacao ?? '',
    ativacao_confirmada: cliente.ativacao_confirmada ?? false,
  });
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function salvar() {
    if (!form.nome || !form.email || !form.whatsapp) {
      toast.error('Nome, email e WhatsApp são obrigatórios');
      return;
    }
    setLoading(true);

    const updates: Record<string, unknown> = {
      nome:                form.nome,
      email:               form.email,
      whatsapp:            form.whatsapp,
      produto:             form.produto,
      pais:                form.pais,
      observacoes:         form.observacoes || null,
      data_compra:         form.data_compra,
      data_vencimento:     form.data_vencimento,
      ativacao_confirmada: form.ativacao_confirmada,
      data_ativacao:       form.data_ativacao || null,
    };

    const { error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', cliente.id);

    setLoading(false);
    if (error) { toast.error('Erro ao salvar: ' + error.message); return; }
    toast.success('Cliente atualizado!');
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">✏️ Editar cliente</h2>

        <div className="space-y-3">
          {/* Linha: nome */}
          <Field label="Nome completo *">
            <input value={form.nome} onChange={e => set('nome', e.target.value)}
              className={INPUT} />
          </Field>

          {/* Linha: email + whatsapp */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className={INPUT} />
            </Field>
            <Field label="WhatsApp *">
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                className={INPUT} />
            </Field>
          </div>

          {/* Linha: produto + país */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Produto">
              <select value={form.produto} onChange={e => set('produto', e.target.value)} className={INPUT}>
                {PRODUTOS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="País">
              <select value={form.pais} onChange={e => set('pais', e.target.value)} className={INPUT}>
                {PAISES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          {/* Linha: data_compra + data_vencimento */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de compra">
              <input type="date" value={form.data_compra}
                onChange={e => set('data_compra', e.target.value)} className={INPUT} />
            </Field>
            <Field label="Data de vencimento">
              <input type="date" value={form.data_vencimento}
                onChange={e => set('data_vencimento', e.target.value)} className={INPUT} />
            </Field>
          </div>

          {/* Linha: data_ativacao + checkbox */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="Data de ativação">
              <input type="date" value={form.data_ativacao}
                onChange={e => set('data_ativacao', e.target.value)} className={INPUT} />
            </Field>
            <label className="flex items-center gap-2 pb-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.ativacao_confirmada}
                onChange={e => set('ativacao_confirmada', e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Conta ativada?</span>
            </label>
          </div>

          {/* Observações */}
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
            {loading ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}
