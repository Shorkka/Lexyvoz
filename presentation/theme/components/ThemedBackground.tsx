import React, { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
  width?: number | `${number}%`;
  align?: 'center' | 'left' | 'right';
  color?: string;
  style?: object;
  height?: number | `${number}%`;
  fullHeight?: boolean;
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

};

const ThemedBackground = ({
  children,
  backgroundColor = 'white',
  width = '80%',
  height,
  align = 'center',
  style = {},
  fullHeight = false,
  justifyContent = 'center',
}: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  let alignSelf: 'center' | 'flex-start' | 'flex-end' = 'center';
  if (align === 'left') alignSelf = 'flex-start';
  if (align === 'right') alignSelf = 'flex-end';

  return (
    <View style={[styles.wrapper]}>
      <View
        style={[
          styles.card,
          style,
          {
            backgroundColor,
            width:
              typeof width === 'string'
                ? width
                : Platform.select({
                    web: Math.min(700, windowWidth * 0.8),
                    default: Math.min(400, windowWidth * 0.95),
                  }),
            alignSelf,
            height: fullHeight ? windowHeight * 0.8 : height, // <- CLAVE
            justifyContent
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
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        boxShadow: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 5,
      },
    }),
  },
});

export default ThemedBackground;
