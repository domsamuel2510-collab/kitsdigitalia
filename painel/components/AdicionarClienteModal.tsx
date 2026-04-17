'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { hoje, addDias, gerarMsgConfirmacao, PRODUTOS, PLANOS, diasDoPlano } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSaved: (clienteId: string) => void;
}

const dataVencInicial = addDias(hoje(), diasDoPlano('mensal'));

export function AdicionarClienteModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    nome:                '',
    email:               '',
    whatsapp:            '',
    produto:             PRODUTOS[0],
    pais:                'Brasil',
    plano:               'mensal',
    data_compra:         hoje(),
    data_vencimento:     dataVencInicial,
    ativacao_confirmada: false,
    data_ativacao:       hoje(),
    observacoes:         '',
  });
  const [loading, setLoading] = useState(false);

  /** Atualiza campo e recalcula data_vencimento ao mudar plano ou data_compra */
  function set(field: string, value: string | boolean) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if ((field === 'plano' || field === 'data_compra') && next.data_compra) {
        next.data_vencimento = addDias(next.data_compra, diasDoPlano(next.plano));
      }
      return next;
    });
  }

  async function salvar() {
    if (!form.nome.trim())     { toast.error('Nome é obrigatório');     return; }
    if (!form.email.trim())    { toast.error('Email é obrigatório');    return; }
    if (!form.whatsapp.trim()) { toast.error('WhatsApp é obrigatório'); return; }
    if (!form.data_compra)     { toast.error('Data de compra é obrigatória'); return; }

    setLoading(true);

    const msg = gerarMsgConfirmacao(
      form.nome, form.produto, form.email, form.whatsapp,
      form.data_compra, form.data_vencimento,
    );

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nome:                form.nome.trim(),
        email:               form.email.trim(),
        whatsapp:            form.whatsapp.trim(),
        produto:             form.produto,
        plano:               form.plano,
        pais:                form.pais,
        data_compra:         form.data_compra,
        data_vencimento:     form.data_vencimento,
        status:              'ativo',
        msg_confirmacao:     msg,
        tentativas_contato:  0,
        ativacao_confirmada: form.ativacao_confirmada,
        data_ativacao:       form.ativacao_confirmada ? form.data_ativacao : null,
        observacoes:         form.observacoes.trim() || null,
      })
      .select('id')
      .single();

    setLoading(false);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
      return;
    }

    toast.success('Cliente adicionado!');
    onSaved(data.id);
    onClose();
  }

  const planoAtual = PLANOS.find(p => p.value === form.plano);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">➕ Novo cliente</h2>

        <div className="space-y-3">

          {/* Nome */}
          <Field label="Nome completo *">
            <input
              autoFocus
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              className={INPUT}
              placeholder="João Silva"
            />
          </Field>

          {/* Email + WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *">
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={INPUT}
                placeholder="joao@email.com"
              />
            </Field>
            <Field label="WhatsApp (com DDD) *">
              <input
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                className={INPUT}
                placeholder="11999990000"
              />
            </Field>
          </div>

          {/* Produto */}
          <Field label="Produto *">
            <select
              value={form.produto}
              onChange={e => set('produto', e.target.value)}
              className={INPUT}
            >
              {PRODUTOS.map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>

          {/* País — botões */}
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">País *</span>
            <div className="flex gap-2">
              {['Brasil', 'Exterior'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('pais', p)}
                  className={[
                    'flex-1 py-2 rounded-lg border text-sm font-medium transition-colors',
                    form.pais === p
                      ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                      : 'border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300',
                  ].join(' ')}
                >
                  {p === 'Brasil' ? '🇧🇷 Brasil' : '🌍 Exterior'}
                </button>
              ))}
            </div>
          </div>

          {/* Plano — botões */}
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Plano *</span>
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
            {planoAtual && (
              <p className="mt-1.5 text-xs text-gray-500">
                Vencimento em <strong>{planoAtual.dias} dias</strong> a partir da data de compra
              </p>
            )}
          </div>

          {/* Datas — compra recalcula vencimento automaticamente */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de compra *">
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
                title="Recalculado ao mudar plano ou data de compra — editável manualmente"
              />
            </Field>
          </div>

          {/* Ativação */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.ativacao_confirmada}
                onChange={e => set('ativacao_confirmada', e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className="text-sm font-medium text-amber-800">
                🔑 Já ativei a conta deste cliente
              </span>
            </label>

            {form.ativacao_confirmada && (
              <Field label="Data de ativação">
                <input
                  type="date"
                  value={form.data_ativacao}
                  onChange={e => set('data_ativacao', e.target.value)}
                  className={INPUT}
                />
              </Field>
            )}
          </div>

          {/* Observações */}
          <Field label="Observações">
            <textarea
              value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)}
              className={`${INPUT} h-20 resize-none`}
              placeholder="Opcional…"
            />
          </Field>

        </div>

        {/* Rodapé */}
        <div className="mt-5 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-60"
          >
            {loading ? 'Salvando…' : 'Salvar cliente'}
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
