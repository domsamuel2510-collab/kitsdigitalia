'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/types/cliente';
import { StatusBadge } from '@/components/StatusBadge';
import { RenovarModal } from '@/components/RenovarModal';
import { RespostaClienteModal } from '@/components/RespostaClienteModal';
import { fmtData, gerarMsgCobranca, whatsappLink, diasSemContato, hoje } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VencendoPage() {
  const [clientes,       setClientes]       = useState<Cliente[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [clienteRenovar, setClienteRenovar] = useState<Cliente | null>(null);
  const [clienteResp,    setClienteResp]    = useState<Cliente | null>(null);
  const [copiados,       setCopiados]       = useState<Record<string, boolean>>({});

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .in('status', ['vence_em_breve', 'vence_hoje', 'vencido'])
      .order('dias_restantes', { ascending: true });

    if (error) toast.error('Erro: ' + error.message);
    else setClientes((data as Cliente[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function registrarTentativa(c: Cliente) {
    const novasTentativas = (c.tentativas_contato ?? 0) + 1;
    await supabase.from('clientes').update({
      tentativas_contato: novasTentativas,
      ultima_tentativa:   hoje(),
    }).eq('id', c.id);
    // atualiza local para refletir imediatamente
    setClientes(prev => prev.map(x =>
      x.id === c.id
        ? { ...x, tentativas_contato: novasTentativas, ultima_tentativa: hoje() }
        : x
    ));
  }

  function copiar(c: Cliente) {
    const msg = gerarMsgCobranca(c.nome, c.produto, c.dias_restantes, c.data_vencimento);
    navigator.clipboard.writeText(msg).then(async () => {
      setCopiados(prev => ({ ...prev, [c.id]: true }));
      setTimeout(() => setCopiados(prev => ({ ...prev, [c.id]: false })), 2000);
      await registrarTentativa(c);
    });
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">⚠️ Vencendo / Vencidos</h1>
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
            {clientes.map(c => {
              const dsc      = diasSemContato(c.ultima_tentativa);
              const urgente  = dsc >= 3;
              const tentativas = c.tentativas_contato ?? 0;

              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 ${
                    urgente ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Nome + status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {urgente && (
                          <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 inline-block" />
                        )}
                        <span className="font-semibold text-gray-900">{c.nome}</span>
                        <StatusBadge status={c.status} />
                        {c.pais && c.pais !== 'Brasil' && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            🌍 {c.pais}
                          </span>
                        )}
                      </div>

                      {/* Dados básicos */}
                      <p className="text-sm text-gray-500 mt-0.5">
                        {c.produto} · vence {fmtData(c.data_vencimento)} · {c.whatsapp}
                      </p>

                      {/* Contexto: histórico */}
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>📊 Tentativas: <strong className={tentativas >= 5 ? 'text-red-600' : 'text-gray-700'}>{tentativas}</strong></span>
                        <span>📅 Sem contato: <strong className={urgente ? 'text-red-600' : 'text-gray-700'}>
                          {dsc >= 999 ? 'nunca' : `${dsc}d`}
                        </strong></span>
                        {c.observacoes && (
                          <span title={c.observacoes}>📝 {c.observacoes.slice(0, 40)}{c.observacoes.length > 40 ? '…' : ''}</span>
                        )}
                      </div>

                      {/* Alerta de 5+ tentativas */}
                      {tentativas >= 5 && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 font-medium">
                          ⚠️ {tentativas} tentativas sem renovação. Mover para reabordagem?
                        </div>
                      )}

                      {/* Mensagem contextual */}
                      <pre className={`mt-2 border rounded-lg p-2.5 text-xs font-mono whitespace-pre-wrap break-words ${
                        c.status === 'vence_hoje'
                          ? 'bg-red-50 border-red-100 text-red-900'
                          : 'bg-yellow-50 border-yellow-100 text-gray-700'
                      }`}>
                        {gerarMsgCobranca(c.nome, c.produto, c.dias_restantes, c.data_vencimento)}
                      </pre>
                    </div>

                    {/* Ações */}
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
                        onClick={() => setClienteResp(c)}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium"
                      >
                        📋 Resposta
                      </button>
                      <button
                        onClick={() => setClienteRenovar(c)}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
                      >
                        Renovar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {clienteResp && (
        <RespostaClienteModal
          cliente={clienteResp}
          onClose={() => setClienteResp(null)}
          onSaved={carregar}
        />
      )}
    </>
  );
}
