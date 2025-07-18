import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props {
  label: string;
  required?: boolean;
  showError?: boolean;
}

const FieldLabel = ({ label, required = false, showError = false }: Props) => {
  const errorColor = useThemeColor({}, 'error');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
      <Text style={{ color: textColor, fontSize: 14 }}>{label}</Text>
      {required && (
        <Text style={{ color: showError ? errorColor : textColor, fontSize: 14 }}> *</Text>
      )}
    </View>
  );
};

export default FieldLabel;