import { User } from "@/core/auth/interface/user";

export class UserMapper {
  static fromApiToEntity(apiUser: any): User {
    return {
      usuario_id: apiUser.usuario_id,
      nombre: apiUser.nombre,
      correo: apiUser.correo,
      contraseña: apiUser.contraseña,
      fecha_de_nacimiento: new Date(apiUser.fecha_de_nacimiento),
      numero_telefono: apiUser.numero_telefono,
      sexo: apiUser.sexo,
      tipo: apiUser.tipo,
      escolaridad: apiUser.escolaridad || undefined,
      especialidad: apiUser.especialidad || undefined,
      domicilio: apiUser.domicilio,
      codigo_postal: apiUser.codigo_postal
    };
  }
}