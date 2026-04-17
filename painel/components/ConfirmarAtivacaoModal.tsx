'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { hoje } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

export function ConfirmarAtivacaoModal({ cliente, onClose, onSaved }: Props) {
  const [dataAtivacao, setDataAtivacao] = useState(hoje());
  const [loading, setLoading] = useState(false);

  async function confirmar() {
    setLoading(true);
    const { error } = await supabase
      .from('clientes')
      .update({ ativacao_confirmada: true, data_ativacao: dataAtivacao })
      .eq('id', cliente.id);
    setLoading(false);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success('Ativação confirmada!');
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <span className="text-3xl">🔑</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Confirmar ativação</h2>
          <p className="text-sm text-gray-500 mt-0.5">{cliente.nome} · {cliente.produto}</p>
        </div>

        <label className="block mb-4">
          <span className="block text-xs font-medium text-gray-600 mb-1">Data de ativação</span>
          <input
            type="date"
            value={dataAtivacao}
            onChange={e => setDataAtivacao(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm rounded-lg border hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={loading}
            className="flex-1 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Salvando…' : '✅ Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
