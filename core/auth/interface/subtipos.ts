export interface SubTiposResponse {
    success: boolean;
    message: string;
    count:   number;
    data:    SubTipo[];
}

export interface SubTipo {
    id_sub_tipo:     number;
    sub_tipo_nombre: string;
    tipo_id:         number;
    tipo_nombre:     string;
    created_at:      Date;
    updated_at:      Date;
}


export interface SubTipoIDResponse {
    success: boolean;
    message: string;
    data:    SubTipo;
}

export interface SubTipoConteoPorTipo {
    success: boolean;
    message: string;
    count:   number;
    data:    Conteo[];
}

export interface Conteo {
    id_tipo:        number;
    tipo_nombre:    string;
    total_subtipos: number;
}
export interface EstadisticasSubTiposResponse {
    success: boolean;
    message: string;
    data:    Data;
}

export interface Data {
    existe:  boolean;
    nombre:  string;
    tipo_id: number;
}

