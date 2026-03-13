'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import { ButtonLink } from '@/components/ui/Button';
import type { Project } from '@/types/project';
import { motion } from 'framer-motion';

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-muted">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Portfólio</p>
          <h2
            className="text-3xl md:text-4xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Projetos em destaque
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <ButtonLink href="/projetos" variant="outline">
            Ver todos os projetos
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
