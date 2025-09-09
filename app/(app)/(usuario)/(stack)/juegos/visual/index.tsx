import React, { useState, useEffect } from 'react';
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
import { Audio } from 'expo-av';
import ThemedVozButton from '@/presentation/theme/components/ThemedVozButton';

interface AudioExercise {
  id: number;
  instruction: string;
  wordToPronounce: string;
  phoneticHint: string;
}

const AudioGameScreen = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [playbackSound, setPlaybackSound] = useState<Audio.Sound | null>(null);

  const exercises: AudioExercise[] = [
    {
      id: 1,
      instruction: "Presiona el botón para grabar y pronuncia la siguiente palabra:",
      wordToPronounce: "Mariposa",
      phoneticHint: "Ma-ri-po-sa"
    },
    {
      id: 1,
      instruction: "Ahora intenta con esta palabra:",
      wordToPronounce: "Biblioteca",
      phoneticHint: "Bi-bli-o-te-ca"
    }
  ];

  const current = exercises[currentExercise];

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (playbackSound) {
        playbackSound.unloadAsync();
      }
    };
  }, [recording, playbackSound]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setHasRecorded(false);
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setHasRecorded(true);
      setRecording(null);
    } catch (err) {
      console.error('Error al detener grabación:', err);
    }
  };

  const playRecording = async () => {
    if (!recording) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recording.getURI()! },
        { shouldPlay: true }
      );
      setPlaybackSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error('Error al reproducir:', err);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setHasRecorded(false);
      setRecording(null);
    }
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <ScrollView contentContainerStyle={styles.container}>
              <ThemedText style={styles.title}>Ejercicio de Pronunciación</ThemedText>
              
              <View style={styles.exerciseContainer}>
                <ThemedText style={styles.instruction}>{current.instruction}</ThemedText>
                
                <View style={styles.wordContainer}>
                  <ThemedText style={styles.word}>{current.wordToPronounce}</ThemedText>
                  <ThemedText style={styles.phoneticHint}>[{current.phoneticHint}]</ThemedText>
                </View>

                <ThemedButton
                  onPress={isRecording ? stopRecording : startRecording}
                  style={[styles.recordButton, isRecording && styles.recordingButton]}
                >
                  <Ionicons 
                    name={isRecording ? "stop-circle" : "mic-circle"} 
                    size={40} 
                    color="white" 
                  />
                  <ThemedText style={styles.recordButtonText}>
                    {isRecording ? 'Detener grabación' : 'Iniciar grabación'}
                  </ThemedText>
                </ThemedButton>

                {hasRecorded && (
                  <View style={styles.playbackContainer}>
                    <ThemedButton onPress={playRecording} style={styles.playButton}>
                      <Ionicons name="play-circle" size={24} color="white" />
                      <ThemedText style={styles.playButtonText}>Escuchar grabación</ThemedText>
                    </ThemedButton>

                    {currentExercise < exercises.length - 1 ? (
                      <ThemedButton onPress={nextExercise} style={styles.nextButton}>
                        <ThemedText style={styles.nextButtonText}>Siguiente palabra</ThemedText>
                      </ThemedButton>
                    ) : (
                      <ThemedText style={styles.completionText}>¡Ejercicio completado!</ThemedText>
                    )}
                  </View>
                )}

                <View style={styles.tipsContainer}>
                  <Ionicons name="information-circle" size={24} color="#ee7200" />
                  <ThemedText style={styles.tipsText}>
                    Habla claramente y toma tu tiempo
                  </ThemedText>
                  <ThemedVozButton/>
                </View>
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
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  phoneticHint: {
    fontSize: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  recordButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  playbackContainer: {
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  playButtonText: {
    fontSize: 16,
    color: 'white',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 20,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  tipsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AudioGameScreen;