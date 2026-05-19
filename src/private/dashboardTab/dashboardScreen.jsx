import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA, MANROPE } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
    Svg,
    Path,
    Defs,
    LinearGradient as SvgGradient,
    Stop,
    Circle,
    G,
    Text as SvgText,
} from 'react-native-svg';
import Header from '../../components/header';
import AppText from '../../components/appText';
import {
    heroData as hero,
    sparklineData,
    dashboardStats as stats,
    weekData,
    fleetSegments,
    aiInsightsData as aiInsights,
    quickActionsData as quickActions,
    topCarsData as topCars,
    recentBookingsData as recentBookings,
    alertsData as alerts,
} from '../../constants/data';

const { width: screenWidth } = Dimensions.get('window');
const SCREEN_PADDING = 24;
const CONTENT_WIDTH = screenWidth - SCREEN_PADDING * 2;

// ════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════
const topRoundedRectPath = (x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h);
    return `M ${x} ${y + radius}
            Q ${x} ${y} ${x + radius} ${y}
            L ${x + w - radius} ${y}
            Q ${x + w} ${y} ${x + w} ${y + radius}
            L ${x + w} ${y + h}
            L ${x} ${y + h} Z`;
};

// Reusable shadow recipe applied to every elevated card
const cardShadow = {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
};

// ════════════════════════════════════════════════════════════════════════
// Small inline components
// ════════════════════════════════════════════════════════════════════════
const SectionTitle = ({ title, action, onActionPress }) => (
    <View className="flex-row items-center justify-between mb-3 mt-2">
        <AppText weight="extrabold" className="text-zinc-900 text-base">
            {title}
        </AppText>
        {action ? (
            <TouchableOpacity activeOpacity={0.6} onPress={onActionPress} className="flex-row items-center">
                <AppText weight="bold" className="text-xs" style={{ color: colors.primary }}>
                    {action}
                </AppText>
                <Ionicons name="arrow-forward" size={11} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
        ) : null}
    </View>
);

// Ring progress indicator (used for utilization)
const RingProgress = ({ size = 64, stroke = 6, percent = 67, color = '#10b981', track = '#e5e7eb' }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (percent / 100) * circumference;
    return (
        <Svg width={size} height={size}>
            <Circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={stroke} fill="transparent" />
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </Svg>
    );
};

