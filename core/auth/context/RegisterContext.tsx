// src/context/RegisterContext.tsx
import { create } from 'zustand';

interface RegisterForm {
  // Paso 1
  nombre?: string;
  email?: string;
  password?: string;
  // Paso 2
  telefono?: string;
  sexo?: string;
  direccion?: string;
  codigoPostal?: string;
  // Paso 3
  rol?: string;
  fechaNacimiento?: Date;
  escolaridad?: string;
  especialidad?: string;
  titulo?: string;
}

interface RegisterStore extends RegisterForm {
  set: (data: Partial<RegisterForm>) => void;
  reset: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  // valores iniciales vacíos
  set: (data) => set((prev) => ({ ...prev, ...data })),
  reset: () =>
    set({
      nombre: undefined,
      email: undefined,
      password: undefined,
      telefono: undefined,
      sexo: undefined,
      direccion: undefined,
      codigoPostal: undefined,
      rol: undefined,
      fechaNacimiento: undefined,
      escolaridad: undefined,
      especialidad: undefined,
      titulo: undefined,
    }),
}));