import React, { useState, useMemo } from 'react';
import {
    View,
    TouchableOpacity,
    StatusBar,
    Alert,
    StyleSheet,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/header';
import AppText from '../../components/appText';
import AdminFormField from '../../components/adminFormField';
import FormChipGroup from '../../components/formChipGroup';
import PhotoUploadZone from '../../components/photoUploadZone';
import CarFormPreview from '../../components/carFormPreview';
import { CustomDatePickerModal } from '../../components/customPickers';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import { pickImageFromDevice, normalizeWebUrl, isValidWebUrl } from '../../utils/imagePickerHelper';
import {
    createEmptyCarForm,
    buildCarFromForm,
    validateCarForm,
    CAR_STATUSES,
    CAR_CATEGORIES,
    CAR_TYPES,
    TRANSMISSIONS,
    FEATURE_OPTIONS,
    DOCUMENT_TYPES,
} from '../../utils/carFormUtils';

const SectionTitle = ({ icon, title }) => (
    <View style={styles.sectionTitleRow}>
        <Ionicons name={icon} size={18} color={colors.primary} />
        <AppText
            weight="bold"
            className="text-slate-900 ml-2 uppercase tracking-wider"
            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
        >
            {title}
        </AppText>
    </View>
);

const Divider = () => <View style={styles.divider} />;

const AddCarScreen = ({ navigation, route }) => {
    const onCarAdded = route.params?.onCarAdded;
    const [form, setForm] = useState(createEmptyCarForm);
    const [errors, setErrors] = useState({});
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewCar, setPreviewCar] = useState(null);
    const [datePicker, setDatePicker] = useState({ visible: false, docKey: null });

    const view360Normalized = useMemo(() => normalizeWebUrl(form.view360Url), [form.view360Url]);
    const show360Preview = isValidWebUrl(form.view360Url);

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const updateDoc = (docKey, patch) => {
        setForm((prev) => ({
            ...prev,
            documents: {
                ...prev.documents,
                [docKey]: {
                    ...prev.documents[docKey],
                    ...patch,
                    uploaded: patch.imageUri ? true : prev.documents[docKey].uploaded,
                },
            },
        }));
    };

    const pickCoverPhoto = () => {
        pickImageFromDevice((uri) => update('coverPhotoUri', uri));
    };

    const pickDocumentPhoto = (docKey) => {
        pickImageFromDevice((uri) => {
            updateDoc(docKey, { imageUri: uri, uploaded: true });
        });
    };

    const openPreview = () => {
        const validation = validateCarForm(form);
        setErrors(validation);
        if (Object.keys(validation).length > 0) {
            Alert.alert('Missing details', 'Please complete required fields before preview.');
            return;
        }
        setPreviewCar(buildCarFromForm(form, normalizeWebUrl));
        setPreviewVisible(true);
    };

    const saveCar = () => {
        const validation = validateCarForm(form);
        setErrors(validation);
        if (Object.keys(validation).length > 0) {
            Alert.alert('Cannot save', 'Fix the highlighted fields and try again.');
            return;
        }

        const car = buildCarFromForm(form, normalizeWebUrl);
        if (typeof onCarAdded === 'function') onCarAdded(car);

        setPreviewVisible(false);
        Alert.alert('Vehicle added', `${car.name} is now in your fleet.`, [
            { text: 'View fleet', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                title="Add Vehicle"
                subtitle="New fleet asset"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={32}
            >
                <SectionTitle icon="image-outline" title="Vehicle photo" />
                <PhotoUploadZone
                    label="Add cover photo"
                    hint="Tap to open camera or gallery"
                    imageUri={form.coverPhotoUri}
                    onPress={pickCoverPhoto}
                />
                {errors.coverPhoto ? (
                    <AppText weight="medium" style={styles.errorText}>{errors.coverPhoto}</AppText>
                ) : null}

                <Divider />

                <SectionTitle icon="information-circle-outline" title="Basic information" />
                <AdminFormField label="Vehicle name" value={form.name} onChangeText={(v) => update('name', v)} placeholder="e.g. Hyundai Creta" error={Boolean(errors.name)} errorMessage={errors.name} />
                <AdminFormField label="Subtitle" value={form.subtitle} onChangeText={(v) => update('subtitle', v)} placeholder="e.g. Compact Premium SUV" error={Boolean(errors.subtitle)} errorMessage={errors.subtitle} />
                <AdminFormField label="License plate" value={form.plate} onChangeText={(v) => update('plate', v)} placeholder="MH 12 AB 1234" autoCapitalize="characters" error={Boolean(errors.plate)} errorMessage={errors.plate} />
                <FormChipGroup label="Category" options={CAR_CATEGORIES} value={form.category} onChange={(v) => update('category', v)} />
                <FormChipGroup label="Fleet type" options={CAR_TYPES} value={form.type} onChange={(v) => update('type', v)} />
                <FormChipGroup label="Status" options={CAR_STATUSES} value={form.status} onChange={(v) => update('status', v)} />

                <Divider />

                <SectionTitle icon="cash-outline" title="Pricing & location" />
                <AdminFormField label="Daily rate (₹)" value={form.price} onChangeText={(v) => update('price', v.replace(/[^0-9]/g, ''))} placeholder="3500" keyboardType="number-pad" error={Boolean(errors.price)} errorMessage={errors.price} />
                <AdminFormField label="Hub location" value={form.location} onChangeText={(v) => update('location', v)} placeholder="Downtown Fleet Hub, Bay 02" error={Boolean(errors.location)} errorMessage={errors.location} />
                <AdminFormField label="Fleet rating" value={form.rating} onChangeText={(v) => update('rating', v)} placeholder="4.5" keyboardType="decimal-pad" />

                <Divider />

                <SectionTitle icon="speedometer-outline" title="Specifications" />
                <FormChipGroup label="Transmission" options={TRANSMISSIONS} value={form.transmission} onChange={(v) => update('transmission', v)} />
                <AdminFormField label="Fuel level" value={form.fuelLeft} onChangeText={(v) => update('fuelLeft', v)} placeholder="85% Fuel / 45L" />
                <AdminFormField label="Odometer" value={form.drivenKm} onChangeText={(v) => update('drivenKm', v)} placeholder="24,500 km" error={Boolean(errors.drivenKm)} errorMessage={errors.drivenKm} />
                <AdminFormField label="Seats" value={form.seats} onChangeText={(v) => update('seats', v.replace(/[^0-9]/g, ''))} placeholder="5" keyboardType="number-pad" />
                <View className="flex-row">
                    <View style={styles.halfFieldLeft}>
                        <AdminFormField label="Top speed" value={form.topSpeed} onChangeText={(v) => update('topSpeed', v)} placeholder="180 km/h" containerStyle={{ marginBottom: 0 }} />
                    </View>
                    <View style={styles.halfFieldRight}>
                        <AdminFormField label="0–100 km/h" value={form.acceleration} onChangeText={(v) => update('acceleration', v)} placeholder="10.2s" containerStyle={{ marginBottom: 0 }} />
                    </View>
                </View>

                <Divider />

                <SectionTitle icon="globe-outline" title="360° view" />
                <AdminFormField
                    label="360° web URL"
                    value={form.view360Url}
                    onChangeText={(v) => update('view360Url', v)}
                    placeholder="https://your-360-tour.com/vehicle"
                    autoCapitalize="none"
                />
                <AppText weight="medium" className="text-slate-500 mb-3" style={{ fontSize: 12, lineHeight: 17 }}>
                    Paste a hosted 360° tour link. It will render in asset view and preview below.
                </AppText>
                {show360Preview ? (
                    <View style={styles.webViewWrap}>
                        <WebView
                            source={{ uri: view360Normalized }}
                            style={styles.webView}
                            javaScriptEnabled
                            domStorageEnabled
                            startInLoadingState
                            allowsInlineMediaPlayback
                        />
                    </View>
                ) : (
                    <View style={styles.webViewPlaceholder}>
                        <MaterialCommunityIcons name="rotate-360" size={36} color="#94a3b8" />
                        <AppText weight="medium" className="text-slate-500 mt-2" style={{ fontSize: 13 }}>
                            360° preview appears when URL is valid
                        </AppText>
                    </View>
                )}

                <Divider />

                <SectionTitle icon="list-outline" title="Features" />
                <FormChipGroup label="Select features" options={FEATURE_OPTIONS} value={form.selectedFeatures} onChange={(v) => update('selectedFeatures', v)} multi />

                <Divider />

                <SectionTitle icon="document-text-outline" title="Listing copy" />
                <AdminFormField label="Description" value={form.description} onChangeText={(v) => update('description', v)} placeholder="Customer-facing description..." multiline numberOfLines={4} error={Boolean(errors.description)} errorMessage={errors.description} />
                <AdminFormField label="AI fleet tip (optional)" value={form.aiTip} onChangeText={(v) => update('aiTip', v)} placeholder="Admin pricing or demand note..." multiline numberOfLines={3} />

                <Divider />

                <SectionTitle icon="folder-open-outline" title="Documents" />
                <AppText weight="medium" className="text-slate-500 mb-3" style={{ fontSize: 12, lineHeight: 17 }}>
                    Tap each row to upload a photo from your phone. Add reference details after upload.
                </AppText>

                <View style={styles.docList}>
                    {DOCUMENT_TYPES.map((docType, index) => {
                        const doc = form.documents[docType.key];
                        const err = errors[docType.key];
                        return (
                            <View key={docType.key}>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => pickDocumentPhoto(docType.key)}
                                    style={styles.docRow}
                                >
                                    {doc.imageUri ? (
                                        <Image source={{ uri: doc.imageUri }} style={styles.docThumb} />
                                    ) : (
                                        <View style={styles.docThumbEmpty}>
                                            <Ionicons name={docType.icon} size={20} color="#64748b" />
                                        </View>
                                    )}
                                    <View className="flex-1 ml-3">
                                        <AppText weight="bold" className="text-slate-900" style={{ fontSize: 14 }}>
                                            {docType.label}
                                        </AppText>
                                        <AppText weight="medium" className="text-slate-500 mt-0.5" style={{ fontSize: 12 }}>
                                            {doc.imageUri ? 'Photo added · Tap to replace' : 'Tap to upload photo'}
                                        </AppText>
                                    </View>
                                    <Ionicons name="cloud-upload-outline" size={22} color={doc.imageUri ? '#10b981' : colors.primary} />
                                </TouchableOpacity>

                                {doc.imageUri && (
                                    <View style={styles.docFields}>
                                        <AdminFormField
                                            label="Reference number"
                                            value={doc.number}
                                            onChangeText={(v) => updateDoc(docType.key, { number: v })}
                                            placeholder="Policy / RC / certificate no."
                                            containerStyle={{ marginBottom: 10 }}
                                        />
                                        <AppText weight="bold" className="text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 11 }}>
                                            Expiry date
                                        </AppText>
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() => setDatePicker({ visible: true, docKey: docType.key })}
                                            style={styles.dateBtn}
                                        >
                                            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                                            <AppText weight="semibold" className="text-slate-800 ml-2" style={{ fontSize: 14 }}>
                                                {doc.expiry || 'Select expiry'}
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {err ? <AppText weight="medium" style={styles.errorText}>{err}</AppText> : null}
                                {index < DOCUMENT_TYPES.length - 1 ? <View style={styles.docLine} /> : null}
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={openPreview} style={styles.previewBtn}>
                    <Ionicons name="eye-outline" size={20} color={colors.primary} />
                    <AppText weight="bold" className="ml-2" style={{ color: colors.primary, fontSize: 14 }}>
                        Preview listing
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} onPress={saveCar} style={styles.saveBtn}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <AppText weight="bold" className="text-white ml-2" style={{ fontSize: 14 }}>
                        Save vehicle
                    </AppText>
                </TouchableOpacity>
            </KeyboardAwareScrollView>

            <CarFormPreview
                visible={previewVisible}
                car={previewCar}
                onClose={() => setPreviewVisible(false)}
                onConfirm={saveCar}
            />

            <CustomDatePickerModal
                visible={datePicker.visible}
                onClose={() => setDatePicker({ visible: false, docKey: null })}
                initialDate={datePicker.docKey ? form.documents[datePicker.docKey]?.expiry : undefined}
                minDate="01 January 2020"
                onSelect={(date) => {
                    if (datePicker.docKey) updateDoc(datePicker.docKey, { expiry: date });
                    setDatePicker({ visible: false, docKey: null });
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 20,
    },
    halfFieldLeft: { flex: 1, marginRight: 8 },
    halfFieldRight: { flex: 1, marginLeft: 8 },
    webViewWrap: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 8,
    },
    webView: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    webViewPlaceholder: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    docList: {
        width: '100%',
        marginBottom: 20,
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        width: '100%',
    },
    docThumb: {
        width: 48,
        height: 48,
        borderRadius: 12,
    },
    docThumbEmpty: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    docFields: {
        paddingBottom: 14,
        paddingLeft: 60,
    },
    docLine: {
        height: 1,
        backgroundColor: '#f1f5f9',
    },
    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginBottom: 10,
        marginTop: -4,
    },
    previewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        marginBottom: 10,
        width: '100%',
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        width: '100%',
    },
});

export default AddCarScreen;
