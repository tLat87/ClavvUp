import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Switch,
  Animated,
} from 'react-native';
import { getSettings, saveSettings } from '../clavvupUtils/storage';
import { AppSettings } from '../clavvupTypes';
import { Share } from 'react-native';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';
import TwinklingStars from '../clavvupComponents/TwinklingStars';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    vibrationEnabled: true,
    notificationsEnabled: true,
    notificationTime: '09:00',
  });
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3200,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();
    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerAnim]);

  const loadSettings = async () => {
    const savedSettings = await getSettings();
    setSettings(savedSettings);
  };

  const updateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleVibrationToggle = (value: boolean) => {
    updateSettings({ ...settings, vibrationEnabled: value });
  };

  const handleNotificationsToggle = (value: boolean) => {
    updateSettings({ ...settings, notificationsEnabled: value });
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out ClavvUp - Small steps, real change!',
        title: 'Share ClavvUp',
      });
    } catch (error) {
      // User cancelled
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <TwinklingStars count={28} />
        <View style={styles.contentWrapper}>
          {/* Main Settings Panel with Golden Marquee Border */}
          <View style={styles.settingsPanel}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.panelShimmer,
                {
                  transform: [
                    {
                      translateX: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width, width],
                      }),
                    },
                  ],
                  opacity: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.15],
                  }),
                },
              ]}
            />
            {/* Marquee Lights Border Effect */}
            <View style={styles.marqueeLightsContainer}>
              {/* Top lights */}
              {[...Array(10)].map((_, i) => (
                <View
                  key={`top-${i}`}
                  style={[
                    styles.lightBulb,
                    {
                      top: -6,
                      left: `${(i + 1) * (100 / 11)}%`,
                    },
                  ]}
                />
              ))}
              {/* Right lights */}
              {[...Array(6)].map((_, i) => (
                <View
                  key={`right-${i}`}
                  style={[
                    styles.lightBulb,
                    {
                      right: -6,
                      top: `${(i + 1) * (100 / 7)}%`,
                    },
                  ]}
                />
              ))}
              {/* Bottom lights */}
              {[...Array(10)].map((_, i) => (
                <View
                  key={`bottom-${i}`}
                  style={[
                    styles.lightBulb,
                    {
                      bottom: -6,
                      left: `${(i + 1) * (100 / 11)}%`,
                    },
                  ]}
                />
              ))}
              {/* Left lights */}
              {[...Array(6)].map((_, i) => (
                <View
                  key={`left-${i}`}
                  style={[
                    styles.lightBulb,
                    {
                      left: -6,
                      top: `${(i + 1) * (100 / 7)}%`,
                    },
                  ]}
                />
              ))}
            </View>
            
            {/* Title */}
            <Text style={styles.panelTitle}>Settings</Text>

            {/* Vibration Option */}
            <View style={styles.menuItem}>
              <Text style={styles.menuText}>Vibration</Text>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={handleVibrationToggle}
                trackColor={{ false: '#767577', true: '#FFD700' }}
                thumbColor={settings.vibrationEnabled ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
              />
            </View>

            {/* Notifications Option */}
            <View style={styles.menuItem}>
              <Text style={styles.menuText}>Notifications</Text>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: '#767577', true: '#FFD700' }}
                thumbColor={settings.notificationsEnabled ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
              />
            </View>

            {/* Share App Option */}
            <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={handleShareApp}>
              <Text style={styles.menuText}>Share App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a2e',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settingsPanel: {
    backgroundColor: '#DC143C',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    position: 'relative',
    overflow: 'visible',
  },
  panelShimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 20,
    opacity: 0.05,
  },
  marqueeLightsContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
  },
  lightBulb: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});
