import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import AppText from '../../components/appText';
import BookingCard from '../../components/bookingCard';
import { CustomDateRangePickerModal } from '../../components/customPickers';
import { adminBookingsList } from '../../constants/data';

const BookingsScreen = ({ navigation }) => {
    // Admin filtering state
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // 'All', 'Pending', 'Approved', 'Completed'
    const [selectedTimelineFilter, setSelectedTimelineFilter] = useState('All'); // 'All', 'Today', 'This Week', 'This Month'
    const [searchQuery, setSearchQuery] = useState('');
    const [isRangeModalVisible, setIsRangeModalVisible] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState({ from: null, to: null });

    const statusFilters = ['All', 'Pending', 'Approved', 'Completed'];
    const timelineFilters = ['All', 'Today', 'This Week', 'This Month'];

    // Filtering algorithm
    const filteredBookings = adminBookingsList.filter(booking => {
        // Search query match
        const matchesSearch = booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchQuery.toLowerCase());

        // Status match
        const matchesStatus = selectedStatusFilter === 'All' || booking.status === selectedStatusFilter;

        // Timeline match
        const matchesTimeline = selectedTimelineFilter === 'All' || booking.dateRange === selectedTimelineFilter;

        // Date range match
        let matchesDate = true;
        if (selectedDateRange && (selectedDateRange.from || selectedDateRange.to)) {
            if (booking && booking.date && typeof booking.date === 'string') {
                const parts = booking.date.split('-');
                if (parts.length >= 1) {
                    const startPart = parts[0].trim();
                    const yearMatch = booking.date.match(/\d{4}/);
                    const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
                    const bookingTimestamp = new Date(`${startPart}, ${year}`).getTime();

                    if (!isNaN(bookingTimestamp)) {
                        if (selectedDateRange.from) {
                            const fromTimestamp = new Date(selectedDateRange.from).getTime();
                            if (bookingTimestamp < fromTimestamp) matchesDate = false;
                        }
                        if (selectedDateRange.to) {
                            const toTimestamp = new Date(selectedDateRange.to).getTime();
                            if (bookingTimestamp > toTimestamp) matchesDate = false;
                        }
                    }
                }
            } else {
                matchesDate = false;
            }
        }

        return matchesSearch && matchesStatus && matchesTimeline && matchesDate;
    });

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <Header
                title="Bookings Management"
                subtitle="Reservations Dashboard"
                rightIcon="calendar-outline"
                rightBadge={Boolean(selectedDateRange && (selectedDateRange.from || selectedDateRange.to))}
                onRightPress={() => setIsRangeModalVisible(true)}
            />

            {/* Filter Section & List */}
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* Search Bar */}
                <View className="px-6 pt-5 pb-4">
                    <View className="flex-row bg-white border border-slate-200/80 rounded-2xl items-center px-4 py-2 shadow-sm">
                        <Ionicons name="search-outline" size={18} color="#64748b" className="mr-2" />
                        <TextInput
                            placeholder="Search customer, car, or booking ID..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-slate-800 text-xs py-2 font-revalia"
                            style={{ fontFamily: FONT_FAMILY_REVALIA }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                                <Ionicons name="close-circle" size={16} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Filter 1: Status Category Scroll */}
                <View className="mb-4">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-6 mb-2 font-revalia" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Reservation Status
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                    >
                        {statusFilters.map((filter) => {
                            const isSelected = selectedStatusFilter === filter;
                            let accentColor = 'bg-white border-slate-200 shadow-sm';
                            if (isSelected) {
                                if (filter === 'Pending') accentColor = 'bg-amber-500 border-amber-600 shadow-sm';
                                else if (filter === 'Approved') accentColor = 'bg-emerald-600 border-emerald-700 shadow-sm';
                                else if (filter === 'Completed') accentColor = 'bg-indigo-600 border-indigo-700 shadow-sm';
                                else accentColor = 'bg-blue-600 border-blue-700 shadow-sm';
                            }

                            return (
                                <TouchableOpacity
                                    key={filter}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedStatusFilter(filter)}
                                    className={`px-4 py-2.5 rounded-xl mr-2.5 border ${accentColor}`}
                                >
                                    <AppText weight="bold" className={`text-xs tracking-wider uppercase ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                                        {filter}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Filter 2: Timeline Scroll */}
                <View className="mb-6">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-6 mb-2 font-revalia" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                        Filter by Timeline
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                    >
                        {timelineFilters.map((filter) => {
                            const isSelected = selectedTimelineFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedTimelineFilter(filter)}
                                    className={`px-4 py-2.5 rounded-xl mr-2.5 border ${isSelected
                                        ? 'bg-blue-600 border-blue-700 shadow-sm'
                                        : 'bg-white border-slate-200 shadow-sm'
                                        }`}
                                >
                                    <AppText weight="bold" className={`text-xs tracking-wider uppercase ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                                        {filter}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Active Date Range Filter Chip */}
                {selectedDateRange && (selectedDateRange.from || selectedDateRange.to) && (
                    <View className="px-6 mb-4 flex-row items-center">
                        <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 shadow-sm">
                            <Ionicons name="calendar" size={14} color="#2563eb" className="mr-2" />
                            <AppText weight="bold" className="text-blue-700 text-xs mr-2">
                                Date: {selectedDateRange.from || 'Any'} → {selectedDateRange.to || 'Any'}
                            </AppText>
                            <TouchableOpacity onPress={() => setSelectedDateRange({ from: null, to: null })}>
                                <Ionicons name="close-circle" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Bookings Results Header */}
                <View className="px-6 flex-row justify-between items-center mb-4">
                    <AppText weight="bold" className="text-slate-500 text-xs tracking-wider uppercase">
                        Active Reservations ({filteredBookings.length})
                    </AppText>
                    {(selectedStatusFilter !== 'All' || selectedTimelineFilter !== 'All' || (selectedDateRange && (selectedDateRange.from !== null || selectedDateRange.to !== null)) || searchQuery !== '') && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setSelectedStatusFilter('All');
                                setSelectedTimelineFilter('All');
                                setSelectedDateRange({ from: null, to: null });
                                setSearchQuery('');
                            }}
                        >
                            <AppText weight="bold" className="text-blue-600 text-xs">Clear Filters</AppText>
                        </TouchableOpacity>
                    )}
                </View>

                {/* List of Booking Cards */}
                <View className="px-6">
                    {filteredBookings.length === 0 ? (
                        <View className="bg-white border border-slate-200/80 rounded-3xl p-8 items-center justify-center mt-4 shadow-sm">
                            <Ionicons name="folder-open-outline" size={48} color="#94a3b8" />
                            <AppText weight="bold" className="text-slate-800 text-sm mt-4">No reservations found</AppText>
                            <AppText weight="medium" className="text-slate-500 text-xs text-center mt-1">Try relaxing your search query or filter tags.</AppText>
                        </View>
                    ) : (
                        filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onPress={() => navigation.navigate('BookingDetail', { booking })}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            <CustomDateRangePickerModal
                visible={isRangeModalVisible}
                onClose={() => setIsRangeModalVisible(false)}
                initialRange={selectedDateRange}
                onSelect={(range) => setSelectedDateRange(range)}
            />
        </View>
    );
};

export default BookingsScreen;
