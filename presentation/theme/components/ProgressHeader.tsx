import React from 'react';
import { View } from 'react-native';
import ThemedProgressBar from '@/presentation/theme/components/ThemedProgressBar';
import { ThemedText } from '@/presentation/theme/components/ThemedText';

const ProgressHeader = ({ step = 2, total = 3 }) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 10 }}>
      <ThemedText type="title">Lexyvoz</ThemedText>
      <ThemedText>Paso {step} de {total}</ThemedText>
      <ThemedProgressBar progress={step / total} width={400} align="center" color="#FF6600" />
    </View>
  );
};

export default ProgressHeader;
