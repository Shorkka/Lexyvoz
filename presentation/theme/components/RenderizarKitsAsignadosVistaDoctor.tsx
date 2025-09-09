import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  Alert,
  Modal,
} from 'react-native';
import { useKitsAsignacionesStore } from '@/infraestructure/store/useKitsAsignacionesStore';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import ThemedBackground from './ThemedBackground';
import { ThemedText } from './ThemedText';
import ThemedButton from './ThemedButton';


interface RenderizarKitsAsignadosVistaDoctorProps {
  pacienteId: number;
  onRefresh?: () => void;
}

const RenderizarKitsAsignadosVistaDoctor: React.FC<RenderizarKitsAsignadosVistaDoctorProps> = ({ 
  pacienteId, 
  onRefresh 
}) => {
  const [selectedKit, setSelectedKit] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { 
    useKitsAsignadosAPacientesQuery, 
    eliminarKitAsignadoMutation 
  } = useKitsAsignacionesStore();
  
  const { data, isLoading, error, refetch } = useKitsAsignadosAPacientesQuery(pacienteId);
  const { mutate: eliminarKit, isPending: isDeleting } = eliminarKitAsignadoMutation;

  const handleKitPress = (kit: any) => {
    setSelectedKit(kit);
    setModalVisible(true);
  };

  const handleEditKit = () => {
    if (selectedKit) {
      setModalVisible(false);
      router.push({
        pathname: '/(app)/(doctor)/(stack)/kits/editKit/[kitId]',
        params: { kitId: selectedKit.id }
      });
    }
  };

  const handleDeleteKit = () => {
    if (selectedKit) {
      Alert.alert(
        "Confirmar eliminación",
        `¿Estás seguro de que quieres eliminar el kit "${selectedKit.kit_nombre}"?`,
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          { 
            text: "Eliminar", 
            onPress: () => {
              eliminarKit(selectedKit.id.toString(), {
                onSuccess: () => {
                  setModalVisible(false);
                  refetch();
                  if (onRefresh) onRefresh();
                  Alert.alert("Éxito", "Kit eliminado correctamente");
                },
                onError: () => {
                  Alert.alert("Error", "No se pudo eliminar el kit");
                }
              });
            }
          }
        ]
      );
    }
  };

  const handleOpenTray = () => {
    if (selectedKit) {
      setModalVisible(false);
      router.push({
        pathname: '/(app)/(doctor)/(stack)/kits/kits-list',
        params: { 
          kitId: selectedKit.id,
          pacienteId: pacienteId
        }
      });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedKit(null);
  };

  if (isLoading) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ActivityIndicator size="large" color="#ee7200" />
      </ThemedBackground>
    );
  }

  if (error) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ThemedText style={styles.errorText}>Error al cargar los kits</ThemedText>
      </ThemedBackground>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ThemedText style={styles.emptyText}>No hay kits asignados a este paciente</ThemedText>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container}>
      <FlatList
        data={data.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.kitCard} 
            onPress={() => handleKitPress(item)}
          >
            <View style={styles.kitHeader}>
              <ThemedText style={styles.kitTitle}>{item.kit_nombre}</ThemedText>
              <ThemedText style={[
                styles.kitStatus,
                item.estado === 'Activo' ? styles.statusActive : 
                item.estado === 'Finalizado' ? styles.statusCompleted : 
                styles.statusInactive
              ]}>
                {item.estado}
              </ThemedText>
            </View>
            <ThemedText style={styles.kitDescription}>{item.kit_descripcion}</ThemedText>
            <ThemedText style={styles.kitDate}>
              Asignado: {new Date(item.fecha_asignacion).toLocaleDateString()}
            </ThemedText>
          </Pressable>
        )}
      />

      {/* Modal de opciones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <ThemedBackground style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>{selectedKit?.kit_nombre}</ThemedText>
            
            <ThemedButton
              
              onPress={handleEditKit}
              style={styles.modalOption}
            >
              <ThemedText style={styles.modalOptionText}>✏️ Editar Kit</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handleOpenTray}
            >
              <ThemedText style={styles.modalOption}>📂 Abrir Bandeja de Ejercicios</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handleDeleteKit}
              disabled={isDeleting}
              style={[styles.modalOption, styles.deleteOption]}
            >
              <ThemedText style={[styles.modalOptionText, styles.deleteOptionText]}>
                {isDeleting ? 'Eliminando...' : '🗑️ Eliminar Kit'}
              </ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handleCloseModal}
              style={styles.cancelButton}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </ThemedButton>
          </ThemedBackground>
        </View>
      </Modal>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  kitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  kitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  kitStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#e6f7ee',
  },
  statusCompleted: {
    backgroundColor: '#e6f0ff',
  },
  statusInactive: {
    backgroundColor: '#f8f9fa',
  },
  kitDescription: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  kitDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
  },
  deleteOption: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  deleteOptionText: {
    color: '#dc3545',
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});

export default RenderizarKitsAsignadosVistaDoctor;