// app/(admin)/admin/index.tsx
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, useWindowDimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';

import { useRoleRouteProtector } from '@/presentation/hooks/useRoleRouteProtector';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthGuard from '@/presentation/theme/components/AuthGuard';

const CANVAS = '#fefcc3'; // fondo de la página
const HERO   = '#fba557'; // banda/hero
const ACCENT = '#ee7200'; // acentos

export default function AdminHome() {
  useRoleRouteProtector();

  const router = useRouter();
  const { width } = useWindowDimensions();

  // Si prefieres fondo de tarjetas por theme:
  const columns = useMemo(() => (width >= 1100 ? 4 : width >= 800 ? 3 : 2), [width]);
  const basisPct = useMemo(() => `${Math.max(25, Math.floor(100 / columns) - 2)}%`, [columns]); // ancho por card

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: CANVAS }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={{ flex: 1, backgroundColor: CANVAS }}
            contentContainerStyle={styles.container} // padding consistente, sin centrar
          >
            {/* HERO / HEADER */}
            <ThemedBackground backgroundColor={HERO} style={styles.hero}>
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ color: '#fff' }} type="title">
                    Panel de administración
                  </ThemedText>
                  <ThemedText type="subtitle" style={{ opacity: 0.8, marginTop: 4, color: '#fff' }}>
                    Gestiona usuarios, kits y ajustes del sistema
                  </ThemedText>
                </View>

                <ThemedButton onPress={() => router.push('/(admin)/admin/kits')} style={{ minWidth: 140 }}>
                  <View style={styles.row}>
                    <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
                      Nuevo kit
                    </ThemedText>
                  </View>
                </ThemedButton>
              </View>

              {/* Acciones rápidas */}
              <View style={{ marginTop: 22 }}>
                <ThemedText type="subtitle" style={{ marginBottom: 10, color: '#fff' }}>
                  Acciones rápidas
                </ThemedText>

                <View style={styles.grid}>
                  <ActionTile
                    title="Gestionar usuarios"
                    subtitle="Alta, edición y permisos"
                    icon="person-add-outline"
                    tint={ACCENT}
                    basis={basisPct}
                    onPress={() => router.push('/admin/users')}
                  />
                  <ActionTile
                    title="Explorar kits"
                    subtitle="Crear o editar contenidos"
                    icon="albums-outline"
                    tint={ACCENT}
                    basis={basisPct}
                    onPress={() => router.push('/admin/kits')}
                  />
                </View>
              </View>

              {/* Actividad */}
              <View style={{ marginTop: 26 }}>
                <ThemedText type="subtitle" style={{ marginBottom: 8, color: '#fff' }}>
                  Actividad reciente
                </ThemedText>
                <EmptyState
                  icon="time-outline"
                  title="Sin actividad por ahora"
                  subtitle="Cuando se creen kits o se actualicen usuarios, aparecerán aquí."
                />
              </View>
            </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
}

/* --------------------------- UI Helpers --------------------------- */


function ActionTile({
  title,
  subtitle,
  icon,
  tint,
  onPress,
  basis,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  tint: string;
  onPress?: () => void;
  basis: string; // "%", ej. "48%"
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cardItem,
      ]}
    >
      <View style={[styles.actionTile, { backgroundColor: '#fff' }]}>
        <View style={[styles.iconWrap, { backgroundColor: `${tint}22` }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={{ color: '#000' }}>
            {title}
          </ThemedText>
          <ThemedText style={{ opacity: 0.8, marginTop: 2, color: '#000' }}>
            {subtitle}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} style={{ opacity: 0.6 }} color="#000" />
      </View>
    </Pressable>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={[styles.emptyState, { backgroundColor: '#fff' }]}>
      <View style={[styles.iconWrap, { backgroundColor: '#00000011', marginBottom: 8 }]}>
        <Ionicons name={icon} size={20} color="#000" />
      </View>
      <ThemedText type="defaultSemiBold" style={{ color: '#000' }}>
        {title}
      </ThemedText>
      {!!subtitle && (
        <ThemedText style={{ textAlign: 'center', marginTop: 4, color: '#000' }}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

/* ----------------------------- Styles ---------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  hero: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6, // “simula” gap
  },
  cardItem: {
    paddingHorizontal: 6,
    marginBottom: 12,
    minWidth: 220,       // evita colapso cuando hay muchas columnas
  },
  statCard: {
    padding: 14,
    borderRadius: 16,
    minHeight: 84,
    justifyContent: 'center',
  },
  actionTile: {
    padding: 14,
    borderRadius: 16,
    minHeight: 72,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
