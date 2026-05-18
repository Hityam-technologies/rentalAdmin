import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';
import InputBox from '../components/InputBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/header';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    return (
        <View className="flex-1" style={{ backgroundColor: colors.login.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.login.background} />

            {/* Top Accents */}
            <View className="absolute -top-24 -right-12 w-48 h-48 rotate-45 opacity-80" style={{ backgroundColor: colors.login.accentYellow }} />

            {/* Header */}
            <Header
                title="Reset Password"
                subtitle="Account Security"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <View className="flex-1 px-6 justify-center" style={{ marginTop: -80 }}>
                <Text className="text-sm mb-8 font-semibold" style={{ color: colors.login.textSubtitle, fontFamily: FONT_FAMILY_REVALIA }}>
                    Enter your registered email below to receive instructions.
                </Text>

                <InputBox
                    label="Email Address"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    containerStyle={{ marginBottom: 24 }}
                />

                <TouchableOpacity
                    className="py-4 rounded items-center justify-center mb-6"
                    style={{ backgroundColor: colors.login.buttonBg }}
                    onPress={() => {
                        alert("Password reset instructions sent!");
                        navigation.goBack();
                    }}
                >
                    <Text className="text-base tracking-widest" style={{
                        color: colors.login.buttonText,
                        fontFamily: FONT_FAMILY_REVALIA,
                    }}>SEND RESET LINK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgotPasswordScreen;
