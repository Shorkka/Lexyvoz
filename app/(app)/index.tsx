import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

const APP_ROUTES = {
  DOCTOR_HOME: '/main',
  USER_HOME: '/home',
  LOGIN: '/login',
} as const;

const CheckAuthenticationLayout = () => {
  const { status, userType, checkStatus, loadSession, user} = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
console.log('User in CheckAuthenticationLayout:', user);
  useEffect(() => {
    const initializeApp = async () => {
      await loadSession();
      await checkStatus();
      setIsInitialized(true);
    };
    initializeApp();
  }, [loadSession, checkStatus]);

  useEffect(() => {
    if (!isInitialized) return;

    if (status === 'unauthenticated') {
      router.replace(APP_ROUTES.LOGIN);
      return;
    }

    if (status === 'authenticated') {
      const targetRoute = userType === 'Doctor' 
        ? APP_ROUTES.DOCTOR_HOME 
        : APP_ROUTES.USER_HOME;
      
      router.replace(targetRoute);
    }
  }, [status, userType, isInitialized, router]);

  if (!isInitialized || status === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default CheckAuthenticationLayout;