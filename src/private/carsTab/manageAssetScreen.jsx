import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import GlassEffect from '../../components/glassEffect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ManageAssetScreen = ({ route, navigation }) => {
    const { car: initialCar } = route.params || {
        car: {
            id: '1',
            name: 'Maruti Suzuki Swift',
            subtitle: 'Premium Urban Hatchback',
            type: 'Economy',
            category: 'Hatchback',
            status: 'Available',
            statusColor: '#10b981',
            statusBg: '#ecfdf5',
            rating: '4.8',
            reviews: '(1.2k)',
            image: 'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
            images: [
                'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
                'https://img.gaadicdn.com/editorial/gallery/6620f4f9dbe4f.jpg',
                'https://img.gaadicdn.com/editorial/gallery/6620f4fa9b0e2.jpg'
            ],
            location: 'Downtown Fleet Hub, Bay 02',
            price: '2,500',
            specs: { transmission: 'Manual', fuelLeft: '85% Fuel', drivenKm: '24,500 km', topSpeed: '165 km/h', acceleration: '11.5s', seats: '5' },
            features: ['Air Condition', 'Bluetooth', 'Compact Size', 'USB Charger', 'Keyless Entry'],
            description: 'Enjoy agile handling and excellent fuel efficiency with the Maruti Swift. A compact hatchback perfect for zipping through urban traffic with premium cabin utilities.',
            aiPrediction: {
                level: 'High Demand',
                color: '#db2777',
                bg: '#fdf2f8',
                border: '#fbcfe8',
                tip: 'City commuter bookings are peaking. Maintain 100% availability for weekend getaways.'
            }
        }
    };

    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewMode, setViewMode] = useState('images'); // 'images' or '3d'
    const [isEditing, setIsEditing] = useState(false);

    const [carData, setCarData] = useState(initialCar);
    const [formData, setFormData] = useState({
        name: initialCar.name,
        subtitle: initialCar.subtitle,
        price: initialCar.price,
        location: initialCar.location,
        status: initialCar.status,
        fuelLeft: initialCar.specs.fuelLeft,
        drivenKm: initialCar.specs.drivenKm,
        description: initialCar.description,
        topSpeed: initialCar.specs.topSpeed,
        acceleration: initialCar.specs.acceleration,
    });

    const carImages = carData.images || [carData.image];

    useEffect(() => {
        if (viewMode !== 'images' || carImages.length <= 1) return;
        const interval = setInterval(() => {
            let nextIndex = (activeIndex + 1) % carImages.length;
            setActiveIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, 3500);

        return () => clearInterval(interval);
    }, [activeIndex, viewMode, carImages.length]);

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    const getStatusColors = (st) => {
        switch (st) {
            case 'Available': return { color: '#10b981', bg: '#ecfdf5' };
            case 'On Rent': return { color: '#3b82f6', bg: '#eff6ff' };
            case 'In Service': return { color: '#ef4444', bg: '#fef2f2' };
            default: return { color: '#64748b', bg: '#f1f5f9' };
        }
    };

    const handleSave = () => {
        const sc = getStatusColors(formData.status);
        setCarData({
            ...carData,
            name: formData.name,
            subtitle: formData.subtitle,
            price: formData.price,
            location: formData.location,
            status: formData.status,
            statusColor: sc.color,
            statusBg: sc.bg,
            description: formData.description,
            specs: {
                ...carData.specs,
                fuelLeft: formData.fuelLeft,
                drivenKm: formData.drivenKm,
                topSpeed: formData.topSpeed,
                acceleration: formData.acceleration,
            }
        });
        setIsEditing(false);
        Alert.alert('Asset Updated', 'Fleet profile details updated successfully.');
    };

    const handleCancel = () => {
        setFormData({
            name: carData.name,
            subtitle: carData.subtitle,
            price: carData.price,
            location: carData.location,
            status: carData.status,
            fuelLeft: carData.specs.fuelLeft,
            drivenKm: carData.specs.drivenKm,
            description: carData.description,
            topSpeed: carData.specs.topSpeed,
            acceleration: carData.specs.acceleration,
        });
        setIsEditing(false);
    };

    const renderSpec = (icon, label, value, isMaterial = false) => (
        <View className="w-[48%] bg-slate-50 rounded-[24px] p-4 mb-4 border border-slate-100">
            <View className="w-10 h-10 rounded-xl bg-white justify-center items-center mb-3 shadow-sm" style={{ elevation: 2 }}>
                {isMaterial ? (
                    <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
                ) : (
                    <Ionicons name={icon} size={20} color={colors.primary} />
                )}
            </View>
            <Text className="text-[10px] text-slate-400 font-revalia mb-1 uppercase tracking-wider">{label}</Text>
            <Text className="text-sm font-revalia text-slate-900 font-bold">{value}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Custom Top Bar */}
            <View
                className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-6"
                style={{ 
                    paddingTop: insets.top + 12,
                    zIndex: 100,
                    elevation: 10
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-12 h-12 rounded-2xl items-center justify-center border border-white/25"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="items-center justify-center">
                    <View className="px-4 py-1.5 rounded-full border border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <Text className="text-white text-[10px] font-bold tracking-[2px] uppercase">
                            {isEditing ? "Editing Asset" : "Asset Profile"}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={isEditing ? handleSave : () => navigation.navigate('CarDocuments', { car: carData })}
                    className="px-4 h-12 rounded-2xl items-center justify-center border border-white/25 flex-row"
                    style={{ backgroundColor: isEditing ? '#10B981' : 'rgba(255,255,255,0.15)' }}
                >
                    <Ionicons name={isEditing ? "checkmark" : "document-text-outline"} size={16} color="white" className="mr-1.5" />
                    <Text className="text-white text-xs font-bold uppercase tracking-wider font-revalia">
                        {isEditing ? "Save" : "Papers"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Header / Image Carousel Background Section */}
            <View 
                className="absolute top-0 left-0 right-0 overflow-hidden" 
                style={{ height: height * 0.75, zIndex: 1 }}
            >
                <LinearGradient
                    colors={[colors.primary, '#1E3A8A']}
                    className="absolute inset-0"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Glass Toggle for View Mode */}
                <View
                    className="absolute left-0 right-0 items-center z-50"
                    style={{ top: insets.top + 68 }}
                >
                    <View className="flex-row rounded-2xl p-1 w-64 border border-white/25" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                        <TouchableOpacity
                            onPress={() => setViewMode('images')}
                            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${viewMode === 'images' ? 'bg-white shadow-lg' : ''}`}
                        >
                            <Ionicons name="images" size={14} color={viewMode === 'images' ? colors.primary : 'rgba(255,255,255,0.7)'} className="mr-2" />
                            <Text className={`text-[10px] font-revalia ${viewMode === 'images' ? 'text-slate-900 font-bold' : 'text-white/70'}`}>Images</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setViewMode('3d')}
                            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${viewMode === '3d' ? 'bg-white shadow-lg' : ''}`}
                        >
                            <MaterialCommunityIcons name="rotate-360" size={16} color={viewMode === '3d' ? colors.primary : 'rgba(255,255,255,0.7)'} className="mr-2" />
                            <Text className={`text-[10px] font-revalia ${viewMode === '3d' ? 'text-slate-900 font-bold' : 'text-white/70'}`}>360° View</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-5 items-center" style={{ marginTop: insets.top + 115, height: 230 }}>
                    {viewMode === 'images' ? (
                        <>
                            <FlatList
                                ref={flatListRef}
                                data={carImages}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onViewableItemsChanged={onViewRef.current}
                                viewabilityConfig={viewConfigRef.current}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ width: width - 40, height: 200 }} className="bg-white/95 rounded-[32px] overflow-hidden justify-center items-center p-4 shadow-xl border border-white/40">
                                        <Image
                                            source={{ uri: item }}
                                            style={{ width: '100%', height: 160 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}
                            />

                            {/* Pagination Dots */}
                            <View className="flex-row justify-center items-center mt-2">
                                {carImages.map((_, index) => (
                                    <View
                                        key={index}
                                        className={`h-1.5 rounded-full mx-1.5 ${activeIndex === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </View>
                        </>
                    ) : carData.view360Url ? (
                        <View style={{ width: width - 40, height: 200, borderRadius: 32, overflow: 'hidden', backgroundColor: '#fff' }}>
                            <WebView
                                source={{ uri: carData.view360Url }}
                                style={{ flex: 1 }}
                                javaScriptEnabled
                                domStorageEnabled
                                startInLoadingState
                                allowsInlineMediaPlayback
                            />
                        </View>
                    ) : (
                        <View className="w-full h-full justify-center items-center">
                            <View style={{ width: width - 40, height: 200 }} className="bg-white rounded-[32px] justify-center items-center shadow-xl border border-slate-50">
                                <MaterialCommunityIcons name="axis-z-rotate-clockwise" size={80} color={colors.primary} opacity={0.1} />
                                <View className="absolute items-center">
                                    <View className="w-12 h-12 rounded-full bg-blue-50 justify-center items-center mb-2">
                                        <Ionicons name="car-sport" size={24} color={colors.primary} />
                                    </View>
                                    <Text className="text-[10px] font-revalia text-slate-400 uppercase tracking-widest text-center px-10">Add a 360° URL when registering the vehicle</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Scrollable details content overlay */}
            <ScrollView
                className="flex-1 bg-transparent"
                showsVerticalScrollIndicator={false}
                style={{
                    position: 'absolute',
                    top: height * 0.23,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    overflow: 'hidden'
                }}
            >
                {/* Transparent Spacer */}
                <View style={{ height: height * 0.23 }} />

                {/* Details Sheet White Container */}
                <View 
                    className="bg-white rounded-t-[40px] px-6 pt-5"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: -6 },
                        elevation: 10,
                        minHeight: height * 0.65,
                        paddingBottom: 140
                    }}
                >
                    {/* Handle */}
                    <View className="w-12 h-1.5 rounded-full bg-slate-200 self-center mb-6" />

                    {!isEditing ? (
                        /* ── NORMAL VIEW ── */
                        <>
                            {/* Title & Badge Section */}
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1 mr-4">
                                    <Text className="text-2xl font-revalia text-slate-900 font-bold leading-tight">{carData.name}</Text>
                                    <Text className="text-xs font-revalia text-slate-400 mt-1 uppercase tracking-wider">
                                        {carData.subtitle}
                                    </Text>
                                </View>
                                <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                    <Ionicons name="star" size={14} color="#FBBF24" />
                                    <Text className="ml-1 text-xs font-bold text-amber-800 font-revalia">{carData.rating}</Text>
                                </View>
                            </View>

                            {/* Status & Assigned Hub Row */}
                            <View className="flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                <View className="flex-row items-center flex-1 mr-2">
                                    <Ionicons name="location" size={16} color={colors.primary} className="mr-1.5" />
                                    <Text className="text-xs text-slate-700 font-revalia flex-1" numberOfLines={1}>{carData.location}</Text>
                                </View>
                                <View className="px-3 py-1 rounded-full flex-row items-center border" style={{ backgroundColor: carData.statusBg, borderColor: `${carData.statusColor}30` }}>
                                    <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: carData.statusColor }} />
                                    <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: carData.statusColor }}>
                                        {carData.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Description */}
                            <Text className="text-xs text-slate-500 leading-relaxed mb-6 font-revalia">
                                {carData.description}
                            </Text>

                            {/* Specifications Grid */}
                            <Text className="text-base font-revalia text-slate-900 font-bold mb-4">Specifications</Text>
                            <View className="flex-row flex-wrap justify-between mb-2">
                                {renderSpec('speedometer-outline', 'Top Speed', carData.specs.topSpeed)}
                                {renderSpec('flash-outline', '0-100 km/h', carData.specs.acceleration)}
                                {renderSpec('gas-station', 'Fuel Remaining', carData.specs.fuelLeft, true)}
                                {renderSpec('speedometer', 'Odometer Total', carData.specs.drivenKm, true)}
                            </View>

                            {/* AI Insights Advisor */}
                            <Text className="text-base font-revalia text-slate-900 font-bold mb-4">AI Advisor</Text>
                            <View className="rounded-2xl p-4 mb-6 border" style={{ backgroundColor: carData.aiPrediction.bg, borderColor: carData.aiPrediction.border }}>
                                <View className="flex-row items-center mb-1.5">
                                    <Ionicons name="sparkles" size={14} color="#D97706" className="mr-1.5" />
                                    <Text className="text-amber-900 text-xs font-bold font-revalia">
                                        AI Prediction · {carData.aiPrediction.level}
                                    </Text>
                                </View>
                                <Text className="text-slate-600 text-xs leading-relaxed">
                                    {carData.aiPrediction.tip}
                                </Text>
                            </View>

                            {/* Features List */}
                            <Text className="text-base font-revalia text-slate-900 font-bold mb-4">Installed Add-ons</Text>
                            <View className="flex-row flex-wrap">
                                {carData.features.map((feature, index) => (
                                    <View key={index} className="flex-row items-center w-1/2 mb-4">
                                        <View className="w-5 h-5 rounded-full bg-blue-50 items-center justify-center mr-2">
                                            <Ionicons name="checkmark" size={12} color={colors.primary} />
                                        </View>
                                        <Text className="text-xs text-slate-600 font-revalia">{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        /* ── EDIT VIEW (FORM) ── */
                        <View>
                            <Text className="text-lg font-revalia text-slate-900 font-bold mb-6 border-b border-slate-100 pb-3">
                                Edit Asset Profile
                            </Text>

                            {/* Status Selection */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Fleet Status</Text>
                            <View className="flex-row mb-5">
                                {['Available', 'On Rent', 'In Service'].map((st) => {
                                    const active = formData.status === st;
                                    const sc = getStatusColors(st);
                                    return (
                                        <TouchableOpacity
                                            key={st}
                                            activeOpacity={0.8}
                                            onPress={() => setFormData({ ...formData, status: st })}
                                            className="px-4 py-2.5 rounded-xl mr-2.5 border"
                                            style={{
                                                backgroundColor: active ? sc.bg : '#F8FAFC',
                                                borderColor: active ? sc.color : '#E2E8F0',
                                            }}
                                        >
                                            <Text className="text-xs font-bold tracking-wider font-revalia" style={{ color: active ? sc.color : '#64748B' }}>
                                                {st}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Name Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Car Name</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Subtitle Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Trim / Subtitle</Text>
                            <TextInput
                                value={formData.subtitle}
                                onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Price Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Daily Rate (₹)</Text>
                            <TextInput
                                value={String(formData.price)}
                                onChangeText={(text) => setFormData({ ...formData, price: text })}
                                keyboardType="numeric"
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Hub Location Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Assigned Hub Bay</Text>
                            <TextInput
                                value={formData.location}
                                onChangeText={(text) => setFormData({ ...formData, location: text })}
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Fuel Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Remaining Fuel Status</Text>
                            <TextInput
                                value={formData.fuelLeft}
                                onChangeText={(text) => setFormData({ ...formData, fuelLeft: text })}
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Driven Km Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Odometer (km)</Text>
                            <TextInput
                                value={formData.drivenKm}
                                onChangeText={(text) => setFormData({ ...formData, drivenKm: text })}
                                className="bg-slate-50 px-4 h-12 rounded-xl text-slate-900 text-xs mb-4 border border-slate-200 font-revalia"
                            />

                            {/* Description Input */}
                            <Text className="text-slate-700 text-xs font-bold mb-2">Asset Description</Text>
                            <TextInput
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                multiline
                                numberOfLines={3}
                                className="bg-slate-50 p-4 rounded-xl text-slate-900 text-xs mb-6 border border-slate-200 font-revalia"
                                style={{ textAlignVertical: 'top' }}
                            />

                            {/* Actions Row */}
                            <View className="flex-row space-x-3 mb-6">
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={handleCancel}
                                    className="flex-1 bg-slate-100 h-12 rounded-xl items-center justify-center mr-2"
                                >
                                    <Text className="text-slate-700 text-xs font-bold uppercase tracking-wider font-revalia">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={handleSave}
                                    className="flex-1 h-12 rounded-xl items-center justify-center ml-2"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <Text className="text-white text-xs font-bold uppercase tracking-wider font-revalia">
                                        Save Changes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Floating Glass Action Bar */}
            <View
                className="absolute left-6 right-6 h-20"
                style={{ bottom: insets.bottom + 20, zIndex: 100 }}
            >
                <GlassEffect
                    removeDefaultClasses={true}
                    className="flex-1 flex-row items-center justify-between px-6 rounded-[30px]"
                    style={{ flex: 1 }}
                >
                    <View>
                        <Text className="text-[10px] text-white/60 font-revalia uppercase tracking-widest">
                            {isEditing ? "Status" : "Daily Rate"}
                        </Text>
                        <View className="flex-row items-baseline mt-0.5">
                            <Text className="text-xl font-revalia text-white font-bold">
                                {isEditing ? "Editing Profile" : `₹${carData.price}`}
                            </Text>
                            {!isEditing && <Text className="text-xs text-white/60 font-revalia ml-1">/Day</Text>}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                        className="px-6 py-3.5 rounded-2xl flex-row items-center shadow-lg"
                        style={{ backgroundColor: isEditing ? '#10B981' : colors.primary }}
                    >
                        <Text className="text-white text-xs font-revalia font-bold uppercase tracking-wider">
                            {isEditing ? "Save Asset" : "Edit Asset"}
                        </Text>
                        <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={16} color="white" className="ml-2" />
                    </TouchableOpacity>
                </GlassEffect>
            </View>
        </View>
    );
};

export default ManageAssetScreen;
