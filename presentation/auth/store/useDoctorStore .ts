
import { enlazarPaciente, searchPacientes } from '@/infraestructure/interface/doctor-actions';
import { create } from 'zustand';

interface DoctorStore {
  pacientes: any[];
  loading: boolean;
  error: string | null;

  getPacientes: (doctor_id: number) => Promise<void>;
  vincularPaciente: (usuario_id: number, doctor_id: number) => Promise<boolean>;
}

export const useDoctorStore = create<DoctorStore>()((set) => ({
  pacientes: [],
  loading: false,
  error: null,

  getPacientes: async (doctor_id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await searchPacientes(doctor_id);
      set({ pacientes: data, loading: false });
    } catch (error: any) {
      console.error('Error al obtener pacientes del doctor', error);
      set({ error: 'No se pudo obtener pacientes', loading: false });
    }
  },

  vincularPaciente: async (usuario_id, doctor_id) => {
    try {
      const res = await enlazarPaciente(usuario_id, doctor_id);
      return res.success;
    } catch (error) {
      console.error('Error al vincular paciente desde store', error);
      return false;
    }
  }
}));
