import imageCompression from 'browser-image-compression';

const DEFAULT_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp' as const,
  initialQuality: 0.8,
};

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, DEFAULT_OPTIONS);
}
