// utils/formdata-helpers.ts
import { Platform } from 'react-native';

/**
 * Dado un nombre de archivo o uri, devuelve un content-type
 * común. Fallback a application/octet-stream.
 */
function guessMimeFromName(nameOrUri: string = ''): string {
  const lower = nameOrUri.split('?')[0].split('#')[0].toLowerCase();
  const ext = lower.substring(lower.lastIndexOf('.') + 1);

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'heif':
      return 'image/heif';
    case 'bmp':
      return 'image/bmp';

    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    case 'mkv':
      return 'video/x-matroska';

    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';

    case 'aac':
      return 'audio/aac';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';

    default:
      return 'application/octet-stream';
  }
}

function getFileNameFromUri(uri: string, fallback = 'upload.bin'): string {
  try {
    const clean = uri.split('?')[0].split('#')[0];
    const parts = clean.split('/');
    const last = parts[parts.length - 1];
    return last || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Crea un FormData con un archivo, compatible con iOS/Android/Web.
 * - En nativo: usa { uri, name, type }.
 * - En web: convierte la uri a Blob y lo appendea.
 */
export async function createFormDataWithFile(
  fieldName: string,
  uri: string,
  fileName?: string,
  contentType?: string,
  extraFields?: Record<string, string | number | boolean>
): Promise<FormData> {
  const name = fileName ?? getFileNameFromUri(uri);
  const type = contentType ?? guessMimeFromName(fileName ?? uri);

  const form = new FormData();

  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => {
      form.append(k, String(v));
    });
  }

  if (Platform.OS === 'web') {
    // En web necesitamos un Blob
    const res = await fetch(uri);
    const blob = await res.blob();
    const file = new File([blob], name, { type });
    form.append(fieldName, file);
  } else {
    // iOS / Android
    form.append(fieldName, {
      uri,
      name,
      type,
    } as any);
  }

  return form;
}

/**
 * Helper simple si ya tienes un Blob (sólo web).
 */
export function createFormDataFromBlob(
  fieldName: string,
  blob: Blob,
  fileName = 'upload.bin',
  contentType = 'application/octet-stream',
  extraFields?: Record<string, string | number | boolean>
): FormData {
  const form = new FormData();
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => {
      form.append(k, String(v));
    });
  }
  const file = new File([blob], fileName, { type: contentType });
  form.append(fieldName, file);
  return form;
}

// Exporta utilidades por si las necesitas
export const MimeUtils = {
  guessMimeFromName,
  getFileNameFromUri,
};
