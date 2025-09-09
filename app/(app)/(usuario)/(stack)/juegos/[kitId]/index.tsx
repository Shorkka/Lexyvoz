import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { router } from 'expo-router';

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  estimatedTime: string;
}

const ExerciseIndex = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const exercises: Exercise[] = [
    {
      id: 'reading',
      title: 'Ejercicio de Lectura',
      description: 'Practica comprensión lectora con preguntas interactivas',
      icon: 'book-outline',
      color: '#4CAF50',
      route: '/juegos/lectura',
      difficulty: 'Fácil',
      estimatedTime: '5-10 min'
    },
    {
      id: 'writing',
      title: 'Ejercicio de Escritura',
      description: 'Desarrolla tus habilidades de escritura con ejercicios guiados',
      icon: 'create-outline',
      color: '#2196F3',
      route: '/juegos/escrito',
      difficulty: 'Medio',
      estimatedTime: '10-15 min'
    },
    {
      id: 'audio',
      title: 'Ejercicio de Pronunciación',
      description: 'Mejora tu pronunciación con grabación de voz',
      icon: 'mic-outline',
      color: '#FF9800',
      route: '/juegos/visual',
      difficulty: 'Medio',
      estimatedTime: '5-8 min'
    }
  ];

  const handleNavigate = (exercise: Exercise) => {
    router.navigate(exercise.route as any);
  };

  const markAsCompleted = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  const getProgress = () => {
    return (completedExercises.length / exercises.length) * 100;
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.header}>
                <ThemedText style={styles.title}>Centro de Ejercicios</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Ejercicios diseñados para ayudar con la dislexia
                </ThemedText>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${getProgress()}%` }]} 
                    />
                  </View>
                  <ThemedText style={styles.progressText}>
                    {completedExercises.length} / {exercises.length} completados
                  </ThemedText>
                </View>
              </View>

              <View style={styles.exercisesContainer}>
                {exercises.map((exercise) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={[styles.iconContainer, { backgroundColor: exercise.color }]}>
                      <Ionicons name={exercise.icon} size={32} color="white" />
                    </View>
                    
                    <View style={styles.exerciseInfo}>
                      <ThemedText style={styles.exerciseTitle}>{exercise.title}</ThemedText>
                      <ThemedText style={styles.exerciseDescription}>
                        {exercise.description}
                      </ThemedText>
                      
                      <View style={styles.exerciseDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons name="time-outline" size={16} color="#666" />
                          <ThemedText style={styles.detailText}>{exercise.estimatedTime}</ThemedText>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="speedometer-outline" size={16} color="#666" />
                          <ThemedText style={styles.detailText}>{exercise.difficulty}</ThemedText>
                        </View>
                      </View>
                    </View>

                    <View style={styles.actionContainer}>
                      {completedExercises.includes(exercise.id) && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color="#4CAF50" 
                          style={styles.completedIcon}
                        />
                      )}
                      <ThemedButton
                        onPress={() => handleNavigate(exercise)}
                        style={[styles.startButton, { backgroundColor: exercise.color }]}
                      >
                        <ThemedText style={styles.startButtonText}>
                          {completedExercises.includes(exercise.id) ? 'Repetir' : 'Comenzar'}
                        </ThemedText>
                      </ThemedButton>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <ThemedButton
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={20} color="white" />
                  <ThemedText style={styles.backButtonText}>Volver</ThemedText>
                </ThemedButton>
              </View>
            </ScrollView>
          </ThemedBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    opacity: 0.9,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
  },
  exercisesContainer: {
    gap: 20,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    alignItems: 'center',
    gap: 10,
  },
  completedIcon: {
    marginBottom: 10,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#666',
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ExerciseIndex;