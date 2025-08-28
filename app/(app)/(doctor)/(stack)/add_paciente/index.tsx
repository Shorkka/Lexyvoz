import React, { useEffect, useState } from 'react';
import { 
  View, SafeAreaView, StyleSheet, ScrollView, 
  Pressable, Modal, Alert, ActivityIndicator 
} from 'react-native';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useSolicitudesVinculacionStore } from '@/infraestructure/store/useSolicitudesVinculacionStore';

import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

interface Solicitud {
  id: number;
  mensaje: string;
  fecha_solicitud: string;
  usuario_nombre: string; // Añadido para evitar el error
  usuario_correo: string; // Añadido para evitar el error
}

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const backgroundColor = useThemeColor({}, 'background');
  
  const { user } = useAuthStore();
  const { 
    useSolicitudesDoctorQuery, 
    responderSolicitudMutation 
  } = useSolicitudesVinculacionStore();

  // Obtener solicitudes pendientes del doctor
  const { data: solicitudesData, isLoading, isError, refetch } = 
    useSolicitudesDoctorQuery(user?.usuario_id || 0);

  useEffect(() => {
    if (solicitudesData && 'solicitudes' in solicitudesData) {
      setSolicitudes(solicitudesData.solicitudes.map(sol => ({
        ...sol,
        id: sol.usuario_id, // Asumiendo que usuario_id es el ID de la solicitud
        mensaje: "Mensaje de solicitud", // Ajusta según tu estructura real
        fecha_solicitud: new Date().toISOString(), // Ajusta según tu estructura real
        usuario_correo: sol.usuario_correo || "", // Añadido para evitar el error
      })));
    } else if (solicitudesData && 'success' in solicitudesData && !solicitudesData.success) {
      // Manejar error
      console.error('Error al obtener solicitudes:', solicitudesData.error);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
    }
  }, [solicitudesData]);

  const handleResponderSolicitud = (respuesta: 'aceptada' | 'rechazada') => {
    if (!selectedSolicitud) return;

    responderSolicitudMutation.mutate(
      { 
        solicitud_id: selectedSolicitud.id, 
        respuesta 
      },
      {
        onSuccess: (result) => {
          if (result && 'success' in result && result.success) {
            const mensaje = respuesta === 'aceptada' 
              ? `Solicitud aceptada. ${selectedSolicitud.usuario_nombre} es ahora tu paciente.`
              : `Solicitud rechazada.`;
            
            Alert.alert('Éxito', mensaje);
            
            // Actualizar lista de solicitudes
            setSolicitudes(prev => 
              prev.filter(s => s.id !== selectedSolicitud.id)
            );
          } else {
            Alert.alert('Error', 'No se pudo procesar la respuesta');
          }
          setSelectedSolicitud(null);
        },
        onError: (error) => {
          Alert.alert('Error', 'Error de conexión');
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
                        {solicitud.mensaje}
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
                
                <ThemedText style={styles.modalLabel}>Correo electrónico:</ThemedText>
                <ThemedText style={styles.modalValue}>{selectedSolicitud.usuario_correo}</ThemedText>
                
                <ThemedText style={styles.modalLabel}>Fecha de solicitud:</ThemedText>
                <ThemedText style={styles.modalValue}>
                  {formatFecha(selectedSolicitud.fecha_solicitud)}
                </ThemedText>
                
                <ThemedText style={styles.modalLabel}>Mensaje:</ThemedText>
                <View style={styles.mensajeContainer}>
                  <ThemedText style={styles.mensajeText}>
                    {selectedSolicitud.mensaje}
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
                    style={{ marginHorizontal: 10 }}
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