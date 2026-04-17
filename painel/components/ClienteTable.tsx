'use client';

import type { Cliente } from '@/types/cliente';
import { StatusBadge } from './StatusBadge';
import { fmtData, whatsappLink } from '@/lib/utils';

interface Props {
  clientes: Cliente[];
  onRenovar: (c: Cliente) => void;
  onNaoRenovar: (c: Cliente) => void;
  onEditar: (c: Cliente) => void;
}

export function ClienteTable({ clientes, onRenovar, onNaoRenovar, onEditar }: Props) {
  if (!clientes.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        Nenhum cliente encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Produto</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">Vencimento</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Dias</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clientes.map(c => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{c.nome}</div>
                <div className="text-xs text-gray-400">{c.email}</div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-gray-700">{c.produto}</td>
              <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                {fmtData(c.data_vencimento)}
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell">
                <DiasChip dias={c.dias_restantes} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
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
                  >
                    ✏️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DiasChip({ dias }: { dias: number }) {
  let cls = 'text-green-700 bg-green-100';
  if (dias <= 0)  cls = 'text-red-700 bg-red-100';
  else if (dias <= 2) cls = 'text-orange-700 bg-orange-100';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {dias}d
    </span>
  );
}
