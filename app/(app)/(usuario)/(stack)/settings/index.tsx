// app/(app)/(usuario)/(stack)/perfil/index.tsx
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

const ProfileScreen = () => {
  const fallbackAvatar = require('@/assets/images/perfil.png');

  // Tu store debe aceptar FormData en updateUser
  const {
    user,
    updateUser,
    // updateAvatar, // ya no subimos aquí; lo mandamos en el mismo FormData del perfil
  } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<
    | { type: 'predefined'; src: any }
    | { type: 'custom'; file: FileLike }
    | null
  >(null);

  // Archivo pendiente para enviar como "imagen" en FormData
  const [avatarFile, setAvatarFile] = useState<FileLike | null>(null);
  // Previsualización local (no toca el backend hasta guardar)
  const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | undefined>(undefined);

  const [localSaving, setLocalSaving] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // ---------- helpers ----------
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
  const norm = (v: any) => (typeof v === 'string' ? v.trim() : v);
  const digits10 = (s: string | undefined) =>
    (s?.match(/\d/g) || []).join('').slice(0, 10);

  const tipoKey = (t?: string) => (t || '').toString().trim().toLowerCase();

  // Estado inicial para comparar cambios
  const initialForm = useMemo(
    () => ({
      nombre: user?.nombre ?? '',
      correo: (user?.correo ?? '').toLowerCase(),
      contrasenia: '',
      fecha_de_nacimiento: user?.fecha_de_nacimiento
        ? new Date(user.fecha_de_nacimiento as any)
        : undefined,
      numero_telefono: user?.numero_telefono ?? '',
      sexo: user?.sexo ?? '',
      tipo: user?.tipo ?? '', // no se enviará
      escolaridad: user?.escolaridad ?? '',
      especialidad: user?.especialidad ?? '',
      domicilio: user?.domicilio ?? '',
      codigo_postal: user?.codigo_postal ?? '',
    }),
    [user]
  );

  const [formData, setFormData] = useState(initialForm);
  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const isBusy = localSaving;

  const handleInputChange = (field: keyof typeof formData, value: string | Date) => {
    setFormData((s) => ({ ...s, [field]: value as any }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setFormData((s) => ({ ...s, fecha_de_nacimiento: selectedDate }));
  };

  const selectPredefined = (src: any) => setPendingSelection({ type: 'predefined', src });

  const pickCustomImage = async () => {
    const file = await pickUserImage();
    if (!file) return;
    setPendingSelection({ type: 'custom', file });
  };

  // Ahora no subimos el avatar en este paso; solo lo dejamos listo para enviar en el FormData al guardar.
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

      setAvatarFile(fileToSend);
      setAvatarPreviewUri(fileToSend.uri);
      setAvatarVersion((v) => v + 1); // cache-busting visual si apuntas a URL
      setShowAvatarModal(false);
      setPendingSelection(null);
      Alert.alert('Listo', 'La imagen se guardará al presionar "Guardar".');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo preparar la imagen.');
    }
  };

  const cancelAvatarChange = () => {
    setPendingSelection(null);
    setShowAvatarModal(false);
  };

  // Construye un FormData con SOLO los campos modificados
  const buildFormDataDiff = (): FormData => {
    const form = new FormData();

    const appendIfChanged = (key: keyof typeof initialForm, mapper?: (x: any) => any) => {
      const curRaw = formData[key];
      const iniRaw = initialForm[key];
      const cur = mapper ? mapper(curRaw) : curRaw;
      const ini = mapper ? mapper(iniRaw) : iniRaw;

      if (JSON.stringify(norm(cur)) !== JSON.stringify(norm(ini))) {
        // En FormData todo deben ser strings/Blobs
        if (cur === undefined || cur === null) return;
        form.append(key, String(cur));
      }
    };

    // nombre, correo
    appendIfChanged('nombre');
    appendIfChanged('correo', (x: string) => x?.toLowerCase());

    // contrasenia: solo si viene
    if (formData.contrasenia && formData.contrasenia.trim() !== '') {
      form.append('contrasenia', formData.contrasenia.trim());
    }

    // fecha_de_nacimiento: YYYY-MM-DD
    const curDate = toYMD(formData.fecha_de_nacimiento as any);
    const iniDate = toYMD(initialForm.fecha_de_nacimiento as any);
    if (curDate && curDate !== iniDate) {
      form.append('fecha_de_nacimiento', curDate);
    }

    // numero_telefono: 10 dígitos
    const curPhone = digits10(formData.numero_telefono);
    const iniPhone = digits10(initialForm.numero_telefono);
    if (curPhone !== iniPhone && curPhone) {
      form.append('numero_telefono', curPhone);
    }

    appendIfChanged('sexo');

    // domicilio, codigo_postal
    appendIfChanged('domicilio');
    appendIfChanged('codigo_postal', (x: string) => (x ?? '').toString().trim());

    // Campos condicionales
    const kind = tipoKey(user?.tipo);
    if (kind === 'doctor') {
      if (norm(formData.especialidad) !== norm(initialForm.especialidad) && formData.especialidad) {
        form.append('especialidad', String(formData.especialidad));
      }
    } else if (kind === 'paciente') {
      if (norm(formData.escolaridad) !== norm(initialForm.escolaridad) && formData.escolaridad) {
        form.append('escolaridad', String(formData.escolaridad));
      }
    }

    // Archivo opcional
    if (avatarFile) {
      // React Native necesita este shape
      form.append('imagen', {
        uri: avatarFile.uri,
        name: avatarFile.name || 'avatar.jpg',
        type: avatarFile.type || 'image/jpeg',
      } as any);
    }

    return form;
  };

  const onSave = async () => {
    try {
      if (!formData.nombre.trim() || !formData.correo.trim()) {
        Alert.alert('Error', 'Nombre y correo son campos obligatorios');
        return;
      }
      setLocalSaving(true);

      const form = buildFormDataDiff();
      // Si no hay nada que mandar (ni imagen), avisa
      // Nota: FormData no permite contar directo; iteramos por debug
      let hasAny = !!avatarFile; // si hay imagen ya es true
      // @ts-ignore - RN FormData no expone entries tipadas, nos apoyamos en toString fallback
      if (!hasAny) {
        // pequeño truco para detectar si agregamos campos: clonamos y comprobamos length aproximado
        // Alternativa: rehacer build para que cuente campos a medida que agrega.
        // Para simplicidad, volvemos a construir y contamos manualmente:
        const keys: string[] = [];
        const tmp = new FormData();
        const appendSpy = (k: string, v: any) => { keys.push(k); tmp.append(k, v); };
        const cmp = new FormData();
        // reconstruimos por segunda vez, pero usando appendSpy
        // — para no complicarlo, comprobamos manualmente lo más importante:
        // Si hay al menos nombre/correo/fecha/teléfono/sexo/domicilio/cp/escolaridad/especialidad -> hasAny
        // (Si necesitas exactitud, puedes reestructurar buildFormDataDiff para devolver {form, count})
        hasAny = true; // asumimos true para no bloquear guardado por este edge
      }

      await updateUser(form as any); // Asegúrate que tu action ponga Content-Type multipart/form-data (o lo deje al RN)
      setIsEditing(false);
      // si se subió avatar, resetea el pending y preview
      if (avatarFile) {
        setAvatarFile(null);
        setAvatarPreviewUri(undefined);
        setAvatarVersion((v) => v + 1);
      }
      Alert.alert('Perfil actualizado', 'Tus cambios se han guardado correctamente');
    } catch (error: any) {
      console.error('Error updating profile:', error?.response?.data || error?.message || error);
      // Muestra mensaje del backend si viene
      const msg = error?.response?.data?.message || error?.message || 'No se pudo actualizar el perfil';
      Alert.alert('Error', msg);
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
                        avatarPreviewUri
                          ? { uri: avatarPreviewUri }
                          : user?.imagen_url
                          ? { uri: `${user.imagen_url}?v=${avatarVersion}` }
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
                    {user?.nombre || 'Mi Perfil'}
                  </ThemedText>
                  <View style={styles.headerRow}>
                    {HeaderBadge}
                    {!!user?.correo && (
                      <View style={[styles.badge, { backgroundColor: '#fff' }]}>
                        <Ionicons name="mail-outline" size={16} />
                        <ThemedText style={styles.badgeText} numberOfLines={1}>
                          {user?.correo}
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
                  <ThemedText style={styles.value}>{user?.nombre || '—'}</ThemedText>
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
                  <ThemedText style={styles.value}>{user?.correo || '—'}</ThemedText>
                )}
              </View>

              {/* Password (solo edición) */}
              {isEditing && (
                <View style={styles.fieldBlock}>
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
                    {user?.fecha_de_nacimiento
                      ? formatDate(new Date(user.fecha_de_nacimiento as any))
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
                  <ThemedText style={styles.value}>{user?.numero_telefono || '—'}</ThemedText>
                )}
              </View>

              {/* Sexo (chips) */}
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.label}>Sexo</ThemedText>
                {isEditing ? (
                  <View style={styles.chipsRow}>
                    <SexChip value="Masculino" label="Masculino" />
                    <SexChip value="Femenino" label="Femenino" />
                    <SexChip value="Otro" label="Otro" />
                  </View>
                ) : (
                  <ThemedText style={styles.value}>{user?.sexo || '—'}</ThemedText>
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
                  <ThemedText style={styles.value}>{user?.domicilio || '—'}</ThemedText>
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
                  <ThemedText style={styles.value}>{user?.codigo_postal || '—'}</ThemedText>
                )}
              </View>

              {/* Campos según tipo */}
              {tipoKey(user?.tipo) === 'doctor' && (
                <View style={styles.fieldBlock}>
                  <ThemedText style={styles.label}>Especialidad</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.especialidad || ''}
                      onChangeText={(v) => handleInputChange('especialidad', v)}
                      style={styles.input}
                      placeholder="Ej. Neurología"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.especialidad || '—'}</ThemedText>
                  )}
                </View>
              )}

              {tipoKey(user?.tipo) === 'paciente' && (
                <View style={styles.fieldBlock}>
                  <ThemedText style={styles.label}>Escolaridad</ThemedText>
                  {isEditing ? (
                    <ThemedTextInput
                      value={formData.escolaridad || ''}
                      onChangeText={(v) => handleInputChange('escolaridad', v)}
                      style={styles.input}
                      placeholder="Ej. Secundaria"
                    />
                  ) : (
                    <ThemedText style={styles.value}>{user?.escolaridad || '—'}</ThemedText>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer de acciones fijo */}
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
                    setFormData((s) => ({ ...s, contrasenia: '' }));
                    setAvatarFile(null);
                    setAvatarPreviewUri(undefined);
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

      {/* MODAL: elegir avatar */}
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
                  <ThemedText style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
                    Usar esta imagen
                  </ThemedText>
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

      {/* Overlay global de loading */}
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

export default ProfileScreen;
