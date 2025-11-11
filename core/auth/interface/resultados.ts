

export interface ResultadoLecturaPayload {
  usuario_id: number;
  ejercicio_id: number;      
  id_reactivo: number;
  kit_id: number;          
  tiempo_respuesta: number;
  voz_usuario_url?: string;  
  probabilidad: number;
}

export interface ResponseLectura {
  message:   string;
  resultado: Resultado;
}

export interface Resultado {
  resultado_id:     number;
  usuario_id:       number;
  reactivo_id:      number;
  tiempo_respuesta: number;
  es_correcto:      boolean;
  voz_usuario_url:  string;
  ia_respuesta:     IaRespuesta;
}

export interface IaRespuesta {
  clase:         string;
  probabilidad:  number;
  transcripcion: string;
}
