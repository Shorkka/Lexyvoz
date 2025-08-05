import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { status, loadSession, checkStatus } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  // Remove navigation ready state and listener, not needed for expo-router

  useEffect(() => {
    const initialize = async () => {
      await loadSession();
        await checkStatus();
      setIsReady(true);
    };
    initialize();
  }, [loadSession, checkStatus]);

  useEffect(() => {
    if (!isReady) return;
    
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, isReady, router]);

  useEffect(() => {
    if (!isReady) return;
    
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, isReady, router]);

  return status === 'authenticated' ? <>{children}</> : null;
};

export default AuthGuard;