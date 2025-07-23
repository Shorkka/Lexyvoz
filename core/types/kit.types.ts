
export interface KitData {
  id: string;
  kitNumber: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  isAssigned: boolean;
  showPlayButton: boolean;
  createdByDoctor: string;
  doctorId: string;
  assignedDate: string;
  completedDate?: string;
  exercises: Exercise[];
  estimatedDuration: number; // en minutos
  category: 'reading' | 'writing' | 'phonetics' | 'comprehension';
}

export interface Exercise {
  id: string;
  type: 'word-recognition' | 'syllable-separation' | 'reading-comprehension' | 'phonetic-awareness';
  title: string;
  instructions: string;
  content: any; // Contenido específico según el tipo de ejercicio
  timeLimit?: number; // en segundos
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
}

export interface PatientKitAssignment {
  patientId: string;
  kitId: string;
  assignedBy: string;
  assignedDate: string;
  dueDate?: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // porcentaje de 0 a 100
  attempts: number;
  lastAttemptDate?: string;
  score?: number;
}

export interface KitCreationData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'reading' | 'writing' | 'phonetics' | 'comprehension';
  exercises: Omit<Exercise, 'id'>[];
  estimatedDuration: number;
  targetPatients?: string[]; // IDs de pacientes a los que se asignará automáticamente
}

export interface KitAssignmentData {
  kitId: string;
  patientIds: string[];
  dueDate?: string;
  notes?: string;
}
