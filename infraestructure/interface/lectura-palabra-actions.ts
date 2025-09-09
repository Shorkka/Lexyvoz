import { productsApi } from "@/core/auth/api/productsApi";

export interface LecturaPalabraResponse {
    message:   string;
    resultado: Resultado;
}

export interface Resultado {
    resultado_reactivo_usuario_id: number;
    usuario_id:                    number;
    id_reactivo:                   number;
    voz_usuario_url:               string;
    tiempo_respuesta:              number;
    es_correcto:                   boolean;
    fecha_realizacion:             Date;
    created_at:                    Date;
    updated_at:                    Date;
}


// Respuesta de la lectura por audio de una palabra

export const crearLecturaPalabra = async (
    usuario_id?: number,
    id_reactivo?: number,
    tiempo_respuesta?: number,
    es_correcto?: boolean,
    fecha_realizacion?: string,
    audio?: string            
) =>{
    try{
        const {data} = await productsApi.post<LecturaPalabraResponse>('/reactivo/resultados-lectura-pseudopalabras',
            {
                usuario_id,
                id_reactivo,
                tiempo_respuesta,
                es_correcto,
                fecha_realizacion,
                audio,
            }
        );
        return data;
    }catch(error){
        return error;
    }
}