import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
// @ts-ignore - sólo en web existe document
import ReactDOM from 'react-dom';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function TermsModal({
  visible,
  onClose,
  onAccept,
  title = 'Términos y Condiciones',
  children,
}: Props) {
  if (!visible) return null;

  const content = (
    <View
      style={styles.overlay}
      // Accesibilidad en web
      {...(Platform.OS === 'web'
        ? { role: 'dialog', 'aria-modal': true }
        : {})}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>

        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 16 }}
          // Asegura scroll en web con teclado
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={onClose}>
            <Text style={[styles.btnText, styles.btnGhostText]}>Cerrar</Text>
          </Pressable>

          {onAccept ? (
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={onAccept}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText]}>Aceptar</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );

  // En web: portal al <body> para evitar contenedores con aria-hidden / overflow
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return ReactDOM.createPortal(content, document.body);
  }

  // En nativo: overlay absoluto en el mismo árbol
  return content;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0 as any,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    inset: 0 as any,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    width: '90%',
    maxWidth: 680,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      } as any,
    }),
    // Altura adaptable (vh en web, números en nativo)
    maxHeight:
      Platform.OS === 'web'
        ? '85vh'
        : 600,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  body: {
    flexGrow: 0,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  btnPrimary: {
    backgroundColor: '#ff9900',
  },
  btnPrimaryText: {
    color: '#fff',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnGhostText: {
    color: '#333',
  },
});
