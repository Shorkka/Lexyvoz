export class UserMapper {
  static fromApiToEntity(apiUser: any) {
    return {
      usuario_id: apiUser.usuario_id,
      nombre: apiUser.nombre,
      correo: apiUser.correo,
      fecha_de_nacimiento: new Date(apiUser.fecha_de_nacimiento),
      numero_telefono: apiUser.numero_telefono,
      sexo: apiUser.sexo,
      tipo: apiUser.tipo,
      escolaridad: apiUser.escolaridad || undefined,
      especialidad: apiUser.especialidad || undefined,
      domicilio: apiUser.domicilio || undefined,
      codigo_postal: apiUser.codigo_postal || undefined,
      imagen_url: apiUser.imagen_url || undefined,
      doctor_id: apiUser.doctor_id || undefined
    };
  }
}