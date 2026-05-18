import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './appText';
import { colors } from '../assets/colors';

const PhotoUploadZone = ({
    label = 'Tap to upload photo',
    hint = 'Camera or gallery',
    imageUri,
    onPress,
    height = 168,
    compact = false,
}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.zone, { height: compact ? 120 : height }]}
    >
        {imageUri ? (
            <>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <View style={styles.changeBadge}>
                    <Ionicons name="camera" size={14} color="#FFF" />
                    <AppText weight="bold" className="text-white ml-1.5" style={{ fontSize: 12 }}>
                        Change photo
                    </AppText>
                </View>
            </>
        ) : (
            <View style={styles.placeholder}>
                <View style={styles.iconCircle}>
                    <Ionicons name="camera-outline" size={28} color={colors.primary} />
                </View>
                <AppText weight="bold" className="text-slate-800 mt-3" style={{ fontSize: 14 }}>
                    {label}
                </AppText>
                <AppText weight="medium" className="text-slate-500 mt-1" style={{ fontSize: 12 }}>
                    {hint}
                </AppText>
            </View>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    zone: {
        width: '100%',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
        borderStyle: 'dashed',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    changeBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
});

export default PhotoUploadZone;
