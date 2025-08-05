export interface CreateKit {
    nombre:      string;
    descripcion: string;
}
export interface KitAsignadoAlUsuario {
    kitId:     string;
    usuarioId: string;
}
export interface EjerciciosKits {
    kitId:       string;
    ejercicioId: string;
}
