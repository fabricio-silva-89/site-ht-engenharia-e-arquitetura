import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-primary mb-2">Página não encontrada</h2>
      <p className="text-secondary mb-8 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium uppercase tracking-wider bg-accent text-white hover:bg-accent-dark transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
