import { DoctorResponse, PacienteResponse, UsuarioResponse, VinculacionResponse } from "@/core/auth/interface/auth";

export class DoctorMapper {
  static fromApiToEntity(apiUser: any): DoctorResponse {
    return {
      page: apiUser.page,
      limit: apiUser.limit,
      total: apiUser.total,
      count: apiUser.count,
      doctors: apiUser.doctors.map((doctor: any) => ({
        doctor_id: doctor.doctor_id,
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

// Mapeo de pacientes
export class PacienteMapper {
  static fromApiToEntity(apiUser: any): PacienteResponse {
    return {
      page: apiUser.page,
      limit: apiUser.limit,
      total: apiUser.total,
      count: apiUser.count,
      patients: apiUser.patients.map((patient: any) => ({
        usuario_id: patient.usuario_id,
        nombre: patient.nombre,
        correo: patient.correo,
        fecha_de_nacimiento: new Date(patient.fecha_de_nacimiento),
        numero_telefono: patient.numero_telefono,
        sexo: patient.sexo,
        tipo: patient.tipo,
        escolaridad: patient.escolaridad || undefined,
        especialidad: patient.especialidad || undefined,
        domicilio: patient.domicilio,
        codigo_postal: patient.codigo_postal
      }))
    };
  }
}

// Mapear la vinculacion
export class VinculacionMapper {
  static fromApiToEntity(apiUser: any): VinculacionResponse {
    return {
      page: apiUser.page,
      limit: apiUser.limit,
      total: apiUser.total,
      count: apiUser.count,
      links: apiUser.links.map((link: any) => ({
        doctor_id: link.doctor_id,
        paciente_id: link.paciente_id,
        doctor_nombre: link.doctor_nombre,
        doctor_correo: link.doctor_correo,
        doctor_imagen_url: link.doctor_imagen_url,
        doctor_especialidad: link.doctor_especialidad,
        paciente_nombre: link.paciente_nombre,
        paciente_correo: link.paciente_correo,
        paciente_imagen_url: link.paciente_imagen_url,
        paciente_escolaridad: link.paciente_escolaridad
      }))
    };
  }
}

// Mapear usuarios
export class UsuarioMapper {
  static fromApiToEntity(apiUser: any): UsuarioResponse {
    return {
      page: apiUser.page,
      limit: apiUser.limit,
      total: apiUser.total,
      count: apiUser.count,
      users: apiUser.users.map((user: any) => ({
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        correo: user.correo,
        fecha_de_nacimiento: new Date(user.fecha_de_nacimiento),
        numero_telefono: user.numero_telefono,
        sexo: user.sexo,
        tipo: user.tipo,
        imagen_url: user.imagen_url,
        imagen_id: user.imagen_id,
        doctor_especialidad: user.doctor_especialidad || undefined,
        domicilio: user.domicilio,
        codigo_postal: user.codigo_postal,
        paciente_escolaridad: user.paciente_escolaridad || undefined
      }))
    };
  }
}
