'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cliente, Status } from '@/types/cliente';
import { DashboardCards } from '@/components/DashboardCards';
import { ClienteTable } from '@/components/ClienteTable';
import { AdicionarClienteModal } from '@/components/AdicionarClienteModal';
import { RenovarModal } from '@/components/RenovarModal';
import { RespostaClienteModal } from '@/components/RespostaClienteModal';
import { ordenarPorUrgencia, precisaAtencao } from '@/lib/utils';
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

  const [showAdicionar,     setShowAdicionar]     = useState(false);
  const [clienteRenovar,    setClienteRenovar]    = useState<Cliente | null>(null);
  const [clienteResposta,   setClienteResposta]   = useState<Cliente | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    await supabase.rpc('atualizar_status_todos').maybeSingle();

    const { data, error } = await supabase
      .from('clientes')
      .select('*');

    if (error) { toast.error('Erro ao carregar: ' + error.message); }
    else setClientes((data as Cliente[]) ?? []);
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

  // ---- métricas de atenção ----
  const precisamAtencao = clientes.filter(precisaAtencao);
  const ativacosPendentes = clientes.filter(c => !c.ativacao_confirmada && c.status === 'ativo');

  // ---- ordenação por urgência + filtros ----
  const filtrados = ordenarPorUrgencia(
    clientes.filter(c => {
      const matchFiltro = filtro === 'todos' || c.status === filtro;
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

        {/* Cards de resumo */}
        <DashboardCards clientes={clientes} />

        {/* Filtros + busca */}
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

        {/* Tabela ordenada por urgência */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Carregando…</div>
        ) : (
          <ClienteTable
            clientes={filtrados}
            onRenovar={setClienteRenovar}
            onNaoRenovar={marcarReabordagem}
            onRegistrarResposta={setClienteResposta}
            onEditar={c => toast(`Edição de ${c.nome} (em breve)`, { icon: 'ℹ️' })}
          />
        )}
      </div>

      {showAdicionar && (
        <AdicionarClienteModal
          onClose={() => setShowAdicionar(false)}
          onSaved={() => { carregar(); }}
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
    </>
  );
}
