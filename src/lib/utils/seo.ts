import type { Project } from '@/types/project';
import type { Metadata } from 'next';

const SITE_NAME = 'Hitalo & Thainá Arquitetura';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hitalothaina.com.br';
const DEFAULT_DESCRIPTION =
  'Escritório de arquitetura e construção. Projetos residenciais e comerciais com design sofisticado e funcional.';

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}

export function buildProjectMetadata(project: Project): Metadata {
  return buildMetadata({
    title: project.name,
    description: project.shortDescription,
    openGraph: {
      type: 'article',
      title: project.name,
      description: project.shortDescription,
      images: project.coverImage
        ? [{ url: project.coverImage.url, width: 1200, height: 630, alt: project.coverImage.alt }]
        : undefined,
      url: `${SITE_URL}/projetos/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.shortDescription,
      images: project.coverImage ? [project.coverImage.url] : undefined,
    },
  });
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.jpg`,
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function buildProjectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.shortDescription,
    image: project.coverImage?.url,
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    dateCreated: project.year.toString(),
  };
}

export function buildCollectionPageJsonLd(projects: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projetos',
    description: 'Conheça nossos projetos de arquitetura e construção.',
    url: `${SITE_URL}/projetos`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/projetos/${project.slug}`,
        name: project.name,
      })),
    },
  };
}
