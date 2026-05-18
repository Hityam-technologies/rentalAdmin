import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './appText';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';

const PayrollOverviewCard = ({ totalSalary, pendingPayouts, staffCount }) => (
    <View style={styles.card}>
        <View className="flex-row items-center mb-3">
            <View style={styles.iconWrap}>
                <Ionicons name="wallet-outline" size={18} color={colors.primary} />
            </View>
            <View className="flex-1 ml-2.5">
                <AppText
                    weight="bold"
                    className="text-slate-900 uppercase tracking-wider"
                    style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
                >
                    Payroll Overview
                </AppText>
                <AppText weight="medium" className="text-slate-500 mt-0.5" style={{ fontSize: 12 }}>
                    {staffCount} team members · current cycle
                </AppText>
            </View>
        </View>

        <View style={styles.statsRow}>
            <View style={styles.statBlock}>
                <AppText weight="medium" className="text-slate-500" style={{ fontSize: 12 }}>
                    Monthly payroll
                </AppText>
                <AppText weight="bold" className="text-slate-900 mt-0.5" style={{ fontSize: 17 }}>
                    ₹{totalSalary.toLocaleString('en-IN')}
                </AppText>
            </View>

            <View style={styles.divider} />

            <View style={[styles.statBlock, styles.statBlockRight]}>
                <AppText weight="medium" className="text-slate-500" style={{ fontSize: 12 }}>
                    Pending payouts
                </AppText>
                <AppText
                    weight="bold"
                    className="mt-1"
                    style={{ fontSize: 17, color: pendingPayouts > 0 ? '#e11d48' : '#059669' }}
                >
                    ₹{pendingPayouts.toLocaleString('en-IN')}
                </AppText>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: colors.primary,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 11,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statBlock: {
        flex: 1,
    },
    statBlockRight: {
        alignItems: 'flex-end',
    },
    divider: {
        width: 1,
        height: 28,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 10,
    },
});

export default PayrollOverviewCard;
