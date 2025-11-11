import { isAxiosError } from 'axios';
import { productsApi } from '../api/productsApi';
import { SecureStorageAdapter } from '@/helper/adapters/secure-storage.adapter';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthResponse;
}

export interface AuthResponse {
  usuario_id: number;
  nombre: string;
  correo: string;
  contrasenia: string;
  fecha_de_nacimiento: Date | string;
  numero_telefono: string;
  sexo: string;
  tipo: string; // 'Doctor' | 'Paciente' | ...
  escolaridad?: string;
  especialidad?: string;
  domicilio: string;
  codigo_postal: string;
  tipo_id: number;
  doctor_id?: number;
  paciente_id?: number;
}

export interface RecoveryResponse {
  success: boolean;
  message: string;
  correo: string;
}

/* Utils */
const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) =>
      v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '')
    )
  ) as Partial<T>;

const toISODateOnly = (v?: string | Date) => {
  if (!v) return undefined;
  const d = typeof v === 'string' ? new Date(v) : v;
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
};

const toTenDigits = (v?: string) =>
  v ? (v.match(/\d/g) || []).join('').slice(0, 10) : undefined;

/* Tipado para update/register */
export type UpdateProfileInput = {
  nombre?: string;
  correo?: string;
  contrasenia?: string;
  fecha_de_nacimiento?: string | Date;
  numero_telefono?: string;
  sexo?: string;
  tipo?: 'Doctor' | 'Paciente' | string;
  especialidad?: string | null;
  escolaridad?: string | null;
  domicilio?: string;
  codigo_postal?: string | number;
  imagen?: { uri?: string; name: string; type: string } | File | Blob | null;
};

/* 🔹 LOGIN */
export const authLogin = async (correo: string, contrasenia: string) => {
  correo = correo.toLowerCase();

  try {
    const { data } = await productsApi.post<LoginResponse>('/auth/login', {
      correo,
      contrasenia,
    });

    if (data.token) {
      await SecureStorageAdapter.setItem('token', data.token);
    }

    return {
      user: { ...data.user, tipo: data.user.tipo },
      token: data.token,
    };
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.error('[authLogin] backend:', error.response?.data);
    }
    throw error;
  }
};

/* 🔹 CHECK STATUS (rehidrata sesión usando credenciales guardadas si existen) */
export const authCheckStatus = async () => {
  try {
    const session = await SecureStorageAdapter.getItem('authSession');
    if (!session) return null;

    const { credentials } = JSON.parse(session);
    if (!credentials?.correo || !credentials?.contrasenia) return null;

    const resp = await authLogin(credentials.correo, credentials.contrasenia);

    await SecureStorageAdapter.setItem(
      'authSession',
      JSON.stringify({
        user: resp.user,
        userType: resp.user.tipo,
        userName: resp.user.nombre,
        credentials,
      })
    );

    return { user: { ...resp.user } };
  } catch (error) {
    console.error('Falló checkStatus (login automático):', error);
    return null;
  }
};

/* 🔹 REGISTER (FormData, permite opcional imagen) */
export const authRegister = async (
  registerData: UpdateProfileInput & { imagen?: UpdateProfileInput['imagen'] },
  _options?: { withDefaultAvatar?: boolean }
) => {
  try {
    const body: any = {
      ...registerData,
      // si el backend requiere escolaridad para Paciente, fija por defecto N/A
      ...(registerData?.tipo === 'Paciente' && !registerData.escolaridad
        ? { escolaridad: 'N/A' }
        : {}),
    };

    const form = new FormData();
    // Normaliza campos antes de anexar
    const normalized = compact({
      nombre: body.nombre,
      correo: body.correo?.toLowerCase(),
      contrasenia: body.contrasenia,
      fecha_de_nacimiento: toISODateOnly(body.fecha_de_nacimiento),
      numero_telefono: toTenDigits(body.numero_telefono),
      sexo: body.sexo,
      tipo: body.tipo,
      especialidad: body.tipo === 'Doctor' ? body.especialidad : undefined,
      escolaridad: body.tipo === 'Paciente' ? body.escolaridad : undefined,
      domicilio: body.domicilio,
      codigo_postal:
        body.codigo_postal != null ? String(body.codigo_postal) : undefined,
    });

    Object.entries(normalized).forEach(([k, v]) => form.append(k, String(v)));

    if (body.imagen) {
      const img: any = body.imagen;
      if (img instanceof Blob || (typeof File !== 'undefined' && img instanceof File)) {
        form.append('imagen', img as Blob);
      } else if (img.uri) {
        // @ts-ignore RN file
        form.append('imagen', {
          uri: img.uri,
          name: img.name || 'avatar.jpg',
          type: img.type || 'image/jpeg',
        });
      }
    }

    const { data } = await productsApi.post('/auth/register', form, {
      // Deja que axios arme el boundary de multipart
    });

    return { user: data?.user ?? data };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('[authRegister] backend:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Error en el registro'
      );
    }
    throw error;
  }
};

