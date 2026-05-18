import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../private/dashboardTab/dashboardScreen';
import CarsScreen from '../private/carsTab/carsScreen';
import BookingsScreen from '../private/bookingsTab/bookingsScreen';
import RevenueScreen from '../private/revenueTab/revenueScreen';
import PeopleScreen from '../private/peopleTab/peopleScreen';
import { colors } from '../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GlassEffect from '../components/glassEffect';

// Floating AI Assistant button that lives above the tab bar on every screen.
// Tap behavior is a placeholder for now — wire it up to open an AI chat sheet.
const AIAssistantFAB = ({ onPress }) => {
    return (
        <View
            className="items-end pr-6 mb-3"
            pointerEvents="box-none"
        >
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPress}
                style={{
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.45,
                    shadowRadius: 12,
                    elevation: 12,
                }}
            >
                <LinearGradient
                    colors={['#0066b8', '#004f8f', '#003a6b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.25)',
                    }}
                >
                    <Ionicons name="sparkles" size={24} color="#FFFFFF" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const Tab = createBottomTabNavigator();

const TabBarItem = ({ route, index, isFocused, onPress, icons, labels }) => {
    const scaleValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: isFocused ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isFocused, scaleValue]);

    const backgroundColor = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', colors.login.accentYellow] // Accent color
    });

    const iconColor = isFocused ? '#FFFFFF' : '#8E8E93';

    // Width animation for pill effect
    const width = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: [48, 120]
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className="items-center justify-center h-12"
        >
            <Animated.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor,
                borderRadius: 24,
                paddingHorizontal: 12,
                height: '100%',
                width,
                justifyContent: 'center'
            }}>
                <Ionicons
                    name={isFocused ? icons[route.name] : `${icons[route.name]}-outline`}
                    size={22}
                    color={iconColor}
                />
                {isFocused && (
                    <Animated.Text
                        style={{
                            color: '#FFFFFF',
                            marginLeft: 6,
                            fontWeight: '600',
                            fontSize: 13,
                            opacity: scaleValue,
                            fontFamily: 'Revalia-Regular' // Keeping with app's font
                        }}
                        numberOfLines={1}
                    >
                        {labels[route.name]}
                    </Animated.Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const handleAIPress = () => {
        const parent = navigation.getParent();
        if (parent) {
            parent.navigate('AiAssistant');
        } else {
            navigation.navigate('AiAssistant');
        }
    };

    return (
        <View className="absolute bottom-0 left-0 right-0" pointerEvents="box-none" style={{ zIndex: 999 }}>
            {/* Floating AI Assistant button — sits directly above the tab bar */}
            <AIAssistantFAB onPress={handleAIPress} />

            {/* Standard Frosted Glass Tab Bar container */}
            <View className="px-3 pb-6 h-22" pointerEvents="box-none">
                <GlassEffect
                    removeDefaultClasses={true}
                    className="flex-row items-center justify-between px-3 h-16"
                    style={{
                        borderRadius: 32,
                        elevation: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.35,
                        shadowRadius: 15,
                    }}
                >
                    {state.routes.map((route, index) => {
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const icons = {
                            Home: 'home',
                            Fleet: 'car-sport',
                            Bookings: 'ticket',
                            Revenue: 'analytics',
                            People: 'people'
                        };

                        const labels = {
                            Home: 'Home',
                            Fleet: 'Cars',
                            Bookings: 'Bookings',
                            Revenue: 'Revenue',
                            People: 'Team'
                        };

                        return (
                            <TabBarItem
                                key={index}
                                route={route}
                                index={index}
                                isFocused={isFocused}
                                onPress={onPress}
                                icons={icons}
                                labels={labels}
                            />
                        );
                    })}
                </GlassEffect>
            </View>
        </View>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={CustomTabBar}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Fleet" component={CarsScreen} />
            <Tab.Screen name="Bookings" component={BookingsScreen} />
            <Tab.Screen name="Revenue" component={RevenueScreen} />
            <Tab.Screen name="People" component={PeopleScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
