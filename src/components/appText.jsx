import React from 'react';
import { Text } from 'react-native';
import { MANROPE } from '../constants/fonts';

/**
 * AppText
 * ───────
 * A thin wrapper around React Native's <Text> that defaults the app
 * typeface to Manrope. Use the `weight` prop to pick a Manrope variant —
 * this is more reliable than Tailwind's `font-bold` because it loads the
 * actual .ttf file for that weight (otherwise Android can fall back to
 * the system font and ignore your custom typeface).
 *
 * Usage:
 *   <AppText>Default regular text</AppText>
 *   <AppText weight="bold">Important number</AppText>
 *   <AppText weight="semibold" className="text-zinc-500 text-xs">Label</AppText>
 */

const WEIGHT_MAP = {
    extraLight: MANROPE.extraLight,
    light: MANROPE.light,
    regular: MANROPE.regular,
    medium: MANROPE.medium,
    semibold: MANROPE.semibold,
    bold: MANROPE.bold,
    extrabold: MANROPE.extrabold,
};

const AppText = ({ weight = 'regular', style, children, ...props }) => {
    const fontFamily = WEIGHT_MAP[weight] || MANROPE.regular;
    return (
        <Text {...props} style={[{ fontFamily }, style]}>
            {children}
        </Text>
    );
};

export default AppText;
