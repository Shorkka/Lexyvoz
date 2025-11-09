import React, { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ThemedBackground from "@/presentation/theme/components/ThemedBackground";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useKitsAsignacionesStore } from "@/infraestructure/store/useKitsAsignacionesStore";

interface KitAsignado {
  id: number;
  kit_nombre: string;
  kit_descripcion: string;
  fecha_asignacion: string;
  estado: "Activo" | "Finalizado" | string;
}

interface Props {
  pacienteId: number;
  onRefresh?: () => void;
}

const DROPDOWN_W = 220;
const DROPDOWN_H = 180;
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const CARD_W = 280;

const RenderizarKitsAsignadosVistaDoctor: React.FC<Props> = ({
  pacienteId,
  onRefresh,
}) => {
  const [selectedKit, setSelectedKit] = useState<KitAsignado | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // refs por tarjeta para anclar el menú justo sobre el kit
  const cardRefs = useRef<Record<string, any>>({});
  const scrollRef = useRef<FlatList<KitAsignado>>(null);

  const {
    useKitsAsignadosAPacientesQuery,
    eliminarKitAsignadoMutation,
  } = useKitsAsignacionesStore();
  const { data, isLoading, error, refetch } =
    useKitsAsignadosAPacientesQuery(pacienteId);
  const { mutate: eliminarKit } = eliminarKitAsignadoMutation;

  // Abre el menú anclado a la ESQUINA SUPERIOR DERECHA de la tarjeta
  const handleKitOptionsPress = useCallback((kit: KitAsignado, e?: any) => {
    e?.stopPropagation?.();
    setSelectedKit(kit);

    if (Platform.OS === "web") {
      const node: any = cardRefs.current[kit.id];
      const rect =
        (node as any)?._node?.getBoundingClientRect?.() ||
        (node as any)?.getBoundingClientRect?.();

      if (rect) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const left = clamp(rect.left + rect.width - DROPDOWN_W, 8, vw - DROPDOWN_W - 8);
        const top  = clamp(rect.top + 8, 8, vh - DROPDOWN_H - 8);
        setAnchorLayout({ x: left, y: top, width: rect.width, height: rect.height });
        setDropdownVisible(true);
        return;
      }
    }

    // Nativo: mide la tarjeta en ventana
    const ref = cardRefs.current[kit.id];
    if (ref?.measureInWindow) {
      ref.measureInWindow((x: number, y: number, w: number, h: number) => {
        const { width: sw, height: sh } = Dimensions.get("window");
        const left = clamp(x + w - DROPDOWN_W, 8, sw - DROPDOWN_W - 8);
        const top  = clamp(y + 8, 8, sh - DROPDOWN_H - 8);
        setAnchorLayout({ x: left, y: top, width: w, height: h });
        setDropdownVisible(true);
      });
    } else {
      // último recurso
      setAnchorLayout({ x: 20, y: 80, width: 0, height: 0 });
      setDropdownVisible(true);
    }
  }, []);

  const handleEditKit = useCallback(() => {
    if (!selectedKit) return;
    setDropdownVisible(false);
    router.push({
      pathname: "/(app)/(doctor)/(stack)/kits/editKit/[kitId]",
      params: { kitId: String(selectedKit.id) },
    });
  }, [selectedKit]);

  const handleDeleteKit = useCallback(() => {
    if (!selectedKit) return;
    Alert.alert("Confirmar eliminación", `¿Eliminar kit "${selectedKit.kit_nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          eliminarKit(String(selectedKit.id), {
            onSuccess: () => {
              setDropdownVisible(false);
              refetch();
              onRefresh?.();
              Alert.alert("Éxito", "Kit eliminado correctamente");
            },
            onError: (err: any) =>
              Alert.alert("Error", err?.message || "No se pudo eliminar el kit"),
          });
        },
      },
    ]);
  }, [selectedKit, eliminarKit, refetch, onRefresh]);

  const handleOpenTray = useCallback(() => {
    if (!selectedKit) return;
    setDropdownVisible(false);
    router.push({
      pathname: "/(app)/(doctor)/(stack)/kits/kits-list",
      params: { kitId: String(selectedKit.id), pacienteId: String(pacienteId) },
    });
  }, [selectedKit, pacienteId]);

  const calculateDropdownPosition = () => {
    if (!anchorLayout) return {};
    const { x, y } = anchorLayout;
    // Web: fixed en coords de viewport; Nativo: absolute a ventana
    if (Platform.OS === "web") return { top: y, left: x };
    const { width: sw, height: sh } = Dimensions.get("window");
    return {
      top: clamp(y, 8, sh - DROPDOWN_H - 8),
      left: clamp(x, 8, sw - DROPDOWN_W - 8),
    };
  };

  // ---------- DATA ----------
  if (isLoading) {
    return (
      <ThemedBackground fullHeight style={styles.center}>
        <ActivityIndicator size="large" color="#ee7200" />
      </ThemedBackground>
    );
  }
  if (error) {
    return (
      <ThemedBackground fullHeight style={styles.center}>
        <ThemedText style={{ color: "red", textAlign: "center" }}>
          Error al cargar los kits.{"\n"}Toque para reintentar
        </ThemedText>
      </ThemedBackground>
    );
  }

  const items: KitAsignado[] =
    data?.data?.map((k: any) => ({
      ...k,
      fecha_asignacion:
        typeof k.fecha_asignacion === "string"
          ? k.fecha_asignacion
          : k.fecha_asignacion?.toISOString?.() ?? "",
    })) ?? [];

  if (!items.length) {
    return (
      <ThemedBackground fullHeight style={styles.center}>
        <ThemedText>No hay kits asignados a este paciente</ThemedText>
      </ThemedBackground>
    );
  }

  // Tarjeta SIEMPRE desplegada (sin chevron ni toggle)
  const renderKitItem = ({ item }: { item: KitAsignado }) => (
    <View
      ref={(r) => {
        cardRefs.current[item.id] = r;
      }}
      style={styles.card}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {item.kit_nombre}
        </ThemedText>

        <View style={styles.headerActions}>
          <ThemedText
            style={[
              styles.status,
              item.estado === "Activo"
                ? styles.stActive
                : item.estado === "Finalizado"
                ? styles.stDone
                : styles.stIdle,
            ]}
          >
            {item.estado}
          </ThemedText>

          <Pressable onPress={(e) => handleKitOptionsPress(item, e)} style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical-outline" size={18} color="#000" />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <ThemedText numberOfLines={3} style={{ opacity: 0.85 }}>
          {item.kit_descripcion}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
          Asignado: {new Date(item.fecha_asignacion).toLocaleDateString()}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedBackground
      
      style={{ flex: 1 }}           // ⬅️ llena todo el alto disponible
      backgroundColor="transparent" // no tapa tu naranja de fondo
    >
      <FlatList
        ref={scrollRef}
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderKitItem}
        horizontal
        showsHorizontalScrollIndicator={true}
        scrollIndicatorInsets={{ bottom: 2 }}
        style={[styles.hListScroll, Platform.OS === "web" && styles.hListScrollWeb]}
        contentContainerStyle={styles.hList}
      />

      {dropdownVisible && anchorLayout && (
        <>
          <Pressable
            style={[styles.overlay, Platform.OS === "web" && styles.fixed]}
            onPress={() => setDropdownVisible(false)}
          />
          <View
            style={[
              styles.dropdownContainer,
              Platform.OS === "web" && styles.fixed,
              calculateDropdownPosition(),
            ]}
          >
            <View style={styles.dropdown}>
              <Pressable style={styles.ddItem} onPress={handleEditKit}>
                <Ionicons name="create-outline" size={20} color="#606060" />
                <Text style={styles.ddText}>Editar Kit</Text>
              </Pressable>

              <View style={styles.sep} />

              <Pressable style={styles.ddItem} onPress={handleOpenTray}>
                <Ionicons name="folder-open-outline" size={20} color="#606060" />
                <Text style={styles.ddText}>Abrir Bandeja</Text>
              </Pressable>

              <View style={styles.sep} />

              <Pressable style={styles.ddItem} onPress={handleDeleteKit}>
                <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                <Text style={[styles.ddText, { color: "#ff3b30" }]}>Eliminar Kit</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },

  // lista horizontal
  hList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12 as any,
  },
  hListScroll: {
    paddingBottom: 2,
  },
  hListScrollWeb: {
    overflow: "auto" as any,
  },

  // tarjeta
  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      web: { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" as any },
    }),
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "700", color: "#ee7200", flex: 1, marginRight: 8 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 as any },
  iconBtn: { padding: 6 },

  status: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 4,
  },
  stActive: { backgroundColor: "#e6f7ee", color: "green" },
  stDone: { backgroundColor: "#e6f0ff", color: "#339af0" },
  stIdle: { backgroundColor: "#f8f9fa", color: "#868e96" },

  body: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#f1f1f1", paddingTop: 8 },

  // overlay + dropdown
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
  fixed: { position: "fixed" as any },
  dropdownContainer: { position: "absolute", zIndex: 2000 },
  dropdown: {
    width: DROPDOWN_W,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  ddItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12 as any,
  },
  ddText: { color: "#0f0f0f", fontSize: 14, fontWeight: "500", flex: 1 },
  sep: { height: 1, backgroundColor: "#f0f0f0", marginHorizontal: 8 },
});

export default RenderizarKitsAsignadosVistaDoctor;
