import type { Project, ProjectFormData } from '@/types/project';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'projects';

function mapDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Project {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name as string,
    slug: data.slug as string,
    shortDescription: data.shortDescription as string,
    fullDescription: data.fullDescription as string,
    location: data.location as string,
    year: data.year as number,
    builtArea: data.builtArea as string,
    coverImage: data.coverImage as Project['coverImage'],
    images: data.images as Project['images'],
    featured: data.featured as boolean,
    published: data.published as boolean,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('published', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
}

export async function getFeaturedProjects(max = 6): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('published', '==', true),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(
    collection(db, COLLECTION),
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return mapDoc(snapshot.docs[0]);
}

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const docSnap = await getDoc(doc(db, COLLECTION, id));
  if (!docSnap.exists()) return null;
  return mapDoc(docSnap);
}

export async function createProject(data: ProjectFormData): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function getPublishedSlugs(): Promise<string[]> {
  const q = query(
    collection(db, COLLECTION),
    where('published', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().slug as string);
}
