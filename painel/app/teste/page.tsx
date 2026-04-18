'use client';

export const dynamic = 'force-dynamic';

export default function TestePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="text-4xl">✅</div>
      <h1 className="text-2xl font-bold text-gray-900">App funcionando</h1>
      <p className="text-sm text-gray-500">
        Se você vê esta página, o Next.js está rodando corretamente no Vercel.
      </p>
      <p className="text-xs text-gray-400">
        O problema está na página principal (/) ou em um dos seus imports.
      </p>
      <a href="/" className="mt-2 px-4 py-2 text-sm rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600">
        Ir para Dashboard →
      </a>
    </div>
  );
}
