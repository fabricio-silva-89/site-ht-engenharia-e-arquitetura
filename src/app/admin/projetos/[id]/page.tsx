'use client';

import { getProjectById } from '@/lib/firebase/firestore';
import type { Project } from '@/types/project';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectForm from '../../components/ProjectForm';

export default function EditarProjetoPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProjectById(id);
      setProject(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-secondary">Carregando projeto...</div>;
  }

  if (!project) {
    return <div className="text-center py-20 text-secondary">Projeto não encontrado.</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-primary mb-8">Editar Projeto</h1>
      <ProjectForm project={project} />
    </>
  );
}
