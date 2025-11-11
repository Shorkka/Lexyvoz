import React, { useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';
import { AdminList } from '../../../../presentation/admin/adminList';
import { AdminScaffold } from '../../../../presentation/admin/adminScaffold';
import { AdminListColumn, AdminRowAction } from '../../../../presentation/admin/interface';

export interface AdminUser {
  usuario_id: number;
  nombre: string;
  correo: string;
  tipo?: string; // Doctor | Paciente | Admin
  activo?: boolean;
}

async function fetchUsers(): Promise<{ data: AdminUser[] }> {
  return { data: [] };
}

export default function AdminUsersList() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((r) => setRows(r.data)).finally(() => setLoading(false));
  }, []);

  const columns: AdminListColumn<AdminUser>[] = [
    { key: 'usuario_id', label: 'ID', width: 64 },
    { key: 'nombre', label: 'Nombre', flex: 2 },
    { key: 'correo', label: 'Correo', flex: 2 },
    { key: 'tipo', label: 'Rol' },
    { key: 'activo', label: 'Activo', render: (u) => <>{u.activo ? 'Sí' : 'No'}</> },
  ];

  const actions: AdminRowAction<AdminUser>[] = [
    { icon: 'pencil-outline', label: 'Editar', onPress: (u) => {} },
    { icon: 'trash-outline', label: 'Eliminar', onPress: async (u) => {} },
  ];

  return (
    <AdminScaffold title="Usuarios" subtitle="Gestión básica de usuarios">
      {loading ? (
        <ActivityIndicator style={{ padding: 16 }} />
      ) : (
        <AdminList<AdminUser>
          columns={columns}
          rows={rows}
          rowKey={(u) => u.usuario_id}
          actions={actions}
          emptyHint=""
        />
      )}
    </AdminScaffold>
  );
}
