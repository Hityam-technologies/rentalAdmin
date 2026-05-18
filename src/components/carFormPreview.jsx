import React from 'react';
import {
    View,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AppText from './appText';
import Header from './header';
import { colors } from '../assets/colors';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';
import { DOCUMENT_TYPES, countUploadedDocs } from '../utils/carFormUtils';

const { width } = Dimensions.get('window');

const PreviewRow = ({ icon, label, value }) => (
    <View style={styles.previewRow}>
        <Ionicons name={icon} size={18} color="#64748b" />
        <AppText weight="medium" className="text-slate-500 ml-2 flex-1" style={{ fontSize: 13 }}>
            {label}
        </AppText>
        <AppText weight="bold" className="text-slate-900 text-right" style={{ fontSize: 13, maxWidth: '50%' }}>
            {value}
        </AppText>
    </View>
);

const CarFormPreview = ({ visible, car, onClose, onConfirm }) => {
    if (!car) return null;

    const docsUploaded = countUploadedDocs(car.documentsMeta || {});

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-slate-50">
                <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
                <Header
                    title="Preview"
                    subtitle="Review before saving"
                    showBackButton
                    onBackPress={onClose}
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                    <LinearGradient
                        colors={[colors.primary, '#003a6b']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.previewBadge}>
                            <AppText weight="bold" className="text-white" style={{ fontSize: 10, letterSpacing: 1 }}>
                                PREVIEW MODE
                            </AppText>
                        </View>

                        <View style={styles.imageWrap}>
                            <Image source={{ uri: car.image }} style={styles.heroImage} resizeMode="contain" />
                        </View>

                        <AppText weight="bold" className="text-white mt-3" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 18 }}>
                            {car.name}
                        </AppText>
                        <AppText weight="medium" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
                            {car.subtitle}
                        </AppText>

                        <View className="flex-row items-center mt-3">
                            <View
                                style={[
                                    styles.statusPill,
                                    { backgroundColor: car.statusBg, borderColor: `${car.statusColor}40` },
                                ]}
                            >
                                <View style={[styles.statusDot, { backgroundColor: car.statusColor }]} />
                                <AppText weight="bold" style={{ fontSize: 10, color: car.statusColor, textTransform: 'uppercase' }}>
                                    {car.status}
                                </AppText>
                            </View>
                            <AppText weight="bold" className="text-white ml-3" style={{ fontSize: 17 }}>
                                ₹{car.price}/day
                            </AppText>
                        </View>
                    </LinearGradient>

                    <View style={styles.sheet}>
                        <AppText weight="bold" className="text-slate-900 mb-3" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                            Vehicle details
                        </AppText>
                        <View style={styles.card}>
                            <PreviewRow icon="pricetag-outline" label="Category" value={`${car.category} · ${car.type}`} />
                            <PreviewRow icon="key-outline" label="Plate" value={car.plate} />
                            <PreviewRow icon="location-outline" label="Hub" value={car.location} />
                            <PreviewRow icon="star-outline" label="Rating" value={`${car.rating} ${car.reviews}`} />
                        </View>

                        <AppText weight="bold" className="text-slate-900 mb-3 mt-2" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                            Specifications
                        </AppText>
                        <View style={styles.card}>
                            <PreviewRow icon="cog-outline" label="Transmission" value={car.specs.transmission} />
                            <PreviewRow icon="water-outline" label="Fuel" value={car.specs.fuelLeft} />
                            <PreviewRow icon="speedometer-outline" label="Odometer" value={car.specs.drivenKm} />
                            <PreviewRow icon="people-outline" label="Seats" value={car.specs.seats} />
                            <PreviewRow icon="flash-outline" label="0–100" value={car.specs.acceleration} />
                            <PreviewRow icon="speedometer-outline" label="Top speed" value={car.specs.topSpeed} />
                        </View>

                        {car.view360Url ? (
                            <>
                                <AppText weight="bold" className="text-slate-900 mb-3 mt-2" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                                    360° view
                                </AppText>
                                <View style={styles.webViewWrap}>
                                    <WebView source={{ uri: car.view360Url }} style={styles.webView} startInLoadingState />
                                </View>
                            </>
                        ) : null}

                        <AppText weight="bold" className="text-slate-900 mb-3 mt-2" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                            Features
                        </AppText>
                        <View style={styles.featuresWrap}>
                            {car.features.map((f) => (
                                <View key={f} style={styles.featureChip}>
                                    <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                                    <AppText weight="medium" className="text-slate-700 ml-1" style={{ fontSize: 12 }}>
                                        {f}
                                    </AppText>
                                </View>
                            ))}
                        </View>

                        <AppText weight="bold" className="text-slate-900 mb-3 mt-2" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                            Documents ({docsUploaded}/4)
                        </AppText>
                        <View style={styles.card}>
                            {DOCUMENT_TYPES.map((docType) => {
                                const doc = car.documentsMeta?.[docType.key] || {};
                                return (
                                    <View key={docType.key} style={styles.docRow}>
                                        {doc.imageUri ? (
                                            <Image source={{ uri: doc.imageUri }} style={styles.docThumb} />
                                        ) : (
                                            <View style={styles.docIcon}>
                                                <Ionicons name={docType.icon} size={16} color="#64748b" />
                                            </View>
                                        )}
                                        <View className="flex-1 ml-3">
                                            <AppText weight="bold" className="text-slate-800" style={{ fontSize: 13 }}>
                                                {docType.label}
                                            </AppText>
                                            <AppText weight="medium" className="text-slate-500" style={{ fontSize: 12 }}>
                                                {doc.imageUri
                                                    ? `${doc.number || '—'} · ${doc.expiry || 'No expiry'}`
                                                    : 'Not uploaded'}
                                            </AppText>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <AppText weight="bold" className="text-slate-900 mb-3 mt-2" style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}>
                            Description
                        </AppText>
                        <View style={styles.card}>
                            <AppText weight="medium" className="text-slate-600 leading-5" style={{ fontSize: 13 }}>
                                {car.description}
                            </AppText>
                        </View>

                        <View style={[styles.card, styles.aiCard]}>
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="sparkles" size={14} color="#d97706" />
                                <AppText weight="bold" className="text-amber-900 ml-2" style={{ fontSize: 12 }}>
                                    AI · {car.aiPrediction.level}
                                </AppText>
                            </View>
                            <AppText weight="medium" className="text-slate-600" style={{ fontSize: 12, lineHeight: 18 }}>
                                {car.aiPrediction.tip}
                            </AppText>
                        </View>

                        <TouchableOpacity activeOpacity={0.9} onPress={onConfirm} style={styles.confirmBtn}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <AppText weight="bold" className="text-white ml-2" style={{ fontSize: 14 }}>
                                Confirm & add to fleet
                            </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.editBtn}>
                            <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.primary} />
                            <AppText weight="bold" className="ml-2" style={{ color: colors.primary, fontSize: 13 }}>
                                Back to edit
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    previewBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    imageWrap: {
        height: 140,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroImage: {
        width: width - 80,
        height: 120,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    sheet: {
        marginTop: -16,
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    featuresWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    docIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    docThumb: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    webViewWrap: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 12,
    },
    webView: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    aiCard: {
        backgroundColor: '#fffbeb',
        borderColor: '#fde68a',
    },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        marginTop: 4,
        marginBottom: 12,
    },
});

export default CarFormPreview;
