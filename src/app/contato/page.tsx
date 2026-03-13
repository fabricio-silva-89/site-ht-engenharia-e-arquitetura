import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import { buildMetadata } from '@/lib/utils/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Contato',
  description: 'Entre em contato com a Hitalo & Thainá Arquitetura. Estamos prontos para transformar seu projeto em realidade.',
});

export default function ContatoPage() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Contato</p>
          <h1
            className="text-3xl md:text-5xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Fale Conosco
          </h1>
          <p className="mt-4 text-secondary max-w-2xl mx-auto">
            Tem um projeto em mente? Entre em contato e vamos transformar sua ideia em realidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
