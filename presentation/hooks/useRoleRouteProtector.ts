// presentation/hooks/useRoleRouteProtector.ts
import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useRootNavigationState, type Href } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

type HardRole = 'Paciente' | 'Doctor' | 'Usuario';

const PUBLIC_PREFIX = [
  '/login',
  '/registro',         
  '/password',
] as const;

const ALLOWED_PREFIX = {
  Paciente: ['/home', '/juegos', '/ejercicios', '/busqueda-doctores', '/settings', '/notifications', '/juegos/escrito', '/juegos/visual', 'juegos/lectura'
    , '/juegos/escrito/interface', '/juegos/visual/interface', 'juegos/lectura/interface' ],
  Doctor:   ['/main', '/add_paciente', '/ver_perfil_usuario', '/settings', '/notifications', '/agenda', '/kits', '/kits/createKit', '/kits/editKit', '/kits/asignar_kits'],
  Usuario:  ['/home', '/juegos', '/ejercicios', '/busqueda-doctores', '/settings', '/notifications', '/juegos/escrito', '/juegos/visual', 'juegos/lectura'
    , '/juegos/escrito/interface', '/juegos/visual/interface', 'juegos/lectura/interface' ],
} as const satisfies Record<HardRole, readonly string[]>;

const HOME_BY_ROLE = {
  Paciente: '/home',
  Doctor:   '/main',
  Usuario:  '/home',
} as const satisfies Record<HardRole, Href>;

export function useRoleRouteProtector() {
  const pathname = usePathname();
  const router = useRouter();
  const navState = useRootNavigationState();
  const { status, userType } = useAuthStore();

  const isRouterReady = !!navState?.key;
  const isClient = typeof window !== 'undefined';
  const scheduled = useRef(false);

  const role = useMemo<HardRole | undefined>(() => {
    if (!userType) return undefined;
    const t = String(userType).toLowerCase();
    if (t.startsWith('doc')) return 'Doctor';
    if (t.startsWith('pac')) return 'Paciente';
    return 'Usuario';
  }, [userType]);

  const safeReplace = (to: Href) => {
    if (scheduled.current) return;
    scheduled.current = true;
    requestAnimationFrame(() => {
      try { router.replace(to); } finally { scheduled.current = false; }
    });
  };

  useEffect(() => {
    if (!isClient || !isRouterReady) return;
    if (!pathname) return;

    // --- SIN SESIÓN: permitir rutas públicas ---
    if (status === 'unauthenticated') {
      const isPublic = PUBLIC_PREFIX.some(p => pathname === p || pathname.startsWith(p + '/'));
      if (!isPublic) safeReplace('/login' as Href);
      return;
    }

    // --- CON SESIÓN COMPLETA ---
    if (status !== 'authenticated' || !role) return;

    // Si ya estás logueado, no te quedes en rutas públicas (ej. /login o /register)
    const isPublic = PUBLIC_PREFIX.some(p => pathname === p || pathname.startsWith(p + '/'));
    if (isPublic) {
      safeReplace(HOME_BY_ROLE[role]);
      return;
    }

    // Permisos por prefijo
    const allowed = ALLOWED_PREFIX[role];
    const isAllowed = allowed.some(p => pathname === p || pathname.startsWith(p + '/'));
    if (!isAllowed) {
      safeReplace(HOME_BY_ROLE[role]);
    }
  }, [isClient, isRouterReady, pathname, status, role, router]);
}
