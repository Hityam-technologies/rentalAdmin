import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './appText';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Header
 * ─────────────────────────────────────────────────────────────────────────
 *  The single, unified screen header used across every screen in the app.
 *
 *  Visual anatomy
 *  ──────────────
 *    ┌─────────────────────────────────────────┐
 *    │  HITYAM FLEET ADMIN              [🔔]  │  ← top row (always rendered)
 *    │  Dashboard                              │
 *    │  ─────────────────────────────────────  │  ← divider (only with `greeting`)
 *    │  Good evening,                          │
 *    │  Konda              [🔍]   [K]          │  ← hero row (only with `greeting`)
 *    │  Wednesday, May 13                      │
 *    └─────────────────────────────────────────┘
 *           (rounded bottom corners)
 *
 *  Variants
 *  ────────
 *  1. Simple header (Cars, Bookings, Revenue)
 *       <Header title="Cars" subtitle="Fleet Inventory" rightIcon="add" />
 *
 *  2. Hero header with greeting (Dashboard / home tab)
 *       <Header
 *         title="Dashboard"
 *         subtitle="Hityam Fleet Admin"
 *         rightIcon="notifications-outline"
 *         rightBadge
 *         greeting={{ name: 'Konda', avatar: 'K', showSearch: true }}
 *       />
 *
 *  3. Detail/sub-screen with a back button
 *       <Header title="Booking Details" showBackButton onBackPress={() => nav.goBack()} />
 *
 *  Props
 *  ─────
 *   @param {string}   title             Screen title (REQUIRED, shown in Revalia display font)
 *   @param {string=}  subtitle          Small uppercase eyebrow above the title
 *   @param {string=}  rightIcon         Ionicons name for the right action button (e.g. 'notifications-outline')
 *   @param {function=} onRightPress     Tap handler for the right action button
 *   @param {boolean=} rightBadge        Show a small red dot on the right button (e.g. unread notifications)
 *   @param {boolean=} showBackButton    Show a chevron-back button on the left
 *   @param {function=} onBackPress      Tap handler for the back button
 *   @param {object=}  greeting          Optional hero block configuration:
 *      @param {string}    greeting.name             Name to display large (Revalia font)
 *      @param {string}    greeting.avatar           1–2 character initials shown inside the avatar bubble
 *      @param {boolean=}  greeting.showSearch       Show search button next to the avatar (default: false)
 *      @param {function=} greeting.onSearchPress    Tap handler for the search button
 *      @param {function=} greeting.onAvatarPress    Tap handler for the avatar
 *
 *  Behavior notes
 *  ──────────────
 *  • Status bar:
 *      The header paints behind the status bar via top safe-area padding.
 *      Each screen using <Header> should set:
 *          <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
 *      so Android's status bar tint matches the header on every screen.
 *  • Greeting time-of-day:
 *      The "Good morning / afternoon / evening" line is computed from the
 *      device's local time, so the parent doesn't need to pass it.
 *  • Theming:
 *      The header always uses the brand primary color. There is no light/dark
 *      variant — keep brand consistency above per-screen theming.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Small utility helpers (local to this file) ──────────────────────────
const getGreetingForHour = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const formatTodayLong = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

