import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './appText';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';

const getInitials = (name) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const getStatusColors = (status) => {
    if (status === 'Active') {
        return { text: '#047857', dot: '#10b981' };
    }
    if (status === 'On Leave') {
        return { text: '#b45309', dot: '#f59e0b' };
    }
    return { text: '#64748b', dot: '#94a3b8' };
};

const WorkerCard = ({ worker, onPress }) => {
    const statusStyle = getStatusColors(worker.status);
    const hasPending = worker.pendingPayout > 0;

    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
            <View className="flex-row items-center">
                <View style={styles.avatar}>
                    <AppText weight="bold" className="text-white" style={{ fontSize: 12 }}>
                        {getInitials(worker.name)}
                    </AppText>
                </View>

                <View className="flex-1 ml-2.5 mr-1.5">
                    <View className="flex-row items-center flex-wrap">
                        <AppText
                            weight="bold"
                            className="text-slate-900 mr-1.5"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}
                            numberOfLines={1}
                        >
                            {worker.name}
                        </AppText>
                        <View style={styles.roleBadge}>
                            <AppText
                                weight="bold"
                                className="text-slate-700"
                                style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}
                                numberOfLines={1}
                            >
                                {worker.role}
                            </AppText>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <Ionicons name="call-outline" size={12} color="#94a3b8" />
                        <AppText weight="medium" className="text-slate-500 ml-1" style={{ fontSize: 12 }} numberOfLines={1}>
                            {worker.phone}
                        </AppText>
                        <View style={[styles.statusDot, { backgroundColor: statusStyle.dot, marginLeft: 8 }]} />
                        <AppText weight="semibold" style={{ fontSize: 11, color: statusStyle.text, marginLeft: 4 }}>
                            {worker.status}
                        </AppText>
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </View>

            <View style={styles.divider} />

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                    <AppText weight="medium" className="text-slate-500 ml-1" style={{ fontSize: 11 }}>
                        Since {worker.joinedDate}
                    </AppText>
                </View>
                <View className="items-end">
                    <AppText weight="medium" className="text-slate-400" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                        Monthly
                    </AppText>
                    <AppText weight="bold" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14, color: '#059669' }}>
                        ₹{worker.salary.toLocaleString('en-IN')}
                    </AppText>
                    {hasPending && (
                        <AppText weight="bold" style={{ fontSize: 10, color: '#e11d48', marginTop: 1 }}>
                            ₹{worker.pendingPayout.toLocaleString('en-IN')} pending
                        </AppText>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleBadge: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        maxWidth: 100,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 10,
    },
});

export default WorkerCard;
