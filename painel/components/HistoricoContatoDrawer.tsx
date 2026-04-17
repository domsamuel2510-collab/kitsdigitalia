'use client';

import { useEffect, useState } from 'react';
import type { Cliente, RespostaCliente } from '@/types/cliente';
import { supabase } from '@/lib/supabase';
import { hoje, fmtData, whatsappLink } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

const RESPOSTA_MAP: Record<RespostaCliente, { label: string; cls: string }> = {
  respondeu:     { label: '💬 Respondeu',       cls: 'bg-blue-100  text-blue-800' },
  vai_renovar:   { label: '✅ Vai renovar',     cls: 'bg-green-100 text-green-800' },
  nao_respondeu: { label: '🔕 Não respondeu',   cls: 'bg-gray-100  text-gray-700' },
  nao_quer_mais: { label: '❌ Não quer mais',   cls: 'bg-red-100   text-red-800' },
};

const OPCOES_RESPOSTA: { value: RespostaCliente; label: string }[] = [
  { value: 'respondeu',    label: '💬 Respondeu' },
  { value: 'vai_renovar',  label: '✅ Vai renovar' },
  { value: 'nao_respondeu',label: '🔕 Não respondeu' },
  { value: 'nao_quer_mais',label: '❌ Não quer mais' },
];

export function HistoricoContatoDrawer({ cliente, onClose, onSaved }: Props) {
  const [novaResposta,  setNovaResposta]  = useState<RespostaCliente | ''>('');
  const [novaObs,       setNovaObs]       = useState('');
  const [salvando,      setSalvando]      = useState(false);
  const [mostrarForm,   setMostrarForm]   = useState(false);

  // Fecha drawer com Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Monta lista de tentativas a partir dos campos disponíveis
  // (sem tabela separada: cada item representa o estado mais recente)
  const tentativas = cliente.tentativas_contato ?? 0;
  const ultimaData = cliente.ultima_tentativa;

  async function registrarContato() {
    if (!novaResposta) { toast.error('Selecione a resposta'); return; }
    setSalvando(true);

    const updates: Record<string, unknown> = {
      resposta_cliente:   novaResposta,
      ultima_tentativa:   hoje(),
      tentativas_contato: tentativas + 1,
    };
    if (novaObs.trim()) updates.observacoes = novaObs.trim();
    if (novaResposta === 'nao_quer_mais') updates.status = 'reabordagem';

    const { error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', cliente.id);

    setSalvando(false);
    if (error) { toast.error('Erro: ' + error.message); return; }
    toast.success('Contato registrado!');
    setMostrarForm(false);
    setNovaResposta('');
    setNovaObs('');
    onSaved();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-bold text-gray-900">{cliente.nome}</h2>
            <p className="text-xs text-gray-500">{cliente.produto} · {cliente.whatsapp}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Resumo do cliente */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 text-gray-600">
            <Row label="Status"       value={<StatusPill status={cliente.status} />} />
            <Row label="Vencimento"   value={fmtData(cliente.data_vencimento)} />
            <Row label="Tentativas"   value={`${tentativas}x`} />
            {ultimaData && <Row label="Último contato" value={fmtData(ultimaData)} />}
            {cliente.observacoes && <Row label="Observações" value={cliente.observacoes} />}
            {cliente.ativacao_confirmada
              ? <Row label="Ativação" value="✅ Confirmada" />
              : <Row label="Ativação" value={<span className="text-amber-600 font-medium">⚠️ Pendente</span>} />
            }
          </div>

          {/* Histórico de tentativas (reconstruído dos dados disponíveis) */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wide mb-2">
              Histórico de contatos
            </h3>

            {tentativas === 0 ? (
              <p className="text-xs text-gray-400 italic">Nenhum contato registrado ainda.</p>
            ) : (
              <div className="space-y-2">
                {/* Registro atual (último) */}
                <div className="bg-white border border-gray-100 rounded-lg p-3 text-xs shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">
                      {tentativas}ª tentativa
                    </span>
                    {ultimaData && (
                      <span className="text-gray-400">{fmtData(ultimaData)}</span>
                    )}
                  </div>
                  {cliente.resposta_cliente && (
                    <RespostaPill resposta={cliente.resposta_cliente} />
                  )}
                  {cliente.observacoes && (
                    <p className="mt-1 text-gray-500">{cliente.observacoes}</p>
                  )}
                </div>

                {tentativas > 1 && (
                  <p className="text-xs text-gray-400 italic px-1">
                    + {tentativas - 1} contato{tentativas - 1 > 1 ? 's' : ''} anterior{tentativas - 1 > 1 ? 'es' : ''} registrado{tentativas - 1 > 1 ? 's' : ''}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Formulário de novo contato */}
          {mostrarForm ? (
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-orange-700">📞 Novo contato</p>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Resposta do cliente *</label>
                <select
                  value={novaResposta}
                  onChange={e => setNovaResposta(e.target.value as RespostaCliente)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Selecionar…</option>
                  {OPCOES_RESPOSTA.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Observação (opcional)</label>
                <textarea
                  value={novaObs}
                  onChange={e => setNovaObs(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder="Ex: disse que vai renovar semana que vem…"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setMostrarForm(false); setNovaResposta(''); setNovaObs(''); }}
                  className="flex-1 py-2 text-xs rounded-lg border hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={registrarContato}
                  disabled={salvando || !novaResposta}
                  className="flex-1 py-2 text-xs rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-60"
                >
                  {salvando ? 'Salvando…' : 'Registrar'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setMostrarForm(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 text-sm font-medium transition-colors"
            >
              + Registrar novo contato
            </button>
          )}
        </div>

        {/* Footer: ações rápidas */}
        <div className="border-t px-5 py-3 flex gap-2">
          <a
            href={whatsappLink(cliente.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-center text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            💬 Abrir WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

// ---- helpers visuais ----

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400 shrink-0">{label}:</span>
      <span className="text-right font-medium text-gray-700">{value}</span>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  ativo:          'bg-green-100  text-green-800',
  vence_em_breve: 'bg-yellow-100 text-yellow-800',
  vence_hoje:     'bg-orange-100 text-orange-800',
  vencido:        'bg-red-100    text-red-800',
  renovado:       'bg-blue-100   text-blue-800',
  reabordagem:    'bg-gray-100   text-gray-700',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function RespostaPill({ resposta }: { resposta: RespostaCliente }) {
  const { label, cls } = RESPOSTA_MAP[resposta] ?? { label: resposta, cls: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}
