import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import AppText from './appText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONT_FAMILY_REVALIA } from '../constants/fonts';

const BookingCard = ({ booking, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="bg-white border border-slate-200/80 rounded-[28px] p-5 mb-4 shadow-sm overflow-hidden"
        >
            {/* Top Ticket Row: Client info & Status */}
            <View className="flex-row justify-between items-center border-b border-slate-100 pb-3.5 mb-3.5">
                <View className="flex-row items-center flex-1 mr-2">
                    <Image
                        source={{ uri: booking.clientAvatar }}
                        className="w-10 h-10 rounded-full border border-slate-200 mr-3"
                    />
                    <View className="flex-1 pr-1">
                        <View className="flex-row items-center">
                            <AppText weight="bold" className="text-slate-800 text-base mr-1.5" numberOfLines={1}>
                                {booking.client}
                            </AppText>
                            {booking.clientVerified && (
                                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            )}
                        </View>
                        <AppText weight="medium" className="text-slate-500 text-xs mt-0.5">
                            Booking ID: {booking.id}
                        </AppText>
                    </View>
                </View>
                <View
                    className="px-3 py-1.5 rounded-full border"
                    style={{ backgroundColor: `${booking.statusColor}15`, borderColor: `${booking.statusColor}30` }}
                >
                    <AppText weight="bold" className="text-[10px] tracking-wider uppercase" style={{ color: booking.statusColor }}>
                        {booking.status}
                    </AppText>
                </View>
            </View>

            {/* Middle Row: Car description & image preview */}
            <View className="flex-row items-center justify-between mb-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                <View className="flex-1 mr-3">
                    <AppText weight="bold" className="text-slate-900 text-sm mb-1" numberOfLines={1} style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        {booking.car.name}
                    </AppText>
                    <View className="flex-row items-center">
                        <View className="px-2 py-0.5 rounded bg-white border border-slate-200 mr-2">
                            <AppText weight="bold" className="text-slate-600 text-[10px]">
                                {booking.car.category}
                            </AppText>
                        </View>
                        <AppText weight="medium" className="text-slate-500 text-xs">
                            {booking.car.plate}
                        </AppText>
                    </View>
                </View>
                <Image
                    source={{ uri: booking.car.image }}
                    className="w-20 h-12 rounded-xl bg-slate-100"
                    resizeMode="contain"
                />
            </View>

            {/* Bottom Row: Dates & Price */}
            <View className="flex-row items-center justify-between pt-1">
                <View className="flex-row items-center flex-1 mr-2">
                    <Ionicons name="calendar-outline" size={15} color="#64748b" className="mr-2" />
                    <AppText weight="medium" className="text-slate-600 text-xs flex-1" numberOfLines={1}>
                        {booking.date}
                    </AppText>
                </View>
                <View className="items-end">
                    <AppText weight="bold" className="text-slate-900 text-base" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        {booking.price}
                    </AppText>
                    <AppText weight="medium" className="text-slate-500 text-[10px]">
                        Total Amount
                    </AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BookingCard;
