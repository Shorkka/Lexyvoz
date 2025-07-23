export interface User {
    usuario_id: number;
    nombre:              string;
    correo:              string;
    contraseña:          string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    domicilio:           string;
}
