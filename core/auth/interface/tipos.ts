export interface TiposKitsResponse {
    success: boolean;
    message: string;
    count?: number;
    data: Datum[];
}

export interface ObtenerTiposKitResponse {
    success: boolean;
    message: string;
    count?: number;
    data: Datum;
}
export interface Datum {
    id_tipo:     number;
    tipo_nombre: string;
    created_at:  Date;
    updated_at:  Date;
}

export interface CrearTipoKit {
    token?: string;
    tipo_nombre: string;
}

export interface ActualizarTipoKit {
    token?: string;
    id_tipo: number;
    tipo_nombre: string;
}
