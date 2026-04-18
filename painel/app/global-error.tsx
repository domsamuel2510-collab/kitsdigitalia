'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[GlobalError] Erro crítico no layout:', error);
    console.error('[GlobalError] Stack:', error.stack);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#fff1f2' }}>
        <h1 style={{ color: '#be123c' }}>Erro crítico</h1>
        <pre style={{ background: '#fee2e2', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto' }}>
          {error.name}: {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ''}
        </pre>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
          Verifique os Vercel Function Logs e o console do browser para o stack trace completo.
        </p>
        <button
          onClick={reset}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
