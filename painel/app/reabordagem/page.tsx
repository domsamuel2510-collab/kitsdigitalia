'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/types/cliente';
import { RenovarModal } from '@/components/RenovarModal';
import { RespostaClienteModal } from '@/components/RespostaClienteModal';
import {
  fmtData, gerarMsgReabordagemBrasil, gerarMsgReabordagemExterior,
  whatsappLink, diasSemContato,
} from '@/lib/utils';
import toast from 'react-hot-toast';

type Aba = 'brasil' | 'exterior';

export default function ReabordagemPage() {
  const [clientes,       setClientes]       = useState<Cliente[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [aba,            setAba]            = useState<Aba>('brasil');
  const [clienteRenovar, setClienteRenovar] = useState<Cliente | null>(null);
  const [clienteResp,    setClienteResp]    = useState<Cliente | null>(null);
  const [copiados,       setCopiados]       = useState<Record<string, boolean>>({});

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('status', 'reabordagem')
      .order('data_vencimento', { ascending: true });

    if (error) toast.error('Erro: ' + error.message);
    else setClientes((data as Cliente[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const brasil   = clientes.filter(c => !c.pais || c.pais === 'Brasil');
  const exterior = clientes.filter(c => c.pais && c.pais !== 'Brasil');
  const visiveis = aba === 'brasil' ? brasil : exterior;

  function gerarMsg(c: Cliente) {
    return aba === 'brasil'
      ? gerarMsgReabordagemBrasil(c.nome, c.produto)
      : gerarMsgReabordagemExterior(c.nome, c.produto);
  }

  function copiar(c: Cliente) {
    navigator.clipboard.writeText(gerarMsg(c)).then(() => {
      setCopiados(prev => ({ ...prev, [c.id]: true }));
      setTimeout(() => setCopiados(prev => ({ ...prev, [c.id]: false })), 2000);
    });
  }

  async function removerDaLista(c: Cliente) {
    const { error } = await supabase
      .from('clientes')
      .update({ status: 'vencido' })
      .eq('id', c.id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success(`${c.nome} removido da reabordagem`);
    carregar();
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔄 Reabordagem</h1>
          <p className="text-sm text-gray-500">{clientes.length} cliente(s) para reabordar</p>
        </div>

        {/* Abas Brasil / Exterior */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setAba('brasil')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              aba === 'brasil'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🇧🇷 Brasil ({brasil.length})
          </button>
          <button
            onClick={() => setAba('exterior')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              aba === 'exterior'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🌍 Exterior ({exterior.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Carregando…</div>
        ) : !visiveis.length ? (
          <div className="text-center py-16 text-gray-400">
            Nenhum cliente nesta categoria. ✅
          </div>
        ) : (
          <div className="space-y-3">
            {visiveis.map(c => {
              const dsc = diasSemContato(c.ultima_tentativa);
              const tentativas = c.tentativas_contato ?? 0;

              return (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{c.nome}</span>
                        <span className="text-xs text-gray-400">⚫ Reabordagem</span>
                        {c.pais && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {c.pais}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {c.produto} · venceu {fmtData(c.data_vencimento)} · {c.whatsapp}
                      </p>

                      {/* Contexto */}
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>📊 Tentativas: <strong>{tentativas}</strong></span>
                        <span>📅 Sem contato: <strong>{dsc >= 999 ? 'nunca' : `${dsc}d`}</strong></span>
                        {c.resposta_cliente && (
                          <span>💬 Última resposta: <strong>{RESPOSTA_LABELS[c.resposta_cliente] ?? c.resposta_cliente}</strong></span>
                        )}
                        {c.observacoes && (
                          <span title={c.observacoes}>📝 {c.observacoes.slice(0, 40)}{c.observacoes.length > 40 ? '…' : ''}</span>
                        )}
                      </div>

                      {/* Mensagem */}
                      <pre className={`mt-2 border rounded-lg p-2.5 text-xs font-mono whitespace-pre-wrap break-words ${
                        aba === 'brasil'
                          ? 'bg-green-50 border-green-100 text-gray-800'
                          : 'bg-blue-50 border-blue-100 text-gray-800'
                      }`}>
                        {gerarMsg(c)}
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
                      <button
                        onClick={() => removerDaLista(c)}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium"
                      >
                        Remover
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

const RESPOSTA_LABELS: Record<string, string> = {
  respondeu:    '💬 Respondeu',
  vai_renovar:  '✅ Vai renovar',
  nao_respondeu:'🔕 Não respondeu',
  nao_quer_mais:'❌ Não quer mais',
};
