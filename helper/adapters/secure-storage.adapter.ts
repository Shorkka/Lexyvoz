// helper/adapters/secure-storage.adapter.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export class SecureStorageAdapter {
  static async getItem(key: string): Promise<string | null> {
    try {
      return isWeb 
        ? await AsyncStorage.getItem(key) 
        : await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting secure item:', error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Error setting secure item:', error);
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
      console.error('Error deleting secure item:', error);
    }
  }
}