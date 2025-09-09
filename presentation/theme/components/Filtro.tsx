import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface FiltroProps {
  onFilterChange: (filtro: string, orden: 'asc' | 'desc') => void;
  filtroActual: string;
  ordenActual: 'asc' | 'desc';
}

const Filtro: React.FC<FiltroProps> = ({ onFilterChange, filtroActual, ordenActual }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const opcionesFiltro = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'ninguno', label: 'Sin filtro' }
  ];

  const seleccionarFiltro = (filtro: string) => {
    if (filtroActual === filtro) {
      // Cambiar orden si es el mismo filtro
      onFilterChange(filtro, ordenActual === 'asc' ? 'desc' : 'asc');
    } else {
      // Nuevo filtro con orden ascendente por defecto
      onFilterChange(filtro, 'asc');
    }
    setModalVisible(false);
  };

  const obtenerIconoOrden = () => {
    return ordenActual === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline';
  };

  const obtenerTextoFiltro = () => {
    if (filtroActual === 'ninguno') return 'Filtrar';
    const opcion = opcionesFiltro.find(op => op.key === filtroActual);
    return opcion ? `${opcion.label} (${ordenActual === 'asc' ? 'A-Z' : 'Z-A'})` : 'Filtrar';
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.botonFiltro}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.textoBoton}>
          {obtenerTextoFiltro()}
        </ThemedText>
        <Ionicons 
          name={filtroActual !== 'ninguno' ? obtenerIconoOrden() : "filter-outline"} 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.tituloModal}>
              Ordenar por
            </ThemedText>
            
            {opcionesFiltro.map((opcion) => (
              <TouchableOpacity
                key={opcion.key}
                style={styles.opcionFiltro}
                onPress={() => seleccionarFiltro(opcion.key)}
              >
                <ThemedText style={[
                  styles.textoOpcion,
                  filtroActual === opcion.key && styles.textoSeleccionado
                ]}>
                  {opcion.label}
                </ThemedText>
                {filtroActual === opcion.key && opcion.key !== 'ninguno' && (
                  <Ionicons 
                    name={obtenerIconoOrden()} 
                    size={16} 
                    color="#ee7200" 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  botonFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ee7200',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  textoBoton: {
    color: 'white',
    marginRight: 5,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  tituloModal: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  opcionFiltro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textoOpcion: {
    fontSize: 16,
    color: '#333',
  },
  textoSeleccionado: {
    color: '#ee7200',
    fontWeight: 'bold',
  },
});

export default Filtro;