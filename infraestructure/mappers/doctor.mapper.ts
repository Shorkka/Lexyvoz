import { DoctorResponse } from "@/core/auth/interface/user";

export class DoctorMapper {
  static fromApiToEntity(apiUser: any): DoctorResponse {
    return {
      page: apiUser.page,
      limit: apiUser.limit,
      total: apiUser.total,
      count: apiUser.count,
      doctors: apiUser.doctors.map((doctor: any) => ({
        usuario_id: doctor.usuario_id,
        nombre: doctor.nombre,
        correo: doctor.correo,
        fecha_de_nacimiento: new Date(doctor.fecha_de_nacimiento),
        numero_telefono: doctor.numero_telefono,
        sexo: doctor.sexo,
        tipo: doctor.tipo,
        escolaridad: doctor.escolaridad || undefined,
        especialidad: doctor.especialidad || undefined,
        domicilio: doctor.domicilio,
        codigo_postal: doctor.codigo_postal
      }))
    };
  }
}