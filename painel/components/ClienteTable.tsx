'use client';

import { useState, useRef, useEffect } from 'react';
import type { Cliente } from '@/types/cliente';
import { StatusBadge } from './StatusBadge';
import { supabase } from '@/lib/supabase';
import {
  fmtDataCurta, whatsappLink, diasSemContato,
  precisaAtencao, precisaRenovacaoMensal, camposFaltantes,
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
  onRenovar, onNaoRenovar, onEditar, onEditarComFoco,
  onRegistrarResposta, onVerHistorico, onConfirmarAtivacao,
}: Props) {
  if (!clientes.length) {
    return <div className="text-center py-10 text-gray-400 text-sm">Nenhum cliente encontrado.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left">Cliente</th>
            <th className="px-3 py-2 text-left hidden md:table-cell">Produto</th>
            <th className="px-3 py-2 text-left hidden lg:table-cell">Compra</th>
            <th className="px-3 py-2 text-left hidden lg:table-cell">Vence</th>
            <th className="px-3 py-2 text-center hidden sm:table-cell">Dias</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-right">Ações</th>
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

// ---- Row ----

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
  const urgente     = precisaAtencao(c);
  const renovMensal = precisaRenovacaoMensal(c);
  const faltam      = camposFaltantes(c);

  // Edição inline de datas
  const [editCompra, setEditCompra] = useState(false);
  const [editVenc,   setEditVenc]   = useState(false);
  const [dataCompra, setDataCompra] = useState(c.data_compra ?? '');
  const [dataVenc,   setDataVenc]   = useState(c.data_vencimento ?? '');
  const skipBlurCompra = useRef(false);
  const skipBlurVenc   = useRef(false);

  // Dropdown
  const [dropAberto, setDropAberto] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropAberto) return;
    function fechar(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropAberto(false);
    }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [dropAberto]);

  function dataValida(v: string) {
    return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v + 'T12:00:00Z').getTime());
  }

  async function salvarData(campo: 'data_compra' | 'data_vencimento', valor: string) {
    const isCompra = campo === 'data_compra';
    if (isCompra) setEditCompra(false); else setEditVenc(false);
    if (!dataValida(valor)) {
      toast.error('Data inválida');
      if (isCompra) setDataCompra(c.data_compra ?? ''); else setDataVenc(c.data_vencimento ?? '');
      return;
    }
    const original = isCompra ? c.data_compra : c.data_vencimento;
    if (valor === original) return;
    try {
      const { error } = await supabase.from('clientes').update({ [campo]: valor }).eq('id', c.id);
      if (error) throw error;
      toast.success('Data atualizada');
    } catch (err: unknown) {
      toast.error('Erro: ' + (err instanceof Error ? err.message : 'desconhecido'));
      if (isCompra) setDataCompra(c.data_compra ?? ''); else setDataVenc(c.data_vencimento ?? '');
    }
  }

  const hasBadge = !c.ativacao_confirmada || renovMensal || faltam.length > 0;

  return (
    <tr className={`text-sm transition-colors hover:bg-gray-50 ${urgente ? 'bg-red-50/40' : ''}`}>

      {/* Cliente — nome + email·whatsapp numa linha */}
      <td className="px-3 py-2 max-w-[200px]">
        <div className="flex items-start gap-1.5">
          {urgente && (
            <span className="mt-1 shrink-0 animate-pulse inline-block w-1.5 h-1.5 rounded-full bg-red-500" title="Sem contato há 3+ dias" />
          )}
          <div className="min-w-0">
            <button
              onClick={() => onVerHistorico(c)}
              className="font-medium text-gray-900 hover:text-orange-600 hover:underline text-left text-sm leading-tight truncate block max-w-full"
              title={c.nome}
            >
              {c.nome}
            </button>
            {/* Email · WhatsApp em linha única */}
            <div className="text-xs text-gray-400 truncate leading-tight">
              {c.email || <span className="text-red-400">sem email</span>}
              {(c.email && c.whatsapp) && <span className="mx-0.5">·</span>}
              {c.whatsapp || <span className="text-red-400">sem whatsapp</span>}
            </div>
            {/* Mini badges apenas quando necessário */}
            {hasBadge && (
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                {!c.ativacao_confirmada && (
                  <button
                    onClick={() => onConfirmarAtivacao(c)}
                    title="Confirmar ativação"
                    className="text-[10px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded px-1 py-0.5 leading-none"
                  >
                    ⚠️ ativar
                  </button>
                )}
                {renovMensal && c.proxima_renovacao_mensal && (
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 rounded px-1 py-0.5 leading-none">
                    🔄 {diasParaRenovacao(c.proxima_renovacao_mensal)}d
                  </span>
                )}
                {faltam.includes('email') && (
                  <button
                    onClick={() => onEditarComFoco ? onEditarComFoco(c, 'email') : onEditar(c)}
                    title="Email ausente"
                    className="text-[10px] font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded px-1 py-0.5 leading-none"
                  >
                    📧
                  </button>
                )}
                {faltam.includes('whatsapp') && (
                  <button
                    onClick={() => onEditarComFoco ? onEditarComFoco(c, 'whatsapp') : onEditar(c)}
                    title="WhatsApp ausente"
                    className="text-[10px] font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded px-1 py-0.5 leading-none"
                  >
                    📱
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Produto + Plano na mesma linha */}
      <td className="px-3 py-2 hidden md:table-cell">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-gray-700 leading-tight">{c.produto}</span>
          {c.plano && <PlanoBadge plano={c.plano} />}
        </div>
      </td>

      {/* Data compra — edição inline, formato DD/MM/AA */}
      <td className="px-3 py-2 hidden lg:table-cell text-gray-600">
        {editCompra ? (
          <input
            type="date" value={dataCompra} autoFocus
            onChange={e => setDataCompra(e.target.value)}
            onBlur={() => { if (skipBlurCompra.current) { skipBlurCompra.current = false; return; } salvarData('data_compra', dataCompra); }}
            onKeyDown={e => {
              if (e.key === 'Enter')  { skipBlurCompra.current = true; salvarData('data_compra', dataCompra); }
              if (e.key === 'Escape') { skipBlurCompra.current = true; setDataCompra(c.data_compra ?? ''); setEditCompra(false); }
            }}
            className="w-28 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-0.5 group text-xs cursor-default">
            {dataCompra ? fmtDataCurta(dataCompra) : '—'}
            <button onClick={() => setEditCompra(true)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-orange-500 transition-opacity text-xs" title="Editar">📅</button>
          </span>
        )}
      </td>

      {/* Data vencimento — edição inline, formato DD/MM/AA */}
      <td className="px-3 py-2 hidden lg:table-cell text-gray-600">
        {editVenc ? (
          <input
            type="date" value={dataVenc} autoFocus
            onChange={e => setDataVenc(e.target.value)}
            onBlur={() => { if (skipBlurVenc.current) { skipBlurVenc.current = false; return; } salvarData('data_vencimento', dataVenc); }}
            onKeyDown={e => {
              if (e.key === 'Enter')  { skipBlurVenc.current = true; salvarData('data_vencimento', dataVenc); }
              if (e.key === 'Escape') { skipBlurVenc.current = true; setDataVenc(c.data_vencimento ?? ''); setEditVenc(false); }
            }}
            className="w-28 text-xs border border-orange-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        ) : (
          <span className="flex items-center gap-0.5 group text-xs cursor-default">
            {dataVenc ? fmtDataCurta(dataVenc) : '—'}
            <button onClick={() => setEditVenc(true)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-orange-500 transition-opacity text-xs" title="Editar">📅</button>
          </span>
        )}
      </td>

      {/* Dias restantes */}
      <td className="px-3 py-2 text-center hidden sm:table-cell">
        <DiasChip dias={c.dias_restantes} />
      </td>

      {/* Status */}
      <td className="px-3 py-2">
        <StatusBadge status={c.status} />
      </td>

      {/* Ações — ícones apenas, sem texto */}
      <td className="px-3 py-2">
        <div className="flex items-center justify-end gap-0.5">
          <IconBtn onClick={() => onRenovar(c)} title="Renovar" className="bg-orange-500 hover:bg-orange-600 text-white">✅</IconBtn>
          <IconBtnA href={whatsappLink(c.whatsapp)} title="WhatsApp" className="bg-green-500 hover:bg-green-600 text-white">💬</IconBtnA>
          <IconBtn onClick={() => onEditar(c)} title="Editar" className="bg-gray-100 hover:bg-gray-200 text-gray-600">✏️</IconBtn>

          {/* Dropdown ⋮ */}
          <div ref={dropRef} className="relative">
            <IconBtn
              onClick={() => setDropAberto(p => !p)}
              title="Mais ações"
              className={dropAberto ? 'bg-gray-200 text-gray-800 border border-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
            >
              ⋮
            </IconBtn>

            {dropAberto && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                <DropItem onClick={() => { setDropAberto(false); onVerHistorico(c); }}>📜 Ver histórico</DropItem>
                <DropItem onClick={() => { setDropAberto(false); onRegistrarResposta(c); }}>📋 Registrar contato</DropItem>
                {!c.ativacao_confirmada && (
                  <DropItem onClick={() => { setDropAberto(false); onConfirmarAtivacao(c); }}>🔑 Confirmar ativação</DropItem>
                )}
                {c.status !== 'reabordagem' && (
                  <>
                    <div className="my-1 border-t border-gray-100" />
                    <DropItem onClick={() => { setDropAberto(false); onNaoRenovar(c); }} danger>❌ Não renovou</DropItem>
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

// ---- Helpers ----

function diasParaRenovacao(proxima: string): number {
  const agora = new Date(); agora.setHours(0, 0, 0, 0);
  return Math.round((new Date(proxima + 'T00:00:00').getTime() - agora.getTime()) / 86_400_000);
}

function IconBtn({
  children, onClick, title, className,
}: { children: React.ReactNode; onClick: () => void; title: string; className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function IconBtnA({
  children, href, title, className,
}: { children: React.ReactNode; href: string; title: string; className: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

function DropItem({
  children, onClick, danger = false,
}: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

// ---- Chips ----

function DiasChip({ dias }: { dias: number }) {
  let cls = 'text-green-700 bg-green-100';
  if (dias <= 0)      cls = 'text-red-700   bg-red-100';
  else if (dias <= 2) cls = 'text-orange-700 bg-orange-100';
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {dias}d
    </span>
  );
}

const PLANO_STYLE: Record<string, string> = {
  mensal:      'bg-gray-100   text-gray-500',
  trimestral:  'bg-blue-100   text-blue-600',
  semestral:   'bg-purple-100 text-purple-600',
  anual:       'bg-orange-100 text-orange-600',
};
const PLANO_LABEL: Record<string, string> = {
  mensal: 'M', trimestral: 'Tri', semestral: 'Sem', anual: 'Anu',
};

function PlanoBadge({ plano }: { plano: string }) {
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${PLANO_STYLE[plano] ?? 'bg-gray-100 text-gray-500'}`}>
      {PLANO_LABEL[plano] ?? plano}
    </span>
  );
}
