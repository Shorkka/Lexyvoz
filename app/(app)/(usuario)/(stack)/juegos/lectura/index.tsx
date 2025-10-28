import React, { useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReadingExercise {
  id: number;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const ReadingGameScreen = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Datos de ejemplo para ejercicios de lectura
  const exercises: ReadingExercise[] = [
    {
      id: 1,
      text: "El gato corre por el jardín. Le gusta jugar con una pelota roja.",
      question: "¿Qué le gusta al gato?",
      options: ["Dormir", "Jugar con una pelota", "Comer pescado", "Saltar"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "María tiene un perro llamado Max. Max es muy cariñoso y le gusta lamer la cara a María.",
      question: "¿Cómo se llama el perro de María?",
      options: ["Luna", "Max", "Rocky", "Toby"],
      correctAnswer: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === exercises[currentExercise].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const current = exercises[currentExercise];

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <ScrollView contentContainerStyle={styles.container}>
              <ThemedText style={styles.title}>Ejercicio de Lectura</ThemedText>
              
              <View style={styles.exerciseContainer}>
                <ThemedText style={styles.readingText}>{current.text}</ThemedText>
                
                <ThemedText style={styles.question}>{current.question}</ThemedText>
                
                <View style={styles.optionsContainer}>
                  {current.options.map((option, index) => (
                    <ThemedButton
                      key={index}
                      onPress={() => handleAnswer(index)}
                      style={[
                        styles.optionButton,
                        selectedAnswer === index && styles.selectedOption,
                        showResult && index === current.correctAnswer && styles.correctOption,
                        showResult && selectedAnswer === index && index !== current.correctAnswer && styles.wrongOption
                      ]}
                      disabled={showResult}
                    >
                      <ThemedText style={styles.optionText}>{option}</ThemedText>
                    </ThemedButton>
                  ))}
                </View>

                {showResult && (
                  <View style={styles.resultContainer}>
                    <ThemedText style={styles.scoreText}>
                      Puntuación: {score}/{exercises.length}
                    </ThemedText>
                    {currentExercise < exercises.length - 1 ? (
                      <ThemedButton onPress={nextExercise} style={styles.nextButton}>
                        <Ionicons name="arrow-forward" size={24} color="white" />
                        <ThemedText style={styles.nextButtonText}>Siguiente</ThemedText>
                      </ThemedButton>
                    ) : (
                      <ThemedText style={styles.finalText}>¡Ejercicio completado!</ThemedText>
                    )}
                  </View>
                )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
  },
  exerciseContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingText: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 20,
    color: '#333',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#444',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#ee7200',
    backgroundColor: '#fff3e0',
  },
  correctOption: {
    backgroundColor: '#4caf50',
  },
  wrongOption: {
    backgroundColor: '#f44336',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
  },
  finalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
});

export default ReadingGameScreen;