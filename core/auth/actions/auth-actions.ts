import { isAxiosError } from 'axios';
import { productsApi } from '../api/productsApi';
import { SecureStorageAdapter } from '@/helper/adapters/secure-storage.adapter';

export interface LoginResponse {
  message: string;
  user: AuthResponse; 
}

export interface AuthResponse {
    usuario_id:           number;
    nombre:              string;
    correo:              string;
    contraseña:          string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    domicilio:           string;
    codigo_postal:        string;

}


export const authLogin = async (correo: string, contraseña: string) => {
  correo = correo.toLowerCase();

  try {
    const { data } = await productsApi.post<LoginResponse>('/auth/login', {
      correo,
      contraseña,
    });

     return {
      user: {
        ...data.user, 
        tipo: data.user.tipo // Asegura que el tipo está incluido
      }
    };
  } catch (error: any) {
    console.log('Login error:', error?.response?.data || error);
    throw error;
  };
}

export const authCheckStatus = async () => {
  try {
    const session = await SecureStorageAdapter.getItem('authSession');
    if (!session) {
      console.warn('No hay sesión guardada.');
      return null;
    }

    const { credentials } = JSON.parse(session);

    if (!credentials?.correo || !credentials?.contraseña) {
      console.warn('Faltan credenciales guardadas.');
      return null;
    }

    // Login automático silencioso
    const resp = await authLogin(credentials.correo, credentials.contraseña);

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
      console.error('Error del backend:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
    throw error;
  }
};


