import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export type FileLike = { uri: string; name: string; type: string };

// Configuración global
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const VALID_MIME = new Set(['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']);

/** Mapea mime -> extensión por si hay que adivinar */
function extFromMime(mime?: string) {
  if (!mime) return '.jpg';
  if (mime.includes('png')) return '.png';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('webp')) return '.webp';
  return '.jpg';
}

/** Asegura que el nombre tiene extensión; si no, la añade desde mime */
function ensureExt(name: string, mime?: string) {
  if (/\.[a-z0-9]{3,4}$/i.test(name)) return name;
  return `${name}${extFromMime(mime)}`;
}

/** Normaliza un asset de ImagePicker a FileLike */
function toFileLike(asset: ImagePicker.ImagePickerAsset): FileLike {
  const baseName =
    asset.fileName ||
    `avatar_${Date.now()}${
      Platform.OS === 'ios' ? '.jpeg' : extFromMime(asset.mimeType)
    }`;

  const name = ensureExt(baseName, asset.mimeType);
  const type = asset.mimeType || (name.endsWith('.png') ? 'image/png' : 'image/jpeg');

  return { uri: asset.uri, name, type };
}

/** Obtiene el tamaño del archivo de forma robusta (nativo/web) */
async function getFileSize(uri: string): Promise<number | null> {
  try {
    // file:// en Expo nativo
    if (uri.startsWith('file://')) {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && typeof info.size === 'number') return info.size;
    }

    // content:// (Android) o http(s):// / blob:
    const res = await fetch(uri);
    const blob = await res.blob();
    return blob.size ?? null;
  } catch {
    return null; // si no se puede determinar, dejamos pasar (backend validará)
  }
}

/** Valida tamaño y tipo; lanza error con mensaje amigable */
async function validateFileLike(file: FileLike) {
  if (!VALID_MIME.has(file.type)) {
    throw new Error('Formato no soportado. Usa PNG, JPG/JPEG, GIF o WEBP (máx. 5 MB).');
  }

  const size = await getFileSize(file.uri);
  if (size !== null && size > MAX_BYTES) {
    throw new Error(`La imagen supera los ${MAX_MB} MB.`);
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
