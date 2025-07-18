import { Platform, useWindowDimensions } from 'react-native';

export const useResponsivePadding = () => {
  const { width } = useWindowDimensions();

  const getResponsivePadding = (value: number, base: number) => {
    if (Platform.OS === 'web') {
      return Math.min(width * 0.3, value);
    } else {
      const basePadding = width * 0.1;
      return Math.max(16, Math.min(basePadding, base));
    }
  };

  return { getResponsivePadding };
};