import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { Data } from '@/core/auth/interface/ejercicios';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ReactivosView from '@/presentation/theme/components/ReactivosView';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Modality = 'lectura' | 'escrito' | 'visual' | null;

const tipoMap: Record<Exclude<Modality, null>, number> = {
  lectura: 1,
  escrito: 2,
  visual: 3,
};

const CreateKits = () => {
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;
  const press = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');

  const [modality, setModality] = useState<Modality>(null);
  const [selectedExercises, setSelectedExercises] = useState<Data[]>([]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleCreateKit = () => {
    const modalityId = modality ? tipoMap[modality] : null;
    const exerciseIds = selectedExercises.map((e) => e.ejercicio_id);

    router.push({
      pathname: '/(app)/(doctor)/(stack)/kits/(terminardeCrearKit)',
      params: {
        exerciseIds: JSON.stringify(exerciseIds),
        exerciseData: JSON.stringify(selectedExercises),
        modality: modalityId,
      },
    });
  };

  const tipoEjercicioId = modality ? tipoMap[modality] : null;

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            contentContainerStyle={[
              GlobalStyles.scrollContent,
              { flexGrow: 1, justifyContent: 'center' },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.container,
                {
                  flexDirection: isHorizontal ? 'row' : 'column',
                  alignItems: isHorizontal ? 'stretch' : 'center',
                },
              ]}
            >
              {/* PANEL IZQUIERDO */}
              <View
                style={[
                  styles.leftPanel,
                  {
                    width: isHorizontal ? '25%' : '90%',
                    marginBottom: isHorizontal ? 0 : 20,
                    height: isHorizontal ? 'auto' : undefined,
                  },
                ]}
              >
                <ThemedText style={styles.title}>Ejercicios</ThemedText>

                <View style={styles.modalityContainer}>
                  {(['lectura', 'escrito', 'visual'] as Modality[]).map((m) => (
                    <ThemedButton
                      key={m}
                      style={[
                        styles.modalityButton,
                        {
                          backgroundColor: modality === m ? press : '#b1b1b1',
                        },
                      ]}
                      onPress={() => setModality(m)}
                    >
                      <ThemedText style={styles.modalityText}>
                        {capitalize(m || '')}
                      </ThemedText>
                    </ThemedButton>
                  ))}
                </View>
              </View>

              {/* PANEL DERECHO FIJO */}
              <View
                style={[
                  styles.rightPanel,
                  {
                    width: isHorizontal ? '70%' : '95%',
                    minHeight: isHorizontal ? 500 : 450, // 🔹 altura fija consistente
                    maxHeight: isHorizontal ? 520 : 480,
                    alignSelf: 'center',
                  },
                ]}
              >
                <ThemedText style={styles.subtitle}>
                  Vista Previa del Kit
                </ThemedText>

                <ThemedText style={styles.infoText}>
                  Selecciona diferentes reactivos para crear un kit.
                </ThemedText>
                <View style={styles.reactivosContainer}>
                  {tipoEjercicioId ? (
                    <ReactivosView
                      tipo_id={tipoEjercicioId}
                      setSelectedExercises={setSelectedExercises}
                    />
                  ) : (
                    <View style={styles.centerContainer}>
                      <ThemedText style={{ color: 'white' }}>
                        Selecciona una modalidad para ver los ejercicios
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* BOTÓN CREAR KIT */}
            <View
              style={[
                styles.createKitWrapper,
                {
                  alignItems: isHorizontal ? 'flex-end' : 'center',
                  marginRight: isHorizontal ? 40 : 0,
                },
              ]}
            >
              <ThemedButton
                style={[
                  styles.createKitBtn,
                  {
                    backgroundColor:
                      selectedExercises.length > 0 && modality
                        ? '#ee7200'
                        : '#b1b1b1',
                    width: isHorizontal ? 220 : '100%',
                  },
                ]}
                onPress={handleCreateKit}
                disabled={selectedExercises.length === 0 || !modality}
              >
                <ThemedText style={styles.createKitText}>Crear Kit</ThemedText>
              </ThemedButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcc3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
  },
  leftPanel: {
    backgroundColor: '#FFA500',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 350,
    ...Platform.select({
      android: { elevation: 4 },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  rightPanel: {
    backgroundColor: '#FFA500',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    ...Platform.select({
      android: { elevation: 4 },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  modalityContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    margin: 20,
  },
  modalityButton: {
    width: '100%',
    height: 50, 
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 22,
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  reactivosContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  createKitWrapper: {
    marginTop: 30,
  },
  createKitBtn: {
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    bottom: 20,
    alignItems: 'center',
  },
  createKitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
});

export default CreateKits;
