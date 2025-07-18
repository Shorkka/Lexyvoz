import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
export class SecureStorageAdapter {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.log(error);
      Alert.alert('Error setting item in secure storage:');
    }
  }

  static async setRegister(key: string, value: string, tipo: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value );
    } catch (error) {
        console.log(error);
      Alert.alert('Error setting item in secure storage with role:');
    }
  }


  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.log(error);
      Alert.alert('Error', 'getting item from secure storage:');
      return null;
    }
  }

  static async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.log(error);
      Alert.alert('Error removing item from secure storage:');
    }
  }
}