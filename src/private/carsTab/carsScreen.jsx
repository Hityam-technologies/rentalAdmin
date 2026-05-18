import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/header';
import AppText from '../../components/appText';
import { inventoryList } from '../../constants/data';

const CarsScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('All Fleet');
    const [imageErrors, setImageErrors] = useState({});
    const [fleet, setFleet] = useState(inventoryList);

    const filterTabs = ['All Fleet', 'Available', 'On Rent', 'In Service'];

    const filteredInventory = fleet.filter(item => {
        if (selectedTab === 'Available') return item.status === 'Available';
        if (selectedTab === 'On Rent') return item.status === 'On Rent';
        if (selectedTab === 'In Service') return item.status === 'In Service';
        return true;
    });

    return (
        <View className="flex-1" style={{ backgroundColor: '#F7F8FA' }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <Header
                title="Cars & Status"
                subtitle="Fleet Inventory"
                rightText="+ Add Car"
                onRightPress={() =>
                    navigation.navigate('AddCar', {
                        onCarAdded: (car) => setFleet((prev) => [car, ...prev]),
                    })
                }
            />

            {/* Filter Tabs */}
            <View className="px-6 pt-4 pb-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {filterTabs.map((tab) => {
                        const active = selectedTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                activeOpacity={0.8}
                                onPress={() => setSelectedTab(tab)}
                                className="px-4 py-2 rounded-xl mr-2.5 border"
                                style={{
                                    backgroundColor: active ? colors.primary : '#FFFFFF',
                                    borderColor: active ? colors.primary : '#E2E8F0',
                                    shadowColor: active ? colors.primary : 'transparent',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: active ? 2 : 0,
                                }}
                            >
                                <AppText
                                    weight="bold"
                                    className="text-xs"
                                    style={{ color: active ? '#FFFFFF' : '#64748B' }}
                                >
                                    {tab}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Scroll view of inventory list */}
            <ScrollView className="flex-1 px-6 pt-3" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {filteredInventory.map((item) => (
                    <View
                        key={item.id}
                        className="bg-white rounded-[24px] p-4 mb-4 border border-slate-100"
                        style={{
                            shadowColor: '#0f172a',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 12,
                            elevation: 3,
                        }}
                    >
                        {/* Header Row */}
                        <View className="flex-row justify-between items-start mb-1">
                            <View className="flex-1 mr-2">
                                <AppText weight="bold" className="text-slate-900 text-base" style={{ fontFamily: FONT_FAMILY_REVALIA }} numberOfLines={1}>
                                    {item.name}
                                </AppText>
                                <AppText weight="medium" className="text-slate-500 text-[11px]" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    {item.subtitle}
                                </AppText>
                            </View>

                            {/* Status Badge */}
                            <View
                                className="px-2.5 py-1 rounded-lg flex-row items-center border"
                                style={{ backgroundColor: item.statusBg, borderColor: `${item.statusColor}30` }}
                            >
                                <View className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: item.statusColor }} />
                                <AppText weight="bold" className="text-[10px] uppercase tracking-wider" style={{ color: item.statusColor }}>
                                    {item.status}
                                </AppText>
                            </View>
                        </View>

                        {/* Rating Row */}
                        <View className="flex-row items-center mb-1">
                            <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                <Ionicons name="star" size={12} color="#FBBF24" />
                                <AppText weight="bold" className="text-slate-900 text-[11px] ml-1" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    {item.rating}
                                </AppText>
                                <AppText weight="medium" className="text-slate-400 text-[10px] ml-1" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    {item.reviews}
                                </AppText>
                            </View>
                        </View>

                        {/* Image Section */}
                        <View className="h-32 w-full justify-center items-center my-2">
                            {imageErrors[item.id] ? (
                                <View className="items-center justify-center">
                                    <Ionicons name="car-sport-outline" size={54} color="#CBD5E1" />
                                </View>
                            ) : (
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                    onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                                />
                            )}
                        </View>

                        {/* Location and Price Row */}
                        <View className="flex-row justify-between items-center mt-1">
                            <View className="flex-row items-center flex-1 mr-3" style={{ flexShrink: 1 }}>
                                <Ionicons name="location-outline" size={14} color="#94A3B8" />
                                <AppText weight="medium" className="text-slate-500 text-[11px] ml-1 flex-1" style={{ fontFamily: FONT_FAMILY_REVALIA }} numberOfLines={1}>
                                    {item.location}
                                </AppText>
                            </View>
                            <View className="flex-row items-baseline pl-2" style={{ flexShrink: 0 }}>
                                <AppText weight="bold" className="text-slate-900 text-lg" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    ₹{item.price}
                                </AppText>
                                <AppText weight="medium" className="text-slate-400 text-[11px] ml-0.5" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    /Day
                                </AppText>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-[1px] bg-slate-100 my-3" />

                        {/* Specs Section */}
                        <View className="flex-row items-center justify-around px-4 mb-4">
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="gas-station" size={16} color="#1E293B" />
                                <AppText weight="medium" className="text-slate-700 text-xs ml-1.5" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    {item.specs.fuelLeft}
                                </AppText>
                            </View>
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="speedometer" size={16} color="#1E293B" />
                                <AppText weight="medium" className="text-slate-700 text-xs ml-1.5" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    {item.specs.drivenKm}
                                </AppText>
                            </View>
                        </View>

                        {/* AI Insights Box */}
                        <View
                            className="rounded-2xl p-3 mb-4 border"
                            style={{ backgroundColor: item.aiPrediction.bg, borderColor: item.aiPrediction.border }}
                        >
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="sparkles" size={13} color="#D97706" className="mr-1.5" />
                                <AppText weight="bold" className="text-amber-900 text-[11px]" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    AI Prediction · {item.aiPrediction.level}
                                </AppText>
                            </View>
                            <AppText weight="medium" className="text-slate-600 text-[11px] leading-relaxed">
                                {item.aiPrediction.tip}
                            </AppText>
                        </View>

                        {/* Manage Asset Button */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('ManageAsset', { car: item })}
                            className="bg-slate-900 rounded-xl h-11 items-center justify-center flex-row"
                        >
                            <Ionicons name="settings-outline" size={16} color="#FFFFFF" className="mr-2" />
                            <AppText weight="bold" className="text-white text-xs tracking-wider uppercase" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                Manage Asset
                            </AppText>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default CarsScreen;
