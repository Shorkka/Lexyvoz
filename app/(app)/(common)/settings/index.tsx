import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity, Image} from 'react-native';
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

const ProfileScreen = () => {
  const avatar = require('../../../../assets/images/perfil.png');
  const { user, updateUser, userType } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    contraseña: '', // No mostramos la contraseña actual por seguridad
    fecha_de_nacimiento: user?.fecha_de_nacimiento ? new Date(user.fecha_de_nacimiento) : new Date(),
    numero_telefono: user?.numero_telefono || '',
    sexo: user?.sexo || '',
    tipo: user?.tipo || '',
    escolaridad: user?.escolaridad || '',
    especialidad: user?.especialidad || '',
    domicilio: user?.domicilio || '',
    codigo_postal: user?.codigo_postal || '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        fecha_de_nacimiento: selectedDate,
      });
    }
  };

  const handleSave = async () => {
    try {
      // Validación básica
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX');
  };
  const returnPage = () => {
    if(userType === 'Doctor') {
      router.replace('/main');
    }else{
      router.replace('/home');
    }
  } 
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
            <ThemedBackground
              fullHeight
              backgroundColor="#fba557"
              style={styles.orangeBackground}
            >

              {/* Botón de regreso */}
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={returnPage}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
     
              <ScrollView style={styles.profileContainer}>
                  <View style = {{justifyContent: 'center', alignItems: 'center',alignContent: 'center'}}> 
                      <Image source={avatar} style = {styleImage.avatar}/>
                </View>
                <ThemedText type="welcome" style={styles.welcomeText}>
                  {isEditing ? 'Editar Perfil' : 'Mi Perfil'}
                </ThemedText>

                {/* Campos comunes a todos los usuarios */}
                <View style={styles.profileSection}>
                     

                  <ThemedText style={styles.label}>Nombre completo</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.nombre}
                      onChangeText={(value) => handleInputChange('nombre', value)}
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
                      onChangeText={(value) => handleInputChange('correo', value)}
                      style={styles.input}
                      keyboardType="email-address"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.correo}</ThemedText>
                  )}
                </View>

                {isEditing && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Nueva contraseña</ThemedText>
                    <ThemedTextInput
                      value={formData.contraseña}
                      onChangeText={(value) => handleInputChange('contraseña', value)}
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
                      <TouchableOpacity 
                        style={styles.dateInput} 
                        onPress={() => setShowDatePicker(true)}
                      >
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
                    <ThemedTextInput
                      value={formData.numero_telefono}
                      onChangeText={(value) => handleInputChange('numero_telefono', value)}
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
                      onChangeText={(value) => handleInputChange('sexo', value)}
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
                      onChangeText={(value) => handleInputChange('domicilio', value)}
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
                      onChangeText={(value) => handleInputChange('codigo_postal', value)}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.codigo_postal || 'No especificado'}</ThemedText>
                  )}
                </View>

                {/* Campos específicos para doctores */}
                {user?.tipo === 'doctor' && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Especialidad</ThemedText>
                    {isEditing ? (
                      <ThemedTextInput
                        value={formData.especialidad || ''}
                        onChangeText={(value) => handleInputChange('especialidad', value)}
                        style={styles.input}
                      />
                    ) : (
                      <ThemedText style={styles.value}>{user?.especialidad || 'No especificada'}</ThemedText>
                    )}
                  </View>
                )}

                {/* Campos específicos para pacientes */}
                {user?.tipo === 'paciente' && (
                  <View style={styles.profileSection}>
                    <ThemedText style={styles.label}>Escolaridad</ThemedText>
                    {isEditing ? (
                      <ThemedTextInput
                        value={formData.escolaridad || ''}
                        onChangeText={(value) => handleInputChange('escolaridad', value)}
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
                      <ThemedButton
                        onPress={handleSave}
                        style={[styles.button, styles.saveButton]}
                      >
                        <ThemedText style={styles.buttonText}>Guardar Cambios</ThemedText>
                      </ThemedButton>
                      <ThemedButton
                        onPress={() => {
                          setFormData({
                            ...formData,
                            contraseña: '',
                          });
                          setIsEditing(false);
                        }}
                        style={[styles.button, styles.cancelButton]}
                      >
                        <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                      </ThemedButton>
                    </>
                  ) : (
                    <ThemedButton
                      onPress={() => setIsEditing(true)}
                      style={[styles.button, styles.editButton]}
                    >
                      <ThemedText style={styles.buttonText}>Editar Perfil</ThemedText>
                    </ThemedButton>
                  )}
                </View>
              </ScrollView>
              
            </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  orangeBackground: {
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  profileContainer: {
    width: '100%',
    padding: 16,
    marginTop: 40, // Espacio para el botón de regreso
  },
  welcomeText: {
    color: '#000000',
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
  },
  profileSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#000',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonGroup: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  button: {
    minWidth: '45%',
    marginVertical: 10,
    borderRadius: 10,
    padding: 12,
  },
  editButton: {
    backgroundColor: '#ee7200',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProfileScreen;