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

    // Acción para manejar el estado de autenticación
    checkStatus: async () => {
        try {
            set({ status: 'checking' });
            
            // Primero verificar si hay datos guardados
            const sessionData = await SecureStorageAdapter.getItem('authSession');
            
            if (sessionData) {
                const { user, userType, credentials } = JSON.parse(sessionData);
                
                // Si hay credenciales guardadas, hacer login para validar
                if (credentials?.correo && credentials?.contrasenia) {
                    try {
                        const resp = await authLogin(credentials.correo, credentials.contrasenia);
                        
                        if (resp?.user) {
                            // Actualizar la sesión con datos frescos del backend
                            const updatedSessionData = {
                                user: resp.user,
                                userType: resp.user.tipo,
                                credentials: credentials
                            };
                            
                            await SecureStorageAdapter.setItem('authSession', JSON.stringify(updatedSessionData));
                            
                            set({
                                status: 'authenticated',
                                user: resp.user,
                                userType: resp.user.tipo
                            });
                            return;
                        }
                    } catch (error) {
                        console.error('Error validating saved credentials:', error);
                        // Si falla la validación, limpiar datos
                        await SecureStorageAdapter.deleteItem('authSession');
                        set({ status: 'unauthenticated', user: undefined, userType: undefined });
                        return;
                    }
                } else {
                    // Si no hay credenciales completas, usar los datos guardados tal como están
                    set({
                        status: 'authenticated',
                        user,
                        userType
                    });
                    return;
                }
            }
            
            // Si no hay datos guardados, verificar con el backend
            const resp = await authCheckStatus();
            if (resp?.user) {
                await SecureStorageAdapter.setItem('authSession', JSON.stringify({
                    user: resp.user,
                    userType: resp.user.tipo,
                    credentials: {
                        correo: resp.user.correo,
                    }
                }));

                set({
                    status: 'authenticated',
                    user: resp.user,
                    userType: resp.user.tipo
                });
            } else {
                await SecureStorageAdapter.deleteItem('authSession');
                set({ status: 'unauthenticated', user: undefined, userType: undefined });
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
                const { user, userType } = JSON.parse(sessionData);
                set({
                    status: 'authenticated',
                    user,
                    userType
                });
                return true;
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
        
        set({ status: 'unauthenticated' });
        return false;
    },
    // Acción de login
    login: async (correo: string, contrasenia: string) => {
    try {
            const resp = await authLogin(correo, contrasenia);

            if (!resp?.user) {
            set({ status: 'unauthenticated', user: undefined, userType: undefined });
            return false;
            }

            const sessionData = {
            user: resp.user,
            };

            await SecureStorageAdapter.setItem('authSession', JSON.stringify(sessionData));

                set({
                status: 'authenticated',
                user: resp.user,
                userType: resp.user.tipo
                });

                return true;
            } catch (error) {
                console.error('Error en login:', error);
                set({ status: 'unauthenticated' });
                return false;
            }
        },

    // Acción de registro
    register: async (registerData: any) => {
        try {
            const resp = await authRegister(registerData);

            if (!resp?.user) {
                console.error('Registro fallido - Respuesta incompleta:', resp);
                set({ status: 'unauthenticated', user: undefined, userType: undefined });
                return false;
            }

            // Guardar el usuario completo
            await SecureStorageAdapter.setItem('user', JSON.stringify(resp.user));

            set({
                status: 'authenticated',
                user: resp.user,
                userType: resp.user.tipo
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
        userType: undefined
        });
        
    },
    updateUser: async (updatedFields: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {

            const updatedUser = await authUpdateUser(currentUser.usuario_id, updatedFields);

            set({ user: updatedUser });

            
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

