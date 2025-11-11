import { View, StyleSheet } from 'react-native';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
const HERO = '#fba557';


interface AdminScaffoldProps {
title: string;
subtitle?: string;
primaryCta?: { label: string; icon?: React.ComponentProps<typeof Ionicons>['name']; onPress: () => void };
children: React.ReactNode;
}


export const AdminScaffold: React.FC<AdminScaffoldProps> = ({ title, subtitle, primaryCta, children }) => {
return (
        <ScrollView>
    <ThemedBackground fullHeight backgroundColor={HERO} style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <ThemedText type="title" style={{ color: '#fff' }}>{title}</ThemedText>
                        {!!subtitle && (
                    <ThemedText type="subtitle" style={{ color: '#fff', opacity: 0.85, marginTop: 4 }}>{subtitle}</ThemedText>
                )}
                </View>
            {primaryCta && (
            <ThemedButton onPress={primaryCta.onPress} style={{ minWidth: 140 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {primaryCta.icon && <Ionicons name={primaryCta.icon} size={18} color="#fff" style={{ marginRight: 8 }} />}
                <   ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>{primaryCta.label}</ThemedText>
                </View>
            </ThemedButton>
            )}
            </View>
            <View style={{ marginTop: 14 }}>{children}</View>
    </ThemedBackground>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
hero: { borderRadius: 16, margin: 16, padding: 16 },
header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});