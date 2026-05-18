import './global.css';
import './src/utils/nativewindInterop';
import React, { useEffect, useState, useRef } from 'react';
import { useColorScheme, AppState, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/rootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './src/components/appText';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLocked, setIsLocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const appState = useRef(AppState.currentState);

  const authenticate = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate to access Admin Center' });
      if (success) {
        setIsLocked(false);
      }
    } catch (error) {
      console.log('Biometrics failed', error);
    }
  };

  const checkBiometrics = async () => {
    try {
      const value = await AsyncStorage.getItem('biometricsEnabled');
      if (value === 'true') {
        setIsLocked(true);
        authenticate();
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error(e);
      setIsLocked(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBiometrics();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkBiometrics();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {isLocked ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090B' }}>
          <Ionicons name="lock-closed" size={64} color="#3b82f6" style={{ marginBottom: 24 }} />
          <AppText weight="bold" style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>App Locked</AppText>
          <AppText weight="medium" style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>Please authenticate to continue</AppText>
          <TouchableOpacity
            onPress={authenticate}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 14,
              backgroundColor: '#3b82f6',
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Ionicons name="finger-print" size={20} color="white" style={{ marginRight: 8 }} />
            <AppText weight="bold" style={{ color: 'white', fontSize: 15 }}>Unlock App</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

export default App;
