/**
 * Font family constants — keep all font names in one place so we
 * never repeat magic strings throughout the app.
 *
 * After dropping new .ttf files into src/assets/fonts/, run:
 *   npx react-native-asset
 * to copy them into the native Android/iOS projects.
 */

// Display / brand font used for screen titles, hero numbers, etc.
export const FONT_FAMILY_REVALIA = 'Revalia-Regular';

// Manrope — primary UI typeface. The string MUST match the .ttf filename
// (without extension) because react-native uses the filename to look up
// the font on Android. On iOS, the PostScript name for these files is
// the same as the filename, so a single value works on both platforms.
export const MANROPE = {
    extraLight: 'Manrope-ExtraLight',
    light: 'Manrope-Light',
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semibold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
    extrabold: 'Manrope-ExtraBold',
};
