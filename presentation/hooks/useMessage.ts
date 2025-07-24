import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
}

export const useAlert = () => {
  const showAlert = (
    title: string, 
    message: string, 
    buttons?: AlertButton[]
  ) => {
    if (Platform.OS === 'web') {
      if (buttons && buttons.length > 0) {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        if (confirmed && buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else {
        window.alert(`${title}\n\n${message}`);
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  return { showAlert };
};