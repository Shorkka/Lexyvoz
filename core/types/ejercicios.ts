export const TIPOS_EJERCICIO = {
  LECTURA: 1,
  ESCRITURA: 2,
  VISUAL: 3,
} as const;

export const NOMBRES_TIPOS: Record<number, string> = {
  1: 'Lectura',
  2: 'Escritura', 
  3: 'Visual',
};

export const COLORES_TIPOS: Record<number, string> = {
  1: '#4CAF50', // Verde para lectura
  2: '#2196F3', // Azul para escritura
  3: '#FF9800', // Naranja para visual
};