import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function ThemedVozButton() {
  const [grabando, setGrabando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const handlePress = () => {
    if (!grabando) {
      // Inicia grabación
      setGrabando(true);
    } else {
      // Detiene grabación y simula procesamiento
      setGrabando(false);
      setModalVisible(true);
      setProcesando(true);

      setTimeout(() => {
        setProcesando(false);
      }, 2500);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.boton, grabando && styles.botonGrabando]}
        onPress={handlePress}
      >
        <Text style={styles.textoBoton}>
          {grabando ? "Detener Grabación" : "🎤 Iniciar Grabación"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {procesando ? (
              <>
                <ActivityIndicator size="large" color="#FF6F61" />
                <Text style={styles.modalText}>Procesando tu respuesta...</Text>
              </>
            ) : (
              <>
                <Text style={[styles.modalText, { fontSize: 18 }]}>
                  🎉 ¡Felicidades!
                </Text>
                <Text style={styles.modalText}>
                  Tu respuesta fue guardada correctamente.
                </Text>
                <TouchableOpacity
                  style={[styles.boton, { marginTop: 20 }]}
                  onPress={cerrarModal}
                >
                  <Text style={styles.textoBoton}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  boton: {
    backgroundColor: "#FF6F61", // Naranja LexyVoz
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  botonGrabando: {
    backgroundColor: "#FF3B30", // Rojo grabando
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
    elevation: 6,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    color: "#333",
  },
});
