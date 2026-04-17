'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { ordenarPorUrgencia, precisaAtencao, normalizarClientes } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, string> = {
  todos:          'Todos',
  ativo:          '🟢 Ativos',
  vence_em_breve: '🟡 Vencendo',
  vence_hoje:     '🟠 Vence hoje',
  vencido:        '🔴 Vencidos',
  renovado:       '🔵 Renovados',
  reabordagem:    '⚫ Reabordagem',
};

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filtro,   setFiltro]   = useState<string>('todos');
  const [busca,    setBusca]    = useState('');

  const [showAdicionar,       setShowAdicionar]       = useState(false);
  const [clienteRenovar,      setClienteRenovar]      = useState<Cliente | null>(null);
  const [clienteResposta,     setClienteResposta]     = useState<Cliente | null>(null);
  const [clienteEditar,       setClienteEditar]       = useState<Cliente | null>(null);
  const [clienteHistorico,    setClienteHistorico]    = useState<Cliente | null>(null);
  const [clienteAtivacao,     setClienteAtivacao]     = useState<Cliente | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);

    // Tenta atualizar o status no banco (pg_cron pode não estar ativo)
    // Não usa .maybeSingle() pois a função retorna void
    await supabase.rpc('atualizar_status_todos').then(
      ({ error }) => { if (error) console.warn('[rpc] atualizar_status_todos:', error.message); }
    );

    const { data, error } = await supabase.from('clientes').select('*');
    if (error) {
      toast.error('Erro ao carregar: ' + error.message);
    } else {
      // Recalcula dias_restantes e status no frontend com base em hoje,
      // garantindo que clientes vencidos apareçam corretamente mesmo que
      // o Supabase tenha valores desatualizados (coluna STORED não atualiza sozinha).
      setClientes(normalizarClientes((data as Cliente[]) ?? []));
    }

    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function marcarReabordagem(c: Cliente) {
    const { error } = await supabase
      .from('clientes')
      .update({ status: 'reabordagem' })
      .eq('id', c.id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success(`${c.nome} movido para reabordagem`);
    carregar();
  }

  const precisamAtencao   = clientes.filter(precisaAtencao);
  const ativacosPendentes = clientes.filter(c => !c.ativacao_confirmada && c.status === 'ativo');

  const filtrados = ordenarPorUrgencia(
    clientes.filter(c => {
      const grupo = FILTRO_GRUPOS[filtro];
      const matchFiltro = filtro === 'todos'
        || (grupo ? grupo.includes(c.status) : c.status === filtro);
      const matchBusca  = !busca ||
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.email.toLowerCase().includes(busca.toLowerCase()) ||
        c.whatsapp.includes(busca) ||
        c.produto.toLowerCase().includes(busca.toLowerCase());
      return matchFiltro && matchBusca;
    })
  );

  return (
    <>
      <div className="space-y-5">
        {/* Banner de atenção */}
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
            onEditar={setClienteEditar}
            onVerHistorico={setClienteHistorico}
            onConfirmarAtivacao={setClienteAtivacao}
          />
        )}
      </div>

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
          onSaved={carregar}
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
          onClose={() => setClienteEditar(null)}
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
          onSaved={carregar}
        />
      )}
    </>
  );
}
