export interface Escrito{
    texto: string;
}

export interface EjercicioRequerimiento{
    nombre: string;
    descripcion: string;
}

export interface EscrituraImagenPalabra{
    palabra: string;
    imagen: string; // URL o base64 
}

export interface EscrituraReordenamiento{
    oracion: string;
}

export interface igualDiferente{
    pregunta: string;
    opciones: string[];
}

export interface imagenCorrecto{
    imagen: string; // URL o base64
    respuesta: string;
}

export interface imagenes{
    reactivoId: string;
    url: string;
}

export interface palabraMalEscrito{
    palabra: string;
    correccion: string;
}

export interface pares{
    elementoA: string;
    elementoB: string;
}

export interface visual{
    descripcion: string;
}

