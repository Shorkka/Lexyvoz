import { Data } from '@/core/auth/interface/ejercicios';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';

interface Props {
    tipo_id: number;
    setSelectedExercises: React.Dispatch<React.SetStateAction<Data[]>>;
}

const ReactivosView = ({ tipo_id, setSelectedExercises }: Props) => {
    const [page, setPage] = useState(1);
    const [canGoNext, setCanGoNext] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [selectedExercisesMap, setSelectedExercisesMap] = useState<Map<number, Data>>(new Map());
    const { useEjerciciosPorTipoQuery } = useEjerciciosStore();
    const { data, isLoading, isError } = useEjerciciosPorTipoQuery(tipo_id, page);

    // Extraer los datos correctamente de la estructura anidada
    const exercisesData = Array.isArray(data?.data?.data) ? data.data.data : [];
    const paginationData = data?.data?.pagination || data?.pagination;

    // Actualizar estado de los botones de paginación
    useEffect(() => {        
        if (paginationData) {
            setCanGoBack(page > 1);
            setCanGoNext(page < paginationData.totalPages);
        } else {
            // Default behavior if pagination is not available
            setCanGoBack(page > 1);
            setCanGoNext(exercisesData.length > 0);
        }
    }, [data, page, exercisesData.length, paginationData]);

    useEffect(() => {
        // Update parent component whenever selection changes
        setSelectedExercises(Array.from(selectedExercisesMap.values()));
    }, [selectedExercisesMap, setSelectedExercises]);

    const onHandleNext = () => {
        if (paginationData && page < paginationData.totalPages) {
            setPage(page + 1);
        }
    };

    const onHandlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const toggleExerciseSelection = (ejercicio: Data) => {
        setSelectedExercisesMap(prev => {
            const newMap = new Map(prev);
            if (newMap.has(ejercicio.ejercicio_id)) {
                newMap.delete(ejercicio.ejercicio_id);
            } else {
                newMap.set(ejercicio.ejercicio_id, ejercicio);
            }
            return newMap;
        });
    };

    // Get selected IDs for UI display
    const selectedIds = Array.from(selectedExercisesMap.keys());

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ThemedButton disabled>Cargando...</ThemedButton>
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View style={styles.centerContainer}>
                <ThemedText style={{ marginBottom: 10 }}>Error cargando los ejercicios</ThemedText>
                <ThemedButton onPress={() => window.location.reload()}>
                    Reintentar
                </ThemedButton>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Lista de ejercicios */}
            <FlatList
                data={exercisesData}
                keyExtractor={(item) => item.ejercicio_id.toString()}
                numColumns={3}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => {
                    const isSelected = selectedIds.includes(item.ejercicio_id);
                    return (
                        <TouchableOpacity
                            style={[
                                styles.exerciseCard,
                                isSelected ? styles.exerciseCardSelected : styles.exerciseCardNormal
                            ]}
                            onPress={() => toggleExerciseSelection(item)}
                        >
                            <ThemedText 
                                style={[
                                    styles.exerciseTitle,
                                    isSelected ? styles.exerciseTextSelected : styles.exerciseTextNormal
                                ]}
                            >
                                {item.titulo}
                            </ThemedText>
                            <ThemedText 
                                style={[
                                    styles.exerciseDescription,
                                    isSelected ? styles.exerciseTextSelected : styles.exerciseTextNormal
                                ]}
                                numberOfLines={2}
                            >
                                {item.descripcion}
                            </ThemedText>
                            {isSelected && (
                                <View style={styles.selectedIndicator}>
                                    <ThemedText style={styles.selectedText}>
                                        {selectedIds.indexOf(item.ejercicio_id) + 1}
                                    </ThemedText>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
            
            {/* Paginación */}
            <View style={styles.pagination}>
                <ThemedButton
                    onPress={onHandlePrev}
                    disabled={!canGoBack}
                    style={[styles.paginationBtn, !canGoBack && styles.paginationBtnDisabled]}
                >
                    <Ionicons name="play-back-outline" size={24} color="#fff" /> 
                </ThemedButton>
                
                <ThemedText style={styles.pageNumber}>
                    Página {page} {paginationData?.totalPages ? `de ${paginationData.totalPages}` : ''}
                </ThemedText>
                
                <ThemedButton 
                    onPress={onHandleNext}
                    disabled={!canGoNext}
                    style={[styles.paginationBtn, !canGoNext && styles.paginationBtnDisabled]}
                >
                    <Ionicons name="play-forward-outline" size={24} color="#fff" /> 
                </ThemedButton>
            </View>         
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    justifyContent: 'space-between',
    padding: 8,
  },
  exerciseCard: {
    width: '30%',
    height: 120,
    margin: 5,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  exerciseCardNormal: {
    backgroundColor: '#f0f0f0',
  },
  exerciseCardSelected: {
    backgroundColor: '#ee7200',
  },
  exerciseTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  exerciseDescription: {
    textAlign: 'center',
    fontSize: 12,
  },
  exerciseTextNormal: {
    color: '#333',
  },
  exerciseTextSelected: {
    color: '#fff',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#ee7200',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    gap: 15,
  },
  paginationBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ee7200',
  },
  paginationBtnDisabled: {
    backgroundColor: '#b1b1b1',
    opacity: 0.6,
  },
  pageNumber: {
    fontWeight: 'bold',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ReactivosView;