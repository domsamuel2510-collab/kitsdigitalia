'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    // Loga o erro completo no console para aparecer nos logs do Vercel
    console.error('[ErrorBoundary] Erro não tratado na página:', error);
    console.error('[ErrorBoundary] Stack:', error.stack);
    if (error.digest) console.error('[ErrorBoundary] Digest:', error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <div className="text-4xl">💥</div>
      <h2 className="text-xl font-bold text-gray-900">Algo deu errado</h2>
      <div className="max-w-lg w-full bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 font-mono break-words">
        <p className="font-semibold mb-1">{error.name}: {error.message}</p>
        {error.digest && (
          <p className="text-xs text-red-500 mt-1">Digest: {error.digest}</p>
        )}
      </div>
      <p className="text-xs text-gray-500 max-w-md text-center">
        Verifique os logs do Vercel para o stack trace completo.
        Abra o Console do browser (F12) para mais detalhes.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          🔄 Tentar novamente
        </button>
        <a
          href="/teste"
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          Página de diagnóstico
        </a>
      </div>
    </div>
  );
}
