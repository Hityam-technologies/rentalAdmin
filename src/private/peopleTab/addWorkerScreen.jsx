import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
    StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import AppText from '../../components/appText';
import AdminFormField from '../../components/adminFormField';
import { CustomDatePickerModal } from '../../components/customPickers';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';

const ROLES = [
    'Fleet Manager',
    'Senior Mechanic',
    'Delivery Driver',
    'Dispatcher',
    'Workshop Lead',
    'Customer Support',
];

const STATUSES = ['Active', 'On Leave'];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const parseDisplayDateToIso = (displayDate) => {
    if (!displayDate) return new Date().toISOString().slice(0, 10);
    const parts = displayDate.split(' ');
    if (parts.length !== 3) return new Date().toISOString().slice(0, 10);
    const day = parts[0];
    const monthIndex = MONTHS.indexOf(parts[1]) + 1;
    const year = parts[2];
    const month = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    return `${year}-${month}-${day}`;
};

const formatTodayDisplay = () => {
    const d = new Date();
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const ChipGroup = ({ label, options, value, onChange }) => (
    <View style={styles.chipSection}>
        <AppText weight="bold" className="text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 11 }}>
            {label}
        </AppText>
        <View style={styles.chipRow}>
            {options.map((option) => {
                const selected = value === option;
                return (
                    <TouchableOpacity
                        key={option}
                        activeOpacity={0.85}
                        onPress={() => onChange(option)}
                        style={[styles.chip, selected && styles.chipSelected]}
                    >
                        <AppText
                            weight="bold"
                            style={{
                                fontSize: 12,
                                color: selected ? '#FFFFFF' : '#475569',
                            }}
                        >
                            {option}
                        </AppText>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
);

const AddWorkerScreen = ({ navigation, route }) => {
    const onWorkerAdded = route.params?.onWorkerAdded;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('Delivery Driver');
    const [status, setStatus] = useState('Active');
    const [salary, setSalary] = useState('');
    const [joinDate, setJoinDate] = useState(formatTodayDisplay());
    const [overview, setOverview] = useState('');
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const next = {};
        if (!name.trim()) next.name = 'Full name is required';
        if (!phone.trim()) next.phone = 'Phone number is required';
        else if (phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone number';
        if (!salary.trim()) next.salary = 'Monthly salary is required';
        else if (Number.isNaN(Number(salary.replace(/,/g, ''))) || Number(salary.replace(/,/g, '')) <= 0) {
            next.salary = 'Enter a valid salary amount';
        }
        if (!overview.trim()) next.overview = 'Add a short role overview';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const salaryNum = Number(salary.replace(/,/g, ''));
        const newWorker = {
            id: `STF-${Date.now().toString().slice(-4)}`,
            name: name.trim(),
            phone: phone.trim(),
            role,
            joinedDate: parseDisplayDateToIso(joinDate),
            status,
            salary: salaryNum,
            pendingPayout: 0,
            lastPayout: '—',
            logs: [],
            overview: overview.trim(),
        };

        if (typeof onWorkerAdded === 'function') {
            onWorkerAdded(newWorker);
        }

        Alert.alert('Worker added', `${newWorker.name} has been added to your team.`, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                title="Add Worker"
                subtitle="New team member"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={24}
            >
                {/* Intro banner */}
                <View style={styles.introCard}>
                    <View style={styles.introIcon}>
                        <Ionicons name="person-add" size={22} color={colors.primary} />
                    </View>
                    <View className="flex-1 ml-3">
                        <AppText
                            weight="bold"
                            className="text-slate-900"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 14 }}
                        >
                            Onboard a team member
                        </AppText>
                        <AppText weight="medium" className="text-slate-500 mt-1" style={{ fontSize: 13, lineHeight: 18 }}>
                            Add payroll, contact, and role details. You can edit payouts later from their profile.
                        </AppText>
                    </View>
                </View>

                {/* Personal */}
                <View style={styles.sectionCard}>
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="person-outline" size={16} color={colors.primary} />
                        <AppText
                            weight="bold"
                            className="text-slate-900 ml-2 uppercase tracking-wider"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
                        >
                            Personal info
                        </AppText>
                    </View>

                    <AdminFormField
                        label="Full name"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Ramesh Kumar"
                        autoCapitalize="words"
                        error={Boolean(errors.name)}
                        errorMessage={errors.name}
                    />
                    <AdminFormField
                        label="Phone number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+91 98765 43210"
                        keyboardType="phone-pad"
                        error={Boolean(errors.phone)}
                        errorMessage={errors.phone}
                    />
                </View>

                {/* Employment */}
                <View style={styles.sectionCard}>
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                        <AppText
                            weight="bold"
                            className="text-slate-900 ml-2 uppercase tracking-wider"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
                        >
                            Employment
                        </AppText>
                    </View>

                    <ChipGroup label="Role" options={ROLES} value={role} onChange={setRole} />
                    <ChipGroup label="Status" options={STATUSES} value={status} onChange={setStatus} />

                    <AppText weight="bold" className="text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 11 }}>
                        Join date
                    </AppText>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setIsDatePickerVisible(true)}
                        style={styles.dateBtn}
                    >
                        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                        <AppText weight="semibold" className="text-slate-800 ml-2" style={{ fontSize: 14 }}>
                            {joinDate}
                        </AppText>
                        <Ionicons name="chevron-down" size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                </View>

                {/* Compensation */}
                <View style={styles.sectionCard}>
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="wallet-outline" size={16} color={colors.primary} />
                        <AppText
                            weight="bold"
                            className="text-slate-900 ml-2 uppercase tracking-wider"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
                        >
                            Compensation
                        </AppText>
                    </View>

                    <AdminFormField
                        label="Monthly salary (₹)"
                        value={salary}
                        onChangeText={(t) => setSalary(t.replace(/[^0-9]/g, ''))}
                        placeholder="e.g. 32000"
                        keyboardType="number-pad"
                        error={Boolean(errors.salary)}
                        errorMessage={errors.salary}
                    />

                    <View style={styles.salaryHint}>
                        <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                        <AppText weight="medium" className="text-slate-500 ml-2 flex-1" style={{ fontSize: 12, lineHeight: 17 }}>
                            Base salary is used for payroll overview and monthly payout calculations.
                        </AppText>
                    </View>
                </View>

                {/* Notes */}
                <View style={styles.sectionCard}>
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                        <AppText
                            weight="bold"
                            className="text-slate-900 ml-2 uppercase tracking-wider"
                            style={{ fontFamily: FONT_FAMILY_REVALIA, fontSize: 12 }}
                        >
                            Role overview
                        </AppText>
                    </View>

                    <AdminFormField
                        label="Responsibilities & notes"
                        value={overview}
                        onChangeText={setOverview}
                        placeholder="Brief description of duties and experience..."
                        multiline
                        numberOfLines={4}
                        error={Boolean(errors.overview)}
                        errorMessage={errors.overview}
                    />
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={handleSave} style={styles.saveBtn}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <AppText weight="bold" className="text-white ml-2 uppercase tracking-wider" style={{ fontSize: 13 }}>
                        Save team member
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                    <AppText weight="bold" className="text-slate-500" style={{ fontSize: 13 }}>
                        Cancel
                    </AppText>
                </TouchableOpacity>
            </KeyboardAwareScrollView>

            <CustomDatePickerModal
                visible={isDatePickerVisible}
                onClose={() => setIsDatePickerVisible(false)}
                initialDate={joinDate}
                minDate="01 January 2020"
                onSelect={setJoinDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 48,
    },
    introCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#eff6ff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    introIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    chipSection: {
        marginBottom: 14,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 4,
    },
    salaryHint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    cancelBtn: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 4,
    },
});

export default AddWorkerScreen;
