import React, { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  Text,
  Pressable,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from "react-native";
import { useKitsAsignacionesStore } from "@/infraestructure/store/useKitsAsignacionesStore";
import { router } from "expo-router";
import ThemedBackground from "./ThemedBackground";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

// Habilitar animaciones en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface KitAsignado {
  id: number;
  kit_nombre: string;
  kit_descripcion: string;
  fecha_asignacion: string;
  estado: "Activo" | "Finalizado" | string;
}

interface RenderizarKitsAsignadosVistaDoctorProps {
  pacienteId: number;
  onRefresh?: () => void;
}

const RenderizarKitsAsignadosVistaDoctor: React.FC<
  RenderizarKitsAsignadosVistaDoctorProps
> = ({ pacienteId, onRefresh }) => {
  const [selectedKit, setSelectedKit] = useState<KitAsignado | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [expandedKitId, setExpandedKitId] = useState<number | null>(null);

  const buttonRefs = useRef<{ [key: string]: View | null }>({});

  const { useKitsAsignadosAPacientesQuery, eliminarKitAsignadoMutation } =
    useKitsAsignacionesStore();

  const { data, isLoading, error, refetch } =
    useKitsAsignadosAPacientesQuery(pacienteId);
  const { mutate: eliminarKit } = eliminarKitAsignadoMutation;

  const toggleKit = useCallback((kitId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedKitId((prevExpandedKitId) => prevExpandedKitId === kitId ? null : kitId);
  }, []);

  const handleKitOptionsPress = useCallback((kit: KitAsignado, event: any) => {
    event.stopPropagation();
    const buttonRef = buttonRefs.current[kit.id];
    if (buttonRef) {
      buttonRef.measureInWindow((x: number, y: number, width: number, height: number) => {
        setSelectedKit(kit);
        setAnchorLayout({ x, y, width, height });
        setDropdownVisible(true);
      });
    }
  }, []);

  const handleEditKit = useCallback(() => {
    if (selectedKit) {
      setDropdownVisible(false);
      router.push({
        pathname: "/(app)/(doctor)/(stack)/kits/editKit/[kitId]",
        params: { kitId: selectedKit.id.toString() },
      });
    }
  }, [selectedKit]);

  const handleDeleteKit = useCallback(() => {
    if (selectedKit) {
      Alert.alert(
        "Confirmar eliminación",
        `¿Eliminar kit "${selectedKit.kit_nombre}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              eliminarKit(selectedKit.id.toString(), {
                onSuccess: () => {
                  setDropdownVisible(false);
                  refetch();
                  onRefresh?.();
                  Alert.alert("Éxito", "Kit eliminado correctamente");
                },
                onError: (error) => {
                  Alert.alert(
                    "Error",
                    error.message || "No se pudo eliminar el kit"
                  );
                },
              });
            },
          },
        ]
      );
    }
  }, [selectedKit, eliminarKit, refetch, onRefresh]);

  const handleOpenTray = useCallback(() => {
    if (selectedKit) {
      setDropdownVisible(false);
      router.push({
        pathname: "/(app)/(doctor)/(stack)/kits/kits-list",
        params: {
          kitId: selectedKit.id.toString(),
          pacienteId: pacienteId.toString(),
        },
      });
    }
  }, [selectedKit, pacienteId]);

  const renderKitItem = useCallback(
    ({ item }: { item: KitAsignado }) => (
      <View>
        <Pressable
          onPress={() => toggleKit(item.id)}
          style={styles.kitHeader}
          android_ripple={{ color: "#f0f0f0" }}
        >
          <View style={styles.kitHeaderContent}>
            <ThemedText style={styles.kitTitle} numberOfLines={1}>
              {item.kit_nombre}
            </ThemedText>
            <ThemedText
              style={[
                styles.kitStatus,
                item.estado === "Activo"
                  ? styles.statusActive
                  : item.estado === "Finalizado"
                  ? styles.statusCompleted
                  : styles.statusInactive,
              ]}
            >
              {item.estado}
            </ThemedText>
          </View>
          <View style={styles.kitHeaderIcons}>
            <Ionicons
              name={expandedKitId === item.id ? "chevron-up" : "chevron-down"}
              size={20}
              color="#606060"
              style={styles.chevronIcon}
            />
            <Pressable
              ref={(ref) => {
                buttonRefs.current[item.id] = ref;
              }}
              onPress={(e) => handleKitOptionsPress(item, e)}
              style={styles.optionsButton}
              accessibilityLabel={`Opciones para kit ${item.kit_nombre}`}
              accessibilityHint="Abre menú de opciones para este kit"
            >
              <Ionicons name="ellipsis-vertical-outline" size={20} color="black" />
            </Pressable>
          </View>
        </Pressable>

        {expandedKitId === item.id && (
          <View style={styles.expandedContent}>
            <ThemedText style={styles.kitDescription} numberOfLines={3}>
              {item.kit_descripcion}
            </ThemedText>
            <ThemedText style={styles.kitDate}>
              Asignado: {new Date(item.fecha_asignacion).toLocaleDateString()}
            </ThemedText>
          </View>
        )}
      </View>
    ),[handleKitOptionsPress, expandedKitId, toggleKit]
  );

  // Cálculo de la posición del dropdown (ajustado para que aparezca al lado del ícono)
  const calculateDropdownPosition = () => {
    if (!anchorLayout) return {};

    const { x, y, width } = anchorLayout;
    const screenWidth = Dimensions.get("window").width;
    const dropdownWidth = 200;

    let left = x + width + 8;
    if (left + dropdownWidth > screenWidth) {
      left = screenWidth - dropdownWidth - 8;
    }

    return {
      top: y,
      left,
    };
  };

  if (isLoading) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ActivityIndicator size="large" color="#ee7200" />
      </ThemedBackground>
    );
  }

  if (error) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ThemedText style={styles.errorText}>
          Error al cargar los kits.{"\n"}
          <Text style={styles.retryText} onPress={() => refetch()}>
            Toque para reintentar
          </Text>
        </ThemedText>
      </ThemedBackground>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <ThemedBackground style={styles.centerContent}>
        <ThemedText style={styles.emptyText}>
          No hay kits asignados a este paciente
        </ThemedText>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container}>
      <FlatList
        data={data.data.map((kit: any) => ({
          ...kit,
          fecha_asignacion:
            typeof kit.fecha_asignacion === "string"
              ? kit.fecha_asignacion
              : kit.fecha_asignacion?.toISOString?.() ?? "",
        }))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderKitItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {dropdownVisible && anchorLayout && (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setDropdownVisible(false)}
            accessibilityLabel="Cerrar menú"
          />
          <View
            style={[
              styles.dropdownContainer,
              calculateDropdownPosition(),
            ]}
            accessibilityViewIsModal={true}
          >
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={handleEditKit}
                accessibilityLabel="Editar kit"
              >
                <Ionicons name="create-outline" size={20} color="#606060" />
                <Text style={styles.dropdownText}>Editar Kit</Text>
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.dropdownItem}
                onPress={handleOpenTray}
                accessibilityLabel="Abrir bandeja del kit"
              >
                <Ionicons name="folder-open-outline" size={20} color="#606060" />
                <Text style={styles.dropdownText}>Abrir Bandeja</Text>
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.dropdownItem}
                onPress={handleDeleteKit}
                accessibilityLabel="Eliminar kit"
              >
                <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                <Text style={[styles.dropdownText, { color: "#ff3b30" }]}>
                  Eliminar Kit
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  kitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kitHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  kitHeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  kitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  kitStatus: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#e6f7ee",
    color: "green",
  },
  statusCompleted: {
    backgroundColor: "#e6f0ff",
    color: "#339af0",
  },
  statusInactive: {
    backgroundColor: "#f8f9fa",
    color: "#868e96",
  },
  expandedContent: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },
  kitDescription: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
    flexShrink: 1,
  },
  kitDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  chevronIcon: {
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  retryText: {
    color: "#ee7200",
    textDecorationLine: "underline",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  dropdownContainer: {
    position: "absolute",
    zIndex: 2000,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownText: {
    color: "#0f0f0f",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default RenderizarKitsAsignadosVistaDoctor;
