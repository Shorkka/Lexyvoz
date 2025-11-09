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
  fecha_de_nacimiento: Date;
  numero_telefono: string;
  sexo: string;
  tipo: string;
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

// 🔹 LOGIN
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
    throw error;
  }
};

// 🔹 CHECK STATUS
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
        credentials,
      })
    );

    return { user: { ...resp.user } };
  } catch (error) {
    console.error('Falló checkStatus (login automático):', error);
    return null;
  }
};

// 🔹 REGISTER
export const authRegister = async (
  registerData: any,
  options?: { withDefaultAvatar?: boolean }
) => {
  try {

    const body = {
      ...registerData,
      ...(registerData?.tipo === 'Paciente' ? { escolaridad: 'N/A' } : {}),
    };

    const form = new FormData();
    Object.entries(body).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (v instanceof Date) form.append(k, v.toISOString());
      else form.append(k, String(v));
    });

    const { data } = await productsApi.post('/auth/register', form, {
      // ❗ No definas manualmente Content-Type en multipart,
      // axios/fetch lo hace automáticamente con boundary correcto.
    });

    return { user: data?.user ?? data };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error backend:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Error en el registro'
      );
    }
    throw error;
  }
};

// 🔹 UPDATE USER
export const authUpdateUser = async (
  usuario_id: number,
  updatedFields: Partial<AuthResponse>
) => {
  try {
    const { data } = await productsApi.put<AuthResponse>(
      `/auth/usuario/${usuario_id}`,
      updatedFields
    );

    const session = await SecureStorageAdapter.getItem('authSession');
    if (session) {
      const parsed = JSON.parse(session);
      parsed.user = data;
      await SecureStorageAdapter.setItem('authSession', JSON.stringify(parsed));
    }

    return data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw new Error('No se pudo actualizar el perfil');
  }
};

// 🔹 UPLOAD AVATAR (usa imagen)
export const uploadUserAvatar = async (
  usuario_id: number,
  file: { uri: string; name: string; type: string }
) => {
  const form = new FormData();

  const { data } = await productsApi.post(
    `/auth/usuario/${usuario_id}/imagen`,
    form
  );

  return data?.user ?? data;
};

// 🔹 RECOVERY
export const recoveryPasswordResponse = async (
  correo: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const resp = await productsApi.post<RecoveryResponse>(
      '/auth/forgot-password',
      { correo }
    );
    return resp.data;
  } catch (error) {
    console.error('Error en recoveryPasswordResponse:', error);
    return { success: false, message: 'Error en el servidor' };
  }
};
