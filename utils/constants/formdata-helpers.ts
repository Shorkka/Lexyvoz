// src/utils/formdata-helpers.ts
import { Platform } from 'react-native';

export type FileLike = { uri: string; name: string; type: string };

const isHttp = (u: string) => u.startsWith('http://') || u.startsWith('https://');
const isDataUri = (u: string) => u.startsWith('data:');

export async function toWebFile(file: FileLike): Promise<File> {
  const res = await fetch(file.uri, { mode: 'cors' });
  const blob = await res.blob();
  const type = file.type || blob.type || 'application/octet-stream';
  const name = file.name || `upload_${Date.now()}`;
  return new File([blob], name, { type });
}

/**
 * Adjunta la imagen a FormData de manera compatible con RN y Web.
 * - En RN: { uri, name, type }.
 * - En Web: intenta directo; si tu stack exige File/Blob, usa toWebFile().
 */
export async function appendImageToFormData(
  form: FormData,
  fieldName: string,
  file: FileLike,
  forceWebFile: boolean = false
) {
  if (Platform.OS === 'web') {
    if (forceWebFile || isHttp(file.uri) || isDataUri(file.uri)) {
      const webFile = await toWebFile(file);
      form.append(fieldName, webFile);
      return;
    }
    // @ts-ignore
    form.append(fieldName, file);
    return;
  }

  form.append(fieldName, {
    uri: file.uri,
    name: file.name || `upload_${Date.now()}.jpg`,
    type: file.type || 'image/jpeg',
  } as any);
}
