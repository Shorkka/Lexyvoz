// app/(app)/(usuario)/(stack)/EjerciciosKits.tsx
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import KitModal from '@/presentation/hooks/ModalKits';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import RenderKits from '@/presentation/theme/components/RenderKits';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

// 🔥 PROGRESO LOCAL
import { loadKitsCompletedFlags } from '@/infraestructure/storage/progress.storage';

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
  const { user } = useAuthStore();
  const userId = user?.usuario_id ?? 0;

  const { useKitsQuery } = useKitsStore();
  const PAGE_SIZE = 6;
  const [currentPage] = useState(0);

  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const kitsQuery = useKitsQuery(currentPage + 1, PAGE_SIZE);
  const { refetch } = kitsQuery;

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  // refetch al enfocar
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // cargar flags "completado" en local para filtrar
  useEffect(() => {
    const kits = kitsQuery.data?.data ?? [];
    const ids = kits.map((k: Kit) => String(k.kit_id ?? (k as any).id));
    if (ids.length === 0) return;
    loadKitsCompletedFlags(userId, ids).then(setCompletedMap);
  }, [kitsQuery.data, userId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const kitsRaw = kitsQuery.data?.data ?? [];
  const kits = useMemo(
    () => kitsRaw.filter((k: Kit) => !completedMap[String(k.kit_id)]),
    [kitsRaw, completedMap]
  );

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
    closeModal();
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
                totalPages={1}
                onKitPress={handleOpenModal}
                userIdSeed={userId}
                contentPadding={16}
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
