import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { SecureStorageAdapter } from '@/helper/adapters/secure-storage.adapter';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { status, loadSession, checkStatus } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // 1. Cargar la sesión guardada
      const hasSession = await loadSession();

      // 2. Si no hay sesión, mandar al login
      if (!hasSession) {
        setIsReady(true);
        router.replace('/login');
        return;
      }

      // 3. Si hay sesión, validar token
      const token = await SecureStorageAdapter.getItem('token');
      if (!token) {
        setIsReady(true);
        router.replace('/login');
        return;
      }

      // 4. Validar usuario con backend
      await checkStatus();

      setIsReady(true);
    };

    initialize();
  }, [checkStatus, loadSession, router]);

  useEffect(() => {
    if (!isReady) return;

    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, isReady, router]);

  // Evita parpadeo mostrando nada hasta que se decida
  if (!isReady) return null;

  return status === 'authenticated' ? <>{children}</> : null;
};

export default AuthGuard;