// ── Component ───────────────────────────────────────────────────────────
const Header = ({
    title,
    subtitle,
    rightIcon,
    rightText,
    onRightPress,
    rightBadge = false,
    secondaryRightIcon,
    onSecondaryRightPress,
    showBackButton = false,
    onBackPress,
    greeting,
    rightElement,
    secondaryRightElement,
}) => {
    const insets = useSafeAreaInsets();
    const hasHero = Boolean(greeting);

    return (
        <View
            style={{
                backgroundColor: colors.primary,
                paddingTop: Math.max(insets.top, 8),
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.18,
                shadowRadius: 12,
                elevation: 8,
            }}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.14)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}
                pointerEvents="none"
            />

            {hasHero ? (
                /* ── Dashboard / Hero Variant (Single combined row) ── */
                <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={greeting.onAvatarPress}
                            activeOpacity={0.85}
                        >
                            <View
                                className="w-12 h-12 rounded-2xl items-center justify-center border border-white/30 mr-4"
                                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                            >
                                <AppText weight="extrabold" className="text-white text-lg">
                                    {greeting.avatar || greeting.name?.charAt(0)}
                                </AppText>
                            </View>
                            <View
                                className="absolute bottom-[-2] right-3 w-3.5 h-3.5 rounded-full bg-emerald-400"
                                style={{ borderWidth: 2, borderColor: colors.primary }}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>

                        <View className="flex-1 mr-2">
                            <AppText weight="medium" className="text-white/80 text-xs mb-1">
                                {getGreetingForHour()},
                            </AppText>
                            <AppText
                                weight="bold"
                                className="text-white text-[22px]"
                                style={{ fontFamily: FONT_FAMILY_REVALIA }}
                                adjustsFontSizeToFit
                                numberOfLines={1}
                            >
                                {greeting.name}
                            </AppText>
                            <AppText weight="medium" className="text-white/60 text-[10px] mt-1 uppercase tracking-wider">
                                {formatTodayLong()}
                            </AppText>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        {secondaryRightIcon && (
                            <TouchableOpacity
                                onPress={onSecondaryRightPress}
                                activeOpacity={0.75}
                                className="w-10 h-10 rounded-xl items-center justify-center border border-white/25 mr-2"
                                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                            >
                                <Ionicons name={secondaryRightIcon} size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={onRightPress}
                            activeOpacity={0.75}
                            className="w-10 h-10 rounded-xl items-center justify-center border border-white/25"
                            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                        >
                            <Ionicons name={rightIcon || "notifications-outline"} size={24} color="#FFFFFF" />
                            {rightBadge ? (
                                <View
                                    className="absolute w-2.5 h-2.5 rounded-full bg-red-500"
                                    style={{
                                        top: 6,
                                        right: 6,
                                        borderWidth: 2,
                                        borderColor: colors.primary,
                                    }}
                                />
                            ) : null}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* ── Standard Variant ── */
                <>
                    <View className="flex-row items-center justify-between px-6 pt-2 pb-3">
                        <View className="flex-row items-center flex-1">
                            {showBackButton ? (
                                <TouchableOpacity
                                    onPress={onBackPress}
                                    activeOpacity={0.75}
                                    className="mr-3 w-10 h-10 rounded-xl items-center justify-center border border-white/25"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                                >
                                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            ) : null}

                            <View className="flex-1">
                                {subtitle ? (
                                    <AppText
                                        weight="bold"
                                        className="text-white/70 text-[10px] uppercase tracking-wider"
                                        numberOfLines={1}
                                    >
                                        {subtitle}
                                    </AppText>
                                ) : null}
                                <AppText
                                    weight="bold"
                                    className="text-white text-lg mt-0.5"
                                    style={{ fontFamily: FONT_FAMILY_REVALIA }}
                                    numberOfLines={1}
                                >
                                    {title}
                                </AppText>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            {secondaryRightElement ? (
                                secondaryRightElement
                            ) : secondaryRightIcon ? (
                                <TouchableOpacity
                                    onPress={onSecondaryRightPress}
                                    activeOpacity={0.75}
                                    className="w-10 h-10 rounded-xl items-center justify-center border border-white/25 mr-2"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                                >
                                    <Ionicons name={secondaryRightIcon} size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            ) : null}

                            {rightElement ? (
                                rightElement
                            ) : rightText ? (
                                <TouchableOpacity
                                    onPress={onRightPress}
                                    activeOpacity={0.75}
                                    className="px-3.5 h-10 rounded-xl items-center justify-center border border-white/25 flex-row"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                                >
                                    <AppText weight="bold" className="text-white text-xs tracking-wider uppercase" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                                        {rightText}
                                    </AppText>
                                </TouchableOpacity>
                            ) : rightIcon ? (
                                <TouchableOpacity
                                    onPress={onRightPress}
                                    activeOpacity={0.75}
                                    className="w-10 h-10 rounded-xl items-center justify-center border border-white/25"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                                >
                                    <Ionicons name={rightIcon} size={24} color="#FFFFFF" />
                                    {rightBadge ? (
                                        <View
                                            className="absolute w-2.5 h-2.5 rounded-full bg-red-500"
                                            style={{
                                                top: 6,
                                                right: 6,
                                                borderWidth: 2,
                                                borderColor: colors.primary,
                                            }}
                                        />
                                    ) : null}
                                </TouchableOpacity>
                            ) : (
                                <View className="w-10 h-10" />
                            )}
                        </View>
                    </View>
                    <View style={{ height: 16 }} />
                </>
            )}
        </View>
    );
};

export default Header;
