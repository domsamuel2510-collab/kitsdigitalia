import type { Status } from '@/types/cliente';

const MAP: Record<Status, { label: string; cls: string }> = {
  ativo:          { label: '🟢 Ativo',          cls: 'bg-green-100  text-green-800' },
  vence_em_breve: { label: '🟡 Vence em breve', cls: 'bg-yellow-100 text-yellow-800' },
  vence_hoje:     { label: '🟠 Vence hoje',     cls: 'bg-orange-100 text-orange-800' },
  vencido:        { label: '🔴 Vencido',        cls: 'bg-red-100    text-red-800' },
  renovado:       { label: '🔵 Renovado',       cls: 'bg-blue-100   text-blue-800' },
  reabordagem:    { label: '⚫ Reabordagem',    cls: 'bg-gray-100   text-gray-700' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, cls } = MAP[status] ?? MAP.ativo;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}
