import ProjectGallery from '@/components/projects/ProjectGallery';
import ProjectInfo from '@/components/projects/ProjectInfo';
import { getProjectBySlug, getPublishedSlugs } from '@/lib/firebase/firestore';
import { buildProjectJsonLd, buildProjectMetadata } from '@/lib/utils/seo';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildProjectMetadata(project);
}

export default async function ProjetoPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProjectJsonLd(project)),
        }}
      />

      <article className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Back link */}
          <Link
            href="/projetos"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar aos projetos
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1
              className="text-3xl md:text-5xl font-bold text-primary mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {project.name}
            </h1>
            <p className="text-lg text-secondary">{project.shortDescription}</p>
          </header>

          {/* Cover image */}
          {project.coverImage?.url && (
            <div className="relative aspect-[16/9] overflow-hidden bg-border mb-12">
              <Image
                src={project.coverImage.url}
                alt={project.coverImage.alt}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Project info */}
          <ProjectInfo project={project} />

          {/* Gallery */}
          {project.images.length > 0 && (
            <div className="mt-16">
              <h2
                className="text-2xl font-bold text-primary mb-8"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Galeria
              </h2>
              <ProjectGallery images={project.images} />
            </div>
          )}
        </div>
      </article>
    </>
  );
}
