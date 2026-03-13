import { z } from 'zod';

export const coverImageSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
});

export const projectImageSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  order: z.number().int().min(0),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  shortDescription: z.string().min(1, 'Descrição curta é obrigatória').max(160),
  fullDescription: z.string().min(1, 'Descrição completa é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  builtArea: z.string().min(1, 'Área construída é obrigatória'),
  coverImage: coverImageSchema,
  images: z.array(projectImageSchema),
  featured: z.boolean(),
  published: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(2000),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;
export type ContactSchemaType = z.infer<typeof contactSchema>;
