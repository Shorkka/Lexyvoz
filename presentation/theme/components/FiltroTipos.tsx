import React from "react";
import { Modal, Pressable, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TipoFiltro = "todos" | "lectura" | "visual" | "escrito";

interface Props {
  value: TipoFiltro;
  onChange: (v: TipoFiltro) => void;
  counters?: Partial<Record<TipoFiltro, number>>;
  visible?: Partial<Record<TipoFiltro, boolean>>;
  label?: string;
}

export default function FiltroTipos({
  value,
  onChange,
  counters,
  visible,
  label = "Filtros",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const show = (k: TipoFiltro) => visible?.[k] !== false;

  const Item = ({
    k,
    icon,
    text,
  }: {
    k: TipoFiltro;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    text: string;
  }) => {
    if (!show(k)) return null;
    const active = value === k;
    const count = counters?.[k];
    return (
      <Pressable
        onPress={() => {
          onChange(k);
          setOpen(false);
        }}
        android_ripple={{ color: "#eee" }}
        style={[styles.item, active && styles.itemActive]}
      >
        <Ionicons name={icon} size={18} color={active ? "#000" : "#444"} />
        <Text style={[styles.itemText, active && styles.itemTextActive]}>
          {text}
          {typeof count === "number" ? ` (${count})` : ""}
        </Text>
        {active && <Ionicons name="checkmark" size={18} color="#000" style={{ marginLeft: "auto" }} />}
      </Pressable>
    );
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)} android_ripple={{ color: "#eee" }} style={styles.button}>
        <Ionicons name="filter-outline" size={18} color="#000" />
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Filtrar por tipo</Text>
            <Item k="todos"   icon="apps-outline"   text="Todos"   />
            <Item k="lectura" icon="book-outline"   text="Lectura" />
            <Item k="visual"  icon="eye-outline"    text="Visual"  />
            <Item k="escrito" icon="create-outline" text="Escrito" />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    ...Platform.select({ android: { elevation: 1 } }),
  },
  buttonText: { marginLeft: 6, color: "#000", fontWeight: "600" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  sheet: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  sheetTitle: { fontWeight: "800", fontSize: 16, marginBottom: 6, color: "#111" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  itemActive: { backgroundColor: "#f6e0c8" },
  itemText: { marginLeft: 8, color: "#444", fontWeight: "600" },
  itemTextActive: { color: "#000" },
});
