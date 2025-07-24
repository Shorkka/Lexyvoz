import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { useThemeColor } from '../hooks/useThemeColor';

type IconSet = 'Ionicons' | 'MaterialIcons' | 'Feather';

interface ThemedPressableDrawerItemProps {
  icon?: string;
  iconSet?: IconSet;
  label?: string;
  textColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ThemedPressableDrawerItem: React.FC<ThemedPressableDrawerItemProps> = ({
  icon,
  iconSet = 'Ionicons',
  label,
  textColor ='white',
  onPress,
  style,
  textStyle = 'white',
  ...pressableProps
}) => {
  const themeTextColor = useThemeColor({}, 'text');
  const defaultTextColor = textColor || themeTextColor;

  const renderIcon = () => {
    if (!icon) return null;

    const iconProps = {
      size: 24,
      color: defaultTextColor,
    };

    switch (iconSet) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon as any} {...iconProps} />;
      case 'Feather':
        return <Feather name={icon as any} {...iconProps} />;
      case 'Ionicons':
      default:
        return <Ionicons name={icon as any} {...iconProps} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    menuItemText: {
      marginLeft: 10,
      fontSize: 14,
      color: defaultTextColor,
    },
    pressed: {
      opacity: 0.6,
    },
  });

  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      {...pressableProps}
    >
      {renderIcon()}
      {label && (
        <Text style={[styles.menuItemText]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default ThemedPressableDrawerItem;