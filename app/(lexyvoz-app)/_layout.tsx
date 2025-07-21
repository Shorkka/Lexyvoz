import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

const CheckAuthenticationLayout = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const { status, checkStatus, user } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);


   useEffect(() => {
    if (status === 'authenticated' && user) {
      const routeMap = {
        'Paciente': '/(lexyvoz-app)/(paciente)/home',
        'Doctor': '/(lexyvoz-app)/(doctor)/home',
        'Usuario': '/(lexyvoz-app)/(usuario)/home'
      };
     const tipo = user?.tipo as keyof typeof routeMap | undefined;
     const target = tipo && routeMap[tipo] ? routeMap[tipo] : '/auth/login';
        router.replace(target as any);
    } else if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, user]);

  if (status === 'checking') {
    return <ActivityIndicator />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor }}}>

    </Stack>
  );
};

export default CheckAuthenticationLayout;