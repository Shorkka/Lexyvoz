// presentation/components/CrossPlatformDateInput.tsx
import React, { useState } from 'react';
import { Platform, Pressable, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { Ionicons } from '@expo/vector-icons';

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
};

const fromYMD = (s: string) => {
  // acepta YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(dt.getTime()) ? null : dt;
};

interface Props {
  value: Date;
  onChange: (d: Date) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CrossPlatformDateInput: React.FC<Props> = ({ value, onChange, disabled, placeholder = 'YYYY-MM-DD' }) => {
  const [open, setOpen] = useState(false);

  // Web: usa TextInput con formato YYYY-MM-DD
  if (Platform.OS === 'web') {
    return (
      <ThemedTextInput
        editable={!disabled}
        value={toYMD(value)}
        onChangeText={(txt) => {
          const parsed = fromYMD(txt);
          if (parsed) onChange(parsed);
        }}
        placeholder={placeholder}
        style={styles.input}
      />
    );
  }

  // iOS/Android: usa DateTimePicker modal inline
  return (
    <View>
      <Pressable disabled={disabled} style={styles.pressable} onPress={() => setOpen(true)}>
        <Ionicons name="calendar-outline" size={18} />
        <ThemedText style={{ marginLeft: 8 }}>{toYMD(value)}</ThemedText>
      </Pressable>

      {open && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setOpen(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
});

export default CrossPlatformDateInput;
