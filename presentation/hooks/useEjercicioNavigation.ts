// hooks/useEjercicioNavigation.ts
import { router } from "expo-router";

export const useEjercicioNavigation = () => {
  // Prefijo real:
  const BASE = "/(app)/(usuario)/(stack)/juegos";

  const routes = {
    1: `${BASE}/lectura`,
    2: `${BASE}/escrito`,
    3: `${BASE}/visual`,
  } as const;

  const navigateToEjercicio = (ejercicio: any, kitId: number | string) => {
    const tipo = Number(ejercicio?.tipo_ejercicio) as keyof typeof routes;
    const route = routes[tipo];

    if (!route) {
      console.warn("Tipo de ejercicio no reconocido:", ejercicio?.tipo_ejercicio);
      return;
    }

    router.push({
      pathname: route,
      params: {
        ejercicioId: String(ejercicio?.ejercicio_id ?? ejercicio?.id),
        kitId: String(kitId),
      },
    });
  };

  return { navigateToEjercicio };
};
