export interface ProjectImage {
  url: string;
  path: string;
  alt: string;
  order: number;
}

export interface CoverImage {
  url: string;
  path: string;
  alt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  year: number;
  builtArea: string;
  coverImage: CoverImage;
  images: ProjectImage[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
