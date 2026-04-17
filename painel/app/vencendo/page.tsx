'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/types/cliente';
import { StatusBadge } from '@/components/StatusBadge';
import { RenovarModal } from '@/components/RenovarModal';
import { fmtData, gerarMsgCobranca, whatsappLink } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VencendoPage() {
  const [clientes, setClientes]       = useState<Cliente[]>([]);
  const [loading,  setLoading]        = useState(true);
  const [clienteRenovar, setClienteRenovar] = useState<Cliente | null>(null);
  const [copiados, setCopiados]       = useState<Record<string, boolean>>({});

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .in('status', ['vence_em_breve', 'vence_hoje'])
      .order('data_vencimento', { ascending: true });

    if (error) toast.error('Erro: ' + error.message);
    else setClientes((data as Cliente[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function copiar(c: Cliente) {
    const msg = gerarMsgCobranca(c.nome, c.produto);
    navigator.clipboard.writeText(msg).then(() => {
      setCopiados(prev => ({ ...prev, [c.id]: true }));
      setTimeout(() => setCopiados(prev => ({ ...prev, [c.id]: false })), 2000);
    });
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">⚠️ Vencendo hoje / em breve</h1>
          <p className="text-sm text-gray-500">{clientes.length} cliente(s) precisam de atenção</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Carregando…</div>
        ) : !clientes.length ? (
          <div className="text-center py-16 text-gray-400">
            Nenhum cliente vencendo nos próximos dias. 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {clientes.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{c.nome}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {c.produto} · vence {fmtData(c.data_vencimento)} · {c.whatsapp}
                    </p>

                    {/* Mensagem de cobrança */}
                    <pre className="mt-2 bg-yellow-50 border border-yellow-100 rounded-lg p-2.5 text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                      {gerarMsgCobranca(c.nome, c.produto)}
                    </pre>
                  </div>

                  <div className="flex gap-2 sm:flex-col shrink-0">
                    <button
                      onClick={() => copiar(c)}
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg border hover:bg-gray-50 font-medium"
                    >
                      {copiados[c.id] ? '✅ Copiado' : '📋 Copiar'}
                    </button>
                    <a
                      href={whatsappLink(c.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-center"
                    >
                      💬 WhatsApp
                    </a>
                    <button
                      onClick={() => setClienteRenovar(c)}
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
                    >
                      Renovar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {clienteRenovar && (
        <RenovarModal
          cliente={clienteRenovar}
          onClose={() => setClienteRenovar(null)}
          onSaved={carregar}
        />
      )}
    </>
  );
}
