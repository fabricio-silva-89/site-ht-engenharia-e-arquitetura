// TODO: Reativar Firebase Storage quando configurado
// import {
//     deleteObject,
//     getDownloadURL,
//     ref,
//     uploadBytes,
// } from 'firebase/storage';
// import { storage } from './config';

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x800/e5e5e0/6b6b6b?text=Imagem+do+Projeto';

export async function uploadImage(
  _file: File,
  _projectId: string
): Promise<{ url: string; path: string }> {
  // const timestamp = Date.now();
  // const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  // const storagePath = `projects/${projectId}/${timestamp}_${safeName}`;
  // const storageRef = ref(storage, storagePath);
  // await uploadBytes(storageRef, file);
  // const url = await getDownloadURL(storageRef);
  // return { url, path: storagePath };
  // Placeholder: retorna imagem placeholder em vez de fazer upload
  const fakePath = `projects/placeholder/${Date.now()}`;
  return { url: PLACEHOLDER_IMAGE, path: fakePath };
}

export async function deleteImage(_path: string): Promise<void> {
  // const storageRef = ref(storage, path);
  // await deleteObject(storageRef);
  // Placeholder: não faz nada até o Storage ser reativado
  return;
}
