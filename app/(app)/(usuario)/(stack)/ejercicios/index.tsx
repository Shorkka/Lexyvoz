// EjerciciosKits.tsx - Versión con vista previa (sin botones y con cierre automático del modal)

import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import KitModal from '@/presentation/hooks/ModalKits';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import RenderKits from '@/presentation/theme/components/RenderKits';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Kit {
  kit_id: number;
  name: string;
  descripcion: string;
  imagen_url?: string;
  ejercicios_count?: number;
  dificultad?: string;
  duracion_estimada?: string;
}

const EjerciciosKits = () => {
  const { useKitsQuery } = useKitsStore();
  const PAGE_SIZE = 6;
  const [currentPage] = useState(0); // ya no hay navegación, se queda en 0

  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const kitsQuery = useKitsQuery(currentPage + 1, PAGE_SIZE);

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

  const kits = kitsQuery.data?.data ?? [];

  const closeModal = () => {
    setModalVisible(false);
    setSelectedKit(null);
  };

  const handleOpenModal = (kit: Kit) => {
    setSelectedKit(kit);
    setModalVisible(true);
  };

  const handlePlay = () => {
    if (!selectedKit) return;

    const kitIdStr = String(selectedKit.kit_id);
    const kitName = selectedKit.name || '';

    // 1) Cierra el modal primero
    closeModal();

    // 2) Pequeño delay para permitir la animación del modal
    setTimeout(() => {
      router.push({
        pathname: '/(app)/(usuario)/(stack)/juegos',
        params: { kitId: kitIdStr, KitName: kitName },
      });
    }, 250);
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
                totalPages={1} // ya no usamos paginación visual
                onKitPress={handleOpenModal}
              />
            </View>
          </ThemedBackground>

          <KitModal
            visible={modalVisible}
            kit={selectedKit}
            onClose={closeModal}
            onAction={handlePlay}
            actionLabel="Jugar ahora"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

export default EjerciciosKits;
