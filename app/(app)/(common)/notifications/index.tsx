import { 
  View, SafeAreaView, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useSolicitudesVinculacionStore } from '@/infraestructure/store/useSolicitudesVinculacionStore';
import { useCitasStore } from '@/infraestructure/store/useCitaStore';

// Interfaces para las notificaciones
interface SolicitudNotification {
  id: number;
  type: 'solicitud';
  title: string;
  description: string;
  date: string;
  read: boolean;
  status: 'pendiente' | 'aceptada' | 'rechazada';
  metadata: {
    solicitud_id: number;
    paciente_id?: number;
    doctor_id?: number;
    paciente_nombre?: string;
    doctor_nombre?: string;
  };
}

interface CitaNotification {
  id: number;
  type: 'cita';
  title: string;
  description: string;
  date: string;
  read: boolean;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metadata: {
    cita_id: number;
    paciente_id: number;
    doctor_id: number;
    paciente_nombre: string;
    doctor_nombre: string;
    fecha_hora: string;
    especialidad?: string;
  };
}

type Notification = SolicitudNotification | CitaNotification;

// Tipos de filtros para pacientes
type PacienteFilter = 'all' | 'solicitudes-enviadas' | 'solicitudes-respuesta' | 'citas';

// Tipos de filtros para doctores
type DoctorFilter = 'all' | 'solicitudes-recibidas' | 'solicitudes-respuesta' | 'citas';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | any>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const backgroundColor = useThemeColor({}, 'background');
  
  const { user } = useAuthStore();
  const { 
    useSolicitudesDoctorQuery, 
    solicitudesEnviadasQuery,
    responderSolicitudMutation 
  } = useSolicitudesVinculacionStore();
  
  const { todasCitasQuery } = useCitasStore();

  // Obtener solicitudes según el rol del usuario
  const solicitudesDoctorQuery = useSolicitudesDoctorQuery(
    user?.tipo === 'doctor' ? user.usuario_id : 0 
  );
  const { data: solicitudesDoctor, isLoading: loadingSolicitudesDoctor } = solicitudesDoctorQuery;

  const { data: solicitudesEnviadas, isLoading: loadingSolicitudesEnviadas } = 
    user?.tipo === 'paciente' ? solicitudesEnviadasQuery : { data: null, isLoading: false };

  const { data: citas, isLoading: loadingCitas } = todasCitasQuery;

  // Combinar y transformar las notificaciones
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Procesar solicitudes según el rol
    if (user?.tipo === 'doctor' && solicitudesDoctor && Array.isArray(solicitudesDoctor)) {
      solicitudesDoctor.forEach((solicitud: any) => {
        newNotifications.push({
          id: solicitud.id,
          type: 'solicitud',
          title: 'Nueva solicitud de vinculación',
          description: `El paciente ${solicitud.paciente_nombre} quiere vincularse contigo`,
          date: solicitud.fecha_solicitud,
          read: false,
          status: solicitud.estado,
          metadata: {
            solicitud_id: solicitud.id,
            paciente_id: solicitud.paciente_id,
            paciente_nombre: solicitud.paciente_nombre
          }
        });
      });
    }

    if (user?.tipo === 'paciente' && solicitudesEnviadas && Array.isArray(solicitudesEnviadas)) {
      solicitudesEnviadas.forEach((solicitud: any) => {
        newNotifications.push({
          id: solicitud.id,
          type: 'solicitud',
          title: `Solicitud ${solicitud.estado}`,
          description: `Tu solicitud al Dr. ${solicitud.doctor_nombre} ha sido ${solicitud.estado}`,
          date: solicitud.fecha_respuesta || solicitud.fecha_solicitud,
          read: false,
          status: solicitud.estado,
          metadata: {
            solicitud_id: solicitud.id,
            doctor_id: solicitud.doctor_id,
            doctor_nombre: solicitud.doctor_nombre
          }
        });
      });
    }

    // Procesar citas
    if (citas) {
      citas.forEach((cita: any) => {
        const isDoctor = user?.tipo === 'doctor';
        const otherPersonName = isDoctor ? cita.paciente_nombre : cita.doctor_nombre;
        
        let title = '';
        let description = '';
        
        switch (cita.estado) {
          case 'pendiente':
            title = isDoctor ? 'Nueva cita solicitada' : 'Cita solicitada';
            description = isDoctor 
              ? `El paciente ${otherPersonName} ha solicitado una cita`
              : `Has solicitado una cita con el Dr. ${otherPersonName}`;
            break;
          case 'confirmada':
            title = 'Cita confirmada';
            description = isDoctor
              ? `Has confirmado la cita con ${otherPersonName}`
              : `El Dr. ${otherPersonName} ha confirmado tu cita`;
            break;
          case 'cancelada':
            title = 'Cita cancelada';
            description = isDoctor
              ? `Has cancelado la cita con ${otherPersonName}`
              : `El Dr. ${otherPersonName} ha cancelado tu cita`;
            break;
          case 'completada':
            title = 'Cita completada';
            description = isDoctor
              ? `Has completado la cita con ${otherPersonName}`
              : `Has completado tu cita con el Dr. ${otherPersonName}`;
            break;
          default:
            title = 'Actualización de cita';
            description = `La cita con ${otherPersonName} ha sido actualizada`;
        }

        newNotifications.push({
          id: cita.id,
          type: 'cita',
          title,
          description,
          date: cita.fecha_hora,
          read: false,
          status: cita.estado,
          metadata: {
            cita_id: cita.id,
            paciente_id: cita.paciente_id,
            doctor_id: cita.doctor_id,
            paciente_nombre: cita.paciente_nombre,
            doctor_nombre: cita.doctor_nombre,
            fecha_hora: cita.fecha_hora,
            especialidad: cita.especialidad
          }
        });
      });
    }

    // Ordenar por fecha (más recientes primero)
    newNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setNotifications(newNotifications);
  }, [solicitudesDoctor, solicitudesEnviadas, citas, user]);

  // Filtrar notificaciones según el rol del usuario
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    
    if (user?.tipo === 'paciente') {
      // Filtros para pacientes
      switch (filter as PacienteFilter) {
        case 'solicitudes-enviadas':
          return notification.type === 'solicitud' && 
                 notification.status === 'pendiente' &&
                 notification.title.includes('Solicitud pendiente');
        case 'solicitudes-respuesta':
          return notification.type === 'solicitud' && 
                 (notification.status === 'aceptada' || notification.status === 'rechazada');
        case 'citas':
          return notification.type === 'cita';
        default:
          return true;
      }
    } else if (user?.tipo === 'doctor') {
      // Filtros para doctores
      switch (filter as DoctorFilter) {
        case 'solicitudes-recibidas':
          return notification.type === 'solicitud' && 
                 notification.status === 'pendiente' &&
                 notification.title.includes('Nueva solicitud');
        case 'solicitudes-respuesta':
          return notification.type === 'solicitud' && 
                 (notification.status === 'aceptada' || notification.status === 'rechazada');
        case 'citas':
          return notification.type === 'cita';
        default:
          return true;
      }
    }
    
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleRespondSolicitud = (solicitudId: number, respuesta: 'aceptada' | 'rechazada') => {
    responderSolicitudMutation.mutate({
      solicitud_id: solicitudId,
      respuesta
    });
    setSelectedNotification(null);
  };

  const isLoading = loadingSolicitudesDoctor || loadingSolicitudesEnviadas || loadingCitas;

  if (isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Cargando notificaciones...
              </ThemedText>
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
            {/* Cabecera con título y filtros */}
            <View style={styles.header}>
              <ThemedText type='title' style={{ color: 'black', marginBottom: 15 }}>
                Centro de Notificaciones
              </ThemedText>
              
              {/* Filtros específicos según el tipo de usuario */}
              <View style={styles.filterContainer}>
                <ThemedButton 
                  backgroundColor={filter === 'all' ? '#ee7200' : 'grey'}
                  onPress={() => setFilter('all')}
                  style={styles.filterButton}
                >Todo</ThemedButton>
                
                {user?.tipo === 'paciente' ? (
                  <>
                    <ThemedButton 
                      backgroundColor={filter === 'solicitudes-enviadas' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('solicitudes-enviadas')}
                      style={styles.filterButton}
                    >Solicitudes Enviadas</ThemedButton>
                    <ThemedButton 
                      backgroundColor={filter === 'solicitudes-respuesta' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('solicitudes-respuesta')}
                      style={styles.filterButton}
                    >Respuestas</ThemedButton>
                    <ThemedButton 
                      backgroundColor={filter === 'citas' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('citas')}
                      style={styles.filterButton}
                    >Citas</ThemedButton>
                  </>
                ) : user?.tipo === 'doctor' ? (
                  <>
                    <ThemedButton 
                      backgroundColor={filter === 'solicitudes-recibidas' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('solicitudes-recibidas')}
                      style={styles.filterButton}
                    >Solicitudes Recibidas</ThemedButton>
                    <ThemedButton 
                      backgroundColor={filter === 'solicitudes-respuesta' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('solicitudes-respuesta')}
                      style={styles.filterButton}
                    >Mis Respuestas</ThemedButton>
                    <ThemedButton 
                      backgroundColor={filter === 'citas' ? '#ee7200' : 'grey'}
                      onPress={() => setFilter('citas')}
                      style={styles.filterButton}
                    >Citas</ThemedButton>
                  </>
                ) : null}
              </View>
            </View>

            {/* Lista de notificaciones */}
            <View style={styles.content}>
              <ScrollView style={styles.notificationsScroll}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <Pressable 
                      key={`${notification.type}-${notification.id}`} 
                      style={[
                        styles.notificationItem,
                        !notification.read && styles.unreadNotification
                      ]} 
                      onPress={() => {
                        setSelectedNotification(notification);
                        markAsRead(notification.id);
                      }}
                    >
                      <View style={styles.notificationContent}>
                        <ThemedText type="subtitle" style={styles.notificationTitle}>
                          {notification.title}
                        </ThemedText>
                        <ThemedText style={styles.notificationDescription}>
                          {notification.description}
                        </ThemedText>
                        <ThemedText style={styles.notificationDate}>
                          {new Date(notification.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </ThemedText>
                        <ThemedText style={[
                          styles.notificationStatus,
                          { color: notification.status === 'aceptada' || notification.status === 'confirmada' || notification.status === 'completada'
                            ? 'green' 
                            : notification.status === 'rechazada' || notification.status === 'cancelada'
                            ? 'red'
                            : 'orange'
                          }
                        ]}>
                          {notification.status.toUpperCase()}
                        </ThemedText>
                      </View>
                      {!notification.read && (
                        <View style={styles.unreadIndicator} />
                      )}
                    </Pressable>
                  ))
                ) : (
                  <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                    No hay notificaciones en esta categoría
                  </ThemedText>
                )}
              </ScrollView>
            </View>
          </View>
        </ThemedBackground>
      </SafeAreaView>

      {/* Modal para mostrar detalles de la notificación */}
      <Modal
        visible={!!selectedNotification}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title">{selectedNotification?.title}</ThemedText>
            <ThemedText style={styles.modalDescription}>
              {selectedNotification?.description}
            </ThemedText>
            <ThemedText style={styles.modalDate}>
              Fecha: {selectedNotification ? new Date(selectedNotification.date).toLocaleString('es-ES') : ''}
            </ThemedText>
            <ThemedText style={styles.modalStatus}>
              Estado: {selectedNotification?.status.toUpperCase()}
            </ThemedText>

            {selectedNotification?.type === 'solicitud' && 
             selectedNotification.status === 'pendiente' &&
             user?.tipo === 'doctor' && (
              <View style={styles.modalActions}>
                <ThemedButton 
                  backgroundColor="green"
                  onPress={() => handleRespondSolicitud(selectedNotification.id, 'aceptada')}
                  style={styles.modalActionButton}
                >
                  Aceptar
                </ThemedButton>
                <ThemedButton 
                  backgroundColor="red"
                  onPress={() => handleRespondSolicitud(selectedNotification.id, 'rechazada')}
                  style={styles.modalActionButton}
                >
                  Rechazar
                </ThemedButton>
              </View>
            )}

            <View style={styles.modalClose}>
              <ThemedButton 
                backgroundColor="#ee7200"
                onPress={() => setSelectedNotification(null)}
              >
                Cerrar
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  filterButton: {
    minWidth: '23%',
    marginHorizontal: 2,
    marginVertical: 5,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  notificationsScroll: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#ee7200',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'black',
    marginBottom: 5,
  },
  notificationDescription: {
    color: 'gray',
    marginBottom: 5,
  },
  notificationDate: {
    color: 'lightgray',
    fontSize: 12,
    marginBottom: 5,
  },
  notificationStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ee7200',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalDescription: {
    marginVertical: 10,
    color: 'gray',
  },
  modalDate: {
    color: 'lightgray',
    fontSize: 12,
    marginBottom: 5,
  },
  modalStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalClose: {
    alignItems: 'center',
  },
});