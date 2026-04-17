'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { PRODUTOS, PLANOS, diasDoPlano, addDias } from '@/lib/utils';
import toast from 'react-hot-toast';

const PAISES = ['Brasil', 'Exterior'];

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
  campoFoco?: 'email' | 'whatsapp'; // abre o modal com foco no campo indicado
}

export function EditarClienteModal({ cliente, onClose, onSaved, campoFoco }: Props) {
  const [form, setForm] = useState({
    nome:                cliente.nome,
    email:               cliente.email,
    whatsapp:            cliente.whatsapp,
    produto:             cliente.produto,
    plano:               cliente.plano ?? 'mensal',
    pais:                cliente.pais ?? 'Brasil',
    observacoes:         cliente.observacoes ?? '',
    data_compra:         cliente.data_compra,
    data_vencimento:     cliente.data_vencimento,
    data_ativacao:       cliente.data_ativacao ?? '',
    ativacao_confirmada: cliente.ativacao_confirmada ?? false,
  });
  const [loading, setLoading] = useState(false);

  /** Atualiza um campo simples e recalcula vencimento se necessário */
  function set(field: string, value: string | boolean) {
    setForm(prev => {
      const next = { ...prev, [field]: value };

      // Recalcula data_vencimento ao mudar data_compra ou plano
      if ((field === 'data_compra' || field === 'plano') && next.data_compra) {
        next.data_vencimento = addDias(next.data_compra, diasDoPlano(next.plano));
      }

      return next;
    });
  }

  async function salvar() {
    if (!form.nome || !form.email || !form.whatsapp) {
      toast.error('Nome, email e WhatsApp são obrigatórios');
      return;
    }
    setLoading(true);

    const { error } = await supabase
      .from('clientes')
      .update({
        nome:                form.nome,
        email:               form.email,
        whatsapp:            form.whatsapp,
        produto:             form.produto,
        plano:               form.plano,
        pais:                form.pais,
        observacoes:         form.observacoes || null,
        data_compra:         form.data_compra,
        data_vencimento:     form.data_vencimento,
        ativacao_confirmada: form.ativacao_confirmada,
        data_ativacao:       form.data_ativacao || null,
      })
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
          <Field label="Nome completo *">
            <input value={form.nome} onChange={e => set('nome', e.target.value)} className={INPUT} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *">
              <input
                type="email"
                autoFocus={campoFoco === 'email'}
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={campoFoco === 'email' ? `${INPUT} ring-2 ring-orange-400` : INPUT}
              />
            </Field>
            <Field label="WhatsApp *">
              <input
                autoFocus={campoFoco === 'whatsapp'}
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                className={campoFoco === 'whatsapp' ? `${INPUT} ring-2 ring-orange-400` : INPUT}
              />
            </Field>
          </div>

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

          {/* Plano — div em vez de label para não ativar botão ao clicar no texto */}
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Plano</span>
            <div className="grid grid-cols-4 gap-2">
              {PLANOS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set('plano', p.value)}
                  className={[
                    'py-2.5 rounded-lg border text-xs font-semibold transition-colors',
                    form.plano === p.value
                      ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                      : 'border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300',
                  ].join(' ')}
                >
                  {p.label.split(' ')[0]}
                  <span className="block font-normal opacity-70">{p.dias}d</span>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Vencimento em <strong>{diasDoPlano(form.plano)} dias</strong> a partir da data de compra
            </p>
          </div>

          {/* Datas — compra recalcula vencimento automaticamente */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de compra">
              <input
                type="date"
                value={form.data_compra}
                onChange={e => set('data_compra', e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Vencimento (calculado)">
              <input
                type="date"
                value={form.data_vencimento}
                onChange={e => set('data_vencimento', e.target.value)}
                className={INPUT}
                title="Editável manualmente — ou recalculado ao mudar compra/plano"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="Data de ativação">
              <input
                type="date"
                value={form.data_ativacao}
                onChange={e => set('data_ativacao', e.target.value)}
                className={INPUT}
              />
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

          <Field label="Observações">
            <textarea
              value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)}
              className={`${INPUT} h-20 resize-none`}
              placeholder="Opcional..."
            />
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
