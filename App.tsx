/**
 * ClavvUp App
 * Small steps, real change.
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoaderScreen from './clavvup/clavvupScreens/LoaderScreen';
import OnboardingScreen from './clavvup/clavvupScreens/OnboardingScreen';
import AppNavigator from './clavvup/clavvupNavigation/AppNavigator';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setShowOnboarding(true); 
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {showLoader ? (
        <LoaderScreen onComplete={handleLoaderComplete} />
      ) : showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
}

export default App;
