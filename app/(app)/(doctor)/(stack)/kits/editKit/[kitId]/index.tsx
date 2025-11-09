import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

const EditarKit = () => {
  const { kitId } = useLocalSearchParams();
  const cardColor = useThemeColor({}, 'primary');
  const { useKitPorIdQuery, actualizarKitMutation } = useKitsStore();
  const backgroundColor = useThemeColor({}, 'background');

  // query para obtener el kit actual
  const { data, isLoading, error } = useKitPorIdQuery(Number(kitId));
  const { mutateAsync: actualizarKit, isPending: isUpdating } = actualizarKitMutation;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // cargar datos iniciales
  useEffect(() => {
    if (data?.kits) {
      setNombre(data.kits.name || '');
      setDescripcion(data.kits.descripcion || '');
    }
  }, [data]);

  const handleActualizar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del kit no puede estar vacío');
      return;
    }

    try {
      await actualizarKit({
        id: Number(kitId),
        kitData: {
          name: nombre.trim(),
          descripcion: descripcion.trim(),
          creado_por: data?.kits.creado_por || 0,
        },
      });

      Alert.alert('Éxito', 'Kit actualizado correctamente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo actualizar el kit');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#ee7200" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <ThemedText style={{ color: 'red' }}>Error al cargar el kit</ThemedText>
      </View>
    );
  }

  return (
    <AuthGuard>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor }}>
      <ThemedBackground
        justifyContent="flex-start"
        fullHeight
        backgroundColor="#fba557"
        style={[GlobalStyles.orangeBackground, { padding: 16 }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Editar Kit
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Modifica la información del kit
            </ThemedText>
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <ThemedTextInput
              placeholder="Nombre del kit"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />

            <ThemedTextInput
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.actionsContainer}>
            <ThemedButton
              onPress={() => router.back()}
              style={[styles.button, styles.cancelButton]}
              disabled={isUpdating}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handleActualizar}
              disabled={isUpdating}
              style={[
                styles.button,
                styles.saveButton,
                isUpdating && styles.saveButtonDisabled,
              ]}
            >
              <ThemedText style={styles.saveButtonText}>
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </ThemedText>
            </ThemedButton>
          </View>
        </ScrollView>
      </ThemedBackground>
      </ScrollView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#000' },
  subtitle: { fontSize: 16, opacity: 0.8, textAlign: 'center', color: '#000' },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      android: { elevation: 3 },
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
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  actionsContainer: { flexDirection: 'row', gap: 12, marginTop: 20 },
  button: { flex: 1, padding: 16, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6' },
  cancelButtonText: { color: '#6c757d', fontWeight: '600' },
  saveButton: { backgroundColor: '#ee7200' },
  saveButtonDisabled: { backgroundColor: '#b1b1b1' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EditarKit;
