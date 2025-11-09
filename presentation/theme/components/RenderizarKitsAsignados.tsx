import React, { useMemo, useEffect } from 'react';
import { Text, ActivityIndicator, Platform, StyleSheet, View, FlatList, Pressable } from 'react-native';
// 👆 uso FlatList/Pressable de react-native para evitar conflictos de gestures
import { useKitsAsignacionesStore } from '@/infraestructure/store/useKitsAsignacionesStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

interface Props {
  onKitPress?: (kit: any) => void;
  onKitLongPress?: (kit: any) => void;
  selectedKitId?: number | null;
}

const RenderizarKitsAsignados: React.FC<Props> = ({ onKitPress, onKitLongPress, selectedKitId = null }) => {
  const { user } = useAuthStore();
  const { useKitsAsignadosAPacientesQuery } = useKitsAsignacionesStore();
  const { data, isLoading, error } = useKitsAsignadosAPacientesQuery(user?.usuario_id || 0);

  const kits = useMemo(() => {
    const d: any = data;
    const arr =
      (Array.isArray(d?.data?.data) && d.data.data) ||
      (Array.isArray(d?.data) && d.data) ||
      (Array.isArray(d?.items) && d.items) ||
      (Array.isArray(d) && d) ||
      [];
    return arr.filter(Boolean);
  }, [data]);

  useEffect(() => {
    console.log(
      kits.length,
      'ids:',
      kits.map((k: any) => k.id ?? k.kit_id ?? k.asignacion_id)
    );
  }, [data, kits]);
  if (isLoading) return <ActivityIndicator size="large" color="#ee7200" style={{ marginTop: 20 }} />;
  if (error) return <Text style={styles.errorText}>Error al cargar los kits</Text>;
  if (!kits.length) return <Text style={styles.emptyText}>No tienes kits asignados por ahora.</Text>;

  return (
    <FlatList
      data={kits}
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}

      keyExtractor={(item, idx) => {
        const aId = item.asignacion_id ?? item.asignacionId ?? item.id;
        const kId = item.kit_id ?? item.kitId;
        return String(aId ?? kId ?? idx) + '-' + idx;
      }}

      extraData={selectedKitId}
      renderItem={({ item, index }) => {
        const itemId = item.asignacion_id ?? item.id ?? item.kit_id ?? index;
        const isSelected = selectedKitId === itemId;

        return (
          <Pressable
            onPress={() => onKitPress?.(item)}
            onLongPress={() => onKitLongPress?.(item)}
            style={[
              styles.kitCard,
              isSelected ? styles.kitCardSelected : styles.kitCardUnselected,
            ]}
          >
            <Text style={styles.kitTitle} numberOfLines={1}>
              {item.kit_nombre ?? item.nombre ?? 'Kit'}
            </Text>
            <Text style={styles.kitDescription} numberOfLines={2}>
              {item.kit_descripcion ?? item.descripcion ?? 'Sin descripción'}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};

export default RenderizarKitsAsignados;

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 5 },
  kitCard: {
    width: 200,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' as any,
      },
    }),
  },
  kitCardSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#fba557',
    borderWidth: 2,
    shadowOpacity: 0.2,
  },
  kitCardUnselected: { backgroundColor: '#f2f2f2' },
  kitTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#222' },
  kitDescription: { fontSize: 14, color: '#555', minHeight: 36 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 10 },
});
