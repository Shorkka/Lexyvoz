import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WritingExercise {
  id: number;
  prompt: string;
  hint: string;
  expectedLength: number;
  dyslexiaTips: string;
}

const WritingGameScreen = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userText, setUserText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const router = useRouter();

  const exercises: WritingExercise[] = [
    {
      id: 1,
      prompt: "Lee y copia esta palabra: 'CASA'",
      hint: "Observa cada letra cuidadosamente antes de escribir",
      expectedLength: 1,
      dyslexiaTips: "Para la dislexia: Separa la palabra en sílabas: CA-SA. Usa papel de colores para reducir el contraste."
    },
    {
      id: 2,
      prompt: "Escribe la palabra 'ELEFANTE' al revés",
      hint: "Empieza desde la última letra hacia la primera",
      expectedLength: 1,
      dyslexiaTips: "Para la dislexia: Este ejercicio ayuda a mejorar la conciencia fonológica. Pronuncia cada letra en voz alta mientras escribes."
    },
    {
      id: 3,
      prompt: "Completa la palabra: P_R_O",
      hint: "Piensa en un animal que trepa árboles",
      expectedLength: 1,
      dyslexiaTips: "Para la dislexia: Asocia la palabra con una imagen mental. ¿Qué animal conoces que tenga esta descripción?"
    },
    {
      id: 4,
      prompt: "Escribe tres palabras que riman con 'SOL'",
      hint: "Por ejemplo: col, rol, mol...",
      expectedLength: 3,
      dyslexiaTips: "Para la dislexia: Las rimas ayudan a reconocer patrones de sonidos en las palabras."
    }
  ];

  const current = exercises[currentExercise];

  const handleComplete = () => {
    if (userText.trim().length >= current.expectedLength) {
      const newCompleted = exercisesCompleted + 1;
      setExercisesCompleted(newCompleted);
      
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserText('');
        setShowHint(false);
      } else {
        // Todos los ejercicios completados
        Alert.alert(
          "¡Felicidades!",
          "Has completado todos los ejercicios",
          [
            {
              text: "OK",
              onPress: () => router.replace('/juegos/[kitId]')
            }
          ]
        );
      }
    }
  };

  const handleExit = () => {
    Alert.alert(
      "Salir",
      "¿Estás seguro de que quieres salir? Tu progreso no se guardará.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Salir",
          onPress: () => router.replace('/juegos/[kitId]')
        }
      ]
    );
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserText('');
      setShowHint(false);
    }
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <ScrollView contentContainerStyle={styles.container}>
              <ThemedText style={styles.title}>Ejercicio para Dislexia</ThemedText>
              
              <View style={styles.progressIndicator}>
                <ThemedText style={styles.progressText}>
                  Ejercicio {currentExercise + 1} de {exercises.length}
                </ThemedText>
              </View>
              
              <View style={styles.exerciseContainer}>
                <ThemedText style={styles.prompt}>{current.prompt}</ThemedText>
                
                <ThemedButton
                  onPress={() => setShowHint(!showHint)}
                  style={styles.hintButton}
                >
                  <Ionicons name="bulb-outline" size={20} color="white" />
                  <ThemedText style={styles.hintButtonText}>
                    {showHint ? 'Ocultar ayuda' : 'Mostrar ayuda'}
                  </ThemedText>
                </ThemedButton>

                {showHint && (
                  <View style={styles.hintContainer}>
                    <ThemedText style={styles.hintText}>{current.hint}</ThemedText>
                    <ThemedText style={styles.dyslexiaTip}>{current.dyslexiaTips}</ThemedText>
                  </View>
                )}

                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="Escribe aquí..."
                  value={userText}
                  onChangeText={setUserText}
                  textAlignVertical="top"
                />

                <View style={styles.progressContainer}>
                  <ThemedText style={styles.progressText}>
                    Palabras: {userText.trim().split(/\s+/).filter(word => word.length > 0).length}
                  </ThemedText>
                  <ThemedText style={styles.progressText}>
                    Mínimo: {current.expectedLength} palabras
                  </ThemedText>
                </View>

                <View style={styles.buttonsContainer}>
                  <ThemedButton
                    onPress={handleExit}
                    style={[styles.button, styles.exitButton]}
                  >
                    <ThemedText style={styles.buttonText}>Salir</ThemedText>
                  </ThemedButton>
                  
                  <ThemedButton
                    onPress={handleNext}
                    style={[styles.button, styles.nextButton]}
                    disabled={currentExercise === exercises.length - 1}
                  >
                    <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
                  </ThemedButton>
                  
                  <ThemedButton
                    onPress={handleComplete}
                    style={[styles.button, styles.completeButton, { opacity: userText.trim().length < current.expectedLength ? 0.5 : 1 }]}
                    disabled={userText.trim().length < current.expectedLength}
                  >
                    <ThemedText style={styles.buttonText}>
                      {currentExercise === exercises.length - 1 ? 'Finalizar' : 'Completar'}
                    </ThemedText>
                  </ThemedButton>
                </View>

                {currentExercise === exercises.length - 1 && exercisesCompleted === exercises.length && (
                  <ThemedText style={styles.completionText}>¡Excelente trabajo!</ThemedText>
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
    marginBottom: 15,
    color: '#fff',
  },
  progressIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 15,
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
  prompt: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  hintButtonText: {
    fontSize: 16,
    color: 'white',
  },
  hintContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  hintText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  dyslexiaTip: {
    fontSize: 14,
    color: '#e65100',
    fontStyle: 'italic',
  },
  textInput: {
    minHeight: 150,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  nextButton: {
    backgroundColor: '#2196f3',
  },
  completeButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WritingGameScreen;