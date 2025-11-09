import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitasStore } from '@/infraestructure/store/useCitaStore';
import { useSolicitudesVinculacionStore } from '@/infraestructure/store/useSolicitudesVinculacionStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';

// ---- Tipos de notificación ----
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
    doctor_id?: number;
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

// Filtros para paciente
type PacienteFilter = 'all' | 'solicitudes-enviadas' | 'solicitudes-respuesta' | 'citas';

const NotificationsPaciente = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<PacienteFilter>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const backgroundColor = useThemeColor({}, 'background');


  const { solicitudesEnviadasQuery } = useSolicitudesVinculacionStore();
  // Nota: en tu store este objeto ya viene "invocado"
  const { data: solicitudesEnviadas, isLoading: loadingSolicitudesEnviadas } = solicitudesEnviadasQuery;

  const { todasCitasQuery } = useCitasStore();
  const { data: citas, isLoading: loadingCitas } = todasCitasQuery;

  // Construcción de notificaciones (PACIENTE)
  useEffect(() => {
    const list: Notification[] = [];

    if (Array.isArray(solicitudesEnviadas)) {
      solicitudesEnviadas.forEach((s: any) => {
        list.push({
          id: s.id,
          type: 'solicitud',
          title: `Solicitud ${s.estado}`,
          description: `Tu solicitud al Dr. ${s.doctor_nombre} ha sido ${s.estado}`,
          date: s.fecha_respuesta || s.fecha_solicitud,
          read: false,
          status: s.estado,
          metadata: {
            solicitud_id: s.id,
            doctor_id: s.doctor_id,
            doctor_nombre: s.doctor_nombre,
          },
        });
      });
    }

    if (Array.isArray(citas)) {
      citas.forEach((c: any) => {
        const otherName = c.doctor_nombre;
        let title = '';
        let description = '';

        switch (c.estado) {
          case 'pendiente':
            title = 'Cita solicitada';
            description = `Has solicitado una cita con el Dr. ${otherName}`;
            break;
          case 'confirmada':
            title = 'Cita confirmada';
            description = `El Dr. ${otherName} ha confirmado tu cita`;
            break;
          case 'cancelada':
            title = 'Cita cancelada';
            description = `El Dr. ${otherName} ha cancelado tu cita`;
            break;
          case 'completada':
            title = 'Cita completada';
            description = `Has completado tu cita con el Dr. ${otherName}`;
            break;
          default:
            title = 'Actualización de cita';
            description = `La cita con el Dr. ${otherName} ha sido actualizada`;
        }

        list.push({
          id: c.id,
          type: 'cita',
          title,
          description,
          date: c.fecha_hora,
          read: false,
          status: c.estado,
          metadata: {
            cita_id: c.id,
            paciente_id: c.paciente_id,
            doctor_id: c.doctor_id,
            paciente_nombre: c.paciente_nombre,
            doctor_nombre: c.doctor_nombre,
            fecha_hora: c.fecha_hora,
            especialidad: c.especialidad,
          },
        });
      });
    }

    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setNotifications(list);
  }, [solicitudesEnviadas, citas]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'all') return true;
      switch (filter) {
        case 'solicitudes-enviadas':
          return n.type === 'solicitud' && n.status === 'pendiente' && n.title.includes('Solicitud pendiente');
        case 'solicitudes-respuesta':
          return n.type === 'solicitud' && (n.status === 'aceptada' || n.status === 'rechazada');
        case 'citas':
          return n.type === 'cita';
        default:
          return true;
      }
    });
  }, [notifications, filter]);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
  };

  const isLoading = loadingSolicitudesEnviadas || loadingCitas;

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
            {/* Header + filtros Paciente */}
            <View style={styles.header}>
              <ThemedText type="title" style={{ color: 'black', marginBottom: 15 }}>
                Centro de Notificaciones
              </ThemedText>

              <View style={styles.filterContainer}>
                <ThemedButton
                  backgroundColor={filter === 'all' ? '#ee7200' : 'grey'}
                  onPress={() => setFilter('all')}
                  style={styles.filterButton}
                >
                  Todo
                </ThemedButton>

                <ThemedButton
                  backgroundColor={filter === 'solicitudes-enviadas' ? '#ee7200' : 'grey'}
                  onPress={() => setFilter('solicitudes-enviadas')}
                  style={styles.filterButton}
                >
                  Solicitudes Enviadas
                </ThemedButton>

                <ThemedButton
                  backgroundColor={filter === 'solicitudes-respuesta' ? '#ee7200' : 'grey'}
                  onPress={() => setFilter('solicitudes-respuesta')}
                  style={styles.filterButton}
                >
                  Respuestas
                </ThemedButton>

                <ThemedButton
                  backgroundColor={filter === 'citas' ? '#ee7200' : 'grey'}
                  onPress={() => setFilter('citas')}
                  style={styles.filterButton}
                >
                  Citas
                </ThemedButton>
              </View>
            </View>

            {/* Lista */}
            <View style={styles.content}>
              <ScrollView style={styles.notificationsScroll}>
                {filtered.length ? (
                  filtered.map((n) => (
                    <Pressable
                      key={`${n.type}-${n.id}`}
                      style={[styles.notificationItem, !n.read && styles.unreadNotification]}
                      onPress={() => {
                        setSelectedNotification(n);
                        markAsRead(n.id);
                      }}
                    >
                      <View style={styles.notificationContent}>
                        <ThemedText type="subtitle" style={styles.notificationTitle}>
                          {n.title}
                        </ThemedText>
                        <ThemedText style={styles.notificationDescription}>{n.description}</ThemedText>
                        <ThemedText style={styles.notificationDate}>
                          {new Date(n.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </ThemedText>
                        <ThemedText
                          style={[
                            styles.notificationStatus,
                            {
                              color:
                                n.status === 'confirmada' || n.status === 'completada'
                                  ? 'green'
                                  : n.status === 'cancelada'
                                  ? 'red'
                                  : 'orange',
                            },
                          ]}
                        >
                          {n.status.toUpperCase()}
                        </ThemedText>
                      </View>
                      {!n.read && <View style={styles.unreadIndicator} />}
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

      {/* Modal Detalle (solo cerrar en paciente) */}
      <Modal
        visible={!!selectedNotification}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title">{selectedNotification?.title}</ThemedText>
            <ThemedText style={styles.modalDescription}>{selectedNotification?.description}</ThemedText>
            <ThemedText style={styles.modalDate}>
              Fecha: {selectedNotification ? new Date(selectedNotification.date).toLocaleString('es-ES') : ''}
            </ThemedText>
            <ThemedText style={styles.modalStatus}>
              Estado: {selectedNotification?.status.toUpperCase()}
            </ThemedText>

            <View style={styles.modalClose}>
              <ThemedButton backgroundColor="#ee7200" onPress={() => setSelectedNotification(null)}>
                Cerrar
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

export default NotificationsPaciente;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, width: '100%' },
  header: { width: '100%', paddingTop: 20 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 15 },
  filterButton: { minWidth: '23%', marginHorizontal: 2, marginVertical: 5, paddingVertical: 8 },
  content: { flex: 1, width: '100%' },
  notificationsScroll: { flex: 1 },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadNotification: { borderLeftWidth: 4, borderLeftColor: '#ee7200' },
  notificationContent: { flex: 1 },
  notificationTitle: { color: 'black', marginBottom: 5 },
  notificationDescription: { color: 'gray', marginBottom: 5 },
  notificationDate: { color: 'lightgray', fontSize: 12, marginBottom: 5 },
  notificationStatus: { fontSize: 12, fontWeight: 'bold' },
  unreadIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ee7200', marginLeft: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%' },
  modalDescription: { marginVertical: 10, color: 'gray' },
  modalDate: { color: 'lightgray', fontSize: 12, marginBottom: 5 },
  modalStatus: { fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  modalClose: { alignItems: 'center' },
});
