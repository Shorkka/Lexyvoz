import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { Data } from '@/core/auth/interface/ejercicios';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ReactivosView from '@/presentation/theme/components/ReactivosView';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View, StyleSheet, Platform} from 'react-native';

type Modality = 'lectura' | 'escrito' | 'visual' | null;

// 🔹 Mapear modalities con IDs del backend
const tipoMap: Record<Exclude<Modality, null>, number> = {
  lectura: 1,
  escrito: 2,
  visual: 3,
};

const CreateKits = () => {
  const press = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  const [modality, setModality] = useState<Modality>(null);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const [selectedExercises, setSelectedExercises] = useState<Data[]>([]);
  
const handleCreateKit = () => {
  const modalityId = modality ? tipoMap[modality] : null;
  const exerciseIds = selectedExercises.map(e => e.ejercicio_id);

  router.push({
    pathname: '/(app)/(doctor)/(stack)/kits/(terminardeCrearKit)',
    params: { 
      exerciseIds: JSON.stringify(exerciseIds),
      exerciseData: JSON.stringify(selectedExercises),
      modality: modalityId
    }
  });
};

  // Obtener el ID numérico para pasar al componente EjercicioTipoView
  const tipoEjercicioId = modality ? tipoMap[modality] : null;

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView contentContainerStyle={[GlobalStyles.scrollContent, { flex: 1 }]}>
            <View style={styles.container}>
              {/* Primer ThemedBackground (30%) */}
              <View style={{...styles.leftPanel, justifyContent: "flex-start"}}>
                <ThemedText type="title" style={{ color: "white", alignItems: "center"}}>
                  Ejercicios
                </ThemedText>
                <View>
                  {(['lectura', 'escrito', 'visual'] as Modality[]).map((m) => (
                    <ThemedButton
                      key={m}
                      style={{
                        backgroundColor: modality === m ? press : '#b1b1b1',
                        ...styles.button, 
                        top: '50%'
                      }}
                      onPress={() => setModality(m)}
                    >
                      <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
                        {capitalize(m || '')}
                      </ThemedText>
                    </ThemedButton>
                  ))}
                </View>
              </View>
              
              {/* Columna derecha: Contenido dividido en dos subcolumnas */}
              <View style={styles.rightPanel}>
                <ThemedText type="title" style={{color: 'white'}}>
                  Vista Previa del Kit
                </ThemedText>
                <ThemedText style={{color: 'white'}}>
                  Selecciona diferentes reactivos para crear un kit, Manten presionado para ver una vista previa.
                </ThemedText>
                <ThemedText style={{color: 'white'}}>
                  Modalidad seleccionada: {modality ? capitalize(modality) : 'Ninguna'}
                </ThemedText>
                
                <View style={styles.navigationContainer}>
                  {tipoEjercicioId ? (
                    <ReactivosView 
                       tipo_id={tipoEjercicioId}
                       setSelectedExercises={setSelectedExercises}
                    />
                  ) : (
                    <View style={styles.centerContainer}>
                      <ThemedText style={{color: 'white'}}>
                        Selecciona una modalidad para ver los ejercicios
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <ThemedButton 
              style={{
                ...styles.navButton, 
                backgroundColor: selectedExercises.length > 0 && modality ? '#ee7200' : '#b1b1b1',
                alignSelf: 'flex-end', 
                padding: 20, 
                width: '20%', 
                marginRight: 20
              }}
              onPress={handleCreateKit}
              disabled={selectedExercises.length === 0 || !modality}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>
                Crear Kit
              </ThemedText>
            </ThemedButton>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // divide izquierda / derecha
    backgroundColor: "#fefcc3", // fondo general (amarillo claro)
    padding: 20,
  },
    centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  leftPanel: {
    flex: 3, // 30%
    backgroundColor: "#FFA500", // naranja
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginRight: 8,
        ...Platform.select({
          android: {
            elevation: 4,
          },
          web: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6,
              shadowRadius: 5,
          },
        }),
  },
  rightPanel: {
    flex: 7, // 70%
    backgroundColor: "#FFA500", // naranja
    borderRadius: 12,
    padding: 12,
    justifyContent: "flex-start",
    marginBottom: '10%',
        ...Platform.select({
      android: {
        elevation: 4,
      },
      web: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 5,
      },
    }),
  },
  buttonActive: {
    backgroundColor: "darkorange",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "gray",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  exerciseCard: {
    backgroundColor: "white",
    paddingVertical: 20,
    marginVertical: 8,
    borderRadius: 10,
    minWidth: "30%", // 3 por fila
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  paginationBtn: {
    backgroundColor: "darkorange",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 8,
  },
  paginationText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  createKitBtn: {
    backgroundColor: "darkorange",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 8,
    width: "60%",
    alignItems: "center",
  },
  createKitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
    mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 10,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
    navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  navButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10, 
    padding: 20,
    width: 60,
    height: 60,
  },
});


export default CreateKits;