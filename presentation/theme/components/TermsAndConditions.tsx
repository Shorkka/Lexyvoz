import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from './hooks/useThemeColor';
import TermsContent from './TermsContent';
import TermsModal from './TermsModal';

type ConfirmResult = {
  accepted: boolean;
  consentVoiceProcessing: boolean; // requerido
  consentVoiceTraining: boolean;   // opcional (entrenamiento IA)
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (result: ConfirmResult) => void;
  appName?: string;
  lastUpdated?: string;
};

const TermsAndConditions: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  appName,
  lastUpdated,
}) => {
  const primary = useThemeColor({}, 'primary');
  const [processing, setProcessing] = useState(true);      // requerido para Aceptar
  const [training, setTraining] = useState(false);         // opcional
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    if (!processing) {
      setError('Debes aceptar el uso de tu voz para prestar el servicio.');
      return;
    }
    setError(null);
    onConfirm({
      accepted: true,
      consentVoiceProcessing: processing,
      consentVoiceTraining: training,
    });
  };

  return (
    <TermsModal visible={visible} onClose={onClose} onAccept={handleAccept}>
      <TermsContent appName={appName} lastUpdated={lastUpdated} />

      {/* Consentimientos */}
      <View style={styles.consentBox}>
        <CheckRow
          checked={processing}
          onToggle={() => setProcessing((v) => !v)}
          label="Acepto el uso de mi voz para prestar el servicio (requerido)."
          color={primary}
        />
        <CheckRow
          checked={training}
          onToggle={() => setTraining((v) => !v)}
          label="Autorizo el uso de mi voz y transcripciones para entrenar y mejorar los modelos de IA (opcional)."
          color={primary}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.hint}>
          Puedes retirar el consentimiento opcional de entrenamiento en cualquier momento desde la configuración o contactándonos.
        </Text>
      </View>
    </TermsModal>
  );
};

const CheckRow = ({
  checked,
  onToggle,
  label,
  color,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  color: string;
}) => (
  <Pressable
    onPress={onToggle}
    style={styles.row}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    hitSlop={8}
  >
    <View style={[styles.checkbox, checked && { backgroundColor: color, borderColor: color }]}>
      {checked ? <Text style={styles.check}>✓</Text> : null}
    </View>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  consentBox: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#fff', fontWeight: '700', lineHeight: 16 },
  label: { flex: 1, color: '#333', fontSize: 13, lineHeight: 18 },
  error: { color: '#d32f2f', marginTop: 4, fontSize: 12 },
  hint: { color: '#666', marginTop: 6, fontSize: 12 },
});

export default TermsAndConditions;
