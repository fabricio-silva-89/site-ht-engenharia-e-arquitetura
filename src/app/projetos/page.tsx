import ProjectGrid from '@/components/projects/ProjectGrid';
import { getPublishedProjects } from '@/lib/firebase/firestore';
import { buildCollectionPageJsonLd, buildMetadata } from '@/lib/utils/seo';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Projetos',
  description: 'Conheça nossos projetos de arquitetura e construção. Design sofisticado e funcional para residências e espaços comerciais.',
});

export default async function ProjetosPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCollectionPageJsonLd(projects)),
        }}
      />

      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Portfólio</p>
            <h1
              className="text-3xl md:text-5xl font-bold text-primary"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nossos Projetos
            </h1>
            <p className="mt-4 text-secondary max-w-2xl mx-auto">
              Cada projeto é uma história única de design, funcionalidade e atenção aos detalhes.
            </p>
          </div>

          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
