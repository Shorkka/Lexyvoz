import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearLecturaPalabra } from "../interface/lectura-palabra-actions";

interface lecturaPalabraBody{
      usuario_id?: number,
    id_reactivo?: number,
    tiempo_respuesta?: number,
    es_correcto?: boolean,
    fecha_realizacion?: string,
    audio?: string    
}

const useLecturaPalabraStore = () => {
    const queryClient = useQueryClient();


    const createecturaPalabraMutation =  useMutation({
       mutationFn: (keyData: lecturaPalabraBody) => 
      crearLecturaPalabra(
          keyData.usuario_id,
          keyData.id_reactivo,
          keyData.tiempo_respuesta,
          keyData.es_correcto,
          keyData.fecha_realizacion,
          keyData.audio
    ),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["Lectura"] });
    },
    })
      

  return (
    createecturaPalabraMutation
  )
}

export default useLecturaPalabraStore