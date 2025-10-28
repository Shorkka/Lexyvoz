import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRoutePersistence = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname !== '/login') {
      AsyncStorage.setItem('lastRoute', pathname);
    }
  }, [pathname]);
};
