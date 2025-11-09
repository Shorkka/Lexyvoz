import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import RenderizarHistorialKitsAsignados from '@/presentation/theme/components/RenderizarHistorialKitsAsignados';
import RenderizarKitsAsignados from '@/presentation/theme/components/RenderizarKitsAsignados';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definir interfaz para el kit
interface Kit {
  kitId: number;
  tipoEjercicio: number;
  tipoReactivo: string;
  name?: string;
  descripcion?: string;
  ejercicios_count?: number;
  dificultad?: string;
  duracion_estimada?: string;
}

// 🔸 Helper para normalizar claves que varían (id vs kit_id, etc.)
type AnyKit = Record<string, any>;
const toSelectedKit = (kit: AnyKit): Kit => ({
  kitId: kit.id ?? kit.kit_id ?? kit.kitId,
  tipoEjercicio: kit.tipo_ejercicio ?? kit.tipoId,
  tipoReactivo: kit.tipo_reactivo ?? kit.tipo ?? '',
  name: kit.kit_nombre ?? kit.name,
  descripcion: kit.kit_descripcion ?? kit.descripcion,
  ejercicios_count: kit.ejercicios_count,
  dificultad: kit.dificultad,
  duracion_estimada: kit.duracion_estimada,
});

// 🔸 Normalizador de clave para la imagen del modal
const keyImg = (t?: string) => {
  const k = String(t ?? '').toLowerCase().trim();
  if (k.startsWith('esc')) return 'escrito';   // escrito/escritura
  if (k.startsWith('lec')) return 'lectura';
  if (k.startsWith('vis')) return 'visual';
  return '';
};

