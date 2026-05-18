import { Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const PICKER_OPTIONS = {
    mediaType: 'photo',
    quality: 0.85,
    selectionLimit: 1,
    includeBase64: false,
};

const handleResult = (response, onPicked) => {
    if (response.didCancel || response.errorCode) {
        if (response.errorMessage) {
            Alert.alert('Upload failed', response.errorMessage);
        }
        return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) onPicked(uri);
};

export const pickImageFromDevice = (onPicked) => {
    Alert.alert('Upload photo', 'Choose how you want to add the photo', [
        {
            text: 'Take photo',
            onPress: () => {
                launchCamera(PICKER_OPTIONS, (res) => handleResult(res, onPicked));
            },
        },
        {
            text: 'Choose from gallery',
            onPress: () => {
                launchImageLibrary(PICKER_OPTIONS, (res) => handleResult(res, onPicked));
            },
        },
        { text: 'Cancel', style: 'cancel' },
    ]);
};

export const normalizeWebUrl = (url) => {
    if (!url?.trim()) return '';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

export const isValidWebUrl = (url) => {
    const normalized = normalizeWebUrl(url);
    if (!normalized) return false;
    try {
        const parsed = new URL(normalized);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};
