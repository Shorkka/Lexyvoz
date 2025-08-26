// En tu store useDoctorStore
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { obtenerPacientesVinculadosConDoctor } from '@/infraestructure/interface/doctor-paciente-actions';

interface Paciente {
  usuario_id: string;
  nombre: string;
  correo: string;
  imagen_url?: string;
  escolaridad?: string;
}

interface UseDoctorStore {
  pacientes: Paciente[];
  usePacientesQuery: (doctorId: number) => {
    data: Paciente[];
    isLoading: boolean;
    isError: boolean;
  };
}

export const useDoctorStore = create<UseDoctorStore>((set, get) => ({
  pacientes: [],
  
  usePacientesQuery: (doctorId: number) => {
    return useQuery({
      queryKey: ['pacientes', doctorId],
      queryFn: () => obtenerPacientesVinculadosConDoctor(doctorId),
      enabled: !!doctorId, // Solo ejecutar si hay doctorId
      select: (data) => {
        // Mapear la respuesta para obtener solo datos del paciente
        if (data && data.links) {
          return data.links.map((link: any) => ({
            usuario_id: link.paciente_id,
            nombre: link.paciente_nombre,
            correo: link.paciente_correo,
            imagen_url: link.paciente_imagen_url,
            escolaridad: link.paciente_escolaridad
          }));
        }
        return [];
      }
    });
  }
}));