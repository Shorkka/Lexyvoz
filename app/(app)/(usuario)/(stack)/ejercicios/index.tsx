// EjerciciosKits.tsx - Versión mejorada con vista previa

import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import KitModal from '@/presentation/hooks/ModalKits';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import RenderKits from '@/presentation/theme/components/RenderKits';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definir interfaz para el kit
interface Kit {
  kit_id: number;
  name: string;
  descripcion: string;
  imagen_url?: string;
  ejercicios_count?: number;
  dificultad?: string;
  duracion_estimada?: string;
}

// Componente de vista previa del kit

const EjerciciosKits = () => {
  const { useKitsQuery } = useKitsStore();
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(0);

  // Estado para el modal con tipo definido
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Llamada a la query (con paginación)
  const kitsQuery = useKitsQuery(currentPage + 1, PAGE_SIZE);

  // Mostrar loading
  if (kitsQuery.isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ee7200" />
          <ThemedText style={{ marginTop: 10 }}>Cargando kits...</ThemedText>
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
  const handleOpenModal = (kit: Kit) => {
    setSelectedKit(kit);
    setModalVisible(true);
  };

  // Navegación tipo-safe
  const handleNavigateToGame = () => {
    setModalVisible(false);
    if (selectedKit?.kit_id) {
      router.navigate({
        pathname: '/juegos/[kitId]',
        params: { kitId: selectedKit.kit_id.toString() }
      });
    }
  };

  return (
  <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={{ flex: 1, width: '100%' }}>
              <RenderKits 
                currentPage={currentPage}
                visibleKits={kits}
                totalPages={totalPages}
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

          {/* Modal para vista previa del kit */}
            <KitModal
            visible={modalVisible}
            kit={selectedKit}
            onClose={() => setModalVisible(false)}
            onAction={handleNavigateToGame}
            actionLabel="Jugar ahora"
          />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  previewContainer: {
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  previewDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    lineHeight: 22,
  },
  previewDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  cancelButton: {
    padding: 12,
  },
});

export default EjerciciosKits;