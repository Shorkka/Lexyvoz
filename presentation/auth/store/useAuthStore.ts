import { authLogin, authRegister } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { SecureStorageAdapter } from "@/helper/adapters/secure-storage.adapter";
import { create } from 'zustand';

export type AuthStatus  = 'authenticated' | 'unauthenticated' | 'checking';
type Role = 'Doctor' | 'Paciente' | 'Usuario';


export interface AuthState{
    status: AuthStatus
    token?: string;
    user?: User;
    role?: Role | null;
    setRole: (role: Role) => void;
    



    login: (correo: string, contraseña: string) => Promise<boolean>;
    // checkStatus: () => Promise<void>;
    logout: () => Promise<void>;
    // changeStatus: (token?:string, user?:User) => Promise<boolean>;
    register: (registerData: any) => Promise<boolean>;
    simulateLogin: (role: Role) => void;

}

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Properties
    status: 'unauthenticated',
    token: undefined,
    user: undefined,

    // Actions
    role: null,
    setRole: (role) => set({ role }),
    /*
    changeStatus: async(token?: string, user?: User) => {
         if( !token || !user ){
            set({status: 'unauthenticated', token: undefined, user: undefined})
            // TODOS llamar logout
            SecureStorageAdapter.deleteItem('token');
            return false;
        }

        set({
            status: 'authenticated',
            token: token,
            user: user,
        })
        await SecureStorageAdapter.setItem('token', token);
        return true;
    },
    */
    
    login: async(correo: string, contraseña: string) =>{
        const resp = await authLogin(correo, contraseña);
        // return get().changeStatus(resp?.token, resp?.user);
        // Puedes manejar el estado aquí directamente si lo necesitas
        if (!resp?.token || !resp?.user) {
            set({status: 'unauthenticated', token: undefined, user: undefined});
            SecureStorageAdapter.deleteItem('token');
            return false;
        }
        set({
            status: 'authenticated',
            token: resp.token,
            user: resp.user,
        });
        await SecureStorageAdapter.setItem('token', resp.token);
        return true;
    },

    /*
    checkStatus: async()=> {
        const  resp = await authCheckStatus();
        get().changeStatus(resp?.token, resp?.user);
    },
    */

    register: async(registerData: any) => {
        const resp = await authRegister(registerData);
        // return get().changeStatus(resp?.token, resp?.user);
        if (!resp?.token || !resp?.user) {
            set({status: 'unauthenticated', token: undefined, user: undefined});
            SecureStorageAdapter.deleteItem('token');
            return false;
        }
        set({
            status: 'authenticated',
            token: resp.token,
            user: resp.user,
        });
        await SecureStorageAdapter.setItem('token', resp.token);
        return true;
    },
    
    logout: async()=> {
        // Clear Token del secure store
        SecureStorageAdapter.deleteItem('token');
        set({status: 'unauthenticated', token: undefined, user: undefined})
    },

    simulateLogin: (role: Role) => {
    const fakeUser: User = {
        nombre: 'Usuario',
        correo: `${role}@lexyvoz.com`,
        contraseña: 'fake-password',
        fecha_de_nacimiento: new Date(),
        numero_telefono: '0000000000',
        sexo: 'Otro',
        tipo: role.charAt(0).toUpperCase() + role.slice(1), // 'Doctor' | 'Paciente' | 'Usuario'
        domicilio: 'Dirección falsa',
        escolaridad: role === 'Doctor' || role === 'Paciente' ? 'Universitaria' : undefined,
        especialidad: role === 'Doctor' ? 'Cardiología' : undefined,
    };

    set({
        status: 'authenticated',
        token: 'fake-token',
        user: fakeUser,
        role,
    });
    },
}))