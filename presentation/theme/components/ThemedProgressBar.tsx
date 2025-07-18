import { View, useWindowDimensions, ViewStyle } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';

interface Props {
  progress: number;
  color?: string;
  width?: number | `${number}%`; // Puedes pasarle porcentaje como texto
  align?: 'center' | 'left' | 'right';
}

const ThemedProgressBar: React.FC<Props> = ({
  progress,
  color = '#FFA500',
  width = 300,
  align = 'center',
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // Alineación horizontal
  let alignSelf: ViewStyle['alignSelf'] = 'center';
  if (align === 'left') alignSelf = 'flex-start';
  if (align === 'right') alignSelf = 'flex-end';

  // Si es un string tipo "80%", lo convertimos a número
  const computedWidth: number =
    typeof width === 'string'
      ? (parseFloat(width) / 100) * screenWidth
      : Math.min(width, screenWidth * 0.95);

  return (
    <View style={{ alignSelf }}>
      <Progress.Bar
        progress={progress}
        width={computedWidth}
        color={color}
        borderRadius={8}
        unfilledColor="#e0e0e0"
        borderWidth={0}
        animationType="spring"
      />
    </View>
  );
};

export default ThemedProgressBar;
