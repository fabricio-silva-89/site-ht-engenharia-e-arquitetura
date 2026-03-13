'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createProject, updateProject } from '@/lib/firebase/firestore';
import { deleteImage, uploadImage } from '@/lib/firebase/storage'; // placeholder até Storage ser configurado
import { projectSchema } from '@/lib/schemas/project';
import { generateSlug } from '@/lib/utils/slug';
import type { CoverImage, Project, ProjectImage } from '@/types/project';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';

interface ProjectFormProps {
  project?: Project;
}

type ImageWithFile = ProjectImage & { file?: File };

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [name, setName] = useState(project?.name || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [shortDescription, setShortDescription] = useState(project?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(project?.fullDescription || '');
  const [location, setLocation] = useState(project?.location || '');
  const [year, setYear] = useState(project?.year?.toString() || new Date().getFullYear().toString());
  const [builtArea, setBuiltArea] = useState(project?.builtArea || '');
  const [featured, setFeatured] = useState(project?.featured || false);
  const [published, setPublished] = useState(project?.published || false);

  const [coverImage, setCoverImage] = useState<CoverImage | null>(project?.coverImage || null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [images, setImages] = useState<ImageWithFile[]>(project?.images || []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing) {
      setSlug(generateSlug(name));
    }
  }, [name, isEditing]);

  async function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { compressImage } = await import('@/lib/utils/image');
    const compressed = await compressImage(file);
    setCoverFile(compressed);
    setCoverImage({
      url: URL.createObjectURL(compressed),
      path: '',
      alt: name || file.name,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      // Determine project ID for uploads
      let projectId = project?.id || 'temp-' + Date.now();

      // Upload cover image if new file
      let finalCover = coverImage;
      if (coverFile && finalCover) {
        // Delete old cover if editing
        if (project?.coverImage?.path) {
          await deleteImage(project.coverImage.path).catch(() => {});
        }
        const { url, path } = await uploadImage(coverFile, projectId);
        finalCover = { url, path, alt: finalCover.alt };
      }

      // Upload new images
      const finalImages: ProjectImage[] = [];
      for (const img of images) {
        if (img.file) {
          const { url, path } = await uploadImage(img.file, projectId);
          finalImages.push({ url, path, alt: img.alt, order: img.order });
        } else {
          finalImages.push({ url: img.url, path: img.path, alt: img.alt, order: img.order });
        }
      }

      // Delete removed images (editing only)
      if (project) {
        const keptPaths = new Set(finalImages.map((i) => i.path));
        const removed = project.images.filter((i) => !keptPaths.has(i.path));
        await Promise.allSettled(removed.map((i) => deleteImage(i.path)));
      }

      const formData = {
        name,
        slug,
        shortDescription,
        fullDescription,
        location,
        year: parseInt(year, 10),
        builtArea,
        coverImage: finalCover || { url: '', path: '', alt: '' },
        images: finalImages,
        featured,
        published,
      };

      // Validate
      const result = projectSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path.join('.');
          fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        setSaving(false);
        return;
      }

      if (isEditing) {
        await updateProject(project.id, result.data);
      } else {
        const newId = await createProject(result.data);
        // If we used temp ID, images are already uploaded under temp id — that's fine
        projectId = newId;
      }

      // Trigger revalidation
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: '' }),
      }).catch(() => {});

      router.push('/admin');
    } catch (err) {
      console.error('Error saving project:', err);
      setErrors({ _form: 'Erro ao salvar projeto. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-border p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Nome do Projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Ex: Residência Jardim Europa"
          required
        />
        <Input
          label="Slug (URL)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={errors.slug}
          placeholder="residencia-jardim-europa"
          required
        />
      </div>

      <Input
        label="Descrição Curta (max 160 caracteres)"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        error={errors.shortDescription}
        placeholder="Projeto residencial com design contemporâneo..."
        required
      />

      <div className="space-y-1">
        <label htmlFor="fullDescription" className="block text-sm font-medium text-primary">
          Descrição Completa (Markdown)
        </label>
        <textarea
          id="fullDescription"
          rows={8}
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          className={`w-full border px-4 py-3 text-sm text-primary placeholder:text-secondary/50 transition-colors focus:outline-none focus:border-accent resize-y font-mono ${
            errors.fullDescription ? 'border-error' : 'border-border'
          }`}
          placeholder="Descreva o projeto em detalhes. Suporta Markdown."
          required
        />
        {errors.fullDescription && <p className="text-xs text-error">{errors.fullDescription}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Input
          label="Localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          error={errors.location}
          placeholder="São Paulo, SP"
          required
        />
        <Input
          label="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          error={errors.year}
          required
        />
        <Input
          label="Área Construída"
          value={builtArea}
          onChange={(e) => setBuiltArea(e.target.value)}
          error={errors.builtArea}
          placeholder="250m²"
          required
        />
      </div>

      {/* Cover image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Imagem de Capa</label>
        <div className="flex items-start gap-4">
          {coverImage?.url && (
            <div className="relative w-32 h-24 bg-border overflow-hidden shrink-0">
              <Image
                src={coverImage.url}
                alt={coverImage.alt}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <label className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider border border-accent text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer">
              {coverImage ? 'Trocar capa' : 'Selecionar capa'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverSelect}
              />
            </label>
            {errors['coverImage.url'] && (
              <p className="text-xs text-error mt-1">{errors['coverImage.url']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Project images */}
      <ImageUploader images={images} onImagesChange={setImages} />

      {/* Toggles */}
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 text-accent accent-accent"
          />
          <span className="text-sm text-primary">Destaque na Home</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-accent accent-accent"
          />
          <span className="text-sm text-primary">Publicado</span>
        </label>
      </div>

      {errors._form && <p className="text-sm text-error">{errors._form}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : isEditing ? 'Atualizar Projeto' : 'Criar Projeto'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
