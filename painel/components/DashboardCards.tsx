'use client';

import type { Cliente } from '@/types/cliente';

interface CardConfig {
  label:       string;
  color:       string;
  bg:          string;
  border:      string;
  borderSel:   string; // borda quando selecionado
  statuses:    string[];
  filtroValue: string; // valor passado ao onFiltrar
}

const CARDS: CardConfig[] = [
  {
    label: 'Ativos', color: 'text-green-700', bg: 'bg-green-50',
    border: 'border-green-200', borderSel: 'border-green-500 ring-2 ring-green-300',
    statuses: ['ativo', 'renovado'], filtroValue: 'ativos',
  },
  {
    label: 'Vencendo', color: 'text-yellow-700', bg: 'bg-yellow-50',
    border: 'border-yellow-200', borderSel: 'border-yellow-500 ring-2 ring-yellow-300',
    statuses: ['vence_em_breve', 'vence_hoje'], filtroValue: 'vencendo',
  },
  {
    label: 'Vencidos', color: 'text-red-700', bg: 'bg-red-50',
    border: 'border-red-200', borderSel: 'border-red-500 ring-2 ring-red-300',
    statuses: ['vencido'], filtroValue: 'vencido',
  },
  {
    label: 'Reabordagem', color: 'text-gray-700', bg: 'bg-gray-50',
    border: 'border-gray-200', borderSel: 'border-gray-500 ring-2 ring-gray-300',
    statuses: ['reabordagem'], filtroValue: 'reabordagem',
  },
];

interface Props {
  clientes:    Cliente[];
  filtroAtivo: string;                  // valor atual do filtro ('todos' = nenhum)
  onFiltrar:   (valor: string) => void; // clique no card
}

export function DashboardCards({ clientes, filtroAtivo, onFiltrar }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {CARDS.map(({ label, color, bg, border, borderSel, statuses, filtroValue }) => {
        const total     = clientes.filter(c => statuses.includes(c.status)).length;
        const selecionado = filtroAtivo === filtroValue;

        return (
          <button
            key={label}
            type="button"
            onClick={() => onFiltrar(selecionado ? 'todos' : filtroValue)}
            className={[
              'rounded-lg border p-3 text-left transition-all duration-150 select-none',
              bg,
              selecionado ? borderSel + ' shadow-md' : border + ' hover:shadow-sm hover:brightness-95',
            ].join(' ')}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide leading-none">{label}</p>
            <p className={`text-2xl font-bold mt-1 leading-none ${color}`}>{total}</p>
            {selecionado && (
              <p className="text-xs mt-1 text-gray-400">limpar ×</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Grupos de status por filtroValue — usado em page.tsx para filtrar a lista */
export const FILTRO_GRUPOS: Record<string, string[]> = {
  ativos:      ['ativo', 'renovado'],
  vencendo:    ['vence_em_breve', 'vence_hoje'],
  vencido:     ['vencido'],
  reabordagem: ['reabordagem'],
};
