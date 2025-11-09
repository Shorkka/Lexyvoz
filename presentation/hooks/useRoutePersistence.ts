// presentation/hooks/useRoutePersistence.ts
import { useEffect } from 'react';
import { usePathname, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

const KEY = 'lexyvoz:lastPath';

export function useRoutePersistence() {
  const pathname = usePathname();
  const navState = useRootNavigationState();
  const { status } = useAuthStore();

  const isRouterReady = !!navState?.key;

  // 1) Persistir solo cuando hay sesión y no es /login
  useEffect(() => {
    if (!isRouterReady) return;
    if (status !== 'authenticated') return;
    if (!pathname || pathname === '/login') return;
    try { localStorage.setItem(KEY, pathname); } catch {}
  }, [pathname, status, isRouterReady]);

  // 2) Si NO hay sesión, solo limpiar la key (no navegues aquí)
  useEffect(() => {
    if (!isRouterReady) return;
    if (status === 'unauthenticated') {
      try { localStorage.removeItem(KEY); } catch {}
    }
  }, [status, isRouterReady]);
}
