// presentation/theme/components/LabelWithAsterisk.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface Props {
  label: string;
  required?: boolean;
}

const LabelWithAsterisk: React.FC<Props> = ({ label, required = false }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 14 }}>{label}</ThemedText>
      {required && (
        <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>
      )}
    </View>
  );
};

export default LabelWithAsterisk;
