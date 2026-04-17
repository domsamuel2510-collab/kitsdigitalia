'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { hoje, addDias, fmtData, gerarMsgConfirmacao, whatsappLink } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

export function RenovarModal({ cliente, onClose, onSaved }: Props) {
  const novaCompra = hoje();
  const novaVenc   = addDias(novaCompra, 30);
  const msg = gerarMsgConfirmacao(
    cliente.nome, cliente.produto, cliente.email,
    cliente.whatsapp, novaCompra, novaVenc,
  );
  const [copiado, setCopido] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function confirmar() {
    setLoading(true);
    const { error } = await supabase.from('clientes').update({
      renovado_em:     novaCompra,
      data_compra:     novaCompra,
      data_vencimento: novaVenc,
      status:          'renovado',
      ultimo_aviso:    null,
      msg_confirmacao: msg,
    }).eq('id', cliente.id);

    setLoading(false);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success('Renovação registrada!');
    onSaved();
    onClose();
  }

  function copiar() {
    navigator.clipboard.writeText(msg).then(() => {
      setCopido(true);
      setTimeout(() => setCopido(false), 2000);
    });
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-gray-900 mb-1">✅ Renovar cliente</h2>
      <p className="text-sm text-gray-500 mb-4">
        {cliente.nome} · {cliente.produto}
      </p>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg border text-xs text-gray-600 space-y-0.5">
        <p>📅 Nova data de compra: <strong>{fmtData(novaCompra)}</strong></p>
        <p>⏳ Novo vencimento: <strong>{fmtData(novaVenc)}</strong></p>
      </div>

      {/* Mensagem pronta */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-1">Mensagem para copiar</p>
        <pre className="w-full bg-gray-900 text-green-300 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap break-words max-h-52 overflow-y-auto">
          {msg}
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={copiar}
          className="flex-1 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"
        >
          {copiado ? '✅ Copiado!' : '📋 Copiar mensagem'}
        </button>
        <a
          href={whatsappLink(cliente.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-center"
        >
          💬 Abrir WhatsApp
        </a>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={confirmar}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-60"
        >
          {loading ? 'Salvando…' : 'Confirmar renovação'}
        </button>
      </div>
    </Overlay>
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
