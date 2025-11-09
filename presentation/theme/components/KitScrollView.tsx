import React from 'react';
import { 
  Text, 
  StyleSheet, 
  FlatList, 

  ActivityIndicator, 
  Platform,
  View,
  Pressable 
} from 'react-native';
import { router } from 'expo-router';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

const KitScrollView = () => {
  const { useKitsQuery } = useKitsStore();
  const { data, isLoading, error, refetch } = useKitsQuery();

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
        <ThemedText style={styles.errorText}>
          Error al cargar los kits.{"\n"}
          <Text style={styles.retryText} onPress={() => refetch()}>
            Toque para reintentar
          </Text>
        </ThemedText>
      </View>
    );
  }

  const handleEditKit = (kitId: number) => {
    router.push({
      pathname: "/(app)/(doctor)/(stack)/kits/editKit/[kitId]",
      params: { kitId: kitId.toString() },
    });
  };

  return (
    <FlatList
      horizontal={true}
      style={{ flexGrow: 1 }}  
      data={data?.data || []} 
      keyExtractor={(item) => item.kit_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.kitCard}>
          <View style={styles.kitHeader}>
            <ThemedText style={styles.kitTitle} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <Pressable
              onPress={() => handleEditKit(item.kit_id)}
              style={styles.optionsButton}
              accessibilityLabel={`Editar kit ${item.name}`}
            >
              <Ionicons name="create-outline" size={20} color="#606060" />
            </Pressable>
          </View>
          
          <ThemedText style={styles.kitDescription} numberOfLines={2}>
            {item.descripcion}
          </ThemedText>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={true}
    />
  );
};

const styles = StyleSheet.create({
  centerContent: { 
    justifyContent: "center", 
    alignItems: "center", 
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  kitCard: {
    backgroundColor: '#fff3e7',
    borderRadius: 10,
    padding: 10,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
      },
    }),
  },
  kitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kitTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  kitDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#606060",
  },
  optionsButton: { 
    padding: 4 
  },
  errorText: { 
    color: "red", 
    textAlign: "center", 
    fontSize: 16 
  },
  retryText: {
    color: "#ee7200",
    textDecorationLine: "underline",
  },
});

export default KitScrollView;