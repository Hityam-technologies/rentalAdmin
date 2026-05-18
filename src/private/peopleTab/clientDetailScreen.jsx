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

const ClientDetailScreen = ({ route, navigation }) => {
    const { client } = route.params;
    const isVerified = client.kycStatus === 'Verified';
    const avgPerTrip = client.totalBookings
        ? Math.round(client.totalRevenue / client.totalBookings)
        : 0;

    const handleCall = () => {
        const phone = client.phone.replace(/\s/g, '');
        Linking.openURL(`tel:${phone}`).catch(() =>
            Alert.alert('Unable to call', 'Could not open the phone dialer.'),
        );
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${client.email}`).catch(() =>
            Alert.alert('Unable to email', 'Could not open the mail app.'),
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                title="Client Profile"
                subtitle={client.id}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 px-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 48 }}
            >
                {/* Hero */}
                <LinearGradient
                    colors={[colors.primary, '#003a6b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View className="flex-row items-start justify-between">
                        <View className="flex-row items-center flex-1">
                            <View style={styles.heroAvatar}>
                                <AppText weight="extrabold" className="text-white text-xl">
                                    {getInitials(client.name)}
                                </AppText>
                            </View>
                            <View className="flex-1 ml-4">
                                <AppText
                                    weight="bold"
                                    className="text-white"
                                    style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 18 }}
                                >
                                    {client.name}
                                </AppText>
                                <View style={styles.heroTierBadge}>
                                    <AppText weight="bold" className="text-amber-900 uppercase tracking-wider" style={{ fontSize: 11 }}>
                                        {client.tier}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        {isVerified && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                <AppText weight="bold" className="text-emerald-700 ml-1.5" style={{ fontSize: 12 }}>
                                    Verified
                                </AppText>
                            </View>
                        )}
                    </View>

                    <View style={styles.heroDivider} />

                    <ProfileHeroStats
                        metrics={[
                            {
                                label: 'Lifetime revenue',
                                value: `₹${client.totalRevenue.toLocaleString('en-IN')}`,
                            },
                            {
                                label: 'Total trips',
                                value: String(client.totalBookings),
                            },
                        ]}
                    />
                </LinearGradient>

                {/* Quick actions */}
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
                        onPress={handleEmail}
                        style={[styles.actionBtn, styles.actionSecondary, styles.actionBtnRight]}
                    >
                        <Ionicons name="mail" size={20} color={colors.primary} />
                        <AppText weight="bold" className="ml-2" style={{ color: colors.primary, fontSize: 14 }}>
                            Email
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Contact */}
                <SectionTitle>Contact & Verification</SectionTitle>
                <View style={styles.sectionCard}>
                    <InfoRow icon="call-outline" label="Phone" value={client.phone} />
                    <InfoRow icon="mail-outline" label="Email" value={client.email} />
                    <InfoRow icon="shield-checkmark-outline" label="KYC" value={client.kycDetail} />
                    <InfoRow icon="calendar-outline" label="Member since" value={client.joinedDate} isLast />
                </View>

                {/* Insights */}
                <SectionTitle>Fleet Insights</SectionTitle>
                <View style={styles.sectionCard}>
                    <InfoRow icon="car-sport-outline" label="Preferred segment" value={client.topSegment} />
                    <InfoRow icon="analytics-outline" label="Avg. per trip" value={`₹${avgPerTrip.toLocaleString('en-IN')}`} />
                    <InfoRow icon="time-outline" label="Past bookings" value={`${client.pastBookingsCount} completed`} isLast />
                </View>

                {/* Active booking */}
                <SectionTitle>Current Rental</SectionTitle>
                {client.currentBooking ? (
                    <View style={[styles.sectionCard, styles.activeBookingCard]}>
                        <View className="flex-row items-center justify-between mb-3">
                            <AppText weight="bold" className="text-slate-900" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 16 }}>
                                {client.currentBooking.car}
                            </AppText>
                            <View style={styles.activePill}>
                                <View style={styles.activeDot} />
                                <AppText weight="bold" className="text-emerald-700 uppercase tracking-wider" style={{ fontSize: 11 }}>
                                    {client.currentBooking.status}
                                </AppText>
                            </View>
                        </View>
                        <View className="flex-row justify-between">
                            <AppText weight="medium" className="text-slate-500" style={{ fontSize: 14 }}>
                                {client.currentBooking.days} days · ₹{client.currentBooking.rate.toLocaleString('en-IN')}/day
                            </AppText>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.sectionCard, styles.emptyBooking]}>
                        <Ionicons name="car-outline" size={36} color="#94a3b8" />
                        <AppText weight="medium" className="text-slate-500 mt-3" style={{ fontSize: 14 }}>
                            No active rental right now
                        </AppText>
                    </View>
                )}

                {/* Admin note */}
                <SectionTitle>Admin Notes</SectionTitle>
                <View style={styles.noteCard}>
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="document-text-outline" size={18} color="#64748b" />
                        <AppText
                            weight="bold"
                            className="text-slate-500 uppercase tracking-wider ml-2"
                            style={{ fontSize: 12 }}
                        >
                            Internal note
                        </AppText>
                    </View>
                    <AppText weight="medium" className="text-slate-700 leading-6" style={{ fontSize: 14 }}>
                        {client.recentNote}
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        borderRadius: 24,
        padding: 18,
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    heroAvatar: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTierBadge: {
        alignSelf: 'flex-start',
        marginTop: 8,
        backgroundColor: '#fde68a',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#a7f3d0',
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
    infoRow: {
        paddingVertical: 16,
    },
    actionBtnLeft: {
        marginRight: 6,
    },
    actionBtnRight: {
        marginLeft: 6,
    },
    actionPrimary: {
        backgroundColor: colors.primary,
    },
    actionSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
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
    activeBookingCard: {
        paddingVertical: 18,
        paddingHorizontal: 18,
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    activePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    emptyBooking: {
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 8,
    },
});

export default ClientDetailScreen;
