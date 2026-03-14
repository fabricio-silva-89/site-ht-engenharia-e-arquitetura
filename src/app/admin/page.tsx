'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { deleteProject as deleteProjectFn, getAllProjects, updateProject } from '@/lib/firebase/firestore';
import { deleteImage } from '@/lib/firebase/storage';
import type { Project } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  }

  async function togglePublished(project: Project) {
    await updateProject(project.id, { published: !project.published });
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Delete all images from storage
      const imagePaths = [
        ...(deleteTarget.coverImage?.path ? [deleteTarget.coverImage.path] : []),
        ...deleteTarget.images.map((img) => img.path),
      ];
      await Promise.allSettled(imagePaths.map(deleteImage));
      await deleteProjectFn(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-secondary">Carregando projetos...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">Projetos</h1>
        <Link href="/admin/projetos/novo">
          <Button size="sm">+ Novo Projeto</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-secondary mb-4">Nenhum projeto cadastrado.</p>
          <Link href="/admin/projetos/novo">
            <Button>Criar primeiro projeto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-secondary font-medium">
                    Projeto
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-secondary font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-secondary font-medium">
                    Destaque
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-secondary font-medium text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-border shrink-0 overflow-hidden">
                          {project.coverImage?.url && (
                            <Image
                              src={project.coverImage.url}
                              alt={project.coverImage.alt}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">{project.name}</p>
                          <p className="text-xs text-secondary">{project.location} · {project.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublished(project)}
                        className={`text-xs px-2 py-1 ${
                          project.published
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {project.published ? 'Publicado' : 'Rascunho'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${project.featured ? 'text-accent' : 'text-secondary'}`}>
                        {project.featured ? '★ Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projetos/${project.id}`}
                          className="text-xs text-accent hover:text-accent-dark transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="text-xs text-error hover:text-red-800 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir projeto"
      >
        <p className="text-secondary mb-6">
          Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-error hover:bg-red-700"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
