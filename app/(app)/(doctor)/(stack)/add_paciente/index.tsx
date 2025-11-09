import { useSolicitudesVinculacionStore } from '@/infraestructure/store/useSolicitudesVinculacionStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlert } from '@/presentation/hooks/useAlert';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definimos las interfaces basadas en la respuesta real de la API
interface solicitudes {
  id: number; // Agregamos id basado en la respuesta de la API
  mensaje: string; // Agregamos mensaje basado en la respuesta de la API
  fecha_solicitud: string; 
  usuario_nombre: string;
  usuario_correo: string;
  usuario_imagen?: string;
  estado?: string; 
}

interface SolicitudesResponse {
  message: string;
  solicitudes: solicitudes[]; 
  total: number;
}

interface ErrorResponse {
  success: boolean;
  error: unknown;
}

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState<solicitudes[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<solicitudes | null>(null);
  const backgroundColor = useThemeColor({}, 'background');
  const {showAlert} = useAlert();
  const { user } = useAuthStore();
  const { 
    useSolicitudesDoctorQuery, 
    responderSolicitudMutation 
  } = useSolicitudesVinculacionStore();

  // Obtener solicitudes pendientes del doctor
  const { data: solicitudesData, isLoading, isError, refetch } = 
    useSolicitudesDoctorQuery(user?.doctor_id || 0);

  useEffect(() => {
    if (solicitudesData) {
      // Verificamos el tipo de respuesta usando type guards más específicos
      if (isSolicitudesResponse(solicitudesData)) {
        setSolicitudes(solicitudesData.solicitudes);
      } else if (isErrorResponse(solicitudesData)) {
        // Es una respuesta de error
        console.error('Error al obtener solicitudes:', solicitudesData.error);
        Alert.alert('Error', 'No se pudieron cargar las solicitudes');
      }
    }
  }, [solicitudesData]);

  // Type guard para verificar si es una respuesta exitosa
  const isSolicitudesResponse = (data: any): data is SolicitudesResponse => {
    return data && typeof data === 'object' && 'solicitudes' in data && Array.isArray(data.solicitudes);
  };

  // Type guard para verificar si es una respuesta de error
  const isErrorResponse = (data: any): data is ErrorResponse => {
    return data && typeof data === 'object' && 'success' in data && data.success === false;
  };

  const handleResponderSolicitud = (respuesta: 'aceptada' | 'rechazada') => {
    if (!selectedSolicitud) return;

    responderSolicitudMutation.mutate(
      { 
        solicitud_id: selectedSolicitud.id, 
        respuesta 
      },
      {
        onSuccess: (result) => {
          // Verificamos el tipo de respuesta
          if (result && 'success' in result) {
            if (result.success) {
              const mensaje = respuesta === 'aceptada' 
                ? `Solicitud aceptada. ${selectedSolicitud.usuario_nombre} es ahora tu paciente.`
                : `Solicitud rechazada.`;
              
              showAlert('Éxito', mensaje);
              
              // Actualizar lista de solicitudes
              setSolicitudes(prev => 
                prev.filter(s => s.id !== selectedSolicitud.id)
              );
            } else {
              showAlert('Error', 'No se pudo procesar la respuesta');
            }
          } else {
            // Asumimos que si no tiene 'success', fue exitoso
            const mensaje = respuesta === 'aceptada' 
              ? `Solicitud aceptada. ${selectedSolicitud.usuario_nombre} es ahora tu paciente.`
              : `Solicitud rechazada.`;
            
            showAlert('Éxito', mensaje);
            
            // Actualizar lista de solicitudes
            setSolicitudes(prev => 
              prev.filter(s => s.id !== selectedSolicitud.id)
            );
          }
          setSelectedSolicitud(null);
        },
        onError: (error) => {
          showAlert('Error', 'Error de conexión');
          console.error('Error al responder solicitud:', error);
        }
      }
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={{ color: 'white', marginTop: 10 }}>
                Cargando solicitudes...
              </ThemedText>
            </View>
          </ThemedBackground>
        </SafeAreaView>
      </AuthGuard>
    );
  }

  if (isError) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={styles.centerContainer}>
              <ThemedText style={{ color: 'white', textAlign: 'center', marginBottom: 20 }}>
                Error al cargar las solicitudes
              </ThemedText>
              <ThemedButton onPress={() => refetch()} backgroundColor="#ee7200">
                Reintentar
              </ThemedButton>
            </View>
          </ThemedBackground>
        </SafeAreaView>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
          <View style={styles.container}>
            {/* Cabecera */}
            <View style={styles.header}>
              <ThemedText type='title' style={{ color: 'black', marginBottom: 15 }}>
                Solicitudes Pendientes
              </ThemedText>
              <ThemedText style={{ color: 'white' }}>
                Total: {solicitudes.length}
              </ThemedText>
            </View>

            {/* Lista de solicitudes */}
            <View style={styles.content}>
              {solicitudes.length === 0 ? (
                <View style={styles.centerContainer}>
                  <ThemedText style={{ color: 'white', textAlign: 'center' }}>
                    No tienes solicitudes pendientes
                  </ThemedText>
                </View>
              ) : (
                <ScrollView style={styles.solicitudesScroll}>
                  {solicitudes.map((solicitud) => (
                    <Pressable 
                      key={solicitud.id} 
                      style={styles.solicitudCard}
                      onPress={() => setSelectedSolicitud(solicitud)}
                    >
                      <View style={styles.solicitudHeader}>
                        <ThemedText type="subtitle" style={styles.solicitudNombre}>
                          {solicitud.usuario_nombre}
                        </ThemedText>
                        <ThemedText style={styles.solicitudFecha}>
                          {formatFecha(solicitud.fecha_solicitud)}
                        </ThemedText>
                      </View>
                      
                      <ThemedText style={styles.solicitudCorreo}>
                        {solicitud.usuario_correo}
                      </ThemedText>
                      
                      <ThemedText style={styles.solicitudMensaje} numberOfLines={2}>
                        {solicitud?.mensaje ? solicitud.mensaje : 'Hola doctor, me gustaría ser paciente!'}
                      </ThemedText>
                      
                      <ThemedText style={styles.verDetalles}>
                        Toca para ver detalles y responder
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </ThemedBackground>
      </SafeAreaView>

      {/* Modal para responder solicitud */}
      <Modal
        visible={!!selectedSolicitud}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSolicitud(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSolicitud && (
              <>
                <ThemedText type="title" style={styles.modalTitle}>
                  Solicitud de {selectedSolicitud.usuario_nombre}
                </ThemedText>
                
                {selectedSolicitud.usuario_imagen && (
                  <Image 
                    source={{ uri: selectedSolicitud.usuario_imagen }} 
                    style={styles.userImage}
                  />
                )}
                
                <ThemedText style={styles.modalLabel}>Correo electrónico:</ThemedText>
                <ThemedText style={styles.modalValue}>{selectedSolicitud.usuario_correo}</ThemedText>
                
                <ThemedText style={styles.modalLabel}>Fecha de solicitud:</ThemedText>
                <ThemedText style={styles.modalValue}>
                  {formatFecha(selectedSolicitud.fecha_solicitud)}
                </ThemedText>
                
                <ThemedText style={styles.modalLabel}>Mensaje:</ThemedText>
                <View style={styles.mensajeContainer}>
                  <ThemedText style={styles.mensajeText}>
                    {selectedSolicitud?.mensaje ? selectedSolicitud.mensaje : 'Hola doctor, me gustaría ser paciente!'}
                  </ThemedText>
                </View>
                
                <ThemedText style={styles.modalPregunta}>
                  ¿Deseas aceptar a {selectedSolicitud.usuario_nombre} como tu paciente?
                </ThemedText>

                <View style={styles.modalButtons}>
                  <ThemedButton 
                    backgroundColor="grey"
                    onPress={() => setSelectedSolicitud(null)}
                    disabled={responderSolicitudMutation.isPending}
                  >
                    Cancelar
                  </ThemedButton>
                  <ThemedButton 
                    backgroundColor="#e74c3c"
                    onPress={() => handleResponderSolicitud('rechazada')}
                    disabled={responderSolicitudMutation.isPending}
                  >
                    Rechazar
                  </ThemedButton>
                  <ThemedButton 
                    backgroundColor="#2ecc71"
                    onPress={() => handleResponderSolicitud('aceptada')}
                    disabled={responderSolicitudMutation.isPending}
                  >
                    Aceptar
                  </ThemedButton>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

export default SolicitudesPendientes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solicitudesScroll: {
    flex: 1,
  },
  solicitudCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  solicitudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  solicitudNombre: {
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  solicitudFecha: {
    color: '#666',
    fontSize: 12,
  },
  solicitudCorreo: {
    color: '#444',
    marginBottom: 8,
  },
  solicitudMensaje: {
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verDetalles: {
    color: '#ee7200',
    fontSize: 12,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#444',
    marginTop: 10,
  },
  modalValue: {
    color: '#666',
    marginBottom: 5,
  },
  modalPregunta: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  mensajeContainer: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 3,
    borderLeftColor: '#ee7200',
    padding: 10,
    borderRadius: 4,
    marginVertical: 10,
  },
  mensajeText: {
    color: '#555',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});