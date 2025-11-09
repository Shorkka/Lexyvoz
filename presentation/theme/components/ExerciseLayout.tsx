import React from "react";
import { View, StyleSheet, Platform, ViewStyle, useWindowDimensions } from "react-native";
import ThemedBackground from "@/presentation/theme/components/ThemedBackground";
import { ThemedText } from "@/presentation/theme/components/ThemedText";

type Variant = "lectura" | "escrito" | "visual";

interface ExerciseLayoutProps {
  title?: string;
  subtitle?: string;
  /** Cambia acentos/bordes según el tipo */
  variant?: Variant;
  /** Si quieres 3 columnas, usa columns; si no, pasa children y se renderiza 1 sola área central */
  columns?: {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
  };
  /** Contenido libre (cuando no uses columns) */
  children?: React.ReactNode;
  /** Footer opcional (botones Siguiente/Finalizar, etc.) */
  footer?: React.ReactNode;
  /** Estilos extra para el contenedor blanco interno */
  contentStyle?: ViewStyle;
}

const ACCENTS: Record<Variant, { border: string; tag: string }> = {
  lectura: { border: "#f59e0b", tag: "Lectura" },
  escrito: { border: "#f59e0b", tag: "Escrito" },
  visual:  { border: "#f59e0b", tag: "Visual"  },
};

export default function ExerciseLayout({
  title,
  subtitle,
  variant = "lectura",
  columns,
  children,
  footer,
  contentStyle,
}: ExerciseLayoutProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900; // 3 columnas lado a lado en pantallas anchas
  const accent = ACCENTS[variant] ?? ACCENTS.lectura;

  return (
    <ThemedBackground
      justifyContent="flex-start"
      fullHeight
      backgroundColor="#fba557"
     style={{ paddingVertical: 30, paddingHorizontal: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        {!!title && (
          <ThemedText type="title" style={styles.headerTitle}>
            {title}
          </ThemedText>
        )}
        {!!subtitle && (
          <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
        )}

        {/* Etiqueta del tipo */}
        <View style={[styles.tag, { borderColor: accent.border }]}>
          <ThemedText style={{ color: "#fff" }}>{ACCENTS[variant].tag}</ThemedText>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.body}>
        {columns ? (
          <View style={[isWide ? styles.gridRow : styles.gridCol]}>
            <ThemedBackground
              backgroundColor="white"
              style={[
                styles.column,
                { borderColor: accent.border },
                isWide ? styles.mr : styles.mb,
                contentStyle,
              ]}
            >
              {columns.left ?? <Placeholder text="(Columna izquierda vacía)" />}
            </ThemedBackground>

            <ThemedBackground
              backgroundColor="white"
              style={[
                styles.column,
                { borderColor: accent.border },
                isWide ? styles.mr : styles.mb,
                contentStyle,
              ]}
            >
              {columns.center ?? <Placeholder text="(Área central vacía)" />}
            </ThemedBackground>

            <ThemedBackground
              backgroundColor="white"
              style={[
                styles.column,
                { borderColor: accent.border },
                contentStyle,
              ]}
            >
              {columns.right ?? <Placeholder text="(Columna derecha vacía)" />}
            </ThemedBackground>
          </View>
        ) : (
          <ThemedBackground
            backgroundColor="white"
            style={[styles.singleBox, { borderColor: accent.border }, contentStyle]}
          >
            {children ?? <Placeholder text="(Contenido vacío)" />}
          </ThemedBackground>
        )}
      </View>

      {/* Footer opcional */}
      {!!footer && <View style={styles.footer}>{footer}</View>}
    </ThemedBackground>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <View style={styles.placeholderBox}>
      <ThemedText style={{ color: "#888" }}>{text}</ThemedText>
    </View>
  );
}

const SPACING = 12;

const styles = StyleSheet.create({
  root: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#000",
    textAlign: "center",
  },
  headerSubtitle: {
    opacity: 0.8,
    marginTop: 4,
    color: "#000",
    textAlign: "center",
  },
  tag: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: "#fba557",
  },
  body: {
    width: "100%",
    paddingHorizontal: 4,
    marginTop: 4,
  },

  // Layout de columnas
  gridRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  gridCol: {
    flexDirection: "column",
  },

  column: {
    flex: 1,
    minHeight: 160,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    minWidth: 0, // evita overflow en Android
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4 },
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.08)" as any },
    }),
  },

  // Márgenes manuales (en vez de `gap`)
  mr: { marginRight: SPACING },
  mb: { marginBottom: SPACING },

  singleBox: {
    borderRadius: 12,
    padding: 12,
    minHeight: 200,
    borderWidth: 2,
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4 },
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.08)" as any },
    }),
  },

  footer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },

  placeholderBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
