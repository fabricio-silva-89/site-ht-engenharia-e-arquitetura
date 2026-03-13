import AboutSection from '@/components/home/AboutSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import HeroSection from '@/components/home/HeroSection';
import { getFeaturedProjects } from '@/lib/firebase/firestore';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/utils/seo';

export const revalidate = 3600;

export default async function HomePage() {
  const projects = await getFeaturedProjects(6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([buildOrganizationJsonLd(), buildWebsiteJsonLd()]),
        }}
      />
      <HeroSection />
      <AboutSection />
      <FeaturedProjects projects={projects} />
    </>
  );
}