/* 🔹 UPDATE USER (PUT /auth/profile con FormData). 
   Nota: mergea con el usuario actual de la sesión para no omitir requeridos. */
export const authUpdateUser = async (
  _usuario_id: number, // se mantiene por compatibilidad; no se usa si el backend toma el usuario del token
  updatedFields: UpdateProfileInput
) => {
  try {
    // Trae el usuario actual de la sesión para completar campos requeridos
    const session = await SecureStorageAdapter.getItem('authSession');
    const currentUser: Partial<AuthResponse> | undefined = session
      ? JSON.parse(session)?.user
      : undefined;

    // Merge preferente de updatedFields sobre currentUser
    const merged = {
      ...currentUser,
      ...updatedFields,
    };

    // Normaliza para cumplir el spec del backend
    const normalized = compact({
      nombre: merged.nombre,
      correo: merged.correo?.toLowerCase(),
      contrasenia: merged.contrasenia, // envíala solo si se cambia realmente
      fecha_de_nacimiento: toISODateOnly(
        (merged.fecha_de_nacimiento as any) ?? undefined
      ),
      numero_telefono: toTenDigits(merged.numero_telefono as any),
      sexo: merged.sexo,
      tipo: merged.tipo as any,
      especialidad:
        merged.tipo === 'Doctor' ? (merged as any).especialidad : undefined,
      escolaridad:
        merged.tipo === 'Paciente' ? (merged as any).escolaridad : undefined,
      domicilio: merged.domicilio,
      codigo_postal:
        (merged as any).codigo_postal != null
          ? String((merged as any).codigo_postal)
          : undefined,
    });

    const fd = new FormData();
    Object.entries(normalized).forEach(([k, v]) => fd.append(k, String(v)));

    if (updatedFields.imagen) {
      const img: any = updatedFields.imagen;
      if (img instanceof Blob || (typeof File !== 'undefined' && img instanceof File)) {
        fd.append('imagen', img as Blob);
      } else if (img.uri) {
        // @ts-ignore RN file
        fd.append('imagen', {
          uri: img.uri,
          name: img.name || 'profile.jpg',
          type: img.type || 'image/jpeg',
        });
      }
    }

    const token = await SecureStorageAdapter.getItem('token');

    const { data } = await productsApi.put('/auth/profile', fd, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        // No fuerces Content-Type; axios lo calcula con boundary
      },
      validateStatus: () => true, // deja pasar 4xx/5xx para leer el body
    });

    if (data?.success === false) {
      throw new Error(data?.message || 'No se pudo actualizar el perfil');
    }

    // Devuelve el usuario actualizado si existe; si no, devuelve el payload
    return data?.user ?? data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('[authUpdateUser] status:', error.response?.status);
      console.error('[authUpdateUser] backend:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          `Fallo al actualizar (HTTP ${error.response?.status ?? '??'})`
      );
    }
    console.error('[authUpdateUser] error:', error);
    throw new Error('No se pudo actualizar el perfil');
  }
};

/* 🔹 UPLOAD AVATAR (envía realmente el archivo) */
export const uploadUserAvatar = async (
  usuario_id: number,
  file: { uri?: string; name: string; type: string } | File | Blob
) => {
  const form = new FormData();

  if (file instanceof Blob || (typeof File !== 'undefined' && file instanceof File)) {
    form.append('imagen', file as Blob);
  } else if ((file as any)?.uri) {
    // @ts-ignore RN file
    form.append('imagen', {
      uri: (file as any).uri,
      name: (file as any).name || 'avatar.jpg',
      type: (file as any).type || 'image/jpeg',
    });
  } else {
    throw new Error('Archivo de imagen inválido');
  }

  const token = await SecureStorageAdapter.getItem('token');

  const { data } = await productsApi.post(
    `/auth/usuario/${usuario_id}/imagen`,
    form,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      validateStatus: () => true,
    }
  );

  if (data?.success === false) {
    throw new Error(data?.message || 'No se pudo actualizar la imagen');
  }

  return data?.user ?? data;
};

/* 🔹 RECOVERY */
export const recoveryPasswordResponse = async (
  correo: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const resp = await productsApi.post<RecoveryResponse>(
      '/auth/forgot-password',
      { correo }
    );
    return resp.data as any;
  } catch (error) {
    console.error('Error en recoveryPasswordResponse:', error);
    return { success: false, message: 'Error en el servidor' };
  }
};
