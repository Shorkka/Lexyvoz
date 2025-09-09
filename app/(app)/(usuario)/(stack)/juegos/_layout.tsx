import { router } from "expo-router";

export const useEjercicioNavigation = () => {
  const navigateToEjercicio = (ejercicio: any, kitId: string) => {
    const routes = {
      1: "/juegos/lectura",
      2: "/juegos/escrito", 
      3: "/juegos/visual"
    } as const; 

    const route = routes[ejercicio.tipo_ejercicio as keyof typeof routes];
    
    if (route) {
      router.push({
        pathname: route,
        params: { 
          ejercicioId: ejercicio.ejercicio_id, 
          kitId 
        }
      });
    } else {
      console.warn("Tipo de ejercicio no reconocido:", ejercicio.tipo_ejercicio);
    }
  };

  return { navigateToEjercicio };
};
