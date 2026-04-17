'use client';

import { useState } from 'react';
import type { Cliente, RespostaCliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { hoje } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

const OPCOES: { value: RespostaCliente; label: string; cls: string }[] = [
  { value: 'respondeu',    label: '💬 Respondeu',        cls: 'border-blue-400 bg-blue-50 text-blue-800' },
  { value: 'vai_renovar',  label: '✅ Vai renovar',      cls: 'border-green-400 bg-green-50 text-green-800' },
  { value: 'nao_respondeu',label: '🔕 Não respondeu',    cls: 'border-gray-400 bg-gray-50 text-gray-700' },
  { value: 'nao_quer_mais',label: '❌ Não quer mais',    cls: 'border-red-400 bg-red-50 text-red-800' },
];

export function RespostaClienteModal({ cliente, onClose, onSaved }: Props) {
  const [resposta, setResposta] = useState<RespostaCliente | null>(cliente.resposta_cliente);
  const [loading, setLoading] = useState(false);

  async function salvar() {
    if (!resposta) { toast.error('Selecione uma opção'); return; }
    setLoading(true);

    const updates: Record<string, unknown> = {
      resposta_cliente:   resposta,
      ultima_tentativa:   hoje(),
      tentativas_contato: (cliente.tentativas_contato ?? 0) + 1,
    };

    if (resposta === 'nao_quer_mais') {
      updates.status = 'reabordagem';
    }

    const { error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', cliente.id);

    setLoading(false);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success('Resposta registrada!');
    onSaved();
    onClose();
  }

  const tentativas = cliente.tentativas_contato ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">📋 Registrar resposta</h2>
        <p className="text-sm text-gray-500 mb-4">
          {cliente.nome} · {cliente.produto}
        </p>

        {tentativas > 0 && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
            <p>📊 Tentativas anteriores: <strong>{tentativas}</strong></p>
            {cliente.ultima_tentativa && (
              <p>📅 Último contato: <strong>{new Date(cliente.ultima_tentativa + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></p>
            )}
            {cliente.resposta_cliente && (
              <p>💬 Última resposta: <strong>{OPCOES.find(o => o.value === cliente.resposta_cliente)?.label}</strong></p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-5">
          {OPCOES.map(({ value, label, cls }) => (
            <button
              key={value}
              onClick={() => setResposta(value)}
              className={`py-3 text-xs font-semibold rounded-xl border-2 transition-all ${
                resposta === value ? cls : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tentativas >= 4 && resposta !== 'vai_renovar' && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
            ⚠️ <strong>{tentativas + 1}ª tentativa</strong> sem renovação. Considere mover para reabordagem.
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm rounded-lg border hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={loading || !resposta}
            className="flex-1 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-60"
          >
            {loading ? 'Salvando…' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
