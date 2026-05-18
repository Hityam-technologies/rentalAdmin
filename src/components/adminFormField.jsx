import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppText from './appText';
import { colors } from '../assets/colors';

const AdminFormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    autoCapitalize = 'sentences',
    error = false,
    errorMessage = '',
    containerStyle,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={[styles.wrap, containerStyle]}>
            <AppText weight="bold" className="text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 11 }}>
                {label}
            </AppText>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                autoCapitalize={autoCapitalize}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={[
                    styles.input,
                    multiline && styles.inputMultiline,
                    focused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            />
            {error && errorMessage ? (
                <AppText weight="medium" style={styles.errorText}>
                    {errorMessage}
                </AppText>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#0f172a',
    },
    inputMultiline: {
        minHeight: 96,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 1.5,
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        fontSize: 11,
        color: '#ef4444',
        marginTop: 6,
    },
});

export default AdminFormField;
