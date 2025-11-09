// RenderKits.tsx (card que no se sale del ThemedBackground)
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useMemo } from 'react';

interface RenderKitsProps {
    currentPage?: number;          // opcional, no se usa
  visibleKits: any[];
  totalPages: number;           // opcional, no se usa
  onKitPress?: (kit: any) => void;
  userIdSeed?: number | string;
  contentPadding?: number;      // opcional por si quieres ajustar desde el padre
}

function hashSeed(seed: string | number = 0) {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function RenderKits({
  visibleKits,
  onKitPress,
  userIdSeed = 0,
  contentPadding = 16,
}: RenderKitsProps) {
  const kitOfTheDay = useMemo(() => {
    const kits = Array.isArray(visibleKits) ? visibleKits : [];
    if (kits.length === 0) return null;
    const epochDays = Math.floor(Date.now() / 86_400_000);
    const seed = (epochDays + hashSeed(userIdSeed)) % kits.length;
    return kits[seed];
  }, [visibleKits, userIdSeed]);

  if (!kitOfTheDay) {
    return (
      <View style={[styles.emptyContainer, { paddingHorizontal: contentPadding }]}>
        <Text style={styles.emptyText}>No hay kits disponibles</Text>
      </View>
    );
  }

  const kit = kitOfTheDay;

  return (
    <View style={[styles.mainContainer, { paddingHorizontal: contentPadding }]}>
      {/* Si tu sección está dentro de un ScrollView padre, puedes quitar este ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          key={kit.kit_id ?? kit.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => onKitPress?.(kit)}
        >
          <Text style={styles.title} numberOfLines={1}>
            {kit.name || kit.kit_nombre || 'Sin nombre'}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {kit.descripcion || kit.kit_descripcion || 'Sin descripción'}
          </Text>
          <Text style={styles.creator} numberOfLines={1}>
            Creado por: {kit.creador_nombre || 'Desconocido'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Este kit rota automáticamente cada 24 horas.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  card: {
    alignSelf: 'stretch',   // ocupa todo el ancho disponible del contenedor
    maxWidth: '100%',       // evita desbordarse en web
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  description: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 18 },
  creator: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 'auto' },
  hint: { marginTop: 10, textAlign: 'center', color: '#666' },
  emptyContainer: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
});
