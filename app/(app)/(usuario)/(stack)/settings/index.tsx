// app/(app)/(common)/settings/index.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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

/** Tipado local del formulario de Settings/Profile */
type ProfileForm = {
  nombre: string;
  correo: string;
  fecha_de_nacimiento?: Date;
  numero_telefono: string;
  sexo: string;
  tipo: string; // solo lectura
  domicilio: string;
  codigo_postal: string;
  imagen_url: string;
  imagen_id?: string;

  // Campos condicionales
  doctor_especialidad?: string;
  paciente_escolaridad?: string;
};

const SettingsScreen = () => {
  const fallbackAvatar = require('@/assets/images/perfil.png');

  // del store
  const {
    user,
    updateUser, // ahora acepta FormData (ver archivo del store)
  } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // imagen seleccionada localmente (se manda en el PUT)
  const [avatarFile, setAvatarFile] = useState<FileLike | null>(null);

  // modal de selección de avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<
    | { type: 'predefined'; src: any }
    | { type: 'custom'; file: FileLike }
    | null
  >(null);

  const [localSaving, setLocalSaving] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0); // para cache-busting

  // helpers
  const toYMD = (d: Date | string | undefined) => {
    if (!d) return undefined;
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return undefined;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };
  const formatDate = (date: Date) => date.toLocaleDateString('es-MX');
  const digits10 = (s: string | undefined) =>
    (s?.match(/\d/g) || []).join('').slice(0, 10);
  const tipoKey = (t?: string) => (t || '').toString().trim().toLowerCase();

  // estado inicial
  const initialForm = useMemo<ProfileForm>(() => ({
    nombre:              user?.nombre ?? '',
    correo:              (user?.correo ?? '').toLowerCase(),
    fecha_de_nacimiento: user?.fecha_de_nacimiento ? new Date(user.fecha_de_nacimiento as any) : undefined,
    numero_telefono:     user?.numero_telefono ?? '',
    sexo:                user?.sexo ?? '',
    tipo:                user?.tipo ?? '',
    domicilio:           user?.domicilio ?? '',
    codigo_postal:       user?.codigo_postal ?? '',
    imagen_url:          user?.imagen_url ?? '',
    doctor_especialidad:  (user as any)?.doctor_especialidad ?? (user as any)?.especialidad ?? undefined,
    paciente_escolaridad: (user as any)?.paciente_escolaridad ?? (user as any)?.escolaridad ?? undefined,
  }), [user]);

  const [formData, setFormData] = useState<ProfileForm>(initialForm);
  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const isBusy = localSaving;

  const handleInputChange = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    setFormData((s) => ({ ...s, [field]: value }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) handleInputChange('fecha_de_nacimiento', selectedDate);
  };

  const selectPredefined = (src: any) => setPendingSelection({ type: 'predefined', src });

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
      let fileToSend: FileLike | null = null;

      if (pendingSelection.type === 'predefined') {
        const [asset] = await Asset.loadAsync(pendingSelection.src);
        fileToSend = {
          uri: asset.localUri ?? asset.uri,
          name: 'avatar_predefinido.png',
          type: 'image/png',
        };
      } else {
        fileToSend = pendingSelection.file;
      }

      // Guardamos en estado; se mandará en el PUT
      setAvatarFile(fileToSend);

      // preview inmediata
      setAvatarVersion((v) => v + 1);
      setShowAvatarModal(false);
      setPendingSelection(null);
      Alert.alert('Éxito', 'Imagen seleccionada (se enviará al guardar)');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo preparar la imagen');
    }
  };

  const cancelAvatarChange = () => {
    setPendingSelection(null);
    setShowAvatarModal(false);
  };

  // crea el FormData
  const buildFormData = () => {
    const fd = new FormData();
    const entries: { key: string; value: any }[] = [];

    const append = (k: string, v: any) => {
      fd.append(k, v as any);
      entries.push({ key: k, value: v });
      console.log(
        '[settings] append',
        k,
        v && typeof v === 'object'
          ? { ...v, uri: String((v as any).uri || '').slice(-36) }
          : v
      );
    };

    const appendIf = (k: string, v: any) => {
      if (v === undefined || v === null) return;
      const sv = typeof v === 'string' ? v.trim() : v;
      if (typeof sv === 'string' && sv === '') return;
      append(k, sv);
    };

    // Campos opcionales: como es PUT sin obligatorios, sólo mandamos lo que haya
    appendIf('nombre', formData.nombre);
    appendIf('correo', formData.correo?.toLowerCase());

    if (formData.fecha_de_nacimiento) {
      const y = formData.fecha_de_nacimiento.getFullYear();
      const m = String(formData.fecha_de_nacimiento.getMonth() + 1).padStart(2, '0');
      const d = String(formData.fecha_de_nacimiento.getDate()).padStart(2, '0');
      appendIf('fecha_de_nacimiento', `${y}-${m}-${d}`);
    }

    appendIf('numero_telefono', digits10(formData.numero_telefono));
    appendIf('sexo', formData.sexo);
    appendIf('domicilio', formData.domicilio);
    appendIf('codigo_postal', String(formData.codigo_postal || '').trim());

    const kind = tipoKey(user?.tipo);
    if (kind === 'doctor') {
      // el back espera "especialidad"
      appendIf('especialidad', formData.doctor_especialidad);
    }
    if (kind === 'paciente') {
      // el back espera "escolaridad"
      appendIf('escolaridad', formData.paciente_escolaridad);
    }

    // Imagen opcional
    if (avatarFile) {
      append('imagen', {
        uri: avatarFile.uri,
        name: avatarFile.name || 'avatar.jpg',
        type: avatarFile.type || 'image/jpeg',
      });
    }

    // Log estilo Postman
    const postmanLog = [
      'Form Data:',
      formData.nombre ? `- nombre: ${formData.nombre}` : '',
      formData.correo ? `- correo: ${formData.correo}` : '',
      formData.fecha_de_nacimiento ? `- fecha_de_nacimiento: ${toYMD(formData.fecha_de_nacimiento)}` : '',
      formData.numero_telefono ? `- numero_telefono: ${digits10(formData.numero_telefono)}` : '',
      formData.sexo ? `- sexo: ${formData.sexo}` : '',
      formData.domicilio ? `- domicilio: ${formData.domicilio}` : '',
      formData.codigo_postal ? `- codigo_postal: ${String(formData.codigo_postal).trim()}` : '',
      kind === 'doctor' && formData.doctor_especialidad ? `- especialidad: ${formData.doctor_especialidad}` : '',
      kind === 'paciente' && formData.paciente_escolaridad ? `- escolaridad: ${formData.paciente_escolaridad}` : '',
      avatarFile ? `- imagen: { name: ${avatarFile.name || 'avatar.jpg'}, type: ${avatarFile.type || 'image/jpeg'}, uri: ...${String(avatarFile.uri).slice(-32)} }` : '',
    ].filter(Boolean);
    console.log(postmanLog.join('\n'));

    console.log('[settings] FormData entries (debug):', entries);

    return fd;
  };

  const onSave = async () => {
    try {
      // ❗️como es PUT sin obligatorios: no validamos nombre/correo
      setLocalSaving(true);

      const fd = buildFormData();

      // aquí ya podemos mandar FormData directo porque el store lo acepta
      await updateUser(fd);

      setIsEditing(false);
      Alert.alert('Perfil actualizado', 'Tus cambios se han guardado correctamente');

      if (avatarFile) setAvatarVersion((v) => v + 1);
    } catch (error: any) {
      console.error('Error updating profile:', error?.response?.data ?? error?.message ?? error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLocalSaving(false);
    }
  };

  const HeaderBadge = useMemo(() => {
    const type = tipoKey(user?.tipo);
    if (!type) return null;

    const iconName =
      type === 'doctor'
        ? 'medkit-outline'
        : type === 'paciente'
        ? 'book-outline'
        : 'person-outline';

    return (
      <View style={styles.badge}>
        <Ionicons name={iconName as any} size={16} />
        <ThemedText style={styles.badgeText}>
          {user?.tipo ?? '—'}
        </ThemedText>
      </View>
    );
  }, [user?.tipo]);

  const SexChip: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    const selected = (formData.sexo || '').toLowerCase() === value.toLowerCase();
    return (
      <Pressable
        onPress={() => handleInputChange('sexo', value)}
        style={[styles.chip, selected && styles.chipSelected]}
      >
        <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</ThemedText>
      </Pressable>
    );
  };

  const kind = tipoKey(user?.tipo);

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor }}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Cover / Header */}
            <ThemedBackground backgroundColor={ORANGE} style={styles.cover}>
              <View style={styles.coverContent}>
                <View style={styles.avatarWrap}>
                  <TouchableOpacity
                    onPress={() => isEditing && setShowAvatarModal(true)}
                    activeOpacity={0.85}
                    accessibilityLabel="Cambiar avatar"
                    style={styles.avatarButton}
                  >
                    <Image
                      source={
                        avatarFile
                          ? { uri: `${avatarFile.uri}` }
                          : formData.imagen_url
                          ? { uri: `${formData.imagen_url}?v=${avatarVersion}` }
                          : fallbackAvatar
                      }
                      style={[styleImage.avatar, styles.avatarRing]}
                    />
                    {isEditing && (
                      <View style={styles.cameraFab}>
                        <Ionicons name="camera" size={18} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.headerTexts}>
                  <ThemedText type="welcome" style={styles.displayName}>
                    {formData.nombre || 'Mi Perfil'}
                  </ThemedText>
                  <View style={styles.headerRow}>
                    {HeaderBadge}
                    {!!formData.correo && (
                      <View style={[styles.badge, { backgroundColor: '#fff' }]}>
                        <Ionicons name="mail-outline" size={16} />
                        <ThemedText style={styles.badgeText} numberOfLines={1}>
                          {formData.correo}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.editAction}>
                  {isEditing ? (
                    <ThemedButton onPress={() => setIsEditing(false)} style={[styles.iconBtn, { backgroundColor: '#333' }]}>
                      <Ionicons name="close" size={18} color="#fff" />
                    </ThemedButton>
                  ) : (
                    <ThemedButton onPress={() => setIsEditing(true)} style={styles.iconBtn}>
                      <Ionicons name="create-outline" size={18} color="#fff" />
                    </ThemedButton>
                  )}
                </View>
              </View>
            </ThemedBackground>

            {/* Card principal */}
            <View style={styles.card}>
              {/* Nombre */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Nombre completo</ThemedText>
                {isEditing ? (
                  <ThemedTextInput
                    value={formData.nombre}
                    onChangeText={(v) => handleInputChange('nombre', v)}
                    style={styles.input}
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <ThemedText style={styles.value}>{formData.nombre || '—'}</ThemedText>
                )}
              </View>

              {/* Correo */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Correo</ThemedText>
                {isEditing ? (
                  <ThemedTextInput
                    value={formData.correo}
                    onChangeText={(v) => handleInputChange('correo', v.toLowerCase())}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="tu@correo.com"
                  />
                ) : (
                  <ThemedText style={styles.value}>{formData.correo || '—'}</ThemedText>
                )}
              </View>

              {/* Fecha de nacimiento */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Fecha de nacimiento</ThemedText>
                {isEditing ? (
                  <>
                    <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                      <Ionicons name="calendar-outline" size={18} />
                      <ThemedText style={{ marginLeft: 8 }}>
                        {formatDate(formData.fecha_de_nacimiento || new Date())}
                      </ThemedText>
                    </Pressable>
                    {showDatePicker && (
                      <DateTimePicker
                        value={formData.fecha_de_nacimiento || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                      />
                    )}
                  </>
                ) : (
                  <ThemedText style={styles.value}>
                    {formData.fecha_de_nacimiento
                      ? formatDate(formData.fecha_de_nacimiento)
                      : 'No especificada'}
                  </ThemedText>
                )}
              </View>

              {/* Teléfono */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Teléfono</ThemedText>
                {isEditing ? (
                  <ThemedTextInput
                    value={formData.numero_telefono}
                    onChangeText={(v) => handleInputChange('numero_telefono', v)}
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                    maxLength={15}
                  />
                ) : (
                  <ThemedText style={styles.value}>{formData.numero_telefono || '—'}</ThemedText>
                )}
              </View>

              {/* Sexo */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Sexo</ThemedText>
                {isEditing ? (
                  <View style={styles.chipsRow}>
                    <SexChip value="Masculino" label="Masculino" />
                    <SexChip value="Femenino" label="Femenino" />
                    <SexChip value="Otro" label="Otro" />
                  </View>
                ) : (
                  <ThemedText style={styles.value}>{formData.sexo || '—'}</ThemedText>
                )}
              </View>

              {/* Domicilio */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Domicilio</ThemedText>
                {isEditing ? (
                  <ThemedTextInput
                    value={formData.domicilio}
                    onChangeText={(v) => handleInputChange('domicilio', v)}
                    style={styles.input}
                    placeholder="Calle, número, colonia"
                  />
                ) : (
                  <ThemedText style={styles.value}>{formData.domicilio || '—'}</ThemedText>
                )}
              </View>

              {/* Código postal */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Código Postal</ThemedText>
                {isEditing ? (
                  <ThemedTextInput
                    value={formData.codigo_postal}
                    onChangeText={(v) => handleInputChange('codigo_postal', v)}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="XXXXX"
                    maxLength={10}
                  />
                ) : (
                  <ThemedText style={styles.value}>{formData.codigo_postal || '—'}</ThemedText>
                )}
              </View>

              {/* Campos condicionales */}
              {kind === 'doctor' && (
                <View style={styles.fieldBlock}>
                  <ThemedText style={styles.label}>Especialidad</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.doctor_especialidad ?? ''}
                      onChangeText={(v) => handleInputChange('doctor_especialidad', v)}
                      style={styles.input}
                      placeholder="Ej. Neurología"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{formData.doctor_especialidad || '—'}</ThemedText>
                  )}
                </View>
              )}

              {kind === 'paciente' && (
                <View style={styles.fieldBlock}>
                  <ThemedText style={styles.label}>Escolaridad</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.paciente_escolaridad ?? ''}
                      onChangeText={(v) => handleInputChange('paciente_escolaridad', v)}
                      style={styles.input}
                      placeholder="Ej. Secundaria"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{formData.paciente_escolaridad || '—'}</ThemedText>
                  )}
                </View>
              )}

              {/* Info de imagen */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Imagen</ThemedText>
                <ThemedText style={{ color: '#111' }}>
                  {avatarFile
                    ? (avatarFile.name || 'avatar.jpg')
                    : (formData.imagen_url ? 'Imagen actual en el servidor' : '—')}
                </ThemedText>
                {isEditing && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <ThemedButton onPress={() => setShowAvatarModal(true)} style={{ backgroundColor: ORANGE }}>
                      <ThemedText style={{ color: '#fff' }}>Cambiar imagen</ThemedText>
                    </ThemedButton>
                    {avatarFile && (
                      <ThemedButton onPress={() => setAvatarFile(null)} style={{ backgroundColor: '#999' }}>
                        <ThemedText style={{ color: '#fff' }}>Quitar selección</ThemedText>
                      </ThemedButton>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* footer acciones */}
          <View style={styles.footer}>
            {isEditing ? (
              <>
                <ThemedButton disabled={isBusy} onPress={onSave} style={[styles.footerBtn, styles.save]}>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <ThemedText style={styles.footerBtnText}>{isBusy ? 'Guardando…' : 'Guardar'}</ThemedText>
                </ThemedButton>
                <ThemedButton
                  disabled={isBusy}
                  onPress={() => {
                    setAvatarFile(null);
                    setFormData(initialForm);
                    setIsEditing(false);
                  }}
                  style={[styles.footerBtn, styles.cancel]}
                >
                  <Ionicons name="close-circle-outline" size={18} color="#fff" />
                  <ThemedText style={styles.footerBtnText}>Cancelar</ThemedText>
                </ThemedButton>
              </>
            ) : (
              <ThemedButton onPress={() => setIsEditing(true)} style={[styles.footerBtn, styles.edit]}>
                <Ionicons name="create-outline" size={18} color="#fff" />
                <ThemedText style={styles.footerBtnText}>Editar Perfil</ThemedText>
              </ThemedButton>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* modal avatar */}
      <Modal visible={showAvatarModal} transparent animationType="slide" onRequestClose={cancelAvatarChange}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              Elige tu avatar
            </ThemedText>

            {pendingSelection && (
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <Image
                  source={
                    pendingSelection.type === 'predefined'
                      ? pendingSelection.src
                      : { uri: pendingSelection.file.uri }
                  }
                  style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: ORANGE }}
                />
                <ThemedText style={{ marginTop: 8 }}>Previsualización</ThemedText>
              </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {predefinedAvatars.map((src, idx) => {
                const isSelected = pendingSelection?.type === 'predefined' && pendingSelection?.src === src;
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
                  }}
                >
                  <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Usar esta imagen</ThemedText>
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

      {/* overlay loading */}
      {isBusy && (
        <View style={styles.busyOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  cover: { height: 200, marginBottom: 64, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  coverContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20, position: 'relative' },
  avatarWrap: { position: 'absolute', bottom: -48, left: 20 },
  avatarButton: { width: 96, height: 96 },
  avatarRing: { borderWidth: 4, borderColor: '#fff', borderRadius: 999 },
  cameraFab: {
    position: 'absolute', right: -2, bottom: -2,
    backgroundColor: '#111', padding: 8, borderRadius: 20, elevation: 3,
  },
  headerTexts: { marginLeft: 140, marginTop: 12 },
  displayName: { color: '#000', fontSize: 28, fontWeight: '700' },
  headerRow: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ffe8d4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  editAction: { position: 'absolute', right: 20, top: 16 },
  iconBtn: {
    backgroundColor: ORANGE, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  card: {
    marginHorizontal: 16, marginTop: -32,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2,
  },
  fieldBlock: { marginBottom: 16 },
  label: { fontSize: 14, color: '#444', marginBottom: 6, fontWeight: '600' },
  value: { fontSize: 16, color: '#111', padding: 12, backgroundColor: '#fafafa', borderRadius: 10 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16,
    borderWidth: 1, borderColor: '#e4e4e7',
  },
  dateInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e4e4e7',
  },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#f2f2f2',
  },
  chipSelected: { backgroundColor: ORANGE },
  chipText: { fontSize: 13, fontWeight: '600', color: '#333' },
  chipTextSelected: { color: '#fff' },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: 12, backgroundColor: '#ffffffee',
    flexDirection: 'row', justifyContent: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  footerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, minWidth: 140,
  },
  footerBtnText: { color: '#fff', fontWeight: '700' },
  edit: { backgroundColor: '#111' },
  save: { backgroundColor: '#10b981' },
  cancel: { backgroundColor: '#ef4444' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%', maxHeight: '70%', alignItems: 'center' },
  busyOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center',
  },
});

export default SettingsScreen;
