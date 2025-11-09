import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';

type Kit = {
  id: number;
  name: string;
  descripcion?: string;
  activo?: boolean;
};

const normalizeId = (k: any): number => {
 
  const raw =
    k?.id ??
    k?.kit_id ??
    k?.KitId ??
    k?.ID ??
    k?.Id;

  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
};

const normalizeName = (k: any): string => {
  return String(k?.name ?? k?.nombre ?? 'Kit');
};

const normalizeDesc = (k: any): string | undefined => {
  return typeof k?.descripcion === 'string' ? k.descripcion : undefined;
};

const AsignarKitsExistentes = () => {
  const { pacienteId } = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  const { height } = useWindowDimensions();

  const { useKitsQuery } = useKitsStore();
  // Si tienes paginación, pásala aquí; por ahora undefined, undefined
  const { data, isLoading, isError, refetch } = useKitsQuery(undefined, undefined);

  const kits: Kit[] = useMemo(() => {
    if (!data) return [];

    // Asegura tomar el arreglo correcto según tu respuesta
    const rawList: any[] =
      Array.isArray(data?.data) ? data.data :
      Array.isArray(data) ? data : [];

    const mapped = rawList.map((k: any) => {
      const id = normalizeId(k);
      return {
        id,
        name: normalizeName(k),
        descripcion: normalizeDesc(k),
        activo: Boolean(k?.activo ?? true),
      } as Kit;
    });

    // Filtra elementos sin id válido (evita NaN -> el problema de "todos se seleccionan")
    const filtered = mapped.filter(k => Number.isFinite(k.id));

    // (Opcional) Elimina duplicados por id
    const seen = new Set<number>();
    const unique = filtered.filter(k => {
      if (seen.has(k.id)) return false;
      seen.add(k.id);
      return true;
    });

    return unique;
  }, [data]);

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleContinuar = () => {
    if (selected.size === 0) return;

    const selectedIds = Array.from(selected);
    const selectedKits = kits.filter(k => selected.has(k.id));

    router.push({
      pathname: '/(app)/(doctor)/(stack)/kits/(confirmarAsignacionKits)',
      params: {
        pacienteId: String(pacienteId ?? ''),
        kitIds: JSON.stringify(selectedIds),
 kitsSnapshot: JSON.stringify(
      selectedKits.map(k => ({ id: Number(k.id), name: k.name, descripcion: k.descripcion }))
    ),
      },
    });
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ThemedBackground style={styles.background} fullHeight backgroundColor="#fba557">
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={{ color: 'black' }}>
              Seleccionar kits para asignar
            </ThemedText>
            <ThemedText style={{ color: 'white', marginTop: 4 }}>
              Paciente ID: {String(pacienteId ?? '—')}
            </ThemedText>
          </View>

          {/* Lista (una columna) */}
          <View style={[styles.listContainer, { maxHeight: height * 0.6 }]}>
            {isLoading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
                <ThemedText style={{ color: 'white', marginTop: 8 }}>
                  Cargando kits...
                </ThemedText>
              </View>
            ) : isError ? (
              <View style={styles.center}>
                <ThemedText style={{ color: 'white', marginBottom: 8 }}>
                  Error al cargar kits
                </ThemedText>
                <ThemedButton onPress={() => refetch()} backgroundColor="#ee7200">
                  Reintentar
                </ThemedButton>
              </View>
            ) : kits.length === 0 ? (
              <View style={styles.center}>
                <ThemedText style={{ color: 'white' }}>
                  No hay kits disponibles
                </ThemedText>
              </View>
            ) : (
              <ScrollView>
                <View style={{ gap: 10 }}>
                  {kits.map(kit => {
                    const isSelected = selected.has(kit.id);
                    return (
                      <Pressable
                        key={`kit-${kit.id}`} 
                        onPress={() => toggle(kit.id)}
                        style={[
                          styles.kitCard,
                          { borderColor: isSelected ? '#ee7200' : 'rgba(0,0,0,0.1)' },
                        ]}
                      >
                        <View style={styles.row}>
                          <View style={[styles.checkbox, isSelected && styles.checkboxChecked]} />
                          <View style={{ flex: 1 }}>
                            <ThemedText style={styles.kitName}>{kit.name}</ThemedText>
                            {kit.descripcion ? (
                              <ThemedText style={styles.kitDesc} numberOfLines={2}>
                                {kit.descripcion}
                              </ThemedText>
                            ) : null}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedButton backgroundColor="grey" onPress={() => router.back()}>
              Cancelar
            </ThemedButton>
            <ThemedButton
              onPress={handleContinuar}
              disabled={selected.size === 0}
              style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
            >
              Continuar ({selected.size})
            </ThemedButton>
          </View>
        </ThemedBackground>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  background: { padding: 16 },
  header: { marginBottom: 12, alignItems: 'center' },
  listContainer: { backgroundColor: 'transparent', marginBottom: 12 },
  kitCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    ...Platform.select({
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
    }),
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  checkboxChecked: { borderColor: '#ee7200', backgroundColor: '#ee7200' },
  kitName: { color: '#333', fontWeight: '700', marginBottom: 2 },
  kitDesc: { color: '#555', fontStyle: 'italic' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 8 },
});

export default AsignarKitsExistentes;
