import { 
  crearCita, 
  obtenerCitas, 
  obtenerCitaPorId, 
  editarCita, 
  eliminarCita 
} from '@/core/auth/actions/cita-actions';
import { create } from 'zustand';

interface Cita {
  cita_id?: number;
  doctor_id: number;
  paciente_id: number;
  fecha_cita: string;
  estado: string;
}

interface CitaStore {
  citas: Cita[];
  citaActual: Cita | null;
  loading: boolean;
  error: string | null;

  crearNuevaCita: (citaData: Cita) => Promise<boolean>;
  obtenerTodasCitas: (filtro?: { doctor_id?: number; paciente_id?: number }) => Promise<void>;
  obtenerCita: (cita_id: number) => Promise<void>;
  actualizarCita: (cita_id: number, citaData: Cita) => Promise<boolean>;
  borrarCita: (cita_id: number) => Promise<boolean>;
  limpiarCitaActual: () => void;
}

export const useCitaStore = create<CitaStore>()((set) => ({
  citas: [],
  citaActual: null,
  loading: false,
  error: null,

  crearNuevaCita: async (citaData) => {
    set({ loading: true, error: null });
    try {
      const res = await crearCita(citaData);
      if (res.success) {
        set((state) => ({ citas: [...state.citas, res.data], loading: false }));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error al crear cita desde store', error);
      set({ error: 'No se pudo crear la cita', loading: false });
      return false;
    }
  },

  obtenerTodasCitas: async (filtro) => {
    set({ loading: true, error: null });
    try {
      const data = await obtenerCitas(filtro);
      set({ citas: data, loading: false });
    } catch (error: any) {
      console.error('Error al obtener citas desde store', error);
      set({ error: 'No se pudo obtener las citas', loading: false });
    }
  },

  obtenerCita: async (cita_id) => {
    set({ loading: true, error: null });
    try {
      const data = await obtenerCitaPorId(cita_id);
      set({ citaActual: data, loading: false });
    } catch (error: any) {
      console.error('Error al obtener cita desde store', error);
      set({ error: 'No se pudo obtener la cita', loading: false });
    }
  },

  actualizarCita: async (cita_id, citaData) => {
    set({ loading: true, error: null });
    try {
      const res = await editarCita(cita_id, citaData);
      if (res.success) {
        set((state) => ({
          citas: state.citas.map(c => c.cita_id === cita_id ? res.data : c),
          loading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error al actualizar cita desde store', error);
      set({ error: 'No se pudo actualizar la cita', loading: false });
      return false;
    }
  },

  borrarCita: async (cita_id) => {
    set({ loading: true, error: null });
    try {
      const res = await eliminarCita(cita_id);
      if (res.success) {
        set((state) => ({
          citas: state.citas.filter(c => c.cita_id !== cita_id),
          loading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error al eliminar cita desde store', error);
      set({ error: 'No se pudo eliminar la cita', loading: false });
      return false;
    }
  },

  limpiarCitaActual: () => set({ citaActual: null })
}));