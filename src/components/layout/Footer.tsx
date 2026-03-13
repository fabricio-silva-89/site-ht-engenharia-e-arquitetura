import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-primary">
              H&T <span className="font-normal text-secondary">Arquitetura</span>
            </Link>
            <p className="mt-3 text-sm text-secondary max-w-xs">
              Transformando espaços com design sofisticado e funcional.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-secondary hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projetos" className="text-sm text-secondary hover:text-accent transition-colors">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-secondary hover:text-accent transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              Contato
            </h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li>contato@hitalothaina.com.br</li>
              <li>Instagram: @hitalothaina.arq</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-secondary">
          © {year} Hitalo & Thainá Arquitetura. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
