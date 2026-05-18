import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../../assets/colors';
import { FONT_FAMILY_REVALIA } from '../../constants/fonts';
import { mockClients, mockStaff } from '../../constants/peopleData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import ClientCard from '../../components/clientCard';
import WorkerCard from '../../components/workerCard';
import PayrollOverviewCard from '../../components/payrollOverviewCard';
import { CustomDateRangePickerModal } from '../../components/customPickers';

const TAB_ACTIVE_STYLE = {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
};

const PeopleScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('clients');
    const [staffList, setStaffList] = useState(mockStaff);


    const openClientDetail = (client) => {
        navigation.navigate('ClientDetail', { client });
    };

    const openWorkerDetail = (worker) => {
        navigation.navigate('WorkerDetail', { worker });
    };

    const openAddWorker = () => {
        navigation.navigate('AddWorker', {
            onWorkerAdded: (worker) => setStaffList((prev) => [worker, ...prev]),
        });
    };

    const renderClients = () => (
        <View className="flex-1">


            <ScrollView
                className="flex-1 px-6 pt-3"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ fontFamily: FONT_FAMILY_REVALIA }}
                >
                    Registered Clients ({mockClients.length})
                </Text>

                {mockClients.length === 0 ? (
                    <View className="bg-white rounded-3xl p-8 items-center justify-center mt-2" style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color="#94a3b8" />
                        <Text className="text-slate-800 text-sm font-bold mt-4" style={{ fontFamily: FONT_FAMILY_REVALIA }}>
                            No clients found
                        </Text>
                    </View>
                ) : (
                    mockClients.map((usr) => (
                        <ClientCard key={usr.id} client={usr} onPress={() => openClientDetail(usr)} />
                    ))
                )}
            </ScrollView>
        </View>
    );

    const renderStaff = () => {
        const totalSalary = staffList.reduce((sum, s) => sum + s.salary, 0);
        const pendingPayouts = staffList.reduce((sum, s) => sum + s.pendingPayout, 0);

        return (
            <ScrollView
                className="flex-1 px-6 pt-3"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <PayrollOverviewCard
                    totalSalary={totalSalary}
                    pendingPayouts={pendingPayouts}
                    staffCount={staffList.length}
                />

                <Text
                    className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ fontFamily: FONT_FAMILY_REVALIA }}
                >
                    Team Members ({staffList.length})
                </Text>

                {staffList.map((staff) => (
                    <WorkerCard key={staff.id} worker={staff} onPress={() => openWorkerDetail(staff)} />
                ))}
            </ScrollView>
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Header
                title="People & Team"
                subtitle="Clients & Staff Management"
                rightIcon={activeTab === 'clients' ? null : 'add'}
                onRightPress={() => (activeTab === 'clients' ? null : openAddWorker())}
            />

            <View className="px-6 pt-4 pb-2">
                <View className="flex-row p-1 rounded-2xl" style={{ backgroundColor: 'rgba(226, 232, 240, 0.6)' }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('clients')}
                        className="flex-1 py-2.5 items-center rounded-xl"
                        style={activeTab === 'clients' ? TAB_ACTIVE_STYLE : undefined}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{
                                fontFamily: FONT_FAMILY_REVALIA,
                                color: activeTab === 'clients' ? '#0f172a' : '#64748b',
                            }}
                        >
                            Clients
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('staff')}
                        className="flex-1 py-2.5 items-center rounded-xl"
                        style={activeTab === 'staff' ? TAB_ACTIVE_STYLE : undefined}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{
                                fontFamily: FONT_FAMILY_REVALIA,
                                color: activeTab === 'staff' ? '#0f172a' : '#64748b',
                            }}
                        >
                            Workers
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {activeTab === 'clients' ? renderClients() : renderStaff()}


        </View>
    );
};

const styles = StyleSheet.create({
    filterChip: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    analyticsCard: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    emptyState: {
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
});

export default PeopleScreen;
