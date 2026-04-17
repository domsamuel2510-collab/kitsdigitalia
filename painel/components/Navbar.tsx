'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',             label: '📊 Dashboard' },
  { href: '/vencendo',     label: '⚠️ Vencendo' },
  { href: '/reabordagem',  label: '🔄 Reabordagem' },
];

export function Navbar() {
  const path = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="text-orange-400 font-bold text-lg tracking-tight">
          KitsDigitalia
        </span>
        <div className="flex gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                path === href
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
