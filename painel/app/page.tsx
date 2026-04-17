'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cliente, Status } from '@/types/cliente';
import { DashboardCards, FILTRO_GRUPOS } from '@/components/DashboardCards';
import { ClienteTable } from '@/components/ClienteTable';
import { AdicionarClienteModal } from '@/components/AdicionarClienteModal';
import { RenovarModal } from '@/components/RenovarModal';
import { RespostaClienteModal } from '@/components/RespostaClienteModal';
import { EditarClienteModal } from '@/components/EditarClienteModal';
import { HistoricoContatoDrawer } from '@/components/HistoricoContatoDrawer';
import { ConfirmarAtivacaoModal } from '@/components/ConfirmarAtivacaoModal';
import {
  ordenarPorUrgencia, precisaAtencao, normalizarClientes,
  precisaRenovacaoMensal, gerarMsgRenovacaoMensal, addDias, fmtData,
  cadastroIncompleto, ordenarIncompletos,
} from '@/lib/utils';
import toast from 'react-hot-toast';

// ---- Tipos ----

interface UndoAction {
  descricao: string;
  reverter: () => Promise<void>;
}

const STATUS_LABELS: Record<string, string> = {
  todos:          'Todos',
  ativo:          '🟢 Ativos',
  vence_em_breve: '🟡 Vencendo',
  vence_hoje:     '🟠 Vence hoje',
  vencido:        '🔴 Vencidos',
  renovado:       '🔵 Renovados',
  reabordagem:    '⚫ Reabordagem',
  incompletos:    '📋 Incompletos',
};

