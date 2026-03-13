import type { Project } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projetos/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-border">
        {project.coverImage?.url ? (
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-secondary">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-secondary mt-1">{project.location} · {project.year}</p>
        <p className="text-sm text-secondary mt-2 line-clamp-2">{project.shortDescription}</p>
      </div>
    </Link>
  );
}
