import React from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
    Alert,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/header';
import AppText from '../../components/appText';
import ProfileHeroStats from '../../components/profileHeroStats';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';

const getInitials = (name) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const getStatusColors = (status) => {
    if (status === 'Active') {
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', dot: '#10b981' };
    }
    if (status === 'On Leave') {
        return { bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b' };
    }
    return { bg: '#f1f5f9', border: '#e2e8f0', text: '#64748b', dot: '#94a3b8' };
};

const SectionTitle = ({ children }) => (
    <AppText
        weight="bold"
        className="text-slate-500 uppercase tracking-wider mb-3"
        style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
    >
        {children}
    </AppText>
);

const InfoRow = ({ icon, label, value, isLast = false }) => (
    <View
        className="flex-row items-center justify-between"
        style={[
            styles.infoRow,
            !isLast ? { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' } : undefined,
        ]}
    >
        <View className="flex-row items-center flex-1 mr-3">
            <View style={styles.infoIconWrap}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <AppText weight="medium" className="text-slate-500 ml-3" style={{ fontSize: 14 }}>
                {label}
            </AppText>
        </View>
        <AppText weight="bold" className="text-slate-900 text-right" style={{ fontSize: 14, maxWidth: '52%' }}>
            {value}
        </AppText>
    </View>
);

const WorkerDetailScreen = ({ route, navigation }) => {
    const { worker } = route.params;
    const statusStyle = getStatusColors(worker.status);

    const handleCall = () => {
        const phone = worker.phone.replace(/\s/g, '');
        Linking.openURL(`tel:${phone}`).catch(() =>
            Alert.alert('Unable to call', 'Could not open the phone dialer.'),
        );
    };

    const handleProcessPayout = () => {
        if (worker.pendingPayout <= 0) {
            Alert.alert('No pending payout', 'This worker has no outstanding payments right now.');
            return;
        }
        Alert.alert(
            'Process Payout',
            `Pay ₹${worker.pendingPayout.toLocaleString('en-IN')} to ${worker.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => Alert.alert('Payout queued', 'Payment has been marked for processing.') },
            ],
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                title="Worker Profile"
                subtitle={worker.id}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 48 }}
            >
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View className="flex-row items-start justify-between">
                        <View className="flex-row items-center flex-1">
                            <View style={styles.heroAvatar}>
                                <AppText weight="extrabold" className="text-white text-xl">
                                    {getInitials(worker.name)}
                                </AppText>
                            </View>
                            <View className="flex-1 ml-4">
                                <AppText
                                    weight="bold"
                                    className="text-white"
                                    style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 18 }}
                                >
                                    {worker.name}
                                </AppText>
                                <View style={styles.heroRoleBadge}>
                                    <AppText weight="bold" className="text-slate-800 uppercase tracking-wider" style={{ fontSize: 11 }}>
                                        {worker.role}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                            <AppText weight="bold" style={{ fontSize: 12, color: statusStyle.text, marginLeft: 6 }}>
                                {worker.status}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.heroDivider} />

                    <ProfileHeroStats
                        metrics={[
                            {
                                label: 'Base salary',
                                value: `₹${worker.salary.toLocaleString('en-IN')}`,
                            },
                            {
                                label: 'Pending',
                                value: `₹${worker.pendingPayout.toLocaleString('en-IN')}`,
                                valueColor: worker.pendingPayout > 0 ? '#fda4af' : undefined,
                            },
                        ]}
                    />
                </LinearGradient>

                <View className="flex-row mb-5">
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleCall}
                        style={[styles.actionBtn, styles.actionPrimary, styles.actionBtnLeft]}
                    >
                        <Ionicons name="call" size={20} color="#FFFFFF" />
                        <AppText weight="bold" className="text-white ml-2" style={{ fontSize: 14 }}>
                            Call
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleProcessPayout}
                        style={[styles.actionBtn, styles.actionSecondary, styles.actionBtnRight]}
                    >
                        <Ionicons name="wallet" size={20} color={colors.primary} />
                        <AppText weight="bold" className="ml-2" style={{ color: colors.primary, fontSize: 14 }}>
                            Pay Out
                        </AppText>
                    </TouchableOpacity>
                </View>

                <SectionTitle>Employment Details</SectionTitle>
                <View style={styles.sectionCard}>
                    <InfoRow icon="briefcase-outline" label="Role" value={worker.role} />
                    <InfoRow icon="pulse-outline" label="Status" value={worker.status} />
                    <InfoRow icon="calendar-outline" label="Joined" value={worker.joinedDate} />
                    <InfoRow icon="cash-outline" label="Last payout" value={worker.lastPayout} isLast />
                </View>

                <SectionTitle>Salary Summary</SectionTitle>
                <View style={styles.salaryHighlight}>
                    <View className="flex-row justify-between">
                        <View>
                            <AppText weight="medium" className="text-emerald-800" style={{ fontSize: 12 }}>
                                Monthly base
                            </AppText>
                            <AppText weight="bold" className="text-emerald-950 mt-1" style={{ fontSize: 18 }}>
                                ₹{worker.salary.toLocaleString('en-IN')}
                            </AppText>
                        </View>
                        <View className="items-end">
                            <AppText weight="medium" className="text-emerald-800" style={{ fontSize: 12 }}>
                                Outstanding
                            </AppText>
                            <AppText
                                weight="bold"
                                className="mt-1"
                                style={{
                                    fontSize: 18,
                                    color: worker.pendingPayout > 0 ? '#e11d48' : '#047857',
                                }}
                            >
                                ₹{worker.pendingPayout.toLocaleString('en-IN')}
                            </AppText>
                        </View>
                    </View>
                </View>

                <SectionTitle>Recent Transactions</SectionTitle>
                <View style={styles.sectionCard}>
                    {worker.logs.length === 0 ? (
                        <View style={styles.emptyLogs}>
                            <Ionicons name="receipt-outline" size={36} color="#94a3b8" />
                            <AppText weight="medium" className="text-slate-500 mt-3" style={{ fontSize: 14 }}>
                                No transactions yet
                            </AppText>
                        </View>
                    ) : (
                        worker.logs.map((log, i) => (
                            <View
                                key={`${log.date}-${log.type}-${i}`}
                                className="flex-row justify-between items-center"
                                style={[
                                    styles.logRow,
                                    i < worker.logs.length - 1 ? { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' } : undefined,
                                ]}
                            >
                                <View className="flex-row items-center flex-1 mr-3">
                                    <View
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: log.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                                        }}
                                    >
                                        <Ionicons
                                            name={log.status === 'Completed' ? 'checkmark' : 'time'}
                                            size={18}
                                            color={log.status === 'Completed' ? '#10b981' : '#f59e0b'}
                                        />
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <AppText weight="bold" className="text-slate-800" style={{ fontSize: 14 }}>
                                            {log.type}
                                        </AppText>
                                        <AppText weight="medium" className="text-slate-400 mt-0.5" style={{ fontSize: 13 }}>
                                            {log.date}
                                        </AppText>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <AppText weight="bold" className="text-slate-900" style={{ fontSize: 15 }}>
                                        ₹{log.amount.toLocaleString('en-IN')}
                                    </AppText>
                                    <AppText
                                        weight="bold"
                                        className="mt-1"
                                        style={{
                                            fontSize: 11,
                                            color: log.status === 'Completed' ? '#10b981' : '#f59e0b',
                                        }}
                                    >
                                        {log.status}
                                    </AppText>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <SectionTitle>Role Overview</SectionTitle>
                <View style={styles.noteCard}>
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="document-text-outline" size={18} color="#64748b" />
                        <AppText
                            weight="bold"
                            className="text-slate-500 uppercase tracking-wider ml-2"
                            style={{ fontSize: 12 }}
                        >
                            Responsibilities
                        </AppText>
                    </View>
                    <AppText weight="medium" className="text-slate-700 leading-6" style={{ fontSize: 14 }}>
                        {worker.overview}
                    </AppText>
                </View>

                <TouchableOpacity activeOpacity={0.85} onPress={handleProcessPayout} style={styles.processBtn}>
                    <Ionicons name="card" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <AppText weight="bold" className="text-white uppercase tracking-wider" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 13 }}>
                        Process Payout
                    </AppText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        borderRadius: 24,
        padding: 18,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    heroAvatar: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroRoleBadge: {
        alignSelf: 'flex-start',
        marginTop: 8,
        backgroundColor: '#e2e8f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    heroDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 16,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    actionBtnLeft: { marginRight: 6 },
    actionBtnRight: { marginLeft: 6 },
    actionPrimary: { backgroundColor: colors.primary },
    actionSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoRow: { paddingVertical: 16 },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    infoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    salaryHighlight: {
        backgroundColor: '#ecfdf5',
        borderRadius: 24,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    logRow: { paddingVertical: 14 },
    emptyLogs: {
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 20,
    },
    processBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
});

export default WorkerDetailScreen;
