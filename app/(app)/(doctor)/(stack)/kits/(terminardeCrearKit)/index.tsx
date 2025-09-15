import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { CrearKitsConEjercicioResponse } from '@/infraestructure/interface/kits-actions';
import { Data } from '@/core/auth/interface/ejercicios'; // Importar la interfaz
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Platform, Alert } from 'react-native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

// Mapeo de modalidades
const modalidadMap: Record<number, string> = {
  1: 'Lectura',
  2: 'Escritura', 
  3: 'Visual'
};

const TerminarDeCrearKit = () => {
  const { exerciseIds, exerciseData, modality, } = useLocalSearchParams();
  const cardColor = useThemeColor({}, 'primary');
  const {user} = useAuthStore();
  const [nombreKit, setNombreKit] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const { crearKitConEjerciciosMutation } = useKitsStore();
  const { mutateAsync: crearKit, isPending: isLoading } = crearKitConEjerciciosMutation;

  const parsedIds = exerciseIds ? JSON.parse(exerciseIds as string) : [];
  
  // Obtener los datos reales de los ejercicios en lugar de los de ejemplo
  const ejerciciosSeleccionados: Data[] = exerciseData 
    ? JSON.parse(exerciseData as string) 
    : [];

  const modalityId = Number(modality);
  const modalidadNombre = modalidadMap[modalityId] || 'Desconocida';

  const calcularDuracionTotal = () => {
    return ejerciciosSeleccionados.reduce((total, ejercicio) => {
      return total + ((ejercicio as any).duration || 5); // 5 minutos por defecto
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
      // Preparar datos para la mutación
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
      console.log('Datos del kit a crear:', kitData);
      // Llamar a la mutación
      await crearKit(kitData);

      Alert.alert('Éxito', 'Kit creado correctamente', [
        { 
          text: 'OK', 
          onPress: () => router.replace('/(app)/(doctor)/(stack)/main')
        }
      ]);

    } catch (error: any) {
      console.error('Error creando kit:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el kit');
    }
  };

  return (
    <AuthGuard>
      <ThemedBackground
        justifyContent="space-between"
        fullHeight
        backgroundColor="#fba557"
        style={[GlobalStyles.orangeBackground, { padding: 16 }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Terminar de Crear Kit
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Completa la información del kit
            </ThemedText>
          </View>

          {/* Contenedor principal de dos columnas */}
          <View style={styles.mainContainer}>
            
            {/* Columna izquierda: Información del kit y resumen */}
            <View style={styles.leftColumn}>
              {/* Información del kit */}
              <View style={[styles.card, { backgroundColor: cardColor }]}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Información del Kit
                </ThemedText>
                
                <ThemedTextInput
                  placeholder="Nombre del kit *"
                  value={nombreKit}
                  onChangeText={setNombreKit}
                  style={styles.input}
                />
                
                <ThemedTextInput
                  placeholder="Descripción (opcional)"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textArea]}
                />
              </View>

              {/* Resumen de selección */}
              <View style={[styles.card, { backgroundColor: cardColor }]}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Resumen de Selección
                </ThemedText>

                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Modalidad:</ThemedText>
                  <ThemedText style={styles.infoValue}>{modalidadNombre}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Ejercicios seleccionados:</ThemedText>
                  <ThemedText style={styles.infoValue}>{ejerciciosSeleccionados.length}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Duración estimada:</ThemedText>
                  <ThemedText style={styles.infoValue}>{calcularDuracionTotal()} minutos</ThemedText>
                </View>
              </View>

              {/* Botones de acción */}
              <View style={styles.actionsContainer}>
                <ThemedButton
                  onPress={() => router.back()}
                  style={[styles.button, styles.cancelButton]}
                  disabled={isLoading}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancelar
                  </ThemedText>
                </ThemedButton>

                <ThemedButton
                  onPress={handleCrearKit}
                  disabled={isLoading || !nombreKit.trim() || ejerciciosSeleccionados.length === 0}
                  style={[
                    styles.button,
                    styles.createButton,
                    (isLoading || !nombreKit.trim() || ejerciciosSeleccionados.length === 0) && styles.createButtonDisabled
                  ]}
                >
                  <ThemedText style={styles.createButtonText}>
                    {isLoading ? 'Creando...' : 'Crear Kit'}
                  </ThemedText>
                </ThemedButton>
              </View>
            </View>

            {/* Columna derecha: Lista de ejercicios seleccionados */}
            <View style={styles.rightColumn}>
              {ejerciciosSeleccionados.length > 0 && (
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Ejercicios Incluidos
                  </ThemedText>
                  
                  <View style={styles.listaEjercicios}>
                    {ejerciciosSeleccionados.map((ejercicio, index) => (
          <View key={ejercicio.ejercicio_id} style={styles.ejercicioItem}>
                        <View style={styles.ejercicioHeader}>
                          <ThemedText style={styles.ejercicioTitulo}>
                            {index + 1}. {ejercicio.titulo}
                          </ThemedText>
                        </View>
                        <View style={styles.ejercicioDetalles}>
                          <ThemedText style={styles.ejercicioTipo}>
                            {modalidadNombre}
                          </ThemedText>
                          <ThemedText style={styles.ejercicioDuracion}>
                            {((ejercicio as any).duracion || 5)} min
                          </ThemedText>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ThemedBackground>
    </AuthGuard>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    color: '#000',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  leftColumn: {
    width: '48%',
    flexDirection: 'column',
  },
  rightColumn: {
    width: '48%',
    flexDirection: 'column',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontWeight: '500',
    color: '#000',
  },
  infoValue: {
    fontWeight: '600',
    color: '#000',
  },
  listaEjercicios: {
    gap: 12,
    maxHeight: 400,
  },ejercicioItem: {
  padding: 16,
  borderRadius: 10,
  backgroundColor: '#fff',
  borderWidth: 2,
  borderColor: '#ee7200', // borde naranja
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
},

ejercicioHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

ejercicioTitulo: {
  fontWeight: '600',
  fontSize: 14,
  color: '#333',
  flex: 1,
},

ejercicioDetalles: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

ejercicioTipo: {
  fontSize: 12,
  color: '#ee7200', // mismo naranja que el borde
  fontWeight: '500',
},

ejercicioDuracion: {
  fontSize: 12,
  color: '#666',
  fontWeight: '500',
},
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#ee7200',
  },
  createButtonDisabled: {
    backgroundColor: '#b1b1b1',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TerminarDeCrearKit;