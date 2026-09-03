export const MAX_UPLOAD_MB = 50;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export function isOverUploadLimit(file: File) {
  return file.size > MAX_UPLOAD_BYTES;
}
