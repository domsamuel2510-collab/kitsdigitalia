'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import { StatusBadge } from './StatusBadge';
import { supabase } from '@/lib/supabase';
import { fmtData, whatsappLink, diasSemContato, precisaAtencao } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  clientes: Cliente[];
  onRenovar:             (c: Cliente) => void;
  onNaoRenovar:          (c: Cliente) => void;
  onEditar:              (c: Cliente) => void;
  onRegistrarResposta:   (c: Cliente) => void;
  onVerHistorico:        (c: Cliente) => void;
  onConfirmarAtivacao:   (c: Cliente) => void;
}

export function ClienteTable({
  clientes,
  onRenovar,
  onNaoRenovar,
  onEditar,
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

// ---- Row separada para isolar estado de edição inline ----

interface RowProps {
  cliente: Cliente;
  onRenovar:           (c: Cliente) => void;
  onNaoRenovar:        (c: Cliente) => void;
  onEditar:            (c: Cliente) => void;
  onRegistrarResposta: (c: Cliente) => void;
  onVerHistorico:      (c: Cliente) => void;
  onConfirmarAtivacao: (c: Cliente) => void;
}

function ClienteRow({
  cliente: c,
  onRenovar, onNaoRenovar, onEditar,
  onRegistrarResposta, onVerHistorico, onConfirmarAtivacao,
}: RowProps) {
  const urgente = precisaAtencao(c);

  // Estado local para edição inline de datas
  const [editCompra,    setEditCompra]    = useState(false);
  const [editVenc,      setEditVenc]      = useState(false);
  const [dataCompra,    setDataCompra]    = useState(c.data_compra);
  const [dataVenc,      setDataVenc]      = useState(c.data_vencimento);

  async function salvarData(campo: 'data_compra' | 'data_vencimento', valor: string) {
    const { error } = await supabase
      .from('clientes')
      .update({ [campo]: valor })
      .eq('id', c.id);
    if (error) {
      toast.error('Erro ao salvar data');
      // reverte
      if (campo === 'data_compra') setDataCompra(c.data_compra);
      else setDataVenc(c.data_vencimento);
    } else {
      toast.success('Data atualizada');
    }
    if (campo === 'data_compra') setEditCompra(false);
    else setEditVenc(false);
  }

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${urgente ? 'bg-red-50/40' : ''}`}>

      {/* Cliente — clicável para abrir drawer */}
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

            {/* Badge de ativação pendente + botão rápido */}
            {!c.ativacao_confirmada && (
              <button
                onClick={() => onConfirmarAtivacao(c)}
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded px-1.5 py-0.5 transition-colors"
                title="Clique para confirmar ativação"
              >
                ⚠️ Ativar conta
              </button>
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
            onBlur={() => salvarData('data_compra', dataCompra)}
            onKeyDown={e => {
              if (e.key === 'Enter') salvarData('data_compra', dataCompra);
              if (e.key === 'Escape') { setDataCompra(c.data_compra); setEditCompra(false); }
            }}
            className="w-32 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-1 group">
            {fmtData(dataCompra)}
            <button
              onClick={() => setEditCompra(true)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-orange-500 transition-opacity text-xs"
              title="Editar data de compra"
            >
              📅
            </button>
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
            onBlur={() => salvarData('data_vencimento', dataVenc)}
            onKeyDown={e => {
              if (e.key === 'Enter') salvarData('data_vencimento', dataVenc);
              if (e.key === 'Escape') { setDataVenc(c.data_vencimento); setEditVenc(false); }
            }}
            className="w-32 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-1 group">
            {fmtData(dataVenc)}
            <button
              onClick={() => setEditVenc(true)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-orange-500 transition-opacity text-xs"
              title="Editar data de vencimento"
            >
              📅
            </button>
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

      {/* Ações */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 flex-wrap">
          <button
            onClick={() => onRenovar(c)}
            className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-medium"
          >
            Renovar
          </button>
          <a
            href={whatsappLink(c.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium"
          >
            WhatsApp
          </a>
          <button
            onClick={() => onRegistrarResposta(c)}
            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium"
            title="Registrar resposta"
          >
            📋
          </button>
          {c.status !== 'reabordagem' && (
            <button
              onClick={() => onNaoRenovar(c)}
              className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium"
            >
              Não renovou
            </button>
          )}
          <button
            onClick={() => onEditar(c)}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-medium"
            title="Editar todos os campos"
          >
            ✏️
          </button>
        </div>
      </td>
    </tr>
  );
}

// ---- chips ----

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
