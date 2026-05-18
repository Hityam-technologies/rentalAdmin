import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/header';
import AppText from '../../components/appText';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const value = await AsyncStorage.getItem('biometricsEnabled');
                if (value !== null) {
                    setFaceIdEnabled(value === 'true');
                }
            } catch (error) {
                console.error("Error loading biometric setting", error);
            }
        };
        loadSettings();
    }, []);

    const toggleBiometrics = async (value) => {
        try {
            if (value) {
                const rnBiometrics = new ReactNativeBiometrics();
                const { available, biometryType } = await rnBiometrics.isSensorAvailable();

                if (available) {
                    setFaceIdEnabled(true);
                    await AsyncStorage.setItem('biometricsEnabled', 'true');
                } else {
                    Alert.alert('Not Supported', 'Biometrics are not available on this device.');
                    setFaceIdEnabled(false);
                    await AsyncStorage.setItem('biometricsEnabled', 'false');
                }
            } else {
                setFaceIdEnabled(false);
                await AsyncStorage.setItem('biometricsEnabled', 'false');
            }
        } catch (error) {
            console.error("Error saving biometric setting", error);
            setFaceIdEnabled(false);
            await AsyncStorage.setItem('biometricsEnabled', 'false');
        }
    };

    const SettingRow = ({ icon, label, sub, type = 'chevron', value, onValueChange }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 12,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                elevation: 1,
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
            }}
            onPress={() => type === 'chevron' && null}
        >
            <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: '#f8fafc',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
            }}>
                <Ionicons name={icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <AppText weight="bold" style={{ color: '#0f172a', fontSize: 13, fontFamily: FONT_FAMILY_REVALIA }}>{label}</AppText>
                {sub && <AppText weight="medium" style={{ color: '#94a3b8', fontSize: 10, marginTop: 1 }}>{sub}</AppText>}
            </View>
            {type === 'chevron' ? (
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            ) : (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#e2e8f0', true: colors.primary }}
                    thumbColor="#ffffff"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
            )}
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }) => (
        <AppText weight="extrabold" style={{
            color: '#cbd5e1',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 10,
            marginTop: 16,
            marginLeft: 4,
            fontFamily: FONT_FAMILY_REVALIA
        }}>
            {title}
        </AppText>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <Header
                title="Settings"
                subtitle="Admin Center"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Summary Header */}
                <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LinearGradient
                            colors={['#4f46e5', '#2563eb']}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AppText weight="extrabold" style={{ color: '#FFFFFF', fontSize: 20 }}>K</AppText>
                        </LinearGradient>
                        <View style={{ marginLeft: 14 }}>
                            <AppText weight="extrabold" style={{ color: '#0f172a', fontSize: 18, fontFamily: FONT_FAMILY_REVALIA }}>Konda Reddi</AppText>
                            <AppText weight="medium" style={{ color: '#94a3b8', fontSize: 11 }}>Primary Admin · konda@hityam.in</AppText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 1.5, borderRadius: 6, backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#d1fae5' }}>
                                    <AppText weight="bold" style={{ color: '#059669', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Verified</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 24 }}>
                    <SectionHeader title="Account & Identity" />
                    <SettingRow icon="person-outline" label="Edit Profile" sub="Update your details" />
                    <SettingRow
                        icon="scan-outline"
                        label="Biometrics"
                        sub="Quick secure access"
                        type="switch"
                        value={faceIdEnabled}
                        onValueChange={toggleBiometrics}
                    />
                    <SettingRow icon="shield-checkmark-outline" label="Security" sub="Passkeys & sessions" />

                    <SectionHeader title="Communications" />
                    <SettingRow
                        icon="notifications-outline"
                        label="Push Alerts"
                        sub="Real-time fleet updates"
                        type="switch"
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                    />
                    <SettingRow icon="mail-outline" label="Email Reports" sub="Daily revenue summaries" />

                    <SectionHeader title="Application" />
                    <SettingRow icon="color-palette-outline" label="Visual Theme" sub="Dark mode & accent colors" />
                    <SettingRow icon="language-outline" label="Language" sub="English (India)" />

                    <SectionHeader title="Support" />
                    <SettingRow icon="help-circle-outline" label="Help Center" sub="FAQs & support chat" />
                    <SettingRow icon="document-text-outline" label="Legal" sub="Privacy & Terms" />

                    <TouchableOpacity style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 14,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: '#fee2e2',
                        backgroundColor: '#fef2f2'
                    }}>
                        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                        <AppText weight="bold" style={{ color: '#ef4444', marginLeft: 8, fontSize: 13 }}>Sign Out</AppText>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={{ marginTop: 40, alignItems: 'center', paddingBottom: 30 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AppText weight="medium" style={{ color: '#cbd5e1', fontSize: 9 }}>with </AppText>
                            <Ionicons name="heart" size={9} color="#ef4444" />
                            <AppText weight="medium" style={{ color: '#cbd5e1', fontSize: 9 }}> from </AppText>
                            <AppText weight="bold" style={{ color: '#94a3b8', fontSize: 9 }}>hityam technologies</AppText>
                        </View>
                        <AppText weight="medium" style={{ color: '#e2e8f0', fontSize: 7, marginTop: 2 }}>v1.0.4 Platinum Admin</AppText>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingsScreen;