// ---- Página principal ----

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filtro,   setFiltro]   = useState<string>('todos');
  const [busca,    setBusca]    = useState('');

  const [showAdicionar,    setShowAdicionar]    = useState(false);
  const [clienteRenovar,   setClienteRenovar]   = useState<Cliente | null>(null);
  const [clienteResposta,  setClienteResposta]  = useState<Cliente | null>(null);
  const [clienteEditar,    setClienteEditar]    = useState<Cliente | null>(null);
  const [campoFocoEditar,  setCampoFocoEditar]  = useState<'email' | 'whatsapp' | undefined>();
  const [clienteHistorico, setClienteHistorico] = useState<Cliente | null>(null);
  const [clienteAtivacao,  setClienteAtivacao]  = useState<Cliente | null>(null);

  // ---- Undo system ----
  const [undoPendente, setUndoPendente] = useState<UndoAction | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function registrarUndo(action: UndoAction) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoPendente(action);
    undoTimerRef.current = setTimeout(() => setUndoPendente(null), 10_000);
  }

  async function executarUndo() {
    if (!undoPendente) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoPendente(null);
    try {
      await undoPendente.reverter();
      toast.success('↩ Ação desfeita');
      carregar();
    } catch {
      toast.error('Erro ao desfazer');
    }
  }

  // ---- Carregar clientes ----

  const carregar = useCallback(async () => {
    setLoading(true);

    await supabase.rpc('atualizar_status_todos').then(
      ({ error }) => { if (error) console.warn('[rpc] atualizar_status_todos:', error.message); }
    );

    const { data, error } = await supabase.from('clientes').select('*');
    if (error) {
      toast.error('Erro ao carregar: ' + error.message);
    } else {
      setClientes(normalizarClientes((data as Cliente[]) ?? []));
    }

    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // ---- Ações ----

  async function marcarReabordagem(c: Cliente) {
    const anterior = c;
    const { error } = await supabase
      .from('clientes')
      .update({ status: 'reabordagem' })
      .eq('id', c.id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success(`${c.nome} movido para reabordagem`);
    registrarUndo({
      descricao: `Mover ${c.nome} para reabordagem`,
      reverter: async () => {
        await supabase.from('clientes').update({ status: anterior.status }).eq('id', anterior.id);
      },
    });
    carregar();
  }

  async function renovacaoMensalFeita(c: Cliente) {
    if (!c.proxima_renovacao_mensal) return;
    const novaData = addDias(c.proxima_renovacao_mensal, 30);
    const anterior = c;
    const { error } = await supabase
      .from('clientes')
      .update({ proxima_renovacao_mensal: novaData })
      .eq('id', c.id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success(`Próxima renovação de ${c.nome}: ${fmtData(novaData)}`);
    registrarUndo({
      descricao: `Renovação mensal de ${c.nome}`,
      reverter: async () => {
        await supabase.from('clientes')
          .update({ proxima_renovacao_mensal: anterior.proxima_renovacao_mensal })
          .eq('id', anterior.id);
      },
    });
    carregar();
  }

  // ---- Dados derivados ----

  const precisamAtencao   = clientes.filter(precisaAtencao);
  const ativacosPendentes = clientes.filter(c => !c.ativacao_confirmada && c.status === 'ativo');
  const renovacoesMensais = clientes.filter(precisaRenovacaoMensal);
  const incompletos       = clientes.filter(cadastroIncompleto);

  const filtrados = (() => {
    const base = clientes.filter(c => {
      const grupo       = FILTRO_GRUPOS[filtro];
      const matchFiltro = filtro === 'todos'
        || filtro === 'incompletos'
        || (grupo ? grupo.includes(c.status) : c.status === filtro);
      const matchIncompleto = filtro !== 'incompletos' || cadastroIncompleto(c);
      const matchBusca = !busca ||
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (c.email  ?? '').toLowerCase().includes(busca.toLowerCase()) ||
        (c.whatsapp ?? '').includes(busca) ||
        c.produto.toLowerCase().includes(busca.toLowerCase());
      return matchFiltro && matchIncompleto && matchBusca;
    });
    // Ordenação especial para filtro incompletos
    if (filtro === 'incompletos') return ordenarIncompletos(base);
    return ordenarPorUrgencia(base);
  })();

  return (
    <>
      <div className="space-y-3">

        {/* Banner de atenção geral */}
        {(precisamAtencao.length > 0 || ativacosPendentes.length > 0) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex flex-wrap items-center gap-3">
            <span className="animate-pulse text-red-500 text-lg">🔴</span>
            <div className="flex-1 text-sm text-red-800">
              {precisamAtencao.length > 0 && (
                <span className="font-semibold">
                  {precisamAtencao.length} cliente{precisamAtencao.length > 1 ? 's precisam' : ' precisa'} de atenção hoje
                </span>
              )}
              {precisamAtencao.length > 0 && ativacosPendentes.length > 0 && ' · '}
              {ativacosPendentes.length > 0 && (
                <span>
                  {ativacosPendentes.length} ativação{ativacosPendentes.length > 1 ? 'ções pendentes' : ' pendente'}
                </span>
              )}
            </div>
            <button
              onClick={() => setFiltro('vence_hoje')}
              className="text-xs font-medium text-red-700 underline"
            >
              Ver agora →
            </button>
          </div>
        )}

        {/* 🔔 Renovações mensais pendentes */}
        {renovacoesMensais.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-blue-800">
                🔔 Renovações mensais pendentes ({renovacoesMensais.length})
              </h2>
              <span className="text-xs text-blue-600">Planos longos — renovação técnica é mensal</span>
            </div>
            <div className="space-y-2">
              {renovacoesMensais.map(c => (
                <RenovacaoMensalCard
                  key={c.id}
                  cliente={c}
                  onFeito={() => renovacaoMensalFeita(c)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 📋 Banner cadastros incompletos */}
        {incompletos.length > 0 && (
          <button
            type="button"
            onClick={() => setFiltro(filtro === 'incompletos' ? 'todos' : 'incompletos')}
            className={`w-full text-left rounded-xl border px-4 py-3 flex items-center gap-3 transition-colors ${
              filtro === 'incompletos'
                ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300'
                : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <span className="text-lg">📋</span>
            <div className="flex-1">
              <span className="font-semibold text-orange-900 text-sm">
                {incompletos.length} cliente{incompletos.length > 1 ? 's' : ''} com cadastro incompleto
              </span>
              <span className="ml-2 text-xs text-orange-700">
                (email ou WhatsApp ausente)
              </span>
              {/* Prioridade: reabordagem incompletos */}
              {incompletos.some(c => c.status === 'reabordagem') && (
                <span className="ml-2 animate-pulse inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 rounded px-1.5 py-0.5">
                  ⚠️ Prioridade — reabordagem incompleta
                </span>
              )}
            </div>
            <span className="text-xs text-orange-600 font-medium shrink-0">
              {filtro === 'incompletos' ? 'Limpar filtro ×' : 'Ver agora →'}
            </span>
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">{clientes.length} clientes cadastrados</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={carregar}
              className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50 text-gray-600"
            >
              🔄 Atualizar
            </button>
            <button
              onClick={() => setShowAdicionar(true)}
              className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium shadow"
            >
              ➕ Novo cliente
            </button>
          </div>
        </div>

        <DashboardCards
          clientes={clientes}
          filtroAtivo={filtro}
          onFiltrar={setFiltro}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="🔍 Buscar por nome, email, produto…"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value as Status | 'todos')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Carregando…</div>
        ) : (
          <ClienteTable
            clientes={filtrados}
            onRenovar={setClienteRenovar}
            onNaoRenovar={marcarReabordagem}
            onRegistrarResposta={setClienteResposta}
            onEditar={c => { setCampoFocoEditar(undefined); setClienteEditar(c); }}
            onEditarComFoco={(c, campo) => { setCampoFocoEditar(campo); setClienteEditar(c); }}
            onVerHistorico={setClienteHistorico}
            onConfirmarAtivacao={setClienteAtivacao}
          />
        )}
      </div>

      {/* ---- Botão flutuante UNDO ---- */}
      {undoPendente && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <span className="text-xs text-gray-300 max-w-[160px] truncate">{undoPendente.descricao}</span>
          <button
            onClick={executarUndo}
            className="text-xs font-bold bg-white text-gray-900 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors shrink-0"
          >
            ↩ Desfazer
          </button>
          <button
            onClick={() => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); setUndoPendente(null); }}
            className="text-gray-400 hover:text-white text-lg leading-none"
            title="Descartar"
          >
            ×
          </button>
        </div>
      )}

      {/* ---- Modais ---- */}

      {showAdicionar && (
        <AdicionarClienteModal
          onClose={() => setShowAdicionar(false)}
          onSaved={() => carregar()}
        />
      )}

      {clienteRenovar && (
        <RenovarModal
          cliente={clienteRenovar}
          onClose={() => setClienteRenovar(null)}
          onSaved={() => {
            const anterior = clienteRenovar;
            registrarUndo({
              descricao: `Renovação de ${anterior.nome}`,
              reverter: async () => {
                await supabase.from('clientes').update({
                  renovado_em:     anterior.renovado_em,
                  data_compra:     anterior.data_compra,
                  data_vencimento: anterior.data_vencimento,
                  status:          anterior.status,
                  ultimo_aviso:    anterior.ultimo_aviso,
                  msg_confirmacao: anterior.msg_confirmacao,
                }).eq('id', anterior.id);
              },
            });
            carregar();
          }}
        />
      )}

      {clienteResposta && (
        <RespostaClienteModal
          cliente={clienteResposta}
          onClose={() => setClienteResposta(null)}
          onSaved={carregar}
        />
      )}

      {clienteEditar && (
        <EditarClienteModal
          cliente={clienteEditar}
          campoFoco={campoFocoEditar}
          onClose={() => { setClienteEditar(null); setCampoFocoEditar(undefined); }}
          onSaved={carregar}
        />
      )}

      {clienteHistorico && (
        <HistoricoContatoDrawer
          cliente={clienteHistorico}
          onClose={() => setClienteHistorico(null)}
          onSaved={carregar}
        />
      )}

      {clienteAtivacao && (
        <ConfirmarAtivacaoModal
          cliente={clienteAtivacao}
          onClose={() => setClienteAtivacao(null)}
          onSaved={() => {
            const anterior = clienteAtivacao;
            registrarUndo({
              descricao: `Ativação de ${anterior.nome}`,
              reverter: async () => {
                await supabase.from('clientes').update({
                  ativacao_confirmada: anterior.ativacao_confirmada,
                  data_ativacao:       anterior.data_ativacao,
                }).eq('id', anterior.id);
              },
            });
            carregar();
          }}
        />
      )}
    </>
  );
}

// ---- Card de renovação mensal ----

function RenovacaoMensalCard({ cliente: c, onFeito }: { cliente: Cliente; onFeito: () => void }) {
  const [copiado,  setCopiado]  = useState(false);
  const [expandido, setExpandido] = useState(false);
  const msg = gerarMsgRenovacaoMensal(c);
  const planoLabel = c.plano ? c.plano.charAt(0).toUpperCase() + c.plano.slice(1) : '';
  const dataFmt    = c.proxima_renovacao_mensal ? fmtData(c.proxima_renovacao_mensal) : '?';

  function copiar() {
    navigator.clipboard.writeText(msg).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div className="bg-white rounded-lg border border-blue-100 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{c.nome}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
            {planoLabel}
          </span>
          <span className="text-xs text-gray-500">{c.produto}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Próxima renovação: <strong className="text-blue-700">{dataFmt}</strong>
        </p>
        {expandido && (
          <pre className="mt-2 text-xs bg-blue-50 border border-blue-100 rounded-lg p-2.5 whitespace-pre-wrap break-words font-mono text-gray-700">
            {msg}
          </pre>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0 flex-wrap">
        <button
          onClick={() => setExpandido(p => !p)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          {expandido ? '🔼 Fechar' : '👁 Ver msg'}
        </button>
        <button
          onClick={copiar}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          {copiado ? '✅ Copiado' : '📋 Copiar'}
        </button>
        <button
          onClick={onFeito}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          ✅ Renovação feita
        </button>
      </div>
    </div>
  );
}
