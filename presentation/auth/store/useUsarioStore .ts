
import { searchDoctors } from '@/infraestructure/interface/paciente-actions';
import { create } from 'zustand';


interface PacienteStore {
  doctores: any[];
  loading: boolean;
  error: string | null;

  getDoctores: (paciente_id: number) => Promise<void>;
}

export const usePacienteStore = create<PacienteStore>()((set) => ({
  doctores: [],
  loading: false,
  error: null,

  getDoctores: async (paciente_id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await searchDoctors(paciente_id);
      set({ doctores: data, loading: false });
    } catch (error) {
      console.error('Error al obtener doctores', error);
      set({ error: 'No se pudo obtener doctores', loading: false });
    }
  },
}));