// ════════════════════════════════════════════════════════════════════════
// Main Dashboard Screen
// ════════════════════════════════════════════════════════════════════════
const DashboardScreen = ({ navigation }) => {
    const adminName = 'Ashok';
    const [chartMetric, setChartMetric] = useState('bookings');

    // ── Data imported from central data store ──
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = 6;


    const statusStyles = {
        confirmed: { bg: '#ecfdf5', color: '#059669', label: 'Confirmed' },
        pickup: { bg: '#eff6ff', color: '#004f8f', label: 'Pickup' },
        returned: { bg: '#f4f4f5', color: '#52525b', label: 'Returned' },
    };

    // ── Chart geometry ─────────────────────────────────────────────────
    const chartCardPadding = 20;
    const chartWidth = CONTENT_WIDTH - chartCardPadding * 2;
    const chartHeight = 180;
    const chartTopPad = 28;
    const chartBottomPad = 22;
    const plotHeight = chartHeight - chartTopPad - chartBottomPad;

    const currentChartData = weekData[chartMetric];
    const maxVal = Math.max(...currentChartData) * 1.25;
    const barGap = 10;
    const barWidth = (chartWidth - barGap * (currentChartData.length - 1)) / currentChartData.length;

    // ── Donut geometry ─────────────────────────────────────────────────
    const donutSize = 140;
    const donutStroke = 18;
    const donutRadius = (donutSize - donutStroke) / 2;
    const donutCircumference = 2 * Math.PI * donutRadius;
    const fleetTotal = fleetSegments.reduce((sum, s) => sum + s.value, 0);
    const segmentGap = 4;

    let donutCumulative = 0;
    const donutPaths = fleetSegments.map((segment, idx) => {
        const segLen = (segment.value / fleetTotal) * donutCircumference;
        const dashLen = Math.max(segLen - segmentGap, 0);
        const offset = -donutCumulative;
        donutCumulative += segLen;
        return { ...segment, dashLen, offset, idx };
    });

    // ── Sparkline geometry (for hero revenue card) ────────────────────
    const sparkW = 160;
    const sparkH = 50;
    const sparkMax = Math.max(...sparklineData);
    const sparkMin = Math.min(...sparklineData);
    const sparkRange = sparkMax - sparkMin || 1;
    let sparkLine = '';
    let sparkArea = '';
    sparklineData.forEach((v, i) => {
        const x = (i / (sparklineData.length - 1)) * sparkW;
        const y = sparkH - 4 - ((v - sparkMin) / sparkRange) * (sparkH - 12);
        if (i === 0) {
            sparkLine = `M ${x} ${y}`;
            sparkArea = `M ${x} ${sparkH} L ${x} ${y}`;
        } else {
            sparkLine += ` L ${x} ${y}`;
            sparkArea += ` L ${x} ${y}`;
        }
        if (i === sparklineData.length - 1) {
            sparkArea += ` L ${x} ${sparkH} Z`;
        }
    });

    return (
        <View className="flex-1" style={{ backgroundColor: '#F7F8FA' }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                rightIcon="notifications-outline"
                rightBadge
                onRightPress={() => navigation.navigate('Notifications')}
                secondaryRightIcon="settings-outline"
                onSecondaryRightPress={() => navigation.navigate('Settings')}
                greeting={{
                    name: adminName,
                    avatar: adminName.charAt(0),
                }}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 20, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >

                {/* ═══ BENTO HERO ════════════════════════════════════ */}
                <View className="flex-row mb-3" style={{ height: 280 }}>
                    {/* LEFT: Featured Revenue Card */}
                    <LinearGradient
                        colors={['#0066b8', '#004f8f', '#001f3a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-3xl p-5 overflow-hidden"
                        style={{
                            flex: 1.4,
                            marginRight: 12,
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.3,
                            shadowRadius: 18,
                            elevation: 12,
                        }}
                    >
                        {/* Aurora orbs */}
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                backgroundColor: 'rgba(168, 85, 247, 0.18)',
                            }}
                        />
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                bottom: -60,
                                left: -30,
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                backgroundColor: 'rgba(56, 189, 248, 0.18)',
                            }}
                        />

                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center bg-white/15 px-2 py-1 rounded-full border border-white/20">
                                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                                <AppText weight="extrabold" className="text-white text-[9px] tracking-widest">
                                    LIVE
                                </AppText>
                            </View>
                            <Ionicons name="ellipsis-horizontal" size={16} color="rgba(255,255,255,0.6)" />
                        </View>

                        <AppText weight="medium" className="text-white/70 text-[11px] mb-1 mt-2">
                            Today's Revenue
                        </AppText>
                        <AppText
                            weight="extrabold"
                            className="text-white text-[30px] leading-tight"
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {hero.todayRevenue}
                        </AppText>

                        <View className="flex-row items-center mt-2 mb-3">
                            <View className="flex-row items-center bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                                <Ionicons name="trending-up" size={10} color="#6ee7b7" />
                                <AppText weight="bold" className="text-emerald-300 text-[10px] ml-1">
                                    {hero.deltaPct}
                                </AppText>
                            </View>
                            <AppText weight="medium" className="text-white/50 text-[10px] ml-2">
                                vs yesterday
                            </AppText>
                        </View>

                        {/* Sparkline */}
                        <View className="flex-1 justify-end">
                            <Svg width={sparkW} height={sparkH}>
                                <Defs>
                                    <SvgGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
                                        <Stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
                                    </SvgGradient>
                                </Defs>
                                <Path d={sparkArea} fill="url(#heroSpark)" />
                                <Path d={sparkLine} fill="none" stroke="#6ee7b7" strokeWidth="2.5" />
                            </Svg>
                        </View>
                    </LinearGradient>

                    {/* RIGHT: Two stacked smaller cards */}
                    <View style={{ flex: 1 }}>
                        {/* Bookings */}
                        <View
                            className="bg-white rounded-3xl p-4 mb-3"
                            style={{ flex: 1, ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                        >
                            <View className="flex-row items-center justify-between">
                                <AppText
                                    weight="bold"
                                    className="text-zinc-400 text-[9px] uppercase tracking-wider"
                                    numberOfLines={1}
                                >
                                    Bookings
                                </AppText>
                                <View
                                    className="w-6 h-6 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: '#ecfdf5' }}
                                >
                                    <Ionicons name="ticket" size={12} color="#059669" />
                                </View>
                            </View>
                            <AppText weight="extrabold" className="text-zinc-900 text-3xl mt-2">
                                {hero.bookingsToday}
                            </AppText>
                            <View className="flex-row items-center mt-1">
                                <View className="bg-emerald-50 px-1.5 py-0.5 rounded-md flex-row items-center">
                                    <Ionicons name="arrow-up" size={9} color="#059669" />
                                    <AppText
                                        weight="bold"
                                        className="text-emerald-700 text-[9px] ml-0.5"
                                    >
                                        {hero.bookingsDelta}
                                    </AppText>
                                </View>
                            </View>
                        </View>

                        {/* Utilization — vertical layout, % rendered inside the ring */}
                        <View
                            className="bg-white rounded-3xl p-4"
                            style={{ flex: 1, ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                        >
                            <View className="flex-row items-center justify-between">
                                <AppText
                                    weight="bold"
                                    className="text-zinc-400 text-[9px] uppercase tracking-wider"
                                >
                                    Utilization
                                </AppText>
                                <View
                                    className="w-6 h-6 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: '#e0edff' }}
                                >
                                    <Ionicons name="speedometer" size={12} color="#004f8f" />
                                </View>
                            </View>

                            <View className="flex-1 items-center justify-center">
                                <View style={{ width: 64, height: 64 }}>
                                    <RingProgress
                                        size={64}
                                        stroke={6}
                                        percent={hero.utilizationPct}
                                        color="#004f8f"
                                        track="#f1f5f9"
                                    />
                                    <View
                                        pointerEvents="none"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AppText weight="extrabold" className="text-zinc-900 text-sm">
                                            {hero.utilizationPct}%
                                        </AppText>
                                    </View>
                                </View>
                            </View>

                            <AppText
                                weight="medium"
                                className="text-zinc-400 text-[10px] text-center"
                            >
                                {hero.utilOf} cars
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* ═══ FLEET SNAPSHOT (4 cards 2x2) ═════════════════ */}
                <SectionTitle title="Fleet Snapshot" />

                <View className="flex-row flex-wrap justify-between mb-6">
                    {stats.map((stat, idx) => (
                        <View
                            key={idx}
                            className="w-[48%] bg-white rounded-3xl p-4 mb-3 overflow-hidden"
                            style={{ ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                        >
                            {/* Decorative corner glow */}
                            <LinearGradient
                                colors={[`${stat.accent}25`, 'transparent']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '60%',
                                    height: '70%',
                                }}
                            />

                            <View
                                className="w-9 h-9 rounded-2xl items-center justify-center mb-3"
                                style={{ backgroundColor: stat.accentBg }}
                            >
                                <Ionicons name={stat.icon} size={17} color={stat.accent} />
                            </View>
                            <AppText
                                weight="bold"
                                className="text-zinc-400 text-[10px] uppercase tracking-wider"
                            >
                                {stat.label}
                            </AppText>
                            <AppText weight="extrabold" className="text-zinc-900 text-2xl mt-0.5">
                                {stat.value}
                            </AppText>
                            <AppText weight="medium" className="text-zinc-400 text-[11px] mt-0.5">
                                {stat.sub}
                            </AppText>
                        </View>
                    ))}
                </View>

                {/* ═══ AI CO-PILOT (REDESIGNED) ══════════════════════ */}
                <SectionTitle title="AI Co-Pilot" />

                <LinearGradient
                    colors={['#1e1b4b', '#312e81', '#1e1b4b', '#0f172a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-3xl p-5 mb-6 overflow-hidden"
                    style={{
                        shadowColor: '#1e1b4b',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.35,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    {/* Aurora orbs for depth */}
                    <View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            top: -80,
                            right: -60,
                            width: 240,
                            height: 240,
                            borderRadius: 120,
                            backgroundColor: 'rgba(168, 85, 247, 0.25)',
                        }}
                    />
                    <View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            bottom: -100,
                            left: -50,
                            width: 280,
                            height: 280,
                            borderRadius: 140,
                            backgroundColor: 'rgba(59, 130, 246, 0.18)',
                        }}
                    />
                    <View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            top: '40%',
                            right: '30%',
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: 'rgba(236, 72, 153, 0.12)',
                        }}
                    />

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-5">
                        <View className="flex-row items-center flex-1">
                            <LinearGradient
                                colors={['#a855f7', '#6366f1', '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-11 h-11 rounded-2xl items-center justify-center mr-3"
                                style={{
                                    shadowColor: '#a855f7',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 8,
                                    elevation: 8,
                                }}
                            >
                                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                            </LinearGradient>
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <AppText
                                        weight="extrabold"
                                        className="text-white text-base"
                                        style={{ fontFamily: FONT_FAMILY_REVALIA }}
                                    >
                                        AI Co-Pilot
                                    </AppText>
                                    <View className="ml-2 px-1.5 py-0.5 rounded-md bg-purple-500/30 border border-purple-400/40">
                                        <AppText weight="extrabold" className="text-purple-200 text-[8px] tracking-wider">
                                            PRO
                                        </AppText>
                                    </View>
                                </View>
                                <View className="flex-row items-center mt-0.5">
                                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                                    <AppText weight="medium" className="text-white/60 text-[10px]">
                                        Live · 4 fresh insights
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="w-9 h-9 rounded-xl items-center justify-center border border-white/15"
                            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                            <Ionicons name="refresh" size={15} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Horizontally scrollable insight cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -20 }}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        className="mb-5"
                    >
                        {aiInsights.map((insight, idx) => (
                            <TouchableOpacity
                                key={idx}
                                activeOpacity={0.85}
                                style={{ width: 200, marginRight: idx === aiInsights.length - 1 ? 0 : 12 }}
                            >
                                <LinearGradient
                                    colors={insight.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="rounded-2xl p-4 overflow-hidden"
                                    style={{ height: 210 }}
                                >
                                    {/* Subtle white glow corner */}
                                    <View
                                        pointerEvents="none"
                                        style={{
                                            position: 'absolute',
                                            top: -30,
                                            right: -30,
                                            width: 100,
                                            height: 100,
                                            borderRadius: 50,
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                        }}
                                    />

                                    <View className="flex-row items-start justify-between mb-3">
                                        <View
                                            className="px-2 py-1 rounded-lg"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                                        >
                                            <AppText weight="extrabold" className="text-white text-[10px] tracking-wider">
                                                {insight.number}
                                            </AppText>
                                        </View>
                                        <View
                                            className="w-9 h-9 rounded-xl items-center justify-center"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                                        >
                                            <Ionicons name={insight.icon} size={16} color="#FFFFFF" />
                                        </View>
                                    </View>

                                    <AppText
                                        weight="semibold"
                                        className="text-white/75 text-[10px] uppercase tracking-wider"
                                    >
                                        {insight.label}
                                    </AppText>
                                    <AppText weight="extrabold" className="text-white text-base mt-1 leading-tight">
                                        {insight.value}
                                    </AppText>
                                    <AppText weight="medium" className="text-white/65 text-[10px] mt-1 leading-tight">
                                        {insight.sub}
                                    </AppText>

                                    {/* Confidence bar */}
                                    <View className="mt-3 mb-3">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <AppText weight="semibold" className="text-white/55 text-[9px] tracking-wider">
                                                CONFIDENCE
                                            </AppText>
                                            <AppText weight="extrabold" className="text-white text-[9px]">
                                                {insight.confidence}%
                                            </AppText>
                                        </View>
                                        <View
                                            className="h-1 rounded-full overflow-hidden"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                        >
                                            <View
                                                className="h-full rounded-full bg-white"
                                                style={{ width: `${insight.confidence}%` }}
                                            />
                                        </View>
                                    </View>

                                    {/* Action chip */}
                                    <View
                                        className="flex-row items-center justify-between rounded-xl px-3 py-2 mt-auto"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                                    >
                                        <AppText weight="bold" className="text-white text-[11px]">
                                            {insight.action}
                                        </AppText>
                                        <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* AI chat-style input */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('AiAssistant')}
                        className="flex-row items-center rounded-2xl p-2 border"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.15)',
                        }}
                    >
                        <LinearGradient
                            colors={['#a855f7', '#6366f1']}
                            className="w-9 h-9 rounded-xl items-center justify-center mr-2"
                        >
                            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                        </LinearGradient>
                        <AppText weight="medium" className="text-white/55 text-xs flex-1">
                            Ask Hityam AI anything...
                        </AppText>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="w-9 h-9 rounded-xl items-center justify-center mr-1"
                                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <Ionicons name="mic-outline" size={15} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-9 h-9 rounded-xl items-center justify-center"
                                style={{ backgroundColor: '#FFFFFF' }}
                            >
                                <Ionicons name="arrow-up" size={16} color="#1e1b4b" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* ═══ WEEKLY PERFORMANCE ════════════════════════════ */}
                <SectionTitle title="Weekly Performance" action="View Reports" />

                <View
                    className="bg-white rounded-3xl p-5 mb-6"
                    style={{ ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                >
                    <View className="flex-row bg-zinc-100 rounded-2xl p-1 mb-5">
                        {['bookings', 'revenue'].map((m) => {
                            const active = chartMetric === m;
                            return (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => setChartMetric(m)}
                                    activeOpacity={0.8}
                                    className="flex-1 py-2 rounded-xl"
                                    style={
                                        active
                                            ? {
                                                backgroundColor: '#FFFFFF',
                                                shadowColor: '#0f172a',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.08,
                                                shadowRadius: 3,
                                                elevation: 2,
                                            }
                                            : null
                                    }
                                >
                                    <AppText
                                        weight={active ? 'bold' : 'semibold'}
                                        className={`text-center text-xs capitalize ${active ? 'text-zinc-900' : 'text-zinc-500'
                                            }`}
                                    >
                                        {m}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="flex-row items-end justify-between mb-4">
                        <View>
                            <AppText
                                weight="semibold"
                                className="text-zinc-400 text-[10px] uppercase tracking-wider"
                            >
                                {chartMetric === 'bookings' ? 'Total Bookings' : 'Total Revenue'} · This week
                            </AppText>
                            <AppText weight="extrabold" className="text-zinc-900 text-2xl mt-1">
                                {chartMetric === 'bookings' ? '128' : '$26.6K'}
                            </AppText>
                        </View>
                        <View className="flex-row items-center bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <Ionicons name="trending-up" size={11} color="#059669" />
                            <AppText weight="bold" className="text-emerald-700 text-[11px] ml-1">
                                +14.8%
                            </AppText>
                        </View>
                    </View>

                    <Svg width={chartWidth} height={chartHeight}>
                        <Defs>
                            <SvgGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor="#0066b8" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#004f8f" stopOpacity="1" />
                            </SvgGradient>
                            <SvgGradient id="barIdle" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor="#dbeafe" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#bfdbfe" stopOpacity="1" />
                            </SvgGradient>
                        </Defs>

                        {[0.25, 0.5, 0.75].map((frac, i) => (
                            <Path
                                key={i}
                                d={`M 0 ${chartTopPad + plotHeight * frac} L ${chartWidth} ${chartTopPad + plotHeight * frac
                                    }`}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                            />
                        ))}

                        {currentChartData.map((val, idx) => {
                            const isToday = idx === todayIndex;
                            const barH = Math.max((val / maxVal) * plotHeight, 6);
                            const x = idx * (barWidth + barGap);
                            const y = chartTopPad + plotHeight - barH;
                            const displayVal = chartMetric === 'revenue' ? `$${val}K` : `${val}`;

                            return (
                                <G key={idx}>
                                    <Path
                                        d={topRoundedRectPath(x, y, barWidth, barH, 8)}
                                        fill={isToday ? 'url(#barActive)' : 'url(#barIdle)'}
                                    />
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={y - 8}
                                        fontSize="10"
                                        fontFamily={MANROPE.bold}
                                        fill={isToday ? '#004f8f' : '#71717a'}
                                        textAnchor="middle"
                                    >
                                        {displayVal}
                                    </SvgText>
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={chartHeight - 4}
                                        fontSize="10"
                                        fontFamily={isToday ? MANROPE.bold : MANROPE.semibold}
                                        fill={isToday ? '#004f8f' : '#a1a1aa'}
                                        textAnchor="middle"
                                    >
                                        {dayLabels[idx]}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </Svg>
                </View>

                {/* ═══ FLEET STATUS DONUT ════════════════════════════ */}
                <SectionTitle title="Fleet Status" />

                <View
                    className="bg-white rounded-3xl p-5 mb-6 flex-row items-center"
                    style={{ ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                >
                    <View style={{ width: donutSize, height: donutSize }}>
                        <Svg width={donutSize} height={donutSize}>
                            <Circle
                                cx={donutSize / 2}
                                cy={donutSize / 2}
                                r={donutRadius}
                                stroke="#f1f5f9"
                                strokeWidth={donutStroke}
                                fill="transparent"
                            />
                            {donutPaths.map((seg) => (
                                <Circle
                                    key={seg.idx}
                                    cx={donutSize / 2}
                                    cy={donutSize / 2}
                                    r={donutRadius}
                                    stroke={seg.color}
                                    strokeWidth={donutStroke}
                                    fill="transparent"
                                    strokeDasharray={`${seg.dashLen} ${donutCircumference}`}
                                    strokeDashoffset={seg.offset}
                                    strokeLinecap="butt"
                                    transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}
                                />
                            ))}
                        </Svg>
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AppText weight="extrabold" className="text-zinc-900 text-2xl">
                                {fleetTotal}
                            </AppText>
                            <AppText
                                weight="semibold"
                                className="text-zinc-400 text-[10px] uppercase tracking-wider"
                            >
                                Total
                            </AppText>
                        </View>
                    </View>

                    <View className="flex-1 ml-5">
                        {fleetSegments.map((seg, idx) => {
                            const pct = Math.round((seg.value / fleetTotal) * 100);
                            return (
                                <View
                                    key={idx}
                                    className={`flex-row items-center justify-between ${idx !== fleetSegments.length - 1 ? 'mb-3 pb-3 border-b border-zinc-100' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-2.5 h-2.5 rounded-sm mr-2.5"
                                            style={{ backgroundColor: seg.color }}
                                        />
                                        <View>
                                            <AppText weight="bold" className="text-zinc-900 text-xs">
                                                {seg.label}
                                            </AppText>
                                            <AppText weight="medium" className="text-zinc-400 text-[10px]">
                                                {pct}%
                                            </AppText>
                                        </View>
                                    </View>
                                    <AppText weight="extrabold" className="text-zinc-900 text-base">
                                        {seg.value}
                                    </AppText>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* ═══ QUICK ACTIONS ═════════════════════════════════ */}
                <SectionTitle title="Quick Actions" />

                <View className="flex-row justify-between mb-6">
                    {quickActions.map((action, idx) => (
                        <TouchableOpacity
                            key={idx}
                            activeOpacity={0.75}
                            onPress={() => {
                                if (action.label === 'Customers') {
                                    navigation.navigate('Users');
                                } else if (action.label === 'Add Car' || action.label === 'Fleet') {
                                    navigation.navigate('Fleet');
                                } else if (action.label === 'Pricing') {
                                    navigation.navigate('Revenue');
                                }
                            }}
                            className="items-center bg-white rounded-3xl py-4"
                            style={{
                                width: '23%',
                                ...cardShadow,
                                borderWidth: 1,
                                borderColor: '#f1f5f9',
                            }}
                        >
                            <LinearGradient
                                colors={action.gradient}
                                className="w-11 h-11 rounded-2xl items-center justify-center mb-2"
                                style={{
                                    shadowColor: action.gradient[1],
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 6,
                                    elevation: 4,
                                }}
                            >
                                <Ionicons name={action.icon} size={20} color="#FFFFFF" />
                            </LinearGradient>
                            <AppText weight="bold" className="text-zinc-700 text-[10px] text-center">
                                {action.label}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ═══ TOP PERFORMERS ════════════════════════════════ */}
                <SectionTitle title="Top Performers" action="See all" />

                <View
                    className="bg-white rounded-3xl p-2 mb-6"
                    style={{ ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                >
                    {topCars.map((car, idx) => {
                        const rankGradients = [
                            ['#fbbf24', '#f59e0b'],
                            ['#cbd5e1', '#94a3b8'],
                            ['#fb923c', '#c2410c'],
                            ['#d4d4d8', '#71717a'],
                        ];
                        return (
                            <View
                                key={car.rank}
                                className={`flex-row items-center px-3 py-3 ${idx !== topCars.length - 1 ? 'border-b border-zinc-100' : ''
                                    }`}
                            >
                                <LinearGradient
                                    colors={rankGradients[idx]}
                                    className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                                >
                                    <AppText weight="extrabold" className="text-white text-xs">
                                        #{car.rank}
                                    </AppText>
                                </LinearGradient>
                                <View className="flex-1">
                                    <AppText weight="bold" className="text-zinc-900 text-sm">
                                        {car.name}
                                    </AppText>
                                    <View className="flex-row items-center mt-0.5">
                                        <AppText weight="medium" className="text-zinc-400 text-[11px]">
                                            {car.category}
                                        </AppText>
                                        <AppText className="text-zinc-300 mx-1.5">·</AppText>
                                        <AppText weight="medium" className="text-zinc-400 text-[11px]">
                                            {car.bookings} bookings
                                        </AppText>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <AppText weight="extrabold" className="text-zinc-900 text-sm">
                                        {car.revenue}
                                    </AppText>
                                    <AppText
                                        weight="bold"
                                        className="text-emerald-600 text-[11px] mt-0.5"
                                    >
                                        {car.trend}
                                    </AppText>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* ═══ RECENT BOOKINGS ═══════════════════════════════ */}
                <SectionTitle title="Recent Bookings" action="See all" />

                <View
                    className="bg-white rounded-3xl p-2 mb-6"
                    style={{ ...cardShadow, borderWidth: 1, borderColor: '#f1f5f9' }}
                >
                    {recentBookings.map((booking, idx) => {
                        const statusStyle = statusStyles[booking.status];
                        return (
                            <View
                                key={idx}
                                className={`flex-row items-center px-3 py-3 ${idx !== recentBookings.length - 1 ? 'border-b border-zinc-100' : ''
                                    }`}
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: `${booking.color}15` }}
                                >
                                    <AppText
                                        weight="extrabold"
                                        className="text-xs"
                                        style={{ color: booking.color }}
                                    >
                                        {booking.initials}
                                    </AppText>
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center">
                                        <AppText weight="bold" className="text-zinc-900 text-sm flex-1">
                                            {booking.name}
                                        </AppText>
                                        <AppText weight="medium" className="text-zinc-400 text-[10px]">
                                            {booking.time}
                                        </AppText>
                                    </View>
                                    <View className="flex-row items-center justify-between mt-1">
                                        <AppText
                                            weight="medium"
                                            className="text-zinc-500 text-[11px] flex-1"
                                            numberOfLines={1}
                                        >
                                            {booking.car}
                                        </AppText>
                                        <View
                                            className="px-2 py-0.5 rounded-md ml-2"
                                            style={{ backgroundColor: statusStyle.bg }}
                                        >
                                            <AppText
                                                weight="extrabold"
                                                className="text-[9px] uppercase tracking-wider"
                                                style={{ color: statusStyle.color }}
                                            >
                                                {statusStyle.label}
                                            </AppText>
                                        </View>
                                        <AppText weight="extrabold" className="text-zinc-900 text-xs ml-2">
                                            {booking.amount}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* ═══ ALERTS ════════════════════════════════════════ */}
                <SectionTitle title="Alerts" />

                {alerts.map((alert, idx) => (
                    <TouchableOpacity
                        key={idx}
                        activeOpacity={0.85}
                        className="rounded-2xl p-4 mb-3 flex-row items-center"
                        style={{
                            backgroundColor: alert.bg,
                            borderWidth: 1,
                            borderColor: alert.border,
                        }}
                    >
                        <View
                            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: alert.iconBg }}
                        >
                            <Ionicons name={alert.icon} size={18} color={alert.iconColor} />
                        </View>
                        <View className="flex-1">
                            <AppText weight="bold" className="text-zinc-900 text-sm">
                                {alert.title}
                            </AppText>
                            <AppText weight="medium" className="text-zinc-600 text-[11px] mt-0.5">
                                {alert.desc}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (alert.cta === 'Manage Fleet') navigation.navigate('Fleet');
                                if (alert.cta === 'Adjust Pricing') navigation.navigate('Revenue');
                            }}
                            className="px-2.5 py-1 rounded-full flex-row items-center"
                            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                        >
                            <AppText
                                weight="extrabold"
                                className="text-[10px] mr-1"
                                style={{ color: alert.iconColor }}
                            >
                                {alert.cta}
                            </AppText>
                            <Ionicons name="chevron-forward" size={11} color={alert.iconColor} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default DashboardScreen;
