import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import AppText from '../../components/appText';
import { alertsData } from '../../constants/data';

const NotificationsScreen = ({ navigation }) => {
    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <Header
                title="Notifications"
                subtitle="Alerts & Updates"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {alertsData.map((alert, idx) => (
                    <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        className="bg-white border border-slate-200/80 rounded-[24px] p-5 mb-4 shadow-sm"
                        style={{
                            shadowColor: '#0f172a',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center mb-3">
                            <View
                                className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                style={{ backgroundColor: alert.iconBg }}
                            >
                                <Ionicons name={alert.icon} size={20} color={alert.iconColor} />
                            </View>
                            <View className="flex-1">
                                <AppText weight="bold" className="text-slate-900 text-base">
                                    {alert.title}
                                </AppText>
                                <AppText weight="medium" className="text-slate-500 text-xs mt-0.5">
                                    {alert.desc}
                                </AppText>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-slate-100">
                            <AppText weight="medium" className="text-slate-400 text-[10px] uppercase tracking-widest">
                                {idx === 0 ? '2h ago' : '5h ago'}
                            </AppText>
                            <TouchableOpacity className="flex-row items-center">
                                <AppText weight="bold" className="text-blue-600 text-xs mr-1">
                                    {alert.cta}
                                </AppText>
                                <Ionicons name="arrow-forward" size={12} color="#2563eb" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Additional Mock Notifications for Density */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="bg-white border border-slate-200/80 rounded-[24px] p-5 mb-4 shadow-sm opacity-60"
                >
                    <View className="flex-row items-center mb-3">
                        <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center mr-3">
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <AppText weight="bold" className="text-slate-900 text-base">
                                KYC Approved
                            </AppText>
                            <AppText weight="medium" className="text-slate-500 text-xs mt-0.5">
                                12 new tenants successfully verified.
                            </AppText>
                        </View>
                    </View>
                    <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-slate-100">
                        <AppText weight="medium" className="text-slate-400 text-[10px] uppercase tracking-widest">Yesterday</AppText>
                        <AppText weight="bold" className="text-slate-400 text-xs">View Clients</AppText>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default NotificationsScreen;
