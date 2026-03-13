'use client';

import { compressImage } from '@/lib/utils/image';
import type { ProjectImage } from '@/types/project';
import Image from 'next/image';
import { useCallback } from 'react';

interface ImageUploaderProps {
  images: (ProjectImage & { file?: File })[];
  onImagesChange: (images: (ProjectImage & { file?: File })[]) => void;
}

export default function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      const newImages: (ProjectImage & { file?: File })[] = [];

      for (const file of files) {
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);
        newImages.push({
          url: previewUrl,
          path: '',
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          order: images.length + newImages.length,
          file: compressed,
        });
      }

      onImagesChange([...images, ...newImages]);
    },
    [images, onImagesChange]
  );

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    onImagesChange(updated);
  }

  function handleAltChange(index: number, alt: string) {
    const updated = [...images];
    updated[index] = { ...updated[index], alt };
    onImagesChange(updated);
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-primary">Imagens do Projeto</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent'); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('border-accent'); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-accent');
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-border p-8 text-center transition-colors"
      >
        <p className="text-sm text-secondary mb-2">
          Arraste imagens aqui ou
        </p>
        <label className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider bg-accent text-white hover:bg-accent-dark transition-colors cursor-pointer">
          Selecionar arquivos
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Image preview list */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={`${image.path || index}`} className="relative group">
              <div className="relative aspect-square bg-border overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover imagem"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={image.alt}
                onChange={(e) => handleAltChange(index, e.target.value)}
                className="mt-1 w-full text-xs border border-border px-2 py-1 focus:outline-none focus:border-accent"
                placeholder="Texto alternativo"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
