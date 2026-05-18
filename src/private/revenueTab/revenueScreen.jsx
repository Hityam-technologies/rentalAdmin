import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, Modal, TextInput, Animated, Image } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/header';
import { CustomDatePickerModal } from '../../components/customPickers';

const { width: screenWidth } = Dimensions.get('window');

// ── Helper: Generate all days in a month ──────────────────────────────────
const generateMonthDays = (isoDatePrefix) => {
    const [yearStr, monthStr] = isoDatePrefix.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const numDays = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let i = 1; i <= numDays; i++) {
        const d = new Date(year, month, i, 12, 0, 0);
        dates.push(d);
    }
    return dates;
};

// ── Helper: Format Date as YYYY-MM-DD for keys ───────────────────────────
const toISODate = (date) => {
    return date.toISOString().split('T')[0];
};

// ── Helper: Deterministic Mock Data Generator based on Date string ───────
const generateMockDataForDate = (isoDate) => {
    // Simple hash function for date to keep mock data deterministic
    let hash = 0;
    for (let i = 0; i < isoDate.length; i++) {
        hash = isoDate.charCodeAt(i) + ((hash << 5) - hash);
    }

    const baseRevenue = 100000 + (Math.abs(hash) % 150000); // 100k to 250k
    const prevDayRevenue = 100000 + ((Math.abs(hash) * 2) % 150000);
    const lastWeekRevenue = baseRevenue - 20000 + (Math.abs(hash) % 40000);
    const bookings = 15 + (Math.abs(hash) % 40);

    // Trend logic
    const trendNum = -5 + (Math.abs(hash) % 25);
    const marketTrend = trendNum > 0 ? `+${trendNum}%` : `${trendNum}%`;

    // Day of week text for insights
    const dateObj = new Date(isoDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    const customers = isWeekend
        ? [
            { label: 'Weekend Getaway', pct: 60 + (Math.abs(hash) % 15), color: '#10b981' },
            { label: 'Corporate Execs', pct: 15 + (Math.abs(hash) % 10), color: '#2563eb' },
            { label: 'Others', pct: 25 - (Math.abs(hash) % 10), color: '#8b5cf6' }
        ]
        : [
            { label: 'Corporate Execs', pct: 55 + (Math.abs(hash) % 15), color: '#2563eb' },
            { label: 'Local Commute', pct: 25 + (Math.abs(hash) % 10), color: '#f59e0b' },
            { label: 'Others', pct: 20 - (Math.abs(hash) % 10), color: '#8b5cf6' }
        ];

    const aiInsights = [
        `${dayName} performance is tracking closely with expected regional metrics. Consider targeting off-peak hours.`,
        `Unusually high demand from corporate clients this ${dayName}. Ensure executive fleet is fully maintained.`,
        `We're seeing a slight dip compared to regional averages this ${dayName}. Time to push an aggressive promotion.`,
        `Solid ${dayName} booking pace. Fleet utilization is optimal for this time of the month.`,
        `Customer retention is driving today's numbers. Over 40% of these bookings are returning tenants.`
    ];
    const aiInsight = aiInsights[Math.abs(hash) % aiInsights.length];

    return {
        revenue: baseRevenue,
        bookings: bookings,
        prevDay: prevDayRevenue,
        lastWeek: lastWeekRevenue,
        marketTrend: marketTrend,
        aiInsight: aiInsight,
        customers: customers,
    };
};



const RevenueScreen = ({ navigation }) => {
    const todayISO = toISODate(new Date());
    const [selectedDateISO, setSelectedDateISO] = useState(todayISO);

    // Generate days for the selected month
    const currentMonthPrefix = selectedDateISO.substring(0, 7);
    const monthDays = useMemo(() => generateMonthDays(currentMonthPrefix), [currentMonthPrefix]);

    // Store user-defined targets mapped by ISO date
    const [targets, setTargets] = useState({
        [todayISO]: 180000 // Default target for today
    });

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [targetModalVisible, setTargetModalVisible] = useState(false);
    const [tempTarget, setTempTarget] = useState('');

    const scrollViewRef = useRef(null);

    // Auto-scroll to the selected date
    useEffect(() => {
        setTimeout(() => {
            if (scrollViewRef.current) {
                const dayOfMonth = parseInt(selectedDateISO.split('-')[2], 10);
                const itemWidth = 64; // width (56) + margin (8)
                const scrollX = Math.max(0, (dayOfMonth - 1) * itemWidth - screenWidth / 2 + itemWidth / 2);
                scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
            }
        }, 100);
    }, [selectedDateISO, currentMonthPrefix]);

    const dayData = useMemo(() => generateMockDataForDate(selectedDateISO), [selectedDateISO]);

    // Fallback default target if one hasn't been set for the chosen date
    const dayTarget = targets[selectedDateISO] || 150000;

    const isTargetMet = dayData.revenue >= dayTarget;
    const targetProgress = Math.min((dayData.revenue / dayTarget) * 100, 100);

    const formatCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;

    const handleSaveTarget = () => {
        const val = parseInt(tempTarget.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(val) && val > 0) {
            setTargets({ ...targets, [selectedDateISO]: val });
        }
        setTargetModalVisible(false);
    };

    const selectedDateObj = new Date(selectedDateISO);
    const displayDateStr = selectedDateISO === todayISO
        ? 'Today'
        : selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <Header
                title="Revenue Analysis"
                subtitle="Daily Performance & Insights"
                rightIcon="calendar-outline"
                onRightPress={() => setIsDatePickerVisible(true)}
            />

            {/* Horizontal Timeline Day Selector */}
            <View className="pt-5 pb-2">
                <Text className="px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Select Date</Text>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {monthDays.map(dateObj => {
                        const iso = toISODate(dateObj);
                        const isSelected = selectedDateISO === iso;
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const dateNum = dateObj.getDate();
                        const isToday = iso === todayISO;

                        return (
                            <TouchableOpacity
                                key={iso}
                                onPress={() => setSelectedDateISO(iso)}
                                activeOpacity={0.8}
                                className={`items-center justify-center rounded-2xl mx-1 w-14 h-16 border ${isSelected
                                    ? 'border-blue-600 bg-blue-600'
                                    : 'border-slate-200 bg-white'
                                    }`}
                                style={isSelected ? { shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 } : undefined}
                            >
                                <Text className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {dayName}
                                </Text>
                                <Text className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                    {dateNum}
                                </Text>
                                {isToday && !isSelected && (
                                    <View className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-6 pt-3" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* Daily Target vs Actual */}
                <View 
                    className="mb-5"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
                >
                    <View 
                        className="rounded-[24px] border overflow-hidden"
                        style={{ borderColor: isTargetMet ? '#10b981' : '#3b82f6', backgroundColor: isTargetMet ? '#ecfdf5' : '#eff6ff' }}
                    >
                        <LinearGradient
                            colors={isTargetMet ? ['#ecfdf5', '#d1fae5'] : ['#eff6ff', '#dbeafe']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            className="p-5"
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View>
                                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        {displayDateStr}'s Revenue
                                    </Text>
                                    <Text className="text-3xl font-extrabold text-slate-900 mt-1">
                                        {formatCurrency(dayData.revenue)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setTempTarget(dayTarget.toString());
                                        setTargetModalVisible(true);
                                    }}
                                    className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex-row items-center"
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
                                >
                                    <Ionicons name="pencil" size={12} color="#64748b" className="mr-1" />
                                    <Text className="text-slate-600 text-[10px] font-bold uppercase">Set Target</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Progress Bar */}
                            <View className="mt-2">
                                <View className="flex-row justify-between mb-1.5">
                                    <Text className="text-slate-600 text-[10px] font-bold">Progress: {targetProgress.toFixed(1)}%</Text>
                                    <Text className="text-slate-600 text-[10px] font-bold">Target: {formatCurrency(dayTarget)}</Text>
                                </View>
                                <View className="w-full h-3 rounded-full overflow-hidden border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: isTargetMet ? '#34d399' : '#93c5fd' }}>
                                    <View
                                        className={`h-full rounded-full ${isTargetMet ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        style={{ width: `${targetProgress}%` }}
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center mt-4 p-2 rounded-xl border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                                <Ionicons name={isTargetMet ? 'checkmark-circle' : 'trending-down'} size={18} color={isTargetMet ? '#10b981' : '#3b82f6'} className="mr-2" />
                                <Text className="text-slate-700 text-xs font-semibold flex-1 leading-relaxed">
                                    {isTargetMet
                                        ? `Excellent! You've surpassed the target by ${formatCurrency(dayData.revenue - dayTarget)}.`
                                        : `You are ${formatCurrency(dayTarget - dayData.revenue)} away from reaching the mark.`}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                {/* Day Bookings & Insights */}
                <View className="flex-row justify-between mb-5">
                    <View className="w-[48%] bg-white rounded-3xl p-4 border border-slate-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mb-2">
                            <Ionicons name="ticket" size={16} color="#2563eb" />
                        </View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Bookings</Text>
                        <Text className="text-2xl font-extrabold text-slate-900">{dayData.bookings}</Text>
                        <Text className="text-slate-400 text-[9px] mt-1 font-medium">Completed & active trips</Text>
                    </View>

                    <View className="w-[48%] bg-white rounded-3xl p-4 border border-slate-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
                        <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center mb-2">
                            <Ionicons name="analytics" size={16} color="#7c3aed" />
                        </View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Vs Last Week</Text>
                        <Text className={`text-xl font-extrabold ${dayData.revenue >= dayData.lastWeek ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {dayData.revenue >= dayData.lastWeek ? '+' : ''}{formatCurrency(dayData.revenue - dayData.lastWeek)}
                        </Text>
                        <Text className="text-slate-400 text-[9px] mt-1 font-medium">Compared to same day</Text>
                    </View>
                </View>

                {/* Market Trend & AI */}
                <Text className="text-slate-500 text-xs font-bold mb-3 uppercase tracking-wider">Trend & Market Analysis</Text>
                <LinearGradient
                    colors={['#1e1b4b', '#312e81']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    className="rounded-[24px] p-5 mb-6"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 6 }}
                >
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                            <Ionicons name="globe-outline" size={18} color="#a855f7" className="mr-2" />
                            <Text className="text-white font-bold text-xs">Market Trend Indicator</Text>
                        </View>
                        <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <Text className="text-white text-[10px] font-bold">{dayData.marketTrend}</Text>
                        </View>
                    </View>
                    <View className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <View className="flex-row items-start">
                            <Ionicons name="sparkles" size={14} color="#fcd34d" className="mr-2 mt-0.5" />
                            <Text className="text-indigo-100 text-xs leading-relaxed flex-1 font-medium">
                                {dayData.aiInsight}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Customer Demographics for the day */}
                <Text className="text-slate-500 text-xs font-bold mb-3 uppercase tracking-wider">Who Booked On This Day?</Text>
                <View className="bg-white border border-slate-200 rounded-[24px] p-5 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
                    {dayData.customers.map((demo, idx) => (
                        <View key={idx} className="mb-4">
                            <View className="flex-row justify-between items-center mb-1.5">
                                <Text className="text-slate-700 text-xs font-semibold">{demo.label}</Text>
                                <Text className="font-bold text-xs" style={{ color: demo.color }}>
                                    {demo.pct}%
                                </Text>
                            </View>
                            <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${demo.pct}%`,
                                        backgroundColor: demo.color
                                    }}
                                />
                            </View>
                        </View>
                    ))}
                </View>



            </ScrollView>

            {isDatePickerVisible && (
                <CustomDatePickerModal
                    visible={isDatePickerVisible}
                    onClose={() => setIsDatePickerVisible(false)}
                    initialDate={(() => {
                        const d = new Date(selectedDateISO);
                        const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
                        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
                    })()}
                    minDate="01 January 2020"
                    onSelect={(dateStr) => {
                        const parts = dateStr.split(' ');
                        const day = parseInt(parts[0], 10);
                        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        const monthIndex = MONTHS.indexOf(parts[1]);
                        const year = parseInt(parts[2], 10);
                        const d = new Date(year, monthIndex, day, 12, 0, 0);
                        setSelectedDateISO(toISODate(d));
                    }}
                />
            )}

            {/* Target Modal */}
            {targetModalVisible && (
                <Modal visible={targetModalVisible} animationType="fade" transparent>
                    <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View className="bg-white w-full rounded-[24px] p-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 }}>
                            <Text className="text-lg font-bold text-slate-900 mb-2">Set Daily Target</Text>
                            <Text className="text-xs text-slate-500 mb-5 leading-relaxed">
                                Update your revenue expectation for {displayDateStr}.
                            </Text>

                            <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5">
                                <Text className="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Amount (₹)</Text>
                                <TextInput
                                    value={tempTarget}
                                    onChangeText={setTempTarget}
                                    keyboardType="numeric"
                                    className="text-xl font-bold text-slate-900 p-0"
                                    placeholderTextColor="#94a3b8"
                                    placeholder="e.g. 150000"
                                />
                            </View>

                            <View className="flex-row justify-end space-x-3">
                                <TouchableOpacity
                                    onPress={() => setTargetModalVisible(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 mr-3"
                                >
                                    <Text className="text-slate-600 font-bold text-xs">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSaveTarget}
                                    className="px-5 py-2.5 rounded-xl bg-blue-600"
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
                                >
                                    <Text className="text-white font-bold text-xs">Save Target</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    );
};

export default RevenueScreen;
