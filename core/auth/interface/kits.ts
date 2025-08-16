export interface CreateKit {
        nombre: string;
        descripcion: string;
        creado_por: number;
}
export interface KitAsignadoAlUsuario {
    kit_id:     string;
    usuario_id: string;
    estado:     string;
}
export interface EjerciciosKits {
    kitId:       string;
    ejercicioId: string;
}
