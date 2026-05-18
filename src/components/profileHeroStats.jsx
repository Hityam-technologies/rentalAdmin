import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './appText';

/**
 * Compact stat chips for profile hero cards (client / worker detail).
 * Uses Manrope for values so numbers match the app header — not display Revalia.
 */
const ProfileHeroStats = ({ metrics }) => (
    <View style={styles.row}>
        {metrics.map((metric, index) => (
            <View
                key={metric.label}
                style={[styles.box, index < metrics.length - 1 && styles.boxGap]}
            >
                <AppText weight="medium" style={styles.label} numberOfLines={1}>
                    {metric.label}
                </AppText>
                <AppText
                    weight="bold"
                    style={[styles.value, metric.valueColor ? { color: metric.valueColor } : null]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                >
                    {metric.value}
                </AppText>
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    box: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    boxGap: {
        marginRight: 10,
    },
    label: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.65)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 4,
    },
    value: {
        fontSize: 17,
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
});

export default ProfileHeroStats;
