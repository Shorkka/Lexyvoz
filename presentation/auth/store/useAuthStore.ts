import { authLogin, authRegister } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
//import { SecureStorageAdapter } from "@/helper/adapters/secure-storage.adapter";
import { create } from 'zustand';

export type AuthStatus  = 'authenticated' | 'unauthenticated' | 'checking';



export interface AuthState{
    status: AuthStatus
    user?: User;
    userType?: string;

    login: (correo: string, contraseña: string) => Promise<boolean>;
    // checkStatus: () => Promise<void>;
    logout: () => Promise<void>;
    // changeStatus: (token?:string, user?:User) => Promise<boolean>;
    register: (registerData: any) => Promise<boolean>;

}

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Properties
    status: 'unauthenticated',
    //token: undefined,
    user: undefined,
    userType: undefined,

    // Actions
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
   // return get().changeStatus(resp?.token, resp?.user);
   // Puedes manejar el estado aquí directamente si lo necesitas
    
    login: async(correo: string, contraseña: string) => {
        try {
            const resp = await authLogin(correo, contraseña);
            
            if (!resp?.user) {
                set({status: 'unauthenticated', user: undefined});
                return false;
            }
            set({
                status: 'authenticated',
                userType: resp.userType,
                user: resp.user,
            });
            return true;
            
        } catch (error) {
            console.error('Error en login:', error);
            set({ status: 'unauthenticated' });
            throw error; // Propaga el error para mostrar en UI
        }
    },

    // await SecureStorageAdapter.setItem('token');

    /*
    checkStatus: async()=> {
        const  resp = await authCheckStatus();
        get().changeStatus(resp?.token, resp?.user);
    },
    */

    register: async (registerData: any) => {
    try {
        const resp = await authRegister(registerData);

        if (!resp?.user) {
            console.error('Registro fallido - Respuesta incompleta:', resp);
            set({ status: 'unauthenticated', user: undefined });
            return false;
        }

        set({
        status: 'authenticated',
        user: resp.user,
        });
        // await SecureStorageAdapter.setItem('token', resp.token);
        return true;
        
    } catch (error) {
        console.error('Error en registro:', error);
        set({ status: 'unauthenticated' });
        throw error;
    }
    },
        
    logout: async()=> {
        // Clear Token del secure store
        //SecureStorageAdapter.deleteItem('token');
        set({status: 'unauthenticated', user: undefined})
    },

   
}))