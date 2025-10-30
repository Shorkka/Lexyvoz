// src/presentation/utils/defaultAvatar.ts
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

// Tu PNG local empaquetado en la app
export const DEFAULT_AVATAR = require('@/assets/images/perfil.png');

export type FileLike = { uri: string; name: string; type: string };

export async function getDefaultAvatarFile(): Promise<FileLike> {
  const [asset] = await Asset.loadAsync(DEFAULT_AVATAR);
  const uri = (Platform.OS === 'web' ? asset.uri : asset.localUri) ?? asset.uri;
  return { uri, name: 'avatar_default.png', type: 'image/png' };
}
