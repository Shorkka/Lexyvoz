import { productsApi } from '../api/productsApi';
import { User } from '../interface/user';

export interface AuthResponse {
    nombre:              string;
    correo:              string;
    contraseña:          string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    token:                string;
    domicilio:           string;
}

const returnUserToken = (data: AuthResponse) : {
    user: User
    token: string,
}=> {
    const { token, ...user} = data;
    return{
        user,
        token,
    }
}
export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  try {
    const { data } = await productsApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  };
}
export const authCheckStatus = async () => {
  try {
    const { data } = await productsApi.get<AuthResponse>('/auth/check-status');

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const authRegister = async (registerData: User): Promise<{ token: string; user: User } | null> => {
  try {
    const { data } = await productsApi.post<{ token: string; user: User }>('/auth/register', registerData);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};