const HomePacienteScreen = () => {
  const { userType, userName} = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');

  // Estado para el modal y kit seleccionado
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const imagenesPorTipo: Record<string, any> = {
    visual:    require('@/assets/images/modalVisual.jpg'),
    lectura:   require('@/assets/images/modalLectura.jpg'),
    escrito:   require('@/assets/images/modalEscrito.jpg'),
    escritura: require('@/assets/images/modalEscrito.jpg'),
  };

  // Long press → vista previa (y de paso selecciona)
  const handleLongPress = (kit: AnyKit) => {
    const formatted = toSelectedKit(kit);
    setSelectedKit(formatted);
    setModalVisible(true);
  };

  // Tap → seleccionar uno (NO abre modal)
  const handlePress = (kit: AnyKit) => {
    const formatted = toSelectedKit(kit);
    setSelectedKit(prev => (prev?.kitId === formatted.kitId ? null : formatted));
    setModalVisible(false);
  };

  const handlePlay = () => {
    if (!selectedKit) return;
    const { kitId , name } = selectedKit;
    router.push({
      pathname: '/(app)/(usuario)/(stack)/juegos',
      params: { kitId: String(kitId), kitName: name || '' } 
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Nota: NO limpiamos selectedKit para que el botón JUGAR siga habilitado
  };
  // Para resaltar el seleccionado en la lista (si tu componente lo soporta)
  const selectedKitId = selectedKit?.kitId ?? null;
  const isPlayDisabled = !selectedKit;

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={{ flex: 1, backgroundColor }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: '100%' }}>
              <ThemedBackground backgroundColor="#fba557" align="center" fullHeight>
                <ThemedText
                  type="welcome"
                  style={{
                    alignSelf: 'center',
                    color: '#000000',
                    fontSize: 32,
                    fontWeight: 'bold',
                    marginBottom: 30,
                  }}
                >
                  Bienvenido {userName}
                </ThemedText>

                {userType === 'Paciente' ? (
                  <View style={{ width: '80%' }}>
                    {/* Kits Asignados */}
                    <ThemedText
                      style={{
                        color: '#000000',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 10,
                      }}
                    >
                      Kits Asignados
                    </ThemedText>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 30,
                      }}
                    >
                      <ThemedBackground
                        backgroundColor="white"
                        style={{
                          borderRadius: 15,
                          padding: 15,
                          flex: 1,
                          marginRight: 15,
                        }}
                      >
                        <RenderizarKitsAsignados
                          onKitPress={handlePress}
                          onKitLongPress={handleLongPress}
                          selectedKitId={selectedKitId} // ← si tu lista lo soporta, resalta
                        />
                      </ThemedBackground>

                      {/* Botón JUGAR: gris si no hay selección */}
                      <ThemedButton
                        onPress={handlePlay}
                        disabled={isPlayDisabled}
                        style={{
                          ...styles.createKitBtn,
                          ...(isPlayDisabled
                            ? { backgroundColor: '#cfcfcf' } // gris
                            : { backgroundColor: '#ee7200' } // color normal
                          )
                        }}
                      >
                        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>JUGAR</ThemedText>
                      </ThemedButton>
                    </View>

                    {/* Historial */}
                    <View style={{ width: '130%' }}>
                      <ThemedText
                        style={{
                          color: '#000000',
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginBottom: 10,
                        }}
                      >
                        Historial
                      </ThemedText>

                      <ThemedBackground backgroundColor="white" style={{ borderRadius: 15, padding: 15 }}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 10, paddingHorizontal: 5 }}
                        >
                          <RenderizarHistorialKitsAsignados />
                        </ScrollView>
                      </ThemedBackground>
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <ThemedButton onPress={() => router.push('/(app)/(usuario)/(stack)/ejercicios')}>
                        <ThemedText type="subtitle" style={{ ...styles.cancelButton, padding: 20, alignSelf: 'center', color: 'white' }}>
                          Jugar
                        </ThemedText>
                      </ThemedButton>
                    </View>
                    <View>
                      <ThemedButton
                        style={{ ...GlobalStyles.primaryButton, alignItems: 'center' }}
                        onPress={() => router.push('/busqueda-doctores')}
                      >
                        <ThemedText type="subtitle" style={{ color: 'white', padding: 20 }}>
                          Conectar con el Doctor
                        </ThemedText>
                      </ThemedButton>
                    </View>
                  </View>
                )}
              </ThemedBackground>
            </View>
          </ScrollView>

          {/* Modal de Vista Previa */}
          <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={handleCloseModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.previewContainer}>
                  {selectedKit?.tipoReactivo ? (
                    imagenesPorTipo[keyImg(selectedKit.tipoReactivo)] ? (
                      <Image
                        source={imagenesPorTipo[keyImg(selectedKit.tipoReactivo)]}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons name="game-controller-outline" size={50} color="#ccc" />
                      </View>
                    )
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="game-controller-outline" size={50} color="#ccc" />
                    </View>
                  )}

                  <ThemedText type="title" style={styles.previewTitle}>
                    {selectedKit?.name}
                  </ThemedText>

                  <ThemedText style={styles.previewDescription}>{selectedKit?.descripcion}</ThemedText>

                  <View style={styles.previewDetails}>
                    {!!selectedKit?.ejercicios_count && (
                      <View style={styles.detailItem}>
                        <Ionicons name="list-outline" size={20} color="#ee7200" />
                        <ThemedText style={styles.detailText}>{selectedKit.ejercicios_count} ejercicios</ThemedText>
                      </View>
                    )}
                    {!!selectedKit?.dificultad && (
                      <View style={styles.detailItem}>
                        <Ionicons name="speedometer-outline" size={20} color="#ee7200" />
                        <ThemedText style={styles.detailText}>Dificultad: {selectedKit.dificultad}</ThemedText>
                      </View>
                    )}
                    {!!selectedKit?.duracion_estimada && (
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={20} color="#ee7200" />
                        <ThemedText style={styles.detailText}>{selectedKit.duracion_estimada}</ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <Pressable onPress={handleCloseModal} style={styles.cancelButton}>
                    <ThemedText style={{ color: '#666' }}>Cerrar Vista Previa</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
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
  previewContainer: { padding: 20 },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  previewDescription: { fontSize: 16, marginBottom: 20, color: '#555', lineHeight: 22 },
  previewDetails: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailText: { marginLeft: 10, fontSize: 16, color: '#444' },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  cancelButton: { padding: 12 },
  createKitBtn: {
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 24,
    bottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomePacienteScreen;
