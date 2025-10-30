import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import styleImage from '@/constants/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';


import { predefinedAvatars } from '@/constants/avatars';
import { pickUserImage } from '@/utils/imageUtils';
import { Asset } from 'expo-asset';
import type { FileLike } from '@/presentation/utils/defaultAvatar';

const ProfileScreen = () => {
  const avatar = require('../../../../assets/images/perfil.png');
  const { user, updateUser, userType, updateAvatar } = useAuthStore(); 
  const backgroundColor = useThemeColor({}, 'background');
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal para elegir avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    contrasenia: '',
    fecha_de_nacimiento: user?.fecha_de_nacimiento ? new Date(user.fecha_de_nacimiento) : new Date(),
    numero_telefono: user?.numero_telefono || '',
    sexo: user?.sexo || '',
    tipo: user?.tipo || '',
    escolaridad: user?.escolaridad || '',
    especialidad: user?.especialidad || '',
    domicilio: user?.domicilio || '',
    codigo_postal: user?.codigo_postal || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, fecha_de_nacimiento: selectedDate });
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.correo) {
        Alert.alert('Error', 'Nombre y correo son campos obligatorios');
        return;
      }
      await updateUser({
        ...formData,
        fecha_de_nacimiento: formData.fecha_de_nacimiento,
      });
      setIsEditing(false);
      Alert.alert('Perfil actualizado', 'Tus cambios se han guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString('es-MX');

  const returnPage = () => {
    if (userType === 'Doctor') router.replace('/main');
    else router.replace('/home');
  };

  // Avatar predefinido → convertir require() a FileLike y subir
  const handleSelectPredefined = async (src: any) => {
    try {
      const [asset] = await Asset.loadAsync(src);
      const file: FileLike = {
        uri: asset.localUri ?? asset.uri,
        name: 'avatar_predefinido.png',
        type: 'image/png',
      };
      await updateAvatar(file);
      setShowAvatarModal(false);
      Alert.alert('Éxito', 'Avatar actualizado');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar el avatar');
    }
  };

  // Avatar propio → abrir galería y subir
  const handlePickCustom = async () => {
    const file = await pickUserImage();
    if (!file) return;
    try {
      await updateAvatar(file);
      setShowAvatarModal(false);
      Alert.alert('Éxito', 'Avatar actualizado');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar el avatar');
    }
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={{ flex: 1, backgroundColor: backgroundColor }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <ThemedBackground fullHeight backgroundColor="#fba557" style={styles.orangeBackground}>
              {/* Botón de regreso */}
              <TouchableOpacity style={styles.backButton} onPress={returnPage}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>

              <ScrollView style={styles.profileContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => isEditing && setShowAvatarModal(true)}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={user?.imagen_url ? { uri: user.imagen_url } : avatar}
                      style={styleImage.avatar}
                    />
                    {isEditing && (
                      <Ionicons
                        name="camera"
                        size={28}
                        color="#fff"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: '#00000099',
                          borderRadius: 20,
                          padding: 5,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <ThemedText type="welcome" style={styles.welcomeText}>
                  {isEditing ? 'Editar Perfil' : 'Mi Perfil'}
                </ThemedText>

                {/* Campos comunes */}
                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Nombre completo</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.nombre} onChangeText={(v) => handleInputChange('nombre', v)} style={styles.input} />
                  ) : (
                    <ThemedText style={styles.value}>{user?.nombre}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Correo electrónico</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.correo} onChangeText={(v) => handleInputChange('correo', v)} style={styles.input} keyboardType="email-address" />
                  ) : (
                    <ThemedText style={styles.value}>{user?.correo}</ThemedText>
                  )}
                </View>

                {isEditing && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Nueva contraseña</ThemedText>
                    <ThemedTextInput
                      value={formData.contrasenia}
                      onChangeText={(v) => handleInputChange('contrasenia', v)}
                      style={styles.input}
                      secureTextEntry
                      placeholder="Dejar en blanco para no cambiar"
                    />
                  </View>
                )}

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Fecha de nacimiento</ThemedText>
                  {isEditing ? (
                    <>
                      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                        <ThemedText>{formatDate(formData.fecha_de_nacimiento)}</ThemedText>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={formData.fecha_de_nacimiento}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                    </>
                  ) : (
                    <ThemedText style={styles.value}>
                      {user?.fecha_de_nacimiento ? formatDate(new Date(user.fecha_de_nacimiento)) : 'No especificada'}
                    </ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Teléfono</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.numero_telefono} onChangeText={(v) => handleInputChange('numero_telefono', v)} style={styles.input} keyboardType="phone-pad" />
                  ) : (
                    <ThemedText style={styles.value}>{user?.numero_telefono || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Sexo</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.sexo} onChangeText={(v) => handleInputChange('sexo', v)} style={styles.input} />
                  ) : (
                    <ThemedText style={styles.value}>{user?.sexo || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Domicilio</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.domicilio} onChangeText={(v) => handleInputChange('domicilio', v)} style={styles.input} />
                  ) : (
                    <ThemedText style={styles.value}>{user?.domicilio || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Código Postal</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput value={formData.codigo_postal} onChangeText={(v) => handleInputChange('codigo_postal', v)} style={styles.input} keyboardType="numeric" />
                  ) : (
                    <ThemedText style={styles.value}>{user?.codigo_postal || 'No especificado'}</ThemedText>
                  )}
                </View>

                {/* Doctor */}
                {user?.tipo === 'doctor' && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Especialidad</ThemedText>
                    {isEditing ? (
                      <ThemedTextInput value={formData.especialidad || ''} onChangeText={(v) => handleInputChange('especialidad', v)} style={styles.input} />
                    ) : (
                      <ThemedText style={styles.value}>{user?.especialidad || 'No especificada'}</ThemedText>
                    )}
                  </View>
                )}

                {/* Paciente */}
                {user?.tipo === 'paciente' && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Escolaridad</ThemedText>
                    {isEditing ? (
                      <ThemedTextInput value={formData.escolaridad || ''} onChangeText={(v) => handleInputChange('escolaridad', v)} style={styles.input} />
                    ) : (
                      <ThemedText style={styles.value}>{user?.escolaridad || 'No especificada'}</ThemedText>
                    )}
                  </View>
                )}

                <View style={styles.buttonGroup}>
                  {isEditing ? (
                    <>
                      <ThemedButton onPress={handleSave} style={[styles.button, styles.saveButton]}>
                        <ThemedText style={styles.buttonText}>Guardar Cambios</ThemedText>
                      </ThemedButton>
                      <ThemedButton
                        onPress={() => {
                          setFormData({ ...formData, contrasenia: '' });
                          setIsEditing(false);
                        }}
                        style={[styles.button, styles.cancelButton]}
                      >
                        <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                      </ThemedButton>
                    </>
                  ) : (
                    <ThemedButton onPress={() => setIsEditing(true)} style={[styles.button, styles.editButton]}>
                      <ThemedText style={styles.buttonText}>Editar Perfil</ThemedText>
                    </ThemedButton>
                  )}
                </View>
              </ScrollView>
            </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* MODAL: elegir avatar */}
      <Modal visible={showAvatarModal} transparent animationType="slide" onRequestClose={() => setShowAvatarModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Elige tu avatar</ThemedText>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {predefinedAvatars.map((src, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleSelectPredefined(src)} style={{ marginHorizontal: 6 }}>
                  <Image source={src} style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#fba557' }} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ThemedButton onPress={handlePickCustom} style={{ marginTop: 8, backgroundColor: '#fba557' }}>
              <ThemedText style={{ color: '#fff' }}>Subir imagen propia</ThemedText>
            </ThemedButton>

            <ThemedButton onPress={() => setShowAvatarModal(false)} style={{ marginTop: 10, backgroundColor: '#ccc' }}>
              <ThemedText>Cancelar</ThemedText>
            </ThemedButton>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  orangeBackground: { borderRadius: 20, alignContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 10 },
  profileContainer: { width: '100%', padding: 16, marginTop: 40 },
  welcomeText: { color: '#000000', fontSize: 32, marginBottom: 30, textAlign: 'center' },
  profileSection: { marginBottom: 20 },
  label: { fontSize: 16, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  value: { fontSize: 18, color: '#000', padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 8 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 8, padding: 10, fontSize: 18, borderWidth: 1, borderColor: '#ddd' },
  dateInput: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 8, padding: 10, fontSize: 18, borderWidth: 1, borderColor: '#ddd' },
  buttonGroup: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  button: { minWidth: '45%', marginVertical: 10, borderRadius: 10, padding: 12 },
  editButton: { backgroundColor: '#ee7200' },
  saveButton: { backgroundColor: '#4CAF50' },
  cancelButton: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%', maxHeight: '60%', alignItems: 'center' },
});

export default ProfileScreen;
