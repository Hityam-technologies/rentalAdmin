import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../assets/colors';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// CUSTOM DATE PICKER MODAL
export const CustomDatePickerModal = ({ visible, onClose, initialDate, minDate, onSelect }) => {
    // Parse initial date (e.g., "02 May 2026")
    const parseInitialDate = () => {
        if (!initialDate) return { day: 2, month: 4, year: 2026 }; // May 2026
        const parts = initialDate.split(' ');
        if (parts.length !== 3) return { day: 2, month: 4, year: 2026 };
        const day = parseInt(parts[0], 10);
        const monthIndex = MONTHS.indexOf(parts[1]);
        const year = parseInt(parts[2], 10);
        return { day, month: monthIndex !== -1 ? monthIndex : 4, year };
    };

    const parsed = parseInitialDate();
    const [currentMonth, setCurrentMonth] = useState(parsed.month);
    const [currentYear, setCurrentYear] = useState(parsed.year);
    const [selectedDay, setSelectedDay] = useState(parsed.day);

    // Parse minDate prop (defaults to today)
    const parseMinDate = () => {
        const today = new Date();
        if (!minDate) {
            return { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
        }
        const parts = minDate.split(' ');
        if (parts.length !== 3) {
            return { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
        }
        const day = parseInt(parts[0], 10);
        const monthIndex = MONTHS.indexOf(parts[1]);
        const year = parseInt(parts[2], 10);
        return { day, month: monthIndex !== -1 ? monthIndex : today.getMonth(), year };
    };

    const minDateObj = parseMinDate();

    // Check if a specific cell day is in the past
    const isPast = (day) => {
        if (currentYear < minDateObj.year) return true;
        if (currentYear > minDateObj.year) return false;
        
        if (currentMonth < minDateObj.month) return true;
        if (currentMonth > minDateObj.month) return false;
        
        return day < minDateObj.day;
    };

    // Sync with initialDate prop changes when modal opens
    useEffect(() => {
        if (visible) {
            const freshParsed = parseInitialDate();
            setCurrentMonth(freshParsed.month);
            setCurrentYear(freshParsed.year);
            setSelectedDay(freshParsed.day);
        }
    }, [visible, initialDate]);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

    const handlePrevMonth = () => {
        // Prevent navigating to previous month if it falls before minDate's month and year
        if (currentYear < minDateObj.year || (currentYear === minDateObj.year && currentMonth <= minDateObj.month)) {
            return;
        }

        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleDaySelect = (day) => {
        if (isPast(day)) return;
        setSelectedDay(day);
    };

    const handleConfirm = () => {
        const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
        const monthName = MONTHS[currentMonth];
        const selectedDateStr = `${formattedDay} ${monthName} ${currentYear}`;
        onSelect(selectedDateStr);
        onClose();
    };

    // Construct the calendar grid cells
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
        cells.push({ type: 'empty', key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({ type: 'day', day, key: `day-${day}` });
    }

    const isPrevMonthDisabled = currentYear < minDateObj.year || (currentYear === minDateObj.year && currentMonth <= minDateObj.month);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {visible && (
            <Pressable className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={onClose}>
                <Pressable 
                    className="w-[90%] bg-white rounded-[32px] p-6"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.25, shadowRadius: 50, elevation: 24 }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Revalia-Regular' }}>Select Date</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                            <Ionicons name="close" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Month Navigator */}
                    <View className="flex-row justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl mb-4">
                        <TouchableOpacity 
                            onPress={handlePrevMonth} 
                            className="w-8 h-8 items-center justify-center"
                            style={{ opacity: isPrevMonthDisabled ? 0.25 : 1 }}
                            disabled={isPrevMonthDisabled}
                        >
                            <Ionicons name="chevron-back" size={20} color="#1E293B" />
                        </TouchableOpacity>
                        <Text className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Revalia-Regular' }}>
                            {MONTHS[currentMonth]} {currentYear}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth} className="w-8 h-8 items-center justify-center">
                            <Ionicons name="chevron-forward" size={20} color="#1E293B" />
                        </TouchableOpacity>
                    </View>

                    {/* Weekdays Indicator */}
                    <View className="flex-row justify-between mb-2">
                        {WEEKDAYS.map((day, idx) => (
                            <View key={idx} className="w-[12%] items-center">
                                <Text className="text-[11px] font-bold text-slate-400" style={{ fontFamily: 'Revalia-Regular' }}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Grid Days */}
                    <View className="flex-row flex-wrap justify-start">
                        {cells.map((cell) => {
                            if (cell.type === 'empty') {
                                return <View key={cell.key} className="w-[14.28%] h-10" />;
                            }

                            const cellIsPast = isPast(cell.day);
                            const isSelected = selectedDay === cell.day && 
                                               currentMonth === parsed.month && 
                                               currentYear === parsed.year &&
                                               !cellIsPast;

                            return (
                                <TouchableOpacity
                                    key={cell.key}
                                    disabled={cellIsPast}
                                    onPress={() => handleDaySelect(cell.day)}
                                    className={`w-[14.28%] h-10 items-center justify-center rounded-xl mb-1 ${
                                        isSelected ? 'bg-blue-600' : 'active:bg-slate-50'
                                    }`}
                                    style={{ opacity: cellIsPast ? 0.22 : 1 }}
                                >
                                    <Text 
                                        className={`text-xs font-bold ${
                                            isSelected ? 'text-white' : 'text-slate-800'
                                        }`} 
                                        style={{ fontFamily: 'Revalia-Regular' }}
                                    >
                                        {cell.day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] bg-slate-100 my-4" />

                    {/* Action buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="flex-1 bg-slate-50 py-3.5 rounded-2xl items-center justify-center border border-slate-100"
                        >
                            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleConfirm}
                            className="flex-1 bg-black py-3.5 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
            )}
        </Modal>
    );
};


// CUSTOM TIME PICKER MODAL
const TIME_SLOTS = [
    { title: 'Morning', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'] },
    { title: 'Afternoon', slots: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'] },
    { title: 'Evening', slots: ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] }
];

export const CustomTimePickerModal = ({ visible, onClose, initialTime, minTime, onSelect }) => {
    const [selectedTime, setSelectedTime] = useState(initialTime || '10:00 AM');

    // Parse time string to total minutes from midnight for math comparisons
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const minTimeVal = minTime ? timeToMinutes(minTime) : 0;

    // Reset and enforce future slot defaults when modal is shown
    useEffect(() => {
        if (visible) {
            const defaultTime = initialTime || '10:00 AM';
            const defaultTimeMin = timeToMinutes(defaultTime);
            const limit = minTime ? timeToMinutes(minTime) : 0;
            
            if (defaultTimeMin < limit) {
                // Initial target is in the past, auto-find first future slot
                let foundSlot = null;
                for (const group of TIME_SLOTS) {
                    for (const slot of group.slots) {
                        if (timeToMinutes(slot) >= limit) {
                            foundSlot = slot;
                            break;
                        }
                    }
                    if (foundSlot) break;
                }
                setSelectedTime(foundSlot || '09:00 PM');
            } else {
                setSelectedTime(defaultTime);
            }
        }
    }, [visible, initialTime, minTime]);

    const handleConfirm = () => {
        onSelect(selectedTime);
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {visible && (
            <Pressable className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={onClose}>
                <Pressable 
                    className="w-[90%] max-h-[70%] bg-white rounded-[32px] p-6"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.25, shadowRadius: 50, elevation: 24 }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Revalia-Regular' }}>Select Time</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                            <Ionicons name="close" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Slots Grid */}
                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        {TIME_SLOTS.map((group, groupIdx) => (
                            <View key={groupIdx} className="mb-4">
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5" style={{ fontFamily: 'Revalia-Regular' }}>{group.title}</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {group.slots.map((time, slotIdx) => {
                                        const isSelected = selectedTime === time;
                                        const isPastSlot = minTime ? (timeToMinutes(time) < minTimeVal) : false;
                                        return (
                                            <TouchableOpacity
                                                key={slotIdx}
                                                disabled={isPastSlot}
                                                onPress={() => setSelectedTime(time)}
                                                className={`px-4 py-2.5 rounded-xl border ${
                                                    isSelected 
                                                        ? 'bg-blue-600 border-blue-600' 
                                                        : 'bg-slate-50 border-slate-100 active:bg-slate-100'
                                                }`}
                                                style={{ width: '31%', opacity: isPastSlot ? 0.22 : 1 }}
                                            >
                                                <Text 
                                                    className={`text-[10px] font-bold text-center ${
                                                        isSelected ? 'text-white' : 'text-slate-700'
                                                    }`}
                                                    style={{ fontFamily: 'Revalia-Regular' }}
                                                >
                                                    {time}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Action buttons */}
                    <View className="flex-row gap-3 mt-2">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="flex-1 bg-slate-50 py-3.5 rounded-2xl items-center justify-center border border-slate-100"
                        >
                            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleConfirm}
                            className="flex-1 bg-black py-3.5 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
            )}
        </Modal>
    );
};


// CUSTOM DATE RANGE PICKER MODAL
export const CustomDateRangePickerModal = ({ visible, onClose, initialRange, onSelect }) => {
    const [fromDate, setFromDate] = useState(initialRange?.from || null);
    const [toDate, setToDate] = useState(initialRange?.to || null);
    const [activePicker, setActivePicker] = useState(null); // 'from' | 'to' | null

    useEffect(() => {
        if (visible) {
            setFromDate(initialRange?.from || null);
            setToDate(initialRange?.to || null);
        }
    }, [visible, initialRange]);

    const handleConfirm = () => {
        onSelect({ from: fromDate, to: toDate });
        onClose();
    };

    const handleReset = () => {
        setFromDate(null);
        setToDate(null);
        onSelect({ from: null, to: null });
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {visible && (
            <>
            <Pressable className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={onClose}>
                <Pressable 
                    className="w-[90%] bg-white rounded-[32px] p-6"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.25, shadowRadius: 50, elevation: 24 }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Revalia-Regular' }}>Filter by Date Range</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                            <Ionicons name="close" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* From Date Selector */}
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: 'Revalia-Regular' }}>Start Date (From)</Text>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() => setActivePicker('from')}
                        className="flex-row items-center justify-between bg-slate-50 border rounded-2xl px-4 py-3.5 mb-4"
                        style={{ borderColor: 'rgba(226, 232, 240, 0.8)' }}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={18} color={fromDate ? "#2563eb" : "#64748b"} className="mr-3" />
                            <Text className={`text-xs font-bold ${fromDate ? 'text-slate-800' : 'text-slate-400'}`} style={{ fontFamily: 'Revalia-Regular' }}>
                                {fromDate || 'Select start date...'}
                            </Text>
                        </View>
                        {fromDate && (
                            <TouchableOpacity onPress={() => setFromDate(null)}>
                                <Ionicons name="close-circle" size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* To Date Selector */}
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: 'Revalia-Regular' }}>End Date (To)</Text>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() => setActivePicker('to')}
                        className="flex-row items-center justify-between bg-slate-50 border rounded-2xl px-4 py-3.5 mb-6"
                        style={{ borderColor: 'rgba(226, 232, 240, 0.8)' }}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={18} color={toDate ? "#2563eb" : "#64748b"} className="mr-3" />
                            <Text className={`text-xs font-bold ${toDate ? 'text-slate-800' : 'text-slate-400'}`} style={{ fontFamily: 'Revalia-Regular' }}>
                                {toDate || 'Select end date...'}
                            </Text>
                        </View>
                        {toDate && (
                            <TouchableOpacity onPress={() => setToDate(null)}>
                                <Ionicons name="close-circle" size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* Action buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity 
                            onPress={handleReset}
                            className="flex-1 bg-slate-50 py-3.5 rounded-2xl items-center justify-center border border-slate-100"
                        >
                            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleConfirm}
                            className="flex-1 bg-black py-3.5 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Revalia-Regular' }}>Apply Filter</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>

            {/* Sub-picker modal */}
            <CustomDatePickerModal
                visible={activePicker !== null}
                onClose={() => setActivePicker(null)}
                initialDate={activePicker === 'from' ? fromDate : toDate}
                minDate="01 January 2025"
                onSelect={(dateStr) => {
                    if (activePicker === 'from') setFromDate(dateStr);
                    else setToDate(dateStr);
                    setActivePicker(null);
                }}
            />
            </>
            )}
        </Modal>
    );
};
