// src/context/RegisterContext.tsx
import { create } from 'zustand';

interface RegisterForm {
  // Paso 1
  nombre?: string;
  correo?: string;
  contrasenia?: string;
  // Paso 2
  numero_telefono?: string;
  sexo?: string;
  domicilio?: string;
  // Paso 3
  tipo?: string;
  fecha_de_nacimiento?: Date;
  escolaridad?: string;
  especialidad?: string;
  codigo_postal?: string;
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
      correo: undefined,
      contrasenia: undefined,
      numero_telefono: undefined,
      sexo: undefined,
      domicilio: undefined,
      tipo: undefined,
      fecha_de_nacimiento: undefined,
      escolaridad: undefined,
      especialidad: undefined,
      codigo_postal: undefined,
    }),
}));