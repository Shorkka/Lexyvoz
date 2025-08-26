import { ObtenerTodos, Vinculaciones } from "@/core/auth/interface/doctor-paciente";

export class DoctorPacienteMapper {
  static toDomain<T>(data: any): ObtenerTodos<T> {
    return {
      message: data.message,
      data: data.pacientes ?? data.doctores ?? data.data, 
      total: data.total,
    };
  }
}


// Mapear todas las vinculaciones 
export class ObtenerVinculaciones{
    static toDomain(data: any): Vinculaciones {
        return {
            message: data.message,
            vinculaciones: data.vinculaciones.map((item: any) => ({
                doctor_id: item.doctor_id,
                paciente_id: item.paciente_id,
                fecha_vinculacion: item.fecha_vinculacion,
                doctor_nombre: item.doctor_nombre,
                especialidad: item.especialidad,
                paciente_nombre: item.paciente_nombre,
                escolaridad: item.escolaridad
            })),
            total: data.total,
        };
    }
}