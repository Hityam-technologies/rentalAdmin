import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';

const InputBox = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
    containerStyle = {},
    leftComponent = null,
    rightComponent = null,
    onFocus,
    onBlur,
    error = false,
    errorMessage = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <View
            className="rounded-md relative h-14 justify-center px-4 flex-row items-center"
            style={[
                {
                    borderColor: error ? colors.login.error : (isFocused ? colors.login.inputBorderFocus : colors.login.inputBorder),
                    borderWidth: (isFocused || error) ? 2 : 1
                },
                containerStyle
            ]}
        >
            <View className="absolute -top-3 left-4 px-1 z-10" style={{ backgroundColor: colors.login.background }}>
                <Text className="text-xs" style={{ color: error ? colors.login.error : (isFocused ? colors.login.textMain : colors.login.inputBorder), fontFamily: FONT_FAMILY_REVALIA }}>
                    {label}
                </Text>
            </View>

            {leftComponent}

            <TextInput
                className="text-base h-full flex-1 p-0 mt-1 tracking-wider"
                style={{ color: colors.login.textMain, fontFamily: FONT_FAMILY_REVALIA }}
                placeholder={placeholder}
                placeholderTextColor={colors.login.placeholderMain}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            {rightComponent}
            {errorMessage ? (
                <View className="absolute -bottom-5 left-2">
                    <Text className="text-[10px]" style={{ color: colors.login.error, fontFamily: FONT_FAMILY_REVALIA }}>
                        {errorMessage}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

export default InputBox;
