import { isAxiosError } from 'axios';
import { productsApi } from '../api/productsApi';
//import { User } from '../interface/user';

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
    const { data } = await productsApi.post<AuthResponse>('/auth/login', {
      correo,
      contraseña,
    });

      return {
      userType: data.tipo, // Usar data.tipo directamente
      user: data
    };
  } catch (error: any) {
    console.log('Login error:', error?.response?.data || error);
    throw error;
  };
}
{/*  
export const authCheckStatus = async () => {
  try {
    const { data } = await productsApi.get<AuthResponse>('/auth/check-status');

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};
*/}


// En tu archivo auth-actions.ts
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