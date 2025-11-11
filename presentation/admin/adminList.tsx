import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { AdminListColumn, AdminRowAction } from './interface';


interface AdminListProps<T> {
columns: AdminListColumn<T>[];
rows?: T[];
isLoading?: boolean;
onRefresh?: () => void;
rowKey: (row: T) => string | number;
actions?: AdminRowAction<T>[];
emptyHint?: string;
}

export function AdminList<T>({ columns, rows = [], isLoading, onRefresh, rowKey, actions = [], emptyHint = 'Sin datos' }: AdminListProps<T>) {
if (isLoading) return <ActivityIndicator style={{ padding: 20 }} />;


return (
<View style={listStyles.table}>
{/* Header */}
<View style={[listStyles.tr, listStyles.thead]}>
{columns.map((c) => (
<View key={String(c.key)} style={[listStyles.th, { flex: c.flex ?? 1, width: c.width }]}>
<ThemedText type="defaultSemiBold" style={{ color: '#000' }}>{c.label}</ThemedText>
</View>
))}
{!!actions.length && (
<View style={[listStyles.th, { width: 92 }]}>
<ThemedText type="defaultSemiBold" style={{ color: '#000' }}>Acciones</ThemedText>
</View>
)}
</View>


{/* Body */}
    {!rows.length ? (
    <View style={{ padding: 16 }}>
    <ThemedText style={{ color: '#000' }}>{emptyHint}</ThemedText>
    </View>
    ) : (
    <FlatList
    data={rows}
    keyExtractor={(row) => String(rowKey(row))}
    refreshing={false}
    onRefresh={onRefresh}
    renderItem={({ item }) => (
    <View style={listStyles.tr}>
    {columns.map((c) => (
    <View key={String(c.key)} style={[listStyles.td, { flex: c.flex ?? 1, width: c.width }]}>
    {c.render ? (
    c.render(item)
    ) : (
    <ThemedText style={{ color: '#000' }}>{String((item as any)[c.key])}</ThemedText>
    )}
    </View>
    ))}
    {!!actions.length && (
    <View style={[listStyles.td, listStyles.actions]}>
    {actions.map((a, idx) => (
    <Pressable key={idx} onPress={() => a.onPress(item)} style={listStyles.actionBtn} hitSlop={8}>
    <Ionicons name={a.icon} size={18} color="#111" />
    </Pressable>
    ))}
    </View>
    )}
    </View>
    )}
    />
    )}
    </View>
    );
}



const listStyles = StyleSheet.create({
    table: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
    thead: { backgroundColor: '#00000008' },
    tr: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#00000011' },
    th: { paddingRight: 8 },
    td: { paddingRight: 8 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
    actionBtn: { padding: 6, borderRadius: 8, backgroundColor: '#0000000A' },
});