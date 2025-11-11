// presentation/hooks/useRoleRouteProtector.ts
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { usePathname, useRouter, useRootNavigationState, type Href } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

type HardRole = 'Paciente' | 'Doctor' | 'Usuario' | 'admin';

const PUBLIC_PREFIX = ['/login', '/registro', '/password'] as const;

// Prefijos permitidos por rol (el hook permite subrutas con startsWith)
const ALLOWED_PREFIX = {
  Paciente: [
    '/home',
    '/juegos', '/juegos/escrito', '/juegos/visual', '/juegos/lectura',
    '/juegos/escrito/interface', '/juegos/visual/interface', '/juegos/lectura/interface',
    '/ejercicios',
    '/busqueda-doctores',
    '/settings',
    '/notifications',
  ],
  Doctor: [
    '/main',
    '/add_paciente',
    '/ver_perfil_usuario',
    '/agenda',
    '/kits', '/kits/createKit', '/kits/editKit', '/kits/asignar_kits',
    '/settings',
    '/notifications',
  ],
  Usuario: [
    '/home',
    '/juegos', '/juegos/escrito', '/juegos/visual', '/juegos/lectura',
    '/juegos/escrito/interface', '/juegos/visual/interface', '/juegos/lectura/interface',
    '/ejercicios',
    '/busqueda-doctores',
    '/settings',
    '/notifications',
  ],
  admin: [
    '/admin', 
    '/admin/users', '/admin/users/create',
    '/admin/kits',  '/admin/kits/create',
    '/admin/settings',
  ],
} as const satisfies Record<HardRole, readonly string[]>;

const HOME_BY_ROLE = {
  Paciente: '/home',
  Doctor:   '/main',
  Usuario:  '/home',
  admin:    '/admin',
} as const satisfies Record<HardRole, Href>;

export function useRoleRouteProtector() {
  const pathname = usePathname();
  const router = useRouter();
  const navState = useRootNavigationState();
  const { status, userType } = useAuthStore();

  const isRouterReady = !!navState?.key;
  const isClient = typeof window !== 'undefined';
  const scheduled = useRef(false);

  // ← aquí el fix: devolvemos 'admin' en minúsculas
  const role = useMemo<HardRole | undefined>(() => {
    if (!userType) return undefined;
    const t = String(userType).toLowerCase();
    if (t.startsWith('adm')) return 'admin';
    if (t.startsWith('doc')) return 'Doctor';
    if (t.startsWith('pac')) return 'Paciente';
    return 'Usuario';
  }, [userType]);

  const safeReplace = useCallback((to: Href) => {
    if (scheduled.current) return;
    scheduled.current = true;
    requestAnimationFrame(() => {
      try { router.replace(to); } finally { scheduled.current = false; }
    });
  }, [router]);

  const matches = useCallback((prefix: string) =>
    pathname === prefix || pathname.startsWith(prefix + '/'), [pathname]);

  useEffect(() => {
    if (!isClient || !isRouterReady) return;
    if (!pathname) return;

    // --- SIN SESIÓN: permitir rutas públicas ---
    if (status === 'unauthenticated') {
      const isPublic = PUBLIC_PREFIX.some(matches);
      if (!isPublic) safeReplace('/login' as Href);
      return;
    }

    // --- SESIÓN NO LISTA O SIN ROL ---
    if (status !== 'authenticated' || !role) return;

    // Autenticado: sacar de rutas públicas
    const isPublic = PUBLIC_PREFIX.some(matches);
    if (isPublic) {
      safeReplace(HOME_BY_ROLE[role]);
      return;
    }

    // Permisos por prefijo
    const allowed = ALLOWED_PREFIX[role];
    const isAllowed = allowed.some(matches);
    if (!isAllowed) {
      safeReplace(HOME_BY_ROLE[role]);
    }
  }, [isClient, isRouterReady, pathname, status, role, router, matches, safeReplace]);
}
