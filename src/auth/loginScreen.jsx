import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';
import InputBox from '../components/InputBox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleEmailChange = (text) => {
        setEmail(text);
        if (text.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(text)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        } else {
            setEmailError('');
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.login.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.login.background} />

            {/* Background Accents to match the yellow theme */}
            <View className="absolute -top-24 -right-12 w-48 h-48 rotate-45 opacity-80" style={{ backgroundColor: colors.login.accentYellow }} />
            <View className="absolute -bottom-32 -right-16 w-80 h-80 opacity-40 rounded-full" style={{ backgroundColor: colors.login.accentYellow }} />

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: insets.top }}
                bounces={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >

                {/* Top Graphic Placeholder (Yellow Car) */}
                <View className="flex-row items-center mt-16 mb-8">
                    <Text className="text-3xl opacity-60 mr-1"></Text>
                    <Text className="text-5xl"></Text>
                </View>

                {/* Titles */}
                <View className="w-full">
                    <Text
                        className="text-3xl uppercase tracking-wider leading-tight"
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={{
                            color: colors.login.textMain,
                            fontFamily: FONT_FAMILY_REVALIA,
                            textShadowColor: colors.login.textMain,
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 1
                        }}
                    >
                        Hello There,
                    </Text>
                    <Text
                        className="text-3xl uppercase tracking-wider leading-tight mt-1"
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={{
                            color: colors.login.textMain,
                            fontFamily: FONT_FAMILY_REVALIA,
                            textShadowColor: colors.login.textMain,
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 1
                        }}
                    >
                        Welcome Back
                    </Text>
                    <Text className="text-sm mt-8 mb-4" style={{ color: colors.login.textSubtitle, fontFamily: FONT_FAMILY_REVALIA }}>
                        Sign In to continue
                    </Text>
                </View>

                {/* Form Section */}
                <View className="flex-1">

                    <InputBox
                        label="Email"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={handleEmailChange}
                        error={!!emailError}
                        errorMessage={emailError}
                        containerStyle={{ marginBottom: 24 }}
                    />

                    <InputBox
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                        containerStyle={{ marginBottom: 8 }}
                        rightComponent={
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-2 -mr-2 justify-center items-center">
                                <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.login.textMain} />
                            </TouchableOpacity>
                        }
                    />

                    {/* Forget Password */}
                    <TouchableOpacity
                        className="self-end mb-8 mt-1"
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text className="text-xs" style={{
                            color: colors.login.textMain,
                            fontFamily: FONT_FAMILY_REVALIA,
                            textShadowColor: colors.login.textMain,
                            textShadowOffset: { width: 0.5, height: 0.5 },
                            textShadowRadius: 0.5
                        }}>FORGET PASSWORD?</Text>
                    </TouchableOpacity>

                    {/* Go Button */}
                    <TouchableOpacity
                        className="py-4 rounded items-center justify-center mb-6"
                        style={{ backgroundColor: colors.login.buttonBg }}
                        onPress={() => navigation?.navigate('MainTabs')}
                    >
                        <Text className="text-base tracking-widest" style={{
                            color: colors.login.buttonText,
                            fontFamily: FONT_FAMILY_REVALIA,
                            textShadowColor: colors.login.buttonText,
                            textShadowOffset: { width: 0.5, height: 0.5 },
                            textShadowRadius: 0.5
                        }}>GO</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;
