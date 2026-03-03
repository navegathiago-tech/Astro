import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0502] text-stone-200 p-4">
      <h2 className="text-4xl font-display text-amber-200 mb-4">404 - Oráculo Perdido</h2>
      <p className="text-stone-400 mb-8">As estrelas não conseguiram encontrar este caminho.</p>
      <Link 
        href="/"
        className="bg-amber-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all"
      >
        Voltar ao Início
      </Link>
    </div>
  );
}
