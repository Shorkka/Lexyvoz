import { authCheckStatus, authLogin, authRegister } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { SecureStorageAdapter } from "@/helper/adapters/secure-storage.adapter";
import { create } from 'zustand';

export type AuthStatus  = 'authenticated' | 'unauthenticated' | 'checking';


export interface AuthState{
    status: AuthStatus
    token?: string;
    user?: User;

    login: (correo: string, contraseña: string) => Promise<boolean>;
    checkStatus: () => Promise<void>;
    logout: () => Promise<void>;
    changeStatus: (token?:string, user?:User) => Promise<boolean>;
    register: (registerData: any) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Properties
    status: 'checking',
    token: undefined,
    user: undefined,

    // Actions

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
    
    login: async(correo: string, contraseña: string) =>{
        const resp = await authLogin(correo, contraseña);

        return get().changeStatus(resp?.token, resp?.user);

    },

    checkStatus: async()=> {
        const  resp = await authCheckStatus();
        get().changeStatus(resp?.token, resp?.user);
        
    },

    register: async(registerData: any) => {
        const resp = await authRegister(registerData);
        return get().changeStatus(resp?.token, resp?.user);
    },
    
    logout: async()=> {
        // Clear Token del secure store
        SecureStorageAdapter.deleteItem('token');
        set({status: 'unauthenticated', token: undefined, user: undefined})
    },
}))