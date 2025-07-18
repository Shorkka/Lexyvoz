import React from 'react';
import { TextInput, View, StyleSheet, Platform, TextInputProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';

type ThemedInputProps = TextInputProps & {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  icon?: string;
  error?: boolean;
};

const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  required = false,
  errorMessage,
  style,
  ...rest
}) => {
  const borderColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'input');

  return (
    <View style={{ marginBottom: 20, width: '100%' }}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {required && <ThemedText style={{ color: 'red' }}> *</ThemedText>}
          
        </ThemedText>
      )}
      <TextInput
        placeholderTextColor="#999"
        style={[
          styles.input,
          { borderColor, color: textColor, backgroundColor },
          style,
        ]}
        {...rest}
      />
      {errorMessage && (
        <ThemedText style={{ color: 'red', fontSize: 12 }}>{errorMessage}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    fontSize: 16,
    width: '100%',
  },
});

export default ThemedInput;
