import React from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import LabelWithAsterisk from '@/presentation/theme/components/LabelWithAsterisk';

interface Props {
  selected: string;
  onSelect: (value: string) => void;
  showError?: boolean; // ← ahora es opcional
}

const GenderSelector: React.FC<Props> = ({ selected, onSelect, showError }) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <LabelWithAsterisk label="Género" required={showError} />
      
      <View
        style={{
          flexDirection: Platform.select({
            web: width < 600 ? 'column' : 'row',
            default: width < 300 ? 'column' : 'row',
          }),
          justifyContent: width < 500 ? 'flex-start' : 'space-around',
          gap: 12,
        }}
      >
        {['Masculino', 'Femenino', 'Otro'].map((gender) => (
          <RadioButton
            key={gender}
            label={gender}
            value={gender}
            selected={selected === gender}
            onPress={onSelect}
          />
        ))}
      </View>
    </>
  );
};

export default GenderSelector;
