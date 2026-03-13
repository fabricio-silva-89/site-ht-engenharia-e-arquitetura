// =============================================================
// Firebase Storage (desativado temporariamente)
// Reativar quando o Firebase Storage estiver configurado
// =============================================================
// import {
//     deleteObject,
//     getDownloadURL,
//     ref,
//     uploadBytes,
// } from 'firebase/storage';
// import { storage } from './config';
//
// export async function uploadImage(
//   file: File,
//   projectId: string
// ): Promise<{ url: string; path: string }> {
//   const timestamp = Date.now();
//   const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
//   const storagePath = `projects/${projectId}/${timestamp}_${safeName}`;
//   const storageRef = ref(storage, storagePath);
//   await uploadBytes(storageRef, file);
//   const url = await getDownloadURL(storageRef);
//   return { url, path: storagePath };
// }
//
// export async function deleteImage(path: string): Promise<void> {
//   const storageRef = ref(storage, path);
//   await deleteObject(storageRef);
// }
// =============================================================

// Armazenamento local via API routes (/api/upload e /api/delete-image)

export async function uploadImage(
  file: File,
  projectId: string
): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Falha no upload da imagem');
  return res.json();
}

export async function deleteImage(filePath: string): Promise<void> {
  await fetch('/api/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath }),
  });
}
  // Placeholder: não faz nada até o Storage ser reativado
//   return;
// }
