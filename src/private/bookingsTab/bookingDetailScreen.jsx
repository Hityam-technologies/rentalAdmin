import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar,
    Dimensions,
    Platform,
    Alert,
    Linking
} from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import GlassEffect from '../../components/glassEffect';
import AppText from '../../components/appText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BookingDetailScreen = ({ route, navigation }) => {
    const { booking: initialBooking } = route.params;
    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);

    const [bookingState, setBookingState] = useState(initialBooking);
    const { client, clientAvatar, clientPhone, clientEmail, clientVerified, car, date, durationDays, pickupLocation, dropoffLocation, status, breakdown } = bookingState;

    const [activeIndex, setActiveIndex] = useState(0);
    const [viewMode, setViewMode] = useState('images'); // 'images' or '3d'

    const carImages = car.images || [car.image];

    useEffect(() => {
        if (viewMode !== 'images' || carImages.length <= 1) return;
        const interval = setInterval(() => {
            let nextIndex = (activeIndex + 1) % carImages.length;
            setActiveIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, 3500);

        return () => clearInterval(interval);
    }, [activeIndex, viewMode, carImages.length]);

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    const handleApprove = () => {
        setBookingState(prev => ({
            ...prev,
            status: 'Approved',
            statusColor: '#10b981',
            statusBg: '#ecfdf5',
        }));
        Alert.alert('Reservation Approved', `Booking ${bookingState.id} has been approved. Notification sent to customer.`);
    };

    const handleDecline = () => {
        Alert.alert(
            'Decline Reservation',
            `Are you sure you want to decline booking ${bookingState.id}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Decline',
                    style: 'destructive',
                    onPress: () => {
                        setBookingState(prev => ({
                            ...prev,
                            status: 'Declined',
                            statusColor: '#ef4444',
                            statusBg: '#fef2f2',
                        }));
                    }
                }
            ]
        );
    };

    const handleContact = (type) => {
        if (type === 'phone') {
            Linking.openURL(`tel:${clientPhone}`);
        } else {
            Linking.openURL(`mailto:${clientEmail}`);
        }
    };

    const renderDetailRow = (icon, label, value, isBold = false, valColor = 'text-slate-900') => (
        <View className="flex-row items-center justify-between py-2.5 border-b border-slate-100">
            <View className="flex-row items-center flex-1 mr-3">
                <Ionicons name={icon} size={18} color="#64748B" className="mr-2.5" />
                <AppText weight="medium" className="text-slate-500 text-xs flex-1">
                    {label}
                </AppText>
            </View>
            <AppText weight={isBold ? "bold" : "medium"} className={`text-xs ${valColor}`}>
                {value}
            </AppText>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Top Navigation Bar */}
            <View
                className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4"
                style={{
                    paddingTop: insets.top + 12,
                    zIndex: 100,
                    elevation: 10
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-2xl items-center justify-center border border-white/25"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>

                <View className="flex-1 items-center justify-center mx-2">
                    <View className="px-3 py-1.5 rounded-full border border-white/20 max-w-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <Text className="text-white text-[9px] font-bold tracking-[1px] uppercase font-revalia text-center" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                            Reservation Overview
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CarDocuments', { car: bookingState.car })}
                    className="px-3 h-10 rounded-2xl items-center justify-center border border-white/25 flex-row"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                    <Ionicons name="document-text-outline" size={14} color="white" className="mr-1" />
                    <Text className="text-white text-[11px] font-bold uppercase tracking-wider font-revalia" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Papers
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Header Carousel Background Section */}
            <View
                className="absolute top-0 left-0 right-0 overflow-hidden"
                style={{ height: height * 0.55, zIndex: 1 }}
            >
                <LinearGradient
                    colors={[colors.primary, '#1E3A8A']}
                    className="absolute inset-0"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* View Mode Toggle */}
                <View
                    className="absolute left-0 right-0 items-center z-50"
                    style={{ top: insets.top + 68 }}
                >
                    <View className="flex-row rounded-2xl p-1 w-64 border border-white/25" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setViewMode('images')}
                            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${viewMode === 'images' ? 'bg-white shadow-lg' : ''}`}
                        >
                            <Ionicons name="images" size={14} color={viewMode === 'images' ? colors.primary : 'rgba(255,255,255,0.7)'} className="mr-2" />
                            <Text className={`text-[10px] font-revalia ${viewMode === 'images' ? 'text-slate-900 font-bold' : 'text-white/70'}`} style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                Images
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setViewMode('3d')}
                            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${viewMode === '3d' ? 'bg-white shadow-lg' : ''}`}
                        >
                            <MaterialCommunityIcons name="rotate-360" size={16} color={viewMode === '3d' ? colors.primary : 'rgba(255,255,255,0.7)'} className="mr-2" />
                            <Text className={`text-[10px] font-revalia ${viewMode === '3d' ? 'text-slate-900 font-bold' : 'text-white/70'}`} style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                360° View
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Carousel Content Area */}
                <View className="px-5 items-center justify-center" style={{ marginTop: insets.top + 115, height: 210 }}>
                    {viewMode === 'images' ? (
                        <>
                            <FlatList
                                ref={flatListRef}
                                data={carImages}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onViewableItemsChanged={onViewRef.current}
                                viewabilityConfig={viewConfigRef.current}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ width: width - 40, height: 180 }} className="bg-white/95 rounded-[32px] overflow-hidden justify-center items-center p-4 shadow-xl border border-white/40">
                                        <Image
                                            source={{ uri: item }}
                                            style={{ width: '100%', height: 150 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}
                            />

                            {/* Pagination Dots */}
                            <View className="flex-row justify-center items-center mt-2">
                                {carImages.map((_, index) => (
                                    <View
                                        key={index}
                                        className={`h-1.5 rounded-full mx-1.5 ${activeIndex === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </View>
                        </>
                    ) : (
                        <View className="w-full h-full justify-center items-center">
                            <View style={{ width: width - 40, height: 180 }} className="bg-white rounded-[32px] justify-center items-center shadow-xl border border-slate-50">
                                <MaterialCommunityIcons name="axis-z-rotate-clockwise" size={80} color={colors.primary} opacity={0.1} />
                                <View className="absolute items-center">
                                    <View className="w-12 h-12 rounded-full bg-blue-50 justify-center items-center mb-2">
                                        <Ionicons name="car-sport" size={24} color={colors.primary} />
                                    </View>
                                    <Text className="text-[10px] font-revalia text-slate-400 uppercase tracking-widest text-center px-10" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                        360° Inspection View
                                    </Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('ManageAsset', { car: bookingState.car })}
                                        className="mt-3 px-6 py-2 rounded-2xl shadow-lg"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        <Text className="text-[11px] font-revalia text-white font-bold" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                            Inspect Asset
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Scrollable Details Overlay */}
            <ScrollView
                className="flex-1 bg-transparent"
                showsVerticalScrollIndicator={false}
                style={{
                    position: 'absolute',
                    top: height * 0.23,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    overflow: 'hidden'
                }}
            >
                {/* Transparent Spacer */}
                <View style={{ height: height * 0.23 }} />

                {/* Details Sheet White Container */}
                <View
                    className="bg-white rounded-t-[40px] px-6 pt-5"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: -6 },
                        elevation: 10,
                        minHeight: height * 0.65,
                        paddingBottom: 140
                    }}
                >
                    {/* Pill Handle */}
                    <View className="w-12 h-1.5 rounded-full bg-slate-200 self-center mb-6" />

                    {/* Booking Title & Status Badge */}
                    <View className="flex-row justify-between items-start mb-6">
                        <View className="flex-1 mr-4">
                            <Text className="text-2xl font-revalia text-slate-900 font-bold leading-tight" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                {car.name}
                            </Text>
                            <Text className="text-xs font-revalia text-slate-400 mt-1 uppercase tracking-wider" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                Booking ID: {bookingState.id}
                            </Text>
                        </View>
                        <View className="px-3.5 py-1.5 rounded-full border" style={{ backgroundColor: bookingState.statusBg, borderColor: `${bookingState.statusColor}30` }}>
                            <Text className="text-[10px] font-bold uppercase tracking-wider font-revalia" style={{ color: bookingState.statusColor, fontFamily: FONT_FAMILY_REVALIA }}>
                                {bookingState.status}
                            </Text>
                        </View>
                    </View>

                    {/* Customer Profile Section */}
                    <Text className="text-base font-revalia text-slate-900 font-bold mb-3" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Customer Information
                    </Text>
                    <View className="bg-slate-50 rounded-[24px] p-4 mb-6 border border-slate-100 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center flex-1 mr-3">
                                <Image source={{ uri: clientAvatar }} className="w-12 h-12 rounded-full border border-slate-200 mr-3" />
                                <View className="flex-1 pr-1">
                                    <View className="flex-row items-center">
                                        <AppText weight="bold" className="text-slate-900 text-sm mr-1.5" numberOfLines={1}>
                                            {client}
                                        </AppText>
                                        {clientVerified && <Ionicons name="checkmark-circle" size={16} color="#10b981" />}
                                    </View>
                                    <AppText weight="medium" className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
                                        {clientEmail}
                                    </AppText>
                                </View>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleContact('phone')}
                                    className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center mr-2"
                                >
                                    <Ionicons name="call" size={18} color={colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleContact('email')}
                                    className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center"
                                >
                                    <Ionicons name="mail" size={18} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="h-[1px] bg-slate-200/60 mb-3" />
                        <View className="flex-row justify-between items-center">
                            <AppText weight="medium" className="text-slate-500 text-xs">Verification Status</AppText>
                            <View className="flex-row items-center">
                                <View className={`w-2 h-2 rounded-full mr-1.5 ${clientVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <AppText weight="bold" className={`text-xs ${clientVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                                    {clientVerified ? 'KYC Verified' : 'KYC Pending'}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Trip Itinerary Section */}
                    <Text className="text-base font-revalia text-slate-900 font-bold mb-3" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Trip Itinerary
                    </Text>
                    <View className="bg-slate-50 rounded-[24px] p-4 mb-6 border border-slate-100 shadow-sm">
                        {renderDetailRow('calendar-outline', 'Rental Timeline', date)}
                        {renderDetailRow('time-outline', 'Duration', `${durationDays} Days`)}
                        {renderDetailRow('location-outline', 'Pick-up Hub', pickupLocation)}
                        {renderDetailRow('flag-outline', 'Return Hub', dropoffLocation)}
                        {renderDetailRow('car-sport-outline', 'Odometer Reading', car.odometer)}
                        {renderDetailRow('key-outline', 'License Plate', car.plate, true)}
                    </View>

                    {/* AI Intelligence & Insights */}
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="sparkles" size={16} color="#8b5cf6" className="mr-2" />
                        <Text className="text-base font-revalia text-slate-900 font-bold" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                            AI Fleet & Customer Insights
                        </Text>
                    </View>

                    <View className="bg-purple-50/70 rounded-[24px] p-5 mb-6 border border-purple-100 shadow-sm">
                        {/* Car AI insight */}
                        <View className="mb-4 pb-4 border-b border-purple-200/60">
                            <View className="flex-row justify-between items-center mb-2">
                                <AppText weight="bold" className="text-purple-900 text-xs uppercase tracking-wider">
                                    Asset Utilization Insight
                                </AppText>
                                <View className="px-2.5 py-1 rounded-full bg-purple-200/80">
                                    <AppText weight="bold" className="text-purple-800 text-[10px]">
                                        {car.aiPrediction?.level || 'High Demand'}
                                    </AppText>
                                </View>
                            </View>
                            <AppText weight="medium" className="text-purple-950 text-xs leading-relaxed">
                                {car.aiPrediction?.tip || 'Vehicle demand is peaking in downtown bays. Optimal dynamic pricing active.'}
                            </AppText>
                        </View>

                        {/* Customer AI insight */}
                        <View>
                            <View className="flex-row justify-between items-center mb-2">
                                <AppText weight="bold" className="text-purple-900 text-xs uppercase tracking-wider">
                                    Tenant Risk & Analytics
                                </AppText>
                                <View className="px-2.5 py-1 rounded-full bg-emerald-100">
                                    <AppText weight="bold" className="text-emerald-800 text-[10px]">
                                        Low Risk · Tier 1
                                    </AppText>
                                </View>
                            </View>
                            <AppText weight="medium" className="text-purple-950 text-xs leading-relaxed">
                                {clientVerified
                                    ? 'Verified KYC tenant with perfect return history. Pre-approved for instant security deposit waiver.'
                                    : 'New tenant requiring standard check-in inspection. KYC documentation verification in progress.'}
                            </AppText>
                        </View>
                    </View>

                    {/* Financial Summary Breakdown */}
                    <Text className="text-base font-revalia text-slate-900 font-bold mb-3" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Financial Summary
                    </Text>
                    <View className="bg-slate-50 rounded-[24px] p-5 mb-6 border border-slate-100 shadow-sm">
                        <View className="flex-row justify-between mb-3">
                            <AppText weight="medium" className="text-slate-500 text-xs">Base Rental ({durationDays} Days)</AppText>
                            <AppText weight="bold" className="text-slate-900 text-xs">₹{breakdown.baseRate}</AppText>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <AppText weight="medium" className="text-slate-500 text-xs">Insurance Protection</AppText>
                            <AppText weight="bold" className="text-slate-900 text-xs">₹{breakdown.insurance}</AppText>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <AppText weight="medium" className="text-slate-500 text-xs">Government Taxes & Fees</AppText>
                            <AppText weight="bold" className="text-slate-900 text-xs">₹{breakdown.tax}</AppText>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <AppText weight="medium" className="text-slate-500 text-xs">Security Deposit (Refundable)</AppText>
                            <AppText weight="bold" className="text-slate-900 text-xs">₹{breakdown.deposit}</AppText>
                        </View>

                        <View className="h-[1px] border-t border-dashed border-slate-200 my-3" />

                        <View className="flex-row justify-between items-center mt-1">
                            <AppText weight="bold" className="text-slate-900 text-sm">Total Billing</AppText>
                            <Text className="text-lg font-revalia font-bold text-blue-600" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                ₹{breakdown.total}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Floating Glass Action Bar */}
            <View
                className="absolute left-4 right-4 h-20"
                style={{ bottom: insets.bottom + 20, zIndex: 100 }}
            >
                <GlassEffect
                    removeDefaultClasses={true}
                    className="flex-1 flex-row items-center justify-between px-4 rounded-[30px]"
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 mr-2">
                        <Text className="text-[9px] text-white/60 font-revalia uppercase tracking-widest" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                            Total Collected
                        </Text>
                        <Text className="text-lg font-revalia text-white font-bold mt-0.5" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                            ₹{breakdown.total}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        {status === 'Pending' ? (
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleDecline}
                                    className="bg-red-500/20 px-3.5 py-3 rounded-2xl border border-red-500/30 mr-2"
                                >
                                    <Text className="text-red-100 text-[11px] font-revalia font-bold uppercase tracking-wider" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                        Decline
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleApprove}
                                    className="bg-emerald-600 px-3.5 py-3 rounded-2xl shadow-lg"
                                >
                                    <Text className="text-white text-[11px] font-revalia font-bold uppercase tracking-wider" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                        Approve
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : status === 'Approved' ? (
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('ManageAsset', { car: bookingState.car })}
                                    className="px-4 py-3 rounded-2xl shadow-lg flex-row items-center"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <Text className="text-white text-[11px] font-revalia font-bold uppercase tracking-wider mr-1.5" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                        Manage Asset
                                    </Text>
                                    <Ionicons name="settings" size={14} color="white" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => Alert.alert('Invoice Downloaded', 'Settlement receipt has been saved.')}
                                className="px-4 py-3 rounded-2xl shadow-lg flex-row items-center"
                                style={{ backgroundColor: colors.primary }}
                            >
                                <Text className="text-white text-[11px] font-revalia font-bold uppercase tracking-wider mr-1.5" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                    Receipt
                                </Text>
                                <Ionicons name="download" size={14} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </GlassEffect>
            </View>
        </View>
    );
};

export default BookingDetailScreen;
