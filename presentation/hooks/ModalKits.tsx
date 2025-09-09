// presentation/components/KitModal.tsx
import React from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { GlobalStyles } from '@/assets/styles/GlobalStyles';

export interface Kit {
  kit_id: number;
  name: string;
  descripcion: string;
  imagen_url?: string;
  ejercicios_count?: number;
  dificultad?: string;
  duracion_estimada?: string;
}

interface KitModalProps {
  visible: boolean;
  kit: Kit | null;
  onClose: () => void;
  onAction?: (kit: Kit) => void; // por ejemplo "Jugar ahora"
  actionLabel?: string;
}

const KitModal: React.FC<KitModalProps> = ({ visible, kit, onClose, onAction, actionLabel }) => {
  if (!kit) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.previewContainer}>
            {kit.imagen_url ? (
              <Image source={{ uri: kit.imagen_url }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="game-controller-outline" size={50} color="#ccc" />
              </View>
            )}

            <ThemedText type="title" style={styles.previewTitle}>
              {kit.name}
            </ThemedText>

            <ThemedText style={styles.previewDescription}>{kit.descripcion}</ThemedText>

            <View style={styles.previewDetails}>
              {kit.ejercicios_count && (
                <View style={styles.detailItem}>
                  <Ionicons name="list-outline" size={20} color="#ee7200" />
                  <ThemedText style={styles.detailText}>{kit.ejercicios_count} ejercicios</ThemedText>
                </View>
              )}
              {kit.dificultad && (
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={20} color="#ee7200" />
                  <ThemedText style={styles.detailText}>Dificultad: {kit.dificultad}</ThemedText>
                </View>
              )}
              {kit.duracion_estimada && (
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={20} color="#ee7200" />
                  <ThemedText style={styles.detailText}>{kit.duracion_estimada}</ThemedText>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            {onAction && (
              <ThemedButton
                onPress={() => kit && onAction(kit)}
                style={[GlobalStyles.primaryButton, styles.playButton]}
              >
                <ThemedText style={{ color: "white", fontWeight: "bold" }}>{actionLabel || "Acción"}</ThemedText>
              </ThemedButton>
            )}

            <Pressable onPress={onClose} style={styles.cancelButton}>
              <ThemedText style={{ color: "#666" }}>Cerrar</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  playButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, flex: 1, justifyContent: 'center' },
  cancelButton: { padding: 12 },
});

export default KitModal;
