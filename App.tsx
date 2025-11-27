/**
 * ClavvUp App
 * Small steps, real change.
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './clavvup/clavvupScreens/OnboardingScreen';
import AppNavigator from './clavvup/clavvupNavigation/AppNavigator';
import { isOnboardingComplete } from './clavvup/clavvupUtils/storage';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const prepareAppState = async () => {
      const onboardingDone = await isOnboardingComplete();
      setShowOnboarding(!onboardingDone);
      setIsInitializing(false);
    };

    prepareAppState();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isInitializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
}

export default App;
