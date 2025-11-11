import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions, Platform } from 'react-native';

import { Kit } from '@/core/auth/interface/kits';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import { AdminList } from '../../../../presentation/admin/adminList';
import { AdminScaffold } from '../../../../presentation/admin/adminScaffold';
import { AdminListColumn, AdminRowAction } from '../../../../presentation/admin/interface';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
export default function AdminKitsList() {
  const { useKitsQuery, eliminarKitMutation } = useKitsStore();
  const { data, isLoading, refetch } = useKitsQuery(1, 20);

  const { width } = useWindowDimensions();
  const isMobile = width < 720;

  const columnsDesktop: AdminListColumn<Kit>[] = [
    { key: 'kit_id', label: 'ID', width: 64 },
    { key: 'name', label: 'Nombre', flex: 2 },
    { key: 'descripcion', label: 'Descripción', flex: 3 },
    { key: 'activo', label: 'Activo', render: (k) => <>{k.activo ? 'Sí' : 'No'}</> },
  ];

  const columnsMobile: AdminListColumn<Kit>[] = [
    { key: 'kit_id', label: 'ID', width: 50 },
    { key: 'name', label: 'Nombre', flex: 2 },
    { key: 'activo', label: 'Activo', render: (k) => <>{k.activo ? 'Sí' : 'No'}</> },
  ];

  const actions: AdminRowAction<Kit>[] = [
    { icon: 'pencil-outline', label: 'Editar', onPress: (k) => router.push({ pathname: '/(admin)/admin/kits/wizard/tipos', params: { id: String(k.kit_id) } }) },
    { icon: 'trash-outline', label: 'Eliminar', onPress: async (k) => eliminarKitMutation.mutate(k.kit_id) },
  ];

  const pageBody = (
    <>
      <AdminList<Kit>
        columns={isMobile ? columnsMobile : columnsDesktop}
        rows={(data?.data || []).map((d: any) => ({ ...d, total_ejercicios: Number((d as any).total_ejercicios) })) as Kit[]}
        isLoading={isLoading}
        onRefresh={refetch}
        rowKey={(k) => k.kit_id}
        actions={actions}
        emptyHint="No hay kits registrados"
      />

      {/* FAB móvil */}
      {isMobile && (
        <View pointerEvents="box-none" style={styles.fabWrap}>
          <Pressable
            onPress={() => router.push('/(admin)/admin/kits/wizard/tipos')}
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Crear nuevo kit"
          >
            <ThemedText style={styles.fabText}>＋</ThemedText>
          </Pressable>
        </View>
      )}
    </>
  );

  return (
    <AdminScaffold
      title="Kits"
      subtitle="Lista y acciones sobre kits"
      primaryCta={!isMobile ? { label: 'Nuevo kit', icon: 'add', onPress: () => router.push('/(admin)/admin/kits/wizard/tipos') } : undefined}
    >
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        {pageBody}
      </View>
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerMobile: {
    paddingHorizontal: 8,
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    backgroundColor: '#ee7200',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 6px 18px rgba(0,0,0,0.2)' as any }
      : { elevation: 4 }),
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  fabText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 28,
    lineHeight: 28,
    marginTop: Platform.OS === 'ios' ? 0 : 2,
  },
});
