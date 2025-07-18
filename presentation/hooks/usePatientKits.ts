import { useCallback, useEffect, useState } from 'react';
import { KitData } from '../../core/types/kit.types';

/**
 * Hook personalizado para manejar los kits del paciente
 * 
 * Este hook maneja la lógica de obtener, filtrar y organizar los kits
 * que han sido creados por el doctor y asignados al paciente actual.
 */

// Datos temporales hasta que se conecte con la API del doctor
const mockKits: KitData[] = [
  {
    id: '1',
    kitNumber: 1,
    title: 'Reconocimiento de Palabras Básicas',
    description: 'Ejercicios para mejorar el reconocimiento de palabras comunes',
    difficulty: 'easy',
    isCompleted: true,
    isAssigned: true,
    showPlayButton: false,
    createdByDoctor: 'Dr. García',
    doctorId: 'doc-001',
    assignedDate: '2024-01-15',
    completedDate: '2024-01-20',
    exercises: [],
    estimatedDuration: 15,
    category: 'reading'
  },
  {
    id: '2',
    kitNumber: 2,
    title: 'Separación de Sílabas',
    description: 'Práctica de división silábica',
    difficulty: 'medium',
    isCompleted: false,
    isAssigned: true,
    showPlayButton: false,
    createdByDoctor: 'Dr. García',
    doctorId: 'doc-001',
    assignedDate: '2024-01-22',
    exercises: [],
    estimatedDuration: 20,
    category: 'phonetics'
  },
  {
    id: '3',
    kitNumber: 3,
    title: 'Comprensión Lectora',
    description: 'Ejercicios de comprensión de textos cortos',
    difficulty: 'medium',
    isCompleted: false,
    isAssigned: true,
    showPlayButton: true,
    createdByDoctor: 'Dr. García',
    doctorId: 'doc-001',
    assignedDate: '2024-01-25',
    exercises: [],
    estimatedDuration: 25,
    category: 'comprehension'
  },
  {
    id: '4',
    kitNumber: 4,
    title: 'Escritura Guiada',
    description: 'Práctica de escritura con plantillas',
    difficulty: 'hard',
    isCompleted: true,
    isAssigned: true,
    showPlayButton: false,
    createdByDoctor: 'Dr. García',
    doctorId: 'doc-001',
    assignedDate: '2024-01-10',
    completedDate: '2024-01-18',
    exercises: [],
    estimatedDuration: 30,
    category: 'writing'
  },
  {
    id: '5',
    kitNumber: 5,
    title: 'Conciencia Fonológica',
    description: 'Ejercicios de sonidos y fonemas',
    difficulty: 'easy',
    isCompleted: true,
    isAssigned: true,
    showPlayButton: false,
    createdByDoctor: 'Dr. García',
    doctorId: 'doc-001',
    assignedDate: '2024-01-05',
    completedDate: '2024-01-12',
    exercises: [],
    estimatedDuration: 18,
    category: 'phonetics'
  }
];

export const usePatientKits = (patientId: string) => {
  const [assignedKits, setAssignedKits] = useState<KitData[]>([]);
  const [completedKits, setCompletedKits] = useState<KitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientKits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Reemplazar con llamada real a la API
      // const response = await fetch(`/api/patients/${patientId}/kits`);
      // const kits = await response.json();
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assigned = mockKits.filter(kit => kit.isAssigned && !kit.isCompleted);
      const completed = mockKits.filter(kit => kit.isCompleted);
      
      setAssignedKits(assigned);
      setCompletedKits(completed);
    } catch (err) {
      setError('Error al cargar los kits del paciente');
      console.error('Error fetching patient kits:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshKits = () => {
    fetchPatientKits();
  };

  const markKitAsCompleted = async (kitId: string) => {
    try {
      // TODO: Implementar llamada a API para marcar como completado
      // await fetch(`/api/kits/${kitId}/complete`, { method: 'POST' });
      
      // Actualizar estado local temporalmente
      const kit = assignedKits.find(k => k.id === kitId);
      if (kit) {
        const updatedKit = { ...kit, isCompleted: true, completedDate: new Date().toISOString() };
        setAssignedKits(prev => prev.filter(k => k.id !== kitId));
        setCompletedKits(prev => [...prev, updatedKit]);
      }
    } catch (err) {
      console.error('Error marking kit as completed:', err);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientKits();
    }
  }, [patientId]);

  return {
    assignedKits,
    completedKits,
    isLoading,
    error,
    refreshKits,
    markKitAsCompleted
  };
};
