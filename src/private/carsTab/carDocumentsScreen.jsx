import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/colors';
import GlassEffect from '../../components/glassEffect';

const { width } = Dimensions.get('window');

const CarDocumentsScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const car = route?.params?.car || { name: 'Maruti Suzuki Swift', regNo: 'MH-12-QW-1234' };

    const documents = useMemo(
        () => [
            {
                id: 'rc',
                title: 'RC',
                fullTitle: 'Registration Certificate (RC)',
                icon: 'file-document',
                subtitle: 'Registration Certificate',
                expiry: 'Valid till Oct 2035',
                images: [
                    { title: 'RC Front', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80' },
                    { title: 'RC Back', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#F59E0B',
                badgeText: 'Verified & Active',
                iconColor: '#D97706',
                bgColor: 'bg-amber-50',
                fields: [
                    { label: 'Registration No', value: 'MH-12-QW-1234' },
                    { label: 'Registered Owner', value: 'Hityam Rentals Pvt. Ltd.' },
                    { label: 'Engine Number', value: 'N20B20A90X812' },
                    { label: 'Expiry Date', value: '12 Oct 2035' }
                ]
            },
            {
                id: 'pollution',
                title: 'Pollution',
                fullTitle: 'Pollution Under Control (PUC)',
                icon: 'leaf',
                subtitle: 'Emission Compliance',
                expiry: 'Valid till Nov 2026',
                images: [
                    { title: 'PUC Certificate', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#10B981',
                badgeText: 'Compliant',
                iconColor: '#059669',
                bgColor: 'bg-emerald-50',
                fields: [
                    { label: 'Certificate No', value: 'PUC-8819028A' },
                    { label: 'Emission Level', value: 'CO: 0.08%, HC: 48 ppm' },
                    { label: 'Tested On', value: '15 Mar 2026' },
                    { label: 'Expiry Date', value: '14 Sep 2026' }
                ]
            },
            {
                id: 'license',
                title: 'License',
                fullTitle: 'Driving License (DL)',
                icon: 'card-account-details',
                subtitle: 'Registered Driver License',
                expiry: 'Valid till Aug 2032',
                images: [
                    { title: 'DL Front', url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80' },
                    { title: 'DL Back', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#3B82F6',
                badgeText: 'Active & Verified',
                iconColor: '#2563EB',
                bgColor: 'bg-blue-50',
                fields: [
                    { label: 'License No', value: 'DL-142018002931' },
                    { label: 'Driver Name', value: 'Alexander Wright' },
                    { label: 'Vehicle Class', value: 'LMV-CAB / TRANS' },
                    { label: 'Expiry Date', value: '05 Aug 2032' }
                ]
            },
            {
                id: 'insurance',
                title: 'Insurance',
                fullTitle: 'Comprehensive Insurance',
                icon: 'shield-check',
                subtitle: 'Active Insurance Policy',
                expiry: 'Valid till May 2027',
                images: [
                    { title: 'Policy Page 1', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80' },
                    { title: 'Terms Page 2', url: 'https://images.unsplash.com/photo-1444653300606-1d4dfe070415?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#10B981',
                badgeText: 'Active Policy',
                iconColor: '#0D9488',
                bgColor: 'bg-teal-50',
                fields: [
                    { label: 'Policy No', value: 'INS-8829-BMW-02' },
                    { label: 'Insurer Name', value: 'Allianz Imperial Insurance' },
                    { label: 'Declared Value', value: '₹45,00,000' },
                    { label: 'Expiry Date', value: '30 May 2027' }
                ]
            },
            {
                id: 'permit',
                title: 'Permit',
                fullTitle: 'All India National Permit',
                icon: 'file-certificate',
                subtitle: 'State Transport Permit',
                expiry: 'Valid till Feb 2029',
                images: [
                    { title: 'Permit Page 1', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#8B5CF6',
                badgeText: 'Authorized',
                iconColor: '#4F46E5',
                bgColor: 'bg-indigo-50',
                fields: [
                    { label: 'Permit No', value: 'AIP-2026-9081' },
                    { label: 'Permit Type', value: 'Tourist (Form 48)' },
                    { label: 'Issuing Authority', value: 'State Transport Authority' },
                    { label: 'Expiry Date', value: '28 Feb 2029' }
                ]
            },
            {
                id: 'fitness',
                title: 'Fitness',
                fullTitle: 'Vehicle Fitness Certificate',
                icon: 'car-cog',
                subtitle: 'Fitness & Safety Approval',
                expiry: 'Valid till Jan 2028',
                images: [
                    { title: 'Fitness Sheet', url: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80' }
                ],
                badgeColor: '#EC4899',
                badgeText: 'Approved & Active',
                iconColor: '#E11D48',
                bgColor: 'bg-rose-50',
                fields: [
                    { label: 'Certificate No', value: 'FIT-90812-B' },
                    { label: 'Fitness Grade', value: 'Class A (Excellent)' },
                    { label: 'Inspected On', value: '14 Jan 2026' },
                    { label: 'Expiry Date', value: '14 Jan 2028' }
                ]
            },
        ],
        []
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Premium Header Background */}
            <View 
                className="relative w-full overflow-hidden" 
                style={{ 
                    height: insets.top + (Platform.OS === 'ios' ? 76 : 90),
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40
                }}
            >
                <LinearGradient
                    colors={[colors.primary, '#1E40AF']}
                    className="absolute inset-0"
                    style={{
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Header Row */}
                <View
                    className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-6"
                    style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 12 : 16) }}
                >
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-12 h-12 rounded-full bg-white/20 justify-center items-center mr-3 border border-white/10"
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="justify-center flex-1 pr-2">
                            <Text 
                                className="text-white/80 text-[10px] uppercase tracking-widest font-revalia" 
                            >
                                CAR PAPERS
                            </Text>
                            <Text 
                                className="text-white text-[16px] font-bold font-revalia" 
                                style={{ lineHeight: 20 }}
                                numberOfLines={1}
                            >
                                {car?.name || 'Vehicle Documents'}
                            </Text>
                            <Text 
                                className="text-white/60 text-[9px] font-bold uppercase tracking-wider font-revalia mt-0.5"
                                numberOfLines={1}
                            >
                                Reg No: {car?.regNo || 'MH-12-QW-1234'}
                            </Text>
                        </View>
                    </View>

                    <View className="w-12 h-12 rounded-full bg-white/20 justify-center items-center border border-white/10">
                        <MaterialCommunityIcons name="shield-check" size={24} color="white" />
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 40 }}
            >
                {/* Compliance Banner - GlassEffect */}
                <View className="mb-5">
                    <GlassEffect
                        removeDefaultClasses={true}
                        className="flex-row items-center justify-between px-5 py-4 rounded-[24px]"
                    >
                        <View className="flex-row items-center flex-1 pr-4">
                            <View
                                className="w-10 h-10 rounded-xl justify-center items-center mr-3 border"
                                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                            >
                                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-[11px] font-bold uppercase tracking-wider font-revalia">
                                    STATUS: FULLY COMPLIANT
                                </Text>
                                <Text
                                    className="text-[10px] mt-0.5 font-semibold"
                                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                    6/6 active documents verified
                                </Text>
                            </View>
                        </View>
                        <View
                            className="px-2.5 py-1 rounded-lg border"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        >
                            <Text className="text-[#10B981] text-[9px] font-bold uppercase font-revalia">
                                SECURE
                            </Text>
                        </View>
                    </GlassEffect>
                </View>

                {/* Document List Header */}
                <Text className="text-[10px] text-slate-400 font-bold uppercase mb-4 ml-1 font-revalia" style={{ letterSpacing: 2 }}>
                    Available Documents
                </Text>

                {/* Document Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {documents.map((doc) => {
                        return (
                            <TouchableOpacity
                                key={doc.id}
                                onPress={() => {
                                    navigation.navigate('CarDocumentDetail', {
                                        car,
                                        activeDocId: doc.id,
                                        documents,
                                    });
                                }}
                                className="bg-white rounded-[24px] p-4 mb-4 border border-slate-100"
                                style={{
                                    width: (width - 50) / 2,
                                    minHeight: 142,
                                    elevation: 4,
                                    shadowColor: '#64748B',
                                    shadowOpacity: 0.08,
                                    shadowRadius: 12,
                                    shadowOffset: { width: 0, height: 4 }
                                }}
                            >
                                {/* Card Header Row: Icon + Badge beautifully aligned */}
                                <View className="flex-row justify-between items-center w-full mb-3">
                                    <View className={`w-10 h-10 rounded-xl items-center justify-center ${doc.bgColor}`}>
                                        <MaterialCommunityIcons
                                            name={doc.icon}
                                            size={20}
                                            color={doc.iconColor}
                                        />
                                    </View>
                                    <View className="flex-row items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                                        <Text className="text-[8px] font-extrabold text-emerald-600 ml-1 font-revalia">OK</Text>
                                    </View>
                                </View>

                                {/* Labels */}
                                <Text
                                    className="text-[13px] font-bold text-slate-900 mt-2 uppercase tracking-wide font-revalia"
                                    numberOfLines={1}
                                >
                                    {doc.title}
                                </Text>
                                <Text
                                    className="text-[10px] text-slate-400 font-semibold mt-1 font-revalia"
                                    numberOfLines={1}
                                >
                                    {doc.expiry}
                                </Text>

                                {/* Multi-Page Badge indicator */}
                                <View className="flex-row items-center mt-3 border-t border-slate-100 pt-2.5">
                                    <Ionicons name="copy-outline" size={10} color="#94A3B8" />
                                    <Text className="text-[9px] font-bold text-slate-400 ml-1.5 font-revalia">
                                        {doc.images.length} {doc.images.length > 1 ? 'Pages' : 'Page'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* RTO Regulatory Information Warning Card */}
                <View
                    className="rounded-[24px] p-5 border mt-2 flex-row items-start"
                    style={{ backgroundColor: 'rgba(241, 245, 249, 0.6)', borderColor: 'rgba(226, 232, 240, 0.5)' }}
                >
                    <Ionicons name="information-circle-outline" size={20} color="#475569" className="mr-3 mt-0.5" />
                    <View className="flex-1 ml-2">
                        <Text className="text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-1.5 font-revalia">
                            RTO Compliance Note
                        </Text>
                        <Text className="text-slate-500 text-[10px] leading-relaxed font-medium">
                            All digital copies stored within the Hityam application are legally recognized by state authorities as equivalent to physical documents under the Digital India Initiative. Keep them handy during checks.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default CarDocumentsScreen;
