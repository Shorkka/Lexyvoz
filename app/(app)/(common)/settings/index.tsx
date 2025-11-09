import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';

import styleImage from '@/constants/GlobalStyles';

import { predefinedAvatars } from '@/constants/avatars';
import type { FileLike } from '@/presentation/utils/defaultAvatar';
import { pickUserImage } from '@/utils/imageUtils';
import { Asset } from 'expo-asset';

const ORANGE = '#fba557';

const ProfileScreen = () => {
  const avatar = require('../../../../assets/images/perfil.png');
  const { user, updateUser, userType, updateAvatar } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal para elegir avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Selección pendiente en el modal (no se sube hasta Aceptar)
  const [pendingSelection, setPendingSelection] = useState<
    | { type: 'predefined'; src: any }
    | { type: 'custom'; file: FileLike }
    | null
  >(null);

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

  // --- Modal: seleccionar sin subir todavía ---
  const selectPredefined = (src: any) => {
    setPendingSelection({ type: 'predefined', src });
  };

  const pickCustomImage = async () => {
    const file = await pickUserImage();
    if (!file) return;
    setPendingSelection({ type: 'custom', file });
  };

  const confirmAvatarChange = async () => {
    if (!pendingSelection) {
      Alert.alert('Selecciona una imagen', 'Elige un avatar o sube una imagen.');
      return;
    }
    try {
      if (pendingSelection.type === 'predefined') {
        const [asset] = await Asset.loadAsync(pendingSelection.src);
        const file: FileLike = {
          uri: asset.localUri ?? asset.uri,
          name: 'avatar_predefinido.png',
          type: 'image/png',
        };
        await updateAvatar(file);
      } else {
        await updateAvatar(pendingSelection.file);
      }
      setShowAvatarModal(false);
      setPendingSelection(null);
      Alert.alert('Éxito', 'Avatar actualizado');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar el avatar');
    }
  };

  const cancelAvatarChange = () => {
    setPendingSelection(null);
    setShowAvatarModal(false);
  };

  // Obtener source de previsualización
  const previewSource =
    pendingSelection?.type === 'predefined'
      ? pendingSelection.src
      : pendingSelection?.type === 'custom'
      ? { uri: pendingSelection.file.uri }
      : null;

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={{ flex: 1, backgroundColor }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <ThemedBackground fullHeight backgroundColor={ORANGE} style={styles.orangeBackground}>
              {/* Botón de regreso */}
              <TouchableOpacity style={styles.backButton} onPress={returnPage} accessibilityLabel="Regresar">
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>

              <ScrollView style={styles.profileContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => isEditing && setShowAvatarModal(true)}
                    activeOpacity={0.85}
                    accessibilityLabel="Cambiar avatar"
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
                    <ThemedTextInput
                      value={formData.nombre}
                      onChangeText={(v) => handleInputChange('nombre', v)}
                      style={styles.input}
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.nombre}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Correo electrónico</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.correo}
                      onChangeText={(v) => handleInputChange('correo', v)}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
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
                      {user?.fecha_de_nacimiento
                        ? formatDate(new Date(user.fecha_de_nacimiento))
                        : 'No especificada'}
                    </ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Teléfono</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.numero_telefono}
                      onChangeText={(v) => handleInputChange('numero_telefono', v)}
                      style={styles.input}
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.numero_telefono || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Sexo</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.sexo}
                      onChangeText={(v) => handleInputChange('sexo', v)}
                      style={styles.input}
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.sexo || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Domicilio</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.domicilio}
                      onChangeText={(v) => handleInputChange('domicilio', v)}
                      style={styles.input}
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.domicilio || 'No especificado'}</ThemedText>
                  )}
                </View>

                <View style={styles.profileSection}>
                  <ThemedText style={styles.label}>Código Postal</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.codigo_postal}
                      onChangeText={(v) => handleInputChange('codigo_postal', v)}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.codigo_postal || 'No especificado'}</ThemedText>
                  )}
                </View>

                {/* Doctor */}
                {user?.tipo === 'doctor' && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Especialidad</ThemedText>
                    {isEditing ? (
                      <ThemedTextInput
                        value={formData.especialidad || ''}
                        onChangeText={(v) => handleInputChange('especialidad', v)}
                        style={styles.input}
                      />
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
                      <ThemedTextInput
                        value={formData.escolaridad || ''}
                        onChangeText={(v) => handleInputChange('escolaridad', v)}
                        style={styles.input}
                      />
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

      {/* MODAL: elegir avatar (seleccionar -> previsualizar -> Aceptar) */}
      <Modal visible={showAvatarModal} transparent animationType="slide" onRequestClose={cancelAvatarChange}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              Elige tu avatar
            </ThemedText>

            {/* Previsualización (si hay selección) */}
            {previewSource && (
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <Image
                  source={previewSource}
                  style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: ORANGE }}
                />
                <ThemedText style={{ marginTop: 8 }}>Previsualización</ThemedText>
              </View>
            )}

            {/* Avatares predefinidos */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {predefinedAvatars.map((src, idx) => {
                const isSelected =
                  pendingSelection?.type === 'predefined' && pendingSelection?.src === src;
                return (
                  <TouchableOpacity key={idx} onPress={() => selectPredefined(src)} style={{ marginHorizontal: 6 }}>
                    <Image
                      source={src}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        borderWidth: 3,
                        borderColor: isSelected ? ORANGE : '#ddd',
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Botones del modal con formato naranja */}
            <View style={{ width: '100%', marginTop: 8 }}>
              <ThemedButton onPress={pickCustomImage} style={{ backgroundColor: ORANGE, borderRadius: 10, paddingVertical: 12 }}>
                <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Subir imagen propia</ThemedText>
              </ThemedButton>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
                <ThemedButton
                  onPress={confirmAvatarChange}
                  disabled={!pendingSelection}
                  style={{
                    flex: 1,
                    backgroundColor: pendingSelection ? ORANGE : '#f0bf8d',
                    borderRadius: 10,
                    paddingVertical: 12,
                    opacity: pendingSelection ? 1 : 0.7,
                  }}
                >
                  <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Aceptar</ThemedText>
                </ThemedButton>

                <ThemedButton
                  onPress={cancelAvatarChange}
                  style={{ flex: 1, backgroundColor: '#ccc', borderRadius: 10, paddingVertical: 12 }}
                >
                  <ThemedText style={{ textAlign: 'center' }}>Cancelar</ThemedText>
                </ThemedButton>
              </View>
            </View>
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
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%', maxHeight: '70%', alignItems: 'center' },
});

export default ProfileScreen;
