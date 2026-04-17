import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KitsDigitalia — Painel',
  description: 'Gestão de clientes de acesso digital',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
