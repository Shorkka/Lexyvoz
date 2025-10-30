import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type FileLike = { uri: string; name: string; type: string };

// Configuración global
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const VALID_MIME = new Set(['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']);

/** Normaliza un asset de ImagePicker a FileLike */
function toFileLike(asset: ImagePicker.ImagePickerAsset): FileLike {
  const guessedName =
    asset.fileName ||
    `avatar_${Date.now()}${
      Platform.OS === 'ios' ? '.jpeg' : asset.mimeType?.includes('png') ? '.png' : '.jpg'
    }`;

  const guessedType = asset.mimeType || (guessedName.endsWith('.png') ? 'image/png' : 'image/jpeg');

  return { uri: asset.uri, name: guessedName, type: guessedType };
}

/** Valida tamaño y tipo; lanza error con mensaje amigable */
async function validateFileLike(file: FileLike) {
  if (!VALID_MIME.has(file.type)) {
    throw new Error('Formato no soportado. Usa PNG, JPG o JPEG (máx. 5 MB).');
  }

  // En web podemos leer tamaño con fetch; en nativo no siempre es fiable.
  try {
    const res = await fetch(file.uri);
    const blob = await res.blob();
    if (blob.size > MAX_BYTES) {
      throw new Error(`La imagen supera los ${MAX_MB} MB.`);
    }
  } catch {
    // Si falla (por ser file:// en nativo), lo dejamos pasar; el backend hará la validación final.
  }
}

/** Abre galería (recomendado para avatar) */
export async function pickUserImage(): Promise<FileLike | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,     // recorte
    aspect: [1, 1],          // cuadrado
    quality: 0.85,           // compresión
  });

  if (result.canceled) return null;

  const file = toFileLike(result.assets[0]);
  await validateFileLike(file);
  return file;
}

/** Abre cámara (opcional) */
export async function takeUserPhoto(): Promise<FileLike | null> {
  // Pide permisos primero
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (perm.status !== 'granted') {
    throw new Error('Permiso de cámara denegado.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled) return null;

  const file = toFileLike(result.assets[0]);
  await validateFileLike(file);
  return file;
}
