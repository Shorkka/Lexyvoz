import { 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  Modal, 
  Pressable 
} from 'react-native';
import React, { useState } from 'react';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import RenderKits from '@/presentation/theme/components/RenderKits';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';

const EjerciciosKits = () => {
  const { useKitsQuery } = useKitsStore();
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(0);

  // Estado para el modal
  const [selectedKit, setSelectedKit] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Llamada a la query (con paginación)
  const kitsQuery = useKitsQuery(currentPage + 1, PAGE_SIZE);

  // Mostrar loading
  if (kitsQuery.isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ee7200" />
          <Text style={{ marginTop: 10 }}>Cargando kits...</Text>
        </SafeAreaView>
      </AuthGuard>
    );
  }

  // Datos ya mapeados
  const kits = kitsQuery.data?.data ?? [];
  const pagination = kitsQuery.data?.pagination;
  const totalPages = pagination?.total_pages || 1;

  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;

  const goToNextPage = () => canGoForward && setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () => canGoBack && setCurrentPage((prev) => prev - 1);

  // Abrir modal con kit seleccionado
  const handleOpenModal = (kit: any) => {
    setSelectedKit(kit);
    setModalVisible(true);
    
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ThemedBackground 
            fullHeight 
            backgroundColor="#fba557" 
            style={styles.container}
          >
            <View style={{ flex: 1, width: '100%' }}>
              <RenderKits 
                currentPage={currentPage}
                visibleKits={kits}
                totalPages={totalPages}
                // Cuando seleccionas un kit abrimos el modal
                onKitPress={handleOpenModal}
              />
            </View>

            {/* Botones de navegación */}
            <View style={styles.navigationContainer}>
              <ThemedButton 
                onPress={goToPrevPage} 
                disabled={!canGoBack || kitsQuery.isLoading}
                style={[
                  styles.navButton,
                  { backgroundColor: !canGoBack ? '#cccccc' : '#ee7200' }
                ]}
              >
                <Ionicons name="play-back-outline" size={24} color="white" />
              </ThemedButton>

              <ThemedButton 
                onPress={goToNextPage} 
                disabled={!canGoForward || kitsQuery.isLoading}
                style={[
                  styles.navButton,
                  { backgroundColor: !canGoForward ? '#cccccc' : '#ee7200' }
                ]}
              >
                <Ionicons name="play-forward-outline" size={24} color="white" />
              </ThemedButton>
            </View>
          </ThemedBackground>

          {/* Modal para jugar */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {selectedKit?.name || "Kit seleccionado"}
                </Text>
                <Text style={{ marginBottom: 20 }}>
                  {selectedKit?.descripcion || "Descripción del kit"}
                </Text>

                <ThemedButton 
                  onPress={() => {
                    setModalVisible(false);
                    // Aquí puedes navegar a la pantalla de juego
                    console.log("Entrar a jugar con kit:", selectedKit);
                  }}
                  style={{ backgroundColor: "#ee7200", marginBottom: 10 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Entrar a jugar</Text>
                </ThemedButton>

                <Pressable onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "#333" }}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 20, 
    padding: 20,
    marginVertical: 20,
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
    padding: 10,
    width: 60,
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  }
});

export default EjerciciosKits;
