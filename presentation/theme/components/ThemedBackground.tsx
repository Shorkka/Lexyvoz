import React, { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

type Props = {
  children: ReactNode;
  backgroundColor?: string; // Color del fondo
  width?: number |  `${number}%`;  // Ancho: 400, '80%'...
  align?: 'center' | 'left' | 'right'; // Posición horizontal
};

const ThemedBackground = ({
  children,
  backgroundColor = 'white',
  width = 600,
  align = 'center',
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  // Alineación horizontal
  let alignSelf: 'center' | 'flex-start' | 'flex-end' = 'center';
  if (align === 'left') alignSelf = 'flex-start';
  if (align === 'right') alignSelf = 'flex-end';

  return (
    <View style={[styles.wrapper]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor,
            width:
              typeof width === 'string'
                ? width
                : Platform.select({
                    web: Math.min(700, windowWidth * 0.9), // Más ancho en web
                    default: Math.min(400, windowWidth * 0.95), // Más angosto en móvil
                  }),
            alignSelf,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // Esto permite múltiples tarjetas en una misma pantalla
    width: '100%',
    paddingVertical: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 100,
    // Sombra cross-platform
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
});

export default ThemedBackground;
