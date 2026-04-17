'use client';

import { useState, useRef, useEffect } from 'react';
import type { Cliente } from '@/types/cliente';
import { StatusBadge } from './StatusBadge';
import { supabase } from '@/lib/supabase';
import {
  fmtData, whatsappLink, diasSemContato, precisaAtencao, precisaRenovacaoMensal,
  camposFaltantes,
} from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  clientes: Cliente[];
  onRenovar:             (c: Cliente) => void;
  onNaoRenovar:          (c: Cliente) => void;
  onEditar:              (c: Cliente) => void;
  onEditarComFoco?:      (c: Cliente, campo: 'email' | 'whatsapp') => void;
  onRegistrarResposta:   (c: Cliente) => void;
  onVerHistorico:        (c: Cliente) => void;
  onConfirmarAtivacao:   (c: Cliente) => void;
}

export function ClienteTable({
  clientes,
  onRenovar,
  onNaoRenovar,
  onEditar,
  onEditarComFoco,
  onRegistrarResposta,
  onVerHistorico,
  onConfirmarAtivacao,
}: Props) {
  if (!clientes.length) {
    return <div className="text-center py-16 text-gray-500">Nenhum cliente encontrado.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Produto</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">Compra</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">Vencimento</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Dias</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Tentativas</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clientes.map(c => (
            <ClienteRow
              key={c.id}
              cliente={c}
              onRenovar={onRenovar}
              onNaoRenovar={onNaoRenovar}
              onEditar={onEditar}
              onEditarComFoco={onEditarComFoco}
              onRegistrarResposta={onRegistrarResposta}
              onVerHistorico={onVerHistorico}
              onConfirmarAtivacao={onConfirmarAtivacao}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Row separada para isolar estado ----

interface RowProps {
  cliente: Cliente;
  onRenovar:            (c: Cliente) => void;
  onNaoRenovar:         (c: Cliente) => void;
  onEditar:             (c: Cliente) => void;
  onEditarComFoco?:     (c: Cliente, campo: 'email' | 'whatsapp') => void;
  onRegistrarResposta:  (c: Cliente) => void;
  onVerHistorico:       (c: Cliente) => void;
  onConfirmarAtivacao:  (c: Cliente) => void;
}

function ClienteRow({
  cliente: c,
  onRenovar, onNaoRenovar, onEditar, onEditarComFoco,
  onRegistrarResposta, onVerHistorico, onConfirmarAtivacao,
}: RowProps) {
  const urgente      = precisaAtencao(c);
  const renovMensal  = precisaRenovacaoMensal(c);
  const faltam       = camposFaltantes(c);

  // Edição inline de datas
  const [editCompra,    setEditCompra]    = useState(false);
  const [editVenc,      setEditVenc]      = useState(false);
  const [dataCompra,    setDataCompra]    = useState(c.data_compra ?? '');
  const [dataVenc,      setDataVenc]      = useState(c.data_vencimento ?? '');
  const skipBlurCompra = useRef(false);
  const skipBlurVenc   = useRef(false);

  // Dropdown de ações secundárias
  const [dropAberto, setDropAberto] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropAberto) return;
    function fechar(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropAberto(false);
      }
    }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [dropAberto]);

  function dataValida(valor: string): boolean {
    if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    return !isNaN(new Date(valor + 'T12:00:00Z').getTime());
  }

  async function salvarData(campo: 'data_compra' | 'data_vencimento', valor: string) {
    const isCompra = campo === 'data_compra';
    if (isCompra) setEditCompra(false); else setEditVenc(false);

    if (!dataValida(valor)) {
      toast.error('Data inválida');
      if (isCompra) setDataCompra(c.data_compra ?? '');
      else          setDataVenc(c.data_vencimento ?? '');
      return;
    }
    const original = isCompra ? c.data_compra : c.data_vencimento;
    if (valor === original) return;

    try {
      const { error } = await supabase.from('clientes').update({ [campo]: valor }).eq('id', c.id);
      if (error) throw error;
      toast.success('Data atualizada');
    } catch (err: unknown) {
      toast.error('Erro ao salvar data: ' + (err instanceof Error ? err.message : 'Erro'));
      if (isCompra) setDataCompra(c.data_compra ?? '');
      else          setDataVenc(c.data_vencimento ?? '');
    }
  }

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${urgente ? 'bg-red-50/40' : ''}`}>

      {/* Cliente */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {urgente && (
            <span
              className="animate-pulse inline-block w-2 h-2 rounded-full bg-red-500 shrink-0"
              title="Sem contato há 3+ dias"
            />
          )}
          <div>
            <button
              onClick={() => onVerHistorico(c)}
              className="font-medium text-gray-900 hover:text-orange-600 hover:underline text-left"
              title="Ver histórico de contatos"
            >
              {c.nome}
            </button>
            <div className="text-xs text-gray-400">{c.email}</div>

            {/* Badge de ativação pendente */}
            {!c.ativacao_confirmada && (
              <button
                onClick={() => onConfirmarAtivacao(c)}
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded px-1.5 py-0.5 transition-colors"
                title="Clique para confirmar ativação"
              >
                ⚠️ Ativar conta
              </button>
            )}

            {/* Badge de renovação mensal pendente */}
            {renovMensal && c.proxima_renovacao_mensal && (
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 rounded px-1.5 py-0.5">
                🔄 Renovar em {diasParaRenovacao(c.proxima_renovacao_mensal)}d
              </span>
            )}

            {/* Ícones de cadastro incompleto — clicáveis */}
            {faltam.length > 0 && (
              <div className="mt-0.5 flex items-center gap-1">
                {faltam.includes('email') && (
                  <button
                    onClick={() => onEditarComFoco ? onEditarComFoco(c, 'email') : onEditar(c)}
                    title="Email ausente — clique para preencher"
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded px-1.5 py-0.5 transition-colors"
                  >
                    📧 sem email
                  </button>
                )}
                {faltam.includes('whatsapp') && (
                  <button
                    onClick={() => onEditarComFoco ? onEditarComFoco(c, 'whatsapp') : onEditar(c)}
                    title="WhatsApp ausente — clique para preencher"
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded px-1.5 py-0.5 transition-colors"
                  >
                    📱 sem whatsapp
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Produto + Plano */}
      <td className="px-4 py-3 hidden md:table-cell text-gray-700">
        <div>{c.produto}</div>
        {c.plano && <PlanoBadge plano={c.plano} />}
      </td>

      {/* Data compra — edição inline */}
      <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
        {editCompra ? (
          <input
            type="date"
            value={dataCompra}
            autoFocus
            onChange={e => setDataCompra(e.target.value)}
            onBlur={() => {
              if (skipBlurCompra.current) { skipBlurCompra.current = false; return; }
              salvarData('data_compra', dataCompra);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter')  { skipBlurCompra.current = true; salvarData('data_compra', dataCompra); }
              if (e.key === 'Escape') { skipBlurCompra.current = true; setDataCompra(c.data_compra ?? ''); setEditCompra(false); }
            }}
            className="w-32 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-1 group">
            {dataCompra ? fmtData(dataCompra) : '—'}
            <button
              onClick={() => setEditCompra(true)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-orange-500 transition-opacity text-xs"
              title="Editar data de compra"
            >📅</button>
          </span>
        )}
      </td>

      {/* Data vencimento — edição inline */}
      <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
        {editVenc ? (
          <input
            type="date"
            value={dataVenc}
            autoFocus
            onChange={e => setDataVenc(e.target.value)}
            onBlur={() => {
              if (skipBlurVenc.current) { skipBlurVenc.current = false; return; }
              salvarData('data_vencimento', dataVenc);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter')  { skipBlurVenc.current = true; salvarData('data_vencimento', dataVenc); }
              if (e.key === 'Escape') { skipBlurVenc.current = true; setDataVenc(c.data_vencimento ?? ''); setEditVenc(false); }
            }}
            className="w-32 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-1 group">
            {dataVenc ? fmtData(dataVenc) : '—'}
            <button
              onClick={() => setEditVenc(true)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-orange-500 transition-opacity text-xs"
              title="Editar data de vencimento"
            >📅</button>
          </span>
        )}
      </td>

      {/* Dias restantes */}
      <td className="px-4 py-3 text-center hidden sm:table-cell">
        <DiasChip dias={c.dias_restantes} />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={c.status} />
      </td>

      {/* Tentativas */}
      <td className="px-4 py-3 text-center hidden md:table-cell">
        <TentativasChip
          tentativas={c.tentativas_contato ?? 0}
          urgente={urgente}
          dsc={diasSemContato(c.ultima_tentativa)}
        />
      </td>

      {/* Ações — primárias visíveis + secundárias no dropdown ⋮ */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {/* Ação primária: Renovar */}
          <button
            onClick={() => onRenovar(c)}
            className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            ✅ Renovar
          </button>

          {/* Ação primária: WhatsApp */}
          <a
            href={whatsappLink(c.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            💬
          </a>

          {/* Dropdown de ações secundárias */}
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropAberto(p => !p)}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                dropAberto
                  ? 'bg-gray-200 border-gray-300 text-gray-800'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'
              }`}
              title="Mais ações"
            >
              ⋮
            </button>

            {dropAberto && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                <DropItem onClick={() => { setDropAberto(false); onEditar(c); }}>
                  ✏️ Editar
                </DropItem>
                <DropItem onClick={() => { setDropAberto(false); onVerHistorico(c); }}>
                  📜 Ver histórico
                </DropItem>
                <DropItem onClick={() => { setDropAberto(false); onRegistrarResposta(c); }}>
                  📋 Registrar contato
                </DropItem>
                {!c.ativacao_confirmada && (
                  <DropItem onClick={() => { setDropAberto(false); onConfirmarAtivacao(c); }}>
                    🔑 Confirmar ativação
                  </DropItem>
                )}
                {c.status !== 'reabordagem' && (
                  <>
                    <div className="my-1 border-t border-gray-100" />
                    <DropItem
                      onClick={() => { setDropAberto(false); onNaoRenovar(c); }}
                      danger
                    >
                      ❌ Não renovou
                    </DropItem>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ---- Helpers inline ----

function diasParaRenovacao(proxima: string): number {
  const agora = new Date(); agora.setHours(0, 0, 0, 0);
  const data  = new Date(proxima + 'T00:00:00');
  return Math.round((data.getTime() - agora.getTime()) / 86_400_000);
}

function DropItem({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

// ---- Chips ----

function DiasChip({ dias }: { dias: number }) {
  let cls = 'text-green-700 bg-green-100';
  if (dias <= 0)       cls = 'text-red-700    bg-red-100';
  else if (dias <= 2)  cls = 'text-orange-700 bg-orange-100';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {dias}d
    </span>
  );
}

const PLANO_STYLE: Record<string, string> = {
  mensal:      'bg-gray-100   text-gray-600',
  trimestral:  'bg-blue-100   text-blue-700',
  semestral:   'bg-purple-100 text-purple-700',
  anual:       'bg-orange-100 text-orange-700',
};
const PLANO_LABEL: Record<string, string> = {
  mensal: 'Mensal', trimestral: 'Trimestral', semestral: 'Semestral', anual: 'Anual',
};

function PlanoBadge({ plano }: { plano: string }) {
  return (
    <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${PLANO_STYLE[plano] ?? 'bg-gray-100 text-gray-600'}`}>
      {PLANO_LABEL[plano] ?? plano}
    </span>
  );
}

function TentativasChip({ tentativas, urgente, dsc }: {
  tentativas: number;
  urgente: boolean;
  dsc: number;
}) {
  if (tentativas === 0) return <span className="text-xs text-gray-300">—</span>;
  const cls = urgente
    ? 'text-red-700 bg-red-100 animate-pulse'
    : 'text-gray-600 bg-gray-100';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}
      title={dsc < 999 ? `Sem contato há ${dsc}d` : 'Nenhum contato registrado'}
    >
      {tentativas}x
    </span>
  );
}
