import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './appText';
import { colors } from '../assets/colors';

const FormChipGroup = ({ label, options, value, onChange, multi = false }) => {
    const toggleMulti = (option) => {
        const set = new Set(value);
        if (set.has(option)) set.delete(option);
        else set.add(option);
        onChange([...set]);
    };

    return (
        <View style={styles.wrap}>
            {label ? (
                <AppText weight="bold" className="text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 11 }}>
                    {label}
                </AppText>
            ) : null}
            <View style={styles.row}>
                {options.map((option) => {
                    const selected = multi ? value.includes(option) : value === option;
                    return (
                        <TouchableOpacity
                            key={option}
                            activeOpacity={0.85}
                            onPress={() => (multi ? toggleMulti(option) : onChange(option))}
                            style={[styles.chip, selected && styles.chipSelected]}
                        >
                            <AppText weight="bold" style={{ fontSize: 12, color: selected ? '#FFF' : '#475569' }}>
                                {option}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: { marginBottom: 14 },
    row: { flexDirection: 'row', flexWrap: 'wrap' },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
});

export default FormChipGroup;
