// app/(admin)/admin/kits/wizard/_layout.tsx
import { Slot, usePathname } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';

const steps = [
  { key: 'detalles', label: 'Detalles' },   
  { key: 'tipos', label: 'Tipo' },
  { key: 'ejercicios', label: 'Ejercicio' },
  { key: 'subtipos', label: 'Sub-tipo' },
  { key: 'reactivos', label: 'Reactivos' },
];

export default function WizardLayout() {
  const pathname = usePathname();
  const activeKey = steps.find(s => pathname.endsWith(s.key))?.key;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <ThemedText type="title">Asistente de Kits</ThemedText>
        <View style={styles.breadcrumbs}>
          {steps.map((s, i) => (
            <View key={s.key} style={[styles.step, activeKey === s.key && styles.stepActive]}>
              <ThemedText style={{ color: '#000', fontWeight: activeKey === s.key ? '700' : '500' }}>
                {i + 1}. {s.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#00000012' },
  breadcrumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  step: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#00000008' },
  stepActive: { backgroundColor: '#c4f0ff55', borderWidth: 1, borderColor: '#00aaff55' },
});
