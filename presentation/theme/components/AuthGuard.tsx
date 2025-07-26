import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { status, loadSession } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  // Remove navigation ready state and listener, not needed for expo-router

  useEffect(() => {
    const initialize = async () => {
      await loadSession();
      setIsReady(true);
    };
    initialize();
  }, [loadSession]);

  useEffect(() => {
    if (!isReady) return;
    
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, isReady, router]);

  useEffect(() => {
    if (!isReady) return;
    
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, isReady, router]);

  return status === 'authenticated' ? <>{children}</> : null;
};

export default AuthGuard;