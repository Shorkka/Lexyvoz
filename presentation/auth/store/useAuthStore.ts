import { authLogin, authRegister, authCheckStatus, authUpdateUser, recoveryPasswordResponse } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { SecureStorageAdapter } from "@/helper/adapters/secure-storage.adapter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
    status: AuthStatus;
    user?: User;
    userType?: string;
    userName?: string;

    login: (correo: string, contrasenia: string) => Promise<boolean>;
    checkStatus: () => Promise<void>;
    logout: () => Promise<void>;
    register: (registerData: any) => Promise<boolean>;
    loadSession: () => Promise<boolean>;
    updateUser: (updatedFields: Partial<User>) => Promise<void>;
    resetPassword: (correo: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    status: 'unauthenticated',
    user: undefined,
    userType: undefined,
    userName: undefined,

    checkStatus: async () => {
        try {
            set({ status: 'checking' });
            
            const sessionData = await SecureStorageAdapter.getItem('authSession');
            
            if (sessionData) {
                const { user, userType, userName, credentials } = JSON.parse(sessionData);
                
                if (credentials?.correo && credentials?.contrasenia) {
                    try {
                        const resp = await authLogin(credentials.correo, credentials.contrasenia);
                        
                        if (resp?.user) {
                            const updatedSessionData = {
                                user: resp.user,
                                userType: resp.user.tipo,
                                userName: resp.user.nombre,
                                credentials
                            };
                            
                            await SecureStorageAdapter.setItem('authSession', JSON.stringify(updatedSessionData));
                            
                            set({
                                status: 'authenticated',
                                user: resp.user,
                                userType: resp.user.tipo,
                                userName: resp.user.nombre
                            });
                            return;
                        }
                    } catch (error) {
                        console.error('Error validating saved credentials:', error);
                        await SecureStorageAdapter.deleteItem('authSession');
                        set({ status: 'unauthenticated', user: undefined, userType: undefined, userName: undefined });
                        return;
                    }
                } else {
                    set({
                        status: 'authenticated',
                        user,
                        userType,
                        userName
                    });
                    return;
                }
            }
            
            const resp = await authCheckStatus();
            if (resp?.user) {
                await SecureStorageAdapter.setItem('authSession', JSON.stringify({
                    user: resp.user,
                    userType: resp.user.tipo,
                    userName: resp.user.nombre,
                    credentials: { correo: resp.user.correo }
                }));

                set({
                    status: 'authenticated',
                    user: resp.user,
                    userType: resp.user.tipo,
                    userName: resp.user.nombre
                });
            } else {
                await SecureStorageAdapter.deleteItem('authSession');
                set({ status: 'unauthenticated', user: undefined, userType: undefined, userName: undefined });
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            set({ status: 'unauthenticated' });
        }
    },

    loadSession: async () => {
        try {
            const sessionData = await SecureStorageAdapter.getItem('authSession');
            
            if (sessionData) {
                const { user, userType, userName } = JSON.parse(sessionData);
                set({
                    status: 'authenticated',
                    user,
                    userType,
                    userName
                });
                return true;
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
        
        set({ status: 'unauthenticated' });
        return false;
    },

    login: async (correo: string, contrasenia: string) => {
        try {
            const resp = await authLogin(correo, contrasenia);

            if (!resp?.user) {
                set({ status: 'unauthenticated', user: undefined, userType: undefined, userName: undefined });
                return false;
            }

            const sessionData = {
                user: resp.user,
                userType: resp.user.tipo,
                userName: resp.user.nombre
            };

            await SecureStorageAdapter.setItem('authSession', JSON.stringify(sessionData));

            set({
                status: 'authenticated',
                user: resp.user,
                userType: resp.user.tipo,
                userName: resp.user.nombre
            });

            return true;
        } catch (error) {
            console.error('Error en login:', error);
            set({ status: 'unauthenticated' });
            return false;
        }
    },

    register: async (registerData: any) => {
        try {
            const resp = await authRegister(registerData);

            if (!resp?.user) {
                console.error('Registro fallido - Respuesta incompleta:', resp);
                set({ status: 'unauthenticated', user: undefined, userType: undefined, userName: undefined });
                return false;
            }

            await SecureStorageAdapter.setItem('authSession', JSON.stringify({
                user: resp.user,
                userType: resp.user.tipo,
                userName: resp.user.nombre
            }));

            set({
                status: 'authenticated',
                user: resp.user,
                userType: resp.user.tipo,
                userName: resp.user.nombre
            });
            
            return true;
        } catch (error) {
            console.error('Error en registro:', error);
            set({ status: 'unauthenticated' });
            throw error;
        }
    },

    logout: async () => {
        await SecureStorageAdapter.deleteItem('authSession');
        AsyncStorage.clear();
        set({ 
            status: 'unauthenticated',
            user: undefined,
            userType: undefined,
            userName: undefined
        });
    },

    updateUser: async (updatedFields: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
            const updatedUser = await authUpdateUser(currentUser.usuario_id, updatedFields);

            const updatedSession = {
                user: updatedUser,
                userType: updatedUser.tipo,
                userName: updatedUser.nombre
            };

            await SecureStorageAdapter.setItem('authSession', JSON.stringify(updatedSession));

            set({ 
                user: updatedUser,
                userType: updatedUser.tipo,
                userName: updatedUser.nombre
            });

        } catch (error) {
            console.error('Error actualizando usuario:', error);
        }
    },

    resetPassword: async (correo: string): Promise<boolean> => {
        try {
            const response = await recoveryPasswordResponse(correo);
            if (response.success) {
                return true;
            } else {
                console.error('Error al enviar el correo de recuperación:', response.message);
                return false;
            }
        } catch (error) {
            console.error('Error en resetPassword:', error);
            return false;
        }
    }
}));
