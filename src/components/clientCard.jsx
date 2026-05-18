import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './appText';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';
import { colors } from '../assets/colors';

const getInitials = (name) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const ClientCard = ({ client, onPress }) => {
    const isVerified = client.kycStatus === 'Verified';

    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
            <View className="flex-row items-center">
                <View style={styles.avatar}>
                    <AppText weight="bold" className="text-white" style={{ fontSize: 12 }}>
                        {getInitials(client.name)}
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
                            {client.name}
                        </AppText>
                        <View style={styles.tierBadge}>
                            <AppText weight="bold" className="text-amber-800" style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                                {client.tier}
                            </AppText>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <Ionicons name="call-outline" size={12} color="#94a3b8" />
                        <AppText weight="medium" className="text-slate-500 ml-1" style={{ fontSize: 12 }} numberOfLines={1}>
                            {client.phone}
                        </AppText>
                        {isVerified && (
                            <Ionicons name="shield-checkmark" size={12} color="#10b981" style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </View>

            <View style={styles.divider} />

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                    <AppText weight="medium" className="text-slate-500 ml-1" style={{ fontSize: 11 }}>
                        {client.totalBookings} trips
                    </AppText>
                </View>
                <View className="items-end">
                    <AppText weight="medium" className="text-slate-400" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                        Lifetime
                    </AppText>
                    <AppText weight="bold" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14, color: colors.primary }}>
                        ₹{client.totalRevenue.toLocaleString('en-IN')}
                    </AppText>
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
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tierBadge: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 10,
    },
});

export default ClientCard;
