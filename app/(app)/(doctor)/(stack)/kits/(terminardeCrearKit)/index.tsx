import { CrearKitsConEjercicioResponse } from '@/infraestructure/interface/kits-actions';
import { Data } from '@/core/auth/interface/ejercicios';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const modalidadMap: Record<number, string> = {
  1: 'Lectura',
  2: 'Escritura',
  3: 'Visual',
};

const TerminarDeCrearKit = () => {
  const { exerciseIds, exerciseData, modality } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [nombreKit, setNombreKit] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const { crearKitConEjerciciosMutation } = useKitsStore();
  const { mutateAsync: crearKit, isPending: isLoading } = crearKitConEjerciciosMutation;

  const parsedIds = exerciseIds ? JSON.parse(exerciseIds as string) : [];
  const ejerciciosSeleccionados: Data[] = exerciseData ? JSON.parse(exerciseData as string) : [];

  const modalityId = Number(modality);
  const modalidadNombre = modalidadMap[modalityId] || 'Desconocida';

  const calcularDuracionTotal = () => {
    return ejerciciosSeleccionados.reduce((total, ejercicio) => {
      return total + ((ejercicio as any).duration || 5);
    }, 0);
  };

  const handleCrearKit = async () => {
    if (!nombreKit.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el kit');
      return;
    }
    if (ejerciciosSeleccionados.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un ejercicio');
      return;
    }

    try {
      const kitData: CrearKitsConEjercicioResponse = {
        name: nombreKit.trim(),
        descripcion: descripcion.trim(),
        creado_por: user?.doctor_id || 0,
        ejercicios: parsedIds.map((id: number, index: number) => ({
          ejercicio_id: id,
          orden: index + 1,
        })),
        activo: true,
      };
      await crearKit(kitData);
      Alert.alert('Éxito', 'Kit creado correctamente', [
        { text: 'OK', onPress: () => router.replace('/(app)/(doctor)/(stack)/main') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el kit');
    }
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 , backgroundColor: '#fffcc3'}}>
      <ThemedBackground
        justifyContent="flex-start"
        fullHeight
        backgroundColor="#e1944e"
        style={{ paddingVertical: 30, paddingHorizontal: 20 }}
      >

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            {/* COLUMNA 1: Edición */}
            <View style={styles.leftColumn}>
              <ThemedText style={styles.label}>Nombre del kit</ThemedText>
              <ThemedTextInput
                placeholder="Escribe el nombre del kit"
                value={nombreKit}
                onChangeText={setNombreKit}
                style={styles.input}
              />

              <ThemedText style={styles.label}>Descripción</ThemedText>
              <ThemedTextInput
                placeholder="Agrega una descripción (opcional)"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />

              <ThemedText style={styles.summaryText}>
                Ejercicios seleccionados: {ejerciciosSeleccionados.length}
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                Duración: {calcularDuracionTotal()} min
              </ThemedText>

              <ThemedButton
                onPress={handleCrearKit}
                disabled={isLoading || !nombreKit.trim() || ejerciciosSeleccionados.length === 0}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor:
                      !nombreKit.trim() || ejerciciosSeleccionados.length === 0
                        ? '#b1b1b1'
                        : '#ee7200',
                  },
                ]}
              >
                <ThemedText style={styles.saveButtonText}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </ThemedText>
              </ThemedButton>
            </View>

            {/* COLUMNA 2: Lista personalizada */}
            <View style={styles.centerColumn}>
              <ThemedText style={styles.columnTitle}>Lista personalizada</ThemedText>
              <View style={styles.cardContainer}>
                {ejerciciosSeleccionados.map((ejercicio, index) => (
                  <View key={ejercicio.ejercicio_id} style={styles.exerciseCard}>
                    <ThemedText style={styles.exerciseText}>
                      Ejercicio {index + 1} · Tipo: {modalidadNombre}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* COLUMNA 3: Tipos de ejercicios */}
            <View style={styles.rightColumn}>
              <ThemedText style={styles.columnTitle}>Ejercicios disponibles</ThemedText>
              <View style={styles.cardContainer}>
                {['Lectura', 'Escritura', 'Visual'].map((tipo) => (
                  <View key={tipo} style={styles.exerciseCard}>
                    <ThemedText style={styles.exerciseText}>{tipo}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedBackground>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingRight: 20,
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    height: '100%',
    maxWidth: 1200,
    gap: 20,
  },
  leftColumn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ffa500',
  },
  centerColumn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ffa500',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ffa500',
  },
  label: {
    color: '#000',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryText: {
    marginTop: 4,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
  },
  exerciseCard: {
    backgroundColor: '#f0780a',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  exerciseText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TerminarDeCrearKit;
