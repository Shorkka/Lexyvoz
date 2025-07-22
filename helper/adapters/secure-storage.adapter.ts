import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export class SecureStorageAdapter {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error setting item in secure storage');
    }
  }

  static async setRegister(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error setting item in secure storage with role');
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error getting item from secure storage');
      return null;
    }
  }

  static async deleteItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error removing item from secure storage');
    }
  }
}
