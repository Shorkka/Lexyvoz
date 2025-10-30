import { Platform } from 'react-native';
import type { FileLike } from '@/presentation/utils/defaultAvatar';

export async function toWebFile(file: FileLike): Promise<File> {
  const res = await fetch(file.uri, { mode: 'cors' });
  const blob = await res.blob();
  const type = file.type || blob.type || 'application/octet-stream';
  const name = file.name || `upload_${Date.now()}`;
  return new File([blob], name, { type });
}

/** Adjunta una imagen a FormData de forma compatible con RN y Web */
export async function appendImageToFormData(
  form: FormData,
  fieldName: string,
  file: FileLike,
  forceWebFile = false
) {
  if (Platform.OS === 'web') {
    const webFile = forceWebFile ? await toWebFile(file) : undefined;
    form.append(fieldName, webFile ?? (file as any));
    return;
  }
  form.append(fieldName, { uri: file.uri, name: file.name, type: file.type } as any);
}
