import type { Cliente } from '@/types/cliente';

interface Props { clientes: Cliente[] }

interface CardConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  statuses: string[];
}

const CARDS: CardConfig[] = [
  { label: 'Ativos',    color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', statuses: ['ativo', 'renovado'] },
  { label: 'Vencendo',  color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', statuses: ['vence_em_breve', 'vence_hoje'] },
  { label: 'Vencidos',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    statuses: ['vencido'] },
  { label: 'Reabordagem', color: 'text-gray-700', bg: 'bg-gray-50',   border: 'border-gray-200',   statuses: ['reabordagem'] },
];

export function DashboardCards({ clientes }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {CARDS.map(({ label, color, bg, border, statuses }) => {
        const total = clientes.filter(c => statuses.includes(c.status)).length;
        return (
          <div key={label} className={`rounded-xl border p-4 ${bg} ${border}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`text-4xl font-bold mt-1 ${color}`}>{total}</p>
          </div>
        );
      })}
    </div>
  );
}
