import type { Project } from '@/types/project';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="space-y-8">
      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-border">
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Localização</p>
          <p className="text-sm font-medium text-primary">{project.location}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Ano</p>
          <p className="text-sm font-medium text-primary">{project.year}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Área</p>
          <p className="text-sm font-medium text-primary">{project.builtArea}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Categoria</p>
          <p className="text-sm font-medium text-primary">Projeto</p>
        </div>
      </div>

      {/* Full description */}
      <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-primary prose-p:text-secondary prose-a:text-accent">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {project.fullDescription}
        </ReactMarkdown>
      </div>
    </div>
  );
}
