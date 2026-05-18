import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
    Modal,
    Alert,
    TextInput,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../assets/colors';

const { width, height } = Dimensions.get('window');

const CarDocumentDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { car, activeDocId: initialDocId, documents: initialDocs } = route?.params || {};

    const [documents, setDocuments] = useState(initialDocs || []);
    const [activeDocId, setActiveDocId] = useState(initialDocId || documents?.[0]?.id);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const activeDoc = useMemo(
        () => documents?.find((doc) => doc.id === activeDocId) || documents?.[0],
        [activeDocId, documents]
    );

    // Form state for editing document metadata
    const [formData, setFormData] = useState({
        fullTitle: activeDoc?.fullTitle || '',
        badgeText: activeDoc?.badgeText || '',
        expiry: activeDoc?.expiry || '',
        fields: activeDoc?.fields || []
    });

    useEffect(() => {
        if (activeDoc) {
            setFormData({
                fullTitle: activeDoc.fullTitle,
                badgeText: activeDoc.badgeText,
                expiry: activeDoc.expiry,
                fields: activeDoc.fields
            });
            setRotation(0);
            setActiveImageIndex(0);
        }
    }, [activeDocId, activeDoc]);

    const safeImageIndex = useMemo(() => {
        if (!activeDoc || !activeDoc.images || activeDoc.images.length === 0) {
            return 0;
        }
        return activeImageIndex < activeDoc.images.length ? activeImageIndex : 0;
    }, [activeImageIndex, activeDoc]);

    const activeImageUrl = useMemo(() => {
        return activeDoc?.images?.[safeImageIndex]?.url;
    }, [activeDoc, safeImageIndex]);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleDownload = () => {
        Alert.alert(
            "Secure Download",
            `Do you want to download ${activeDoc?.fullTitle} (Page ${safeImageIndex + 1}) to your local device?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Download", 
                    onPress: () => {
                        Alert.alert("Saved Successfully", `${activeDoc?.title} has been downloaded to your storage folder.`);
                    }
                }
            ]
        );
    };

    const handleShare = () => {
        Alert.alert(
            "Encrypted Document Share",
            `Generate a temporary, secure link to share ${activeDoc?.title} (Page ${safeImageIndex + 1})? This link expires automatically in 15 minutes.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Generate Link", 
                    onPress: () => {
                        Alert.alert("Link Copied", "Secure temporary viewing link has been copied to your clipboard: https://hityam.rent/share/doc/temp-9810");
                    }
                }
            ]
        );
    };

    const handleSaveEdit = () => {
        const updatedDocs = documents.map(d => {
            if (d.id === activeDoc.id) {
                return {
                    ...d,
                    fullTitle: formData.fullTitle,
                    badgeText: formData.badgeText,
                    expiry: formData.expiry,
                    fields: formData.fields
                };
            }
            return d;
        });
        setDocuments(updatedDocs);
        setIsEditing(false);
        Alert.alert("Audit Complete", "Document verification parameters updated successfully.");
    };

    const handleFieldChange = (index, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[index].value = value;
        setFormData({ ...formData, fields: updatedFields });
    };

    if (!activeDoc) {
        return (
            <View className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-600 font-bold font-revalia">
                    Document not found
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Header Row */}
            <View 
                className="flex-row justify-between items-center px-6" 
                style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 18), paddingBottom: 12 }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center border border-slate-200"
                    style={{
                        shadowColor: '#64748B',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 1
                    }}
                >
                    <Ionicons name="chevron-back" size={22} color="#0F172A" />
                </TouchableOpacity>

                <View className="items-center justify-center">
                    <Text className="text-slate-800 text-[12px] font-bold uppercase tracking-[2px] font-revalia">
                        {isEditing ? "Editing Doc" : "Doc Center"}
                    </Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity
                        onPress={() => setIsEditing(!isEditing)}
                        className="px-3 h-11 rounded-xl items-center justify-center border border-slate-200 mr-2 flex-row"
                        style={{
                            backgroundColor: isEditing ? '#10B981' : '#F1F5F9',
                            shadowColor: '#64748B',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 1
                        }}
                    >
                        <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={16} color={isEditing ? "white" : "#0F172A"} className="mr-1" />
                        <Text className={`text-xs font-bold uppercase tracking-wider font-revalia ${isEditing ? 'text-white' : 'text-slate-800'}`}>
                            {isEditing ? "Save" : "Edit"}
                        </Text>
                    </TouchableOpacity>

                    {!isEditing && (
                        <>
                            <TouchableOpacity
                                onPress={handleShare}
                                className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center border border-slate-200 mr-2"
                            >
                                <Ionicons name="share-social-outline" size={18} color="#0F172A" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDownload}
                                className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center border border-slate-200"
                            >
                                <Ionicons name="download-outline" size={18} color="#0F172A" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Main Scrollable Area for Content */}
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                {/* Title Block */}
                <View className="px-6 mt-3">
                    <Text 
                        className="text-slate-900 text-lg font-bold uppercase tracking-wide leading-snug font-revalia" 
                    >
                        {activeDoc.fullTitle}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View 
                            className="flex-row items-center px-2.5 py-0.5 rounded-full border mr-2"
                            style={{ 
                                backgroundColor: activeDoc.badgeColor + '12', 
                                borderColor: activeDoc.badgeColor + '25' 
                            }}
                        >
                            <Ionicons name="shield-checkmark" size={11} color={activeDoc.iconColor} />
                            <Text 
                                className="text-[9px] font-extrabold uppercase ml-1 font-revalia" 
                                style={{ color: activeDoc.iconColor }}
                            >
                                {activeDoc.badgeText}
                            </Text>
                        </View>
                        <Text className="text-slate-500 text-[10px] font-semibold uppercase font-revalia">
                            • {activeDoc.expiry}
                        </Text>
                    </View>
                </View>

                {/* Central Document Image Area */}
                <View className="justify-center items-center px-6 mt-5">
                    {activeDoc.images.length > 1 && (
                        <View 
                            className="flex-row rounded-xl p-1 mb-4 self-center border"
                            style={{ 
                                backgroundColor: 'rgba(226, 232, 240, 0.6)', 
                                borderColor: 'rgba(226, 232, 240, 0.2)' 
                            }}
                        >
                            {activeDoc.images.map((img, idx) => {
                                const isSelected = idx === safeImageIndex;
                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => setActiveImageIndex(idx)}
                                        className={`px-4 py-1.5 rounded-lg ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                                        style={isSelected ? {
                                            shadowColor: '#64748B',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 1
                                        } : null}
                                    >
                                        <Text 
                                            className={`text-[10px] font-bold uppercase font-revalia ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} 
                                        >
                                            {img.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    <TouchableOpacity 
                        activeOpacity={0.9}
                        onPress={() => setIsImageFullscreen(true)}
                        className="bg-white rounded-[30px] overflow-hidden justify-center items-center border relative"
                        style={{ 
                            width: width - 40, 
                            height: height * 0.34,
                            borderColor: 'rgba(226, 232, 240, 0.5)',
                            shadowColor: '#64748B',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 4
                        }}
                    >
                        <Animated.Image
                            key={activeImageUrl}
                            source={{ uri: activeImageUrl }}
                            className="w-full h-[90%]"
                            resizeMode="contain"
                            style={{
                                transform: [{ rotate: `${rotation}deg` }]
                            }}
                        />

                        <View 
                            className="absolute top-4 right-4 w-9 h-9 rounded-xl items-center justify-center border"
                            style={{ 
                                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                borderColor: 'rgba(255, 255, 255, 0.15)'
                            }}
                        >
                            <Ionicons name="expand" size={15} color="white" />
                        </View>

                        <TouchableOpacity 
                            onPress={handleRotate}
                            className="absolute bottom-4 right-4 w-11 h-11 rounded-xl items-center justify-center border z-20"
                            style={{ 
                                backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                                borderColor: 'rgba(255, 255, 255, 0.15)' 
                            }}
                        >
                            <MaterialCommunityIcons name="rotate-right" size={20} color="white" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <View 
                        className="flex-row items-center mt-4 px-4 py-1.5 rounded-full border"
                        style={{ 
                            backgroundColor: 'rgba(226, 232, 240, 0.5)', 
                            borderColor: 'rgba(226, 232, 240, 0.2)' 
                        }}
                    >
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-revalia">
                            Tap image to inspect in full size • MD5 Verified
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Info Sheet / Drawer */}
            <View 
                className="bg-white rounded-t-[36px] border-t px-6 pt-5" 
                style={{ 
                    borderTopColor: 'rgba(226, 232, 240, 0.5)',
                    shadowColor: '#0F172A',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.06,
                    shadowRadius: 24,
                    elevation: 20,
                    paddingBottom: Math.max(insets.bottom + 8, 20)
                }}
            >
                <Text 
                    className="text-[11px] text-slate-400 font-bold uppercase mb-3 ml-0.5 font-revalia" 
                    style={{ letterSpacing: 2 }}
                >
                    {isEditing ? "Update Parameters" : "Document Parameters"}
                </Text>

                {/* Metadata parameters list / edit inputs */}
                <View className="flex-row flex-wrap justify-between">
                    {isEditing ? (
                        <>
                            <View className="w-full mb-3">
                                <Text className="text-[10px] text-slate-500 font-bold uppercase mb-1 font-revalia">Document Title</Text>
                                <TextInput
                                    value={formData.fullTitle}
                                    onChangeText={(text) => setFormData({ ...formData, fullTitle: text })}
                                    className="bg-slate-50 px-4 h-11 rounded-xl text-xs text-slate-900 border border-slate-200 font-revalia"
                                />
                            </View>
                            <View className="w-1/2 pr-2 mb-3">
                                <Text className="text-[10px] text-slate-500 font-bold uppercase mb-1 font-revalia">Verification Status</Text>
                                <TextInput
                                    value={formData.badgeText}
                                    onChangeText={(text) => setFormData({ ...formData, badgeText: text })}
                                    className="bg-slate-50 px-4 h-11 rounded-xl text-xs text-slate-900 border border-slate-200 font-revalia"
                                />
                            </View>
                            <View className="w-1/2 pl-2 mb-3">
                                <Text className="text-[10px] text-slate-500 font-bold uppercase mb-1 font-revalia">Expiry Info</Text>
                                <TextInput
                                    value={formData.expiry}
                                    onChangeText={(text) => setFormData({ ...formData, expiry: text })}
                                    className="bg-slate-50 px-4 h-11 rounded-xl text-xs text-slate-900 border border-slate-200 font-revalia"
                                />
                            </View>
                            {formData.fields.map((field, idx) => (
                                <View key={idx} className="w-[48%] mb-3">
                                    <Text className="text-[9px] text-slate-400 font-bold uppercase font-revalia mb-1">{field.label}</Text>
                                    <TextInput
                                        value={field.value}
                                        onChangeText={(text) => handleFieldChange(idx, text)}
                                        className="bg-slate-50 px-3 h-10 rounded-xl text-xs text-slate-900 border border-slate-200 font-revalia"
                                    />
                                </View>
                            ))}
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                className="w-full h-11 rounded-xl items-center justify-center mt-2 shadow-md mb-2"
                                style={{ backgroundColor: colors.primary }}
                            >
                                <Text className="text-white text-xs font-bold uppercase tracking-wider font-revalia">Save Parameters</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        formData.fields.map((field, idx) => (
                            <View 
                                key={idx} 
                                className="w-[48%] bg-slate-50 rounded-[18px] p-3 mb-3 border border-slate-100"
                                style={{
                                    borderLeftWidth: 3,
                                    borderLeftColor: activeDoc.badgeColor || '#3B82F6'
                                }}
                            >
                                <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-revalia">
                                    {field.label}
                                </Text>
                                <Text className="text-[12px] text-slate-900 font-bold mt-1 font-revalia" numberOfLines={1}>
                                    {field.value}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Tab selection row */}
                {!isEditing && (
                    <>
                        <Text 
                            className="text-[10px] text-slate-400 font-bold uppercase mt-2 mb-3 ml-0.5 font-revalia" 
                            style={{ letterSpacing: 2 }}
                        >
                            Quick Switch Document
                        </Text>

                        <View className="h-16">
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingRight: 20 }}
                            >
                                {documents?.map((doc) => {
                                    const isCurrentDoc = doc.id === activeDocId;
                                    return (
                                        <TouchableOpacity
                                            key={doc.id}
                                            onPress={() => setActiveDocId(doc.id)}
                                            className="h-12 px-4 rounded-xl flex-row items-center mr-2.5 border"
                                            style={isCurrentDoc ? {
                                                backgroundColor: doc.badgeColor || '#3B82F6',
                                                borderColor: doc.badgeColor || '#3B82F6',
                                                shadowColor: doc.badgeColor || '#3B82F6',
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.15,
                                                shadowRadius: 6,
                                                elevation: 3
                                            } : {
                                                backgroundColor: '#F1F5F9',
                                                borderColor: '#E2E8F0',
                                            }}
                                        >
                                            <MaterialCommunityIcons 
                                                name={doc.icon} 
                                                size={15} 
                                                color={isCurrentDoc ? 'white' : '#64748B'} 
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text 
                                                className={`text-[10px] font-bold uppercase font-revalia ${
                                                    isCurrentDoc ? 'text-white' : 'text-slate-500'
                                                }`}
                                            >
                                                {doc.title}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>

            {/* Immersive True Fullscreen Zoom Viewer Modal */}
            <Modal
                visible={isImageFullscreen}
                transparent={false}
                animationType="fade"
                onRequestClose={() => setIsImageFullscreen(false)}
            >
                <View className="flex-1 bg-black justify-center items-center relative">
                    <StatusBar hidden={true} />

                    <TouchableOpacity
                        onPress={() => setIsImageFullscreen(false)}
                        className="absolute w-12 h-12 rounded-full bg-black/50 items-center justify-center border border-white/20 z-50"
                        style={{ top: insets.top + 10, left: 24 }}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRotate}
                        className="absolute w-12 h-12 rounded-full bg-black/50 items-center justify-center border border-white/20 z-50"
                        style={{ top: insets.top + 10, right: 24 }}
                    >
                        <MaterialCommunityIcons name="rotate-right" size={22} color="white" />
                    </TouchableOpacity>

                    <Animated.Image
                        key={activeImageUrl}
                        source={{ uri: activeImageUrl }}
                        className="w-full h-full"
                        resizeMode="contain"
                        style={{
                            transform: [{ rotate: `${rotation}deg` }]
                        }}
                    />

                    <View 
                        className="absolute bg-black/65 px-5 py-2.5 rounded-full border border-white/10 mx-6"
                        style={{ bottom: Math.max(insets.bottom + 10, 30) }}
                    >
                        <Text className="text-white text-[11px] font-extrabold uppercase text-center tracking-wide font-revalia">
                            {activeDoc.fullTitle} • {activeDoc.images[safeImageIndex]?.title} ({safeImageIndex + 1}/{activeDoc.images.length})
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CarDocumentDetailScreen;
