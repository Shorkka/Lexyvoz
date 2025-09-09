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
    usuario_id:           number;
    nombre:              string;
    correo:              string;
    contrasenia:          string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    domicilio:           string;
    codigo_postal:        string;
    tipo_id:              number;
    doctor_id?:          number;
    paciente_id?:        number;
}

export interface RecoveryResponse {
    success: boolean;
    message: string;
    correo: string;
}

export const authLogin = async (correo: string, contrasenia: string) => {
  correo = correo.toLowerCase();

  try {
    const { data } = await productsApi.post<LoginResponse>('/auth/login', {
      correo,
      contrasenia,
    });
    
    // Guardar token para el interceptor
    if (data.token) {
      await SecureStorageAdapter.setItem('token', data.token);
    }

    return {
      user: { ...data.user, tipo: data.user.tipo },
      token: data.token
    };

  } catch (error: any) {
    throw error;
  }
};
export const authCheckStatus = async () => {
  try {
    const session = await SecureStorageAdapter.getItem('authSession');
    if (!session) {
      return null;
    }

    const { credentials } = JSON.parse(session);

    if (!credentials?.correo || !credentials?.contrasenia) {
      return null;
    }

    // Login automático silencioso
    const resp = await authLogin(credentials.correo, credentials.contrasenia);

    // Opcionalmente vuelve a guardar por si el user cambió
    await SecureStorageAdapter.setItem('authSession', JSON.stringify({
      user: resp.user,
      userType: resp.user.tipo,
      credentials,
    }));

    return { user: { ...resp.user } };

  } catch (error) {
    console.error('Falló checkStatus (login automático):', error);
    return null;
  }
};


export const authRegister = async (registerData: any) => {
  try {
    console.log('Datos enviados al registrar:', registerData); // Debug
    const { data } = await productsApi.post('/auth/register', registerData);
  return { user: data };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
    throw error;
  }
};

export const authUpdateUser = async (usuario_id: number, updatedFields: Partial<AuthResponse>) => {
  try {
    const { data } = await productsApi.put<AuthResponse>(`/auth/usuario/${usuario_id}`, updatedFields);

    // Actualiza storage con nuevo usuario
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
export const recoveryPasswordResponse = async (correo: string): Promise<{ success: boolean; message: string }> => {
  try {
    const resp = await productsApi.post<RecoveryResponse>('/auth/forgot-password', { correo });
    return resp.data;
  } catch (error) {
    console.error('Error en recoveryPasswordResponse:', error);
    return { success: false, message: 'Error en el servidor' };
  }
}

