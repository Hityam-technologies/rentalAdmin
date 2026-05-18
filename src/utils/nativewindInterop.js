/**
 * NativeWind cssInterop registrations for third-party components.
 * Import this once at app startup (see App.jsx) before any screens render.
 */
import { cssInterop } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';

cssInterop(LinearGradient, {
    className: 'style',
});
