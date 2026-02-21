/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { LoginPage, WorkoutPage } from './src/components';

const NOTIFICATION_PERMISSION_BOOTSTRAP_KEY = 'notification_permission_bootstrap_done_v1';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const ensureNotificationPermissionOnFirstLaunch = async () => {
      if (Platform.OS !== 'android' || Platform.Version < 33) return;

      const alreadyHandled = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_BOOTSTRAP_KEY);
      if (alreadyHandled === 'true') return;

      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } finally {
        await AsyncStorage.setItem(NOTIFICATION_PERMISSION_BOOTSTRAP_KEY, 'true');
      }
    };

    ensureNotificationPermissionOnFirstLaunch().catch((error) => {
      console.warn('Errore durante la richiesta del permesso notifiche', error);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (nextUser) => {
      setUser(nextUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  let content = <LoginPage />;

  if (initializing) {
    content = <ActivityIndicator size="large" />;
  } else if (user) {
    content = <WorkoutPage />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>{content}</View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
});

export default App;
