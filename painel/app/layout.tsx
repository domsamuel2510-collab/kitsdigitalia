import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import './globals.css';

// Inter é carregada via CSS em globals.css — sem dependência de rede no build.

export const metadata: Metadata = {
  title: 'KitsDigitalia — Painel',
  description: 'Gestão de clientes de acesso digital',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans bg-gray-100 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-3">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
