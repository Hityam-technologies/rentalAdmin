import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/loginScreen';
import TabNavigator from './tabNavigator';
import ForgotPasswordScreen from '../auth/forgotPasswordScreen';
import ManageAssetScreen from '../private/carsTab/manageAssetScreen';
import CarDocumentsScreen from '../private/carsTab/carDocumentsScreen';
import CarDocumentDetailScreen from '../private/carsTab/carDocumentDetailScreen';
import BookingDetailScreen from '../private/bookingsTab/bookingDetailScreen';
import ClientDetailScreen from '../private/peopleTab/clientDetailScreen';
import WorkerDetailScreen from '../private/peopleTab/workerDetailScreen';
import AddWorkerScreen from '../private/peopleTab/addWorkerScreen';
import AddCarScreen from '../private/carsTab/addCarScreen';
import NotificationsScreen from '../private/dashboardTab/notificationsScreen';
import SettingsScreen from '../private/dashboardTab/settingsScreen';
import AiAssistantScreen from '../private/aiTab/aiAssistantScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#09090B' },
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ManageAsset" component={ManageAssetScreen} />
            <Stack.Screen name="CarDocuments" component={CarDocumentsScreen} />
            <Stack.Screen name="CarDocumentDetail" component={CarDocumentDetailScreen} />
            <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
            <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
            <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen} />
            <Stack.Screen name="AddWorker" component={AddWorkerScreen} />
            <Stack.Screen name="AddCar" component={AddCarScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
                name="AiAssistant"
                component={AiAssistantScreen}
                options={{ animation: 'slide_from_bottom' }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;
