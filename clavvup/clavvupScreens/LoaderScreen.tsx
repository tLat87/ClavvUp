import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';

const { width, height } = Dimensions.get('window');

interface LoaderScreenProps {
  onComplete: () => void;
}

export default function LoaderScreen({ onComplete }: LoaderScreenProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation (2 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      onComplete();
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '85%'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.content}>
          {/* Central Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            

            <Image source={require('../clavvupAssets/img/8906ebdc9141aa522b2d7a8d1aaf86e204bcaeb0.png')} style={{width: 300, height: 300}} resizeMode="contain" /> 
          </Animated.View>
        </View>

        {/* Bottom Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>
          
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a3a',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  prizeWheelContainer: {
    marginBottom: -30,
    zIndex: 2,
  },
  prizeWheel: {
    width: 120,
    height: 120,
    borderRadius: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  wheelSegment: {
    width: '20%',
    height: '20%',
  },
  wheelBorder: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFD700',
    top: -5,
    left: -5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
  },
  mainSign: {
    backgroundColor: '#DC143C',
    borderRadius: 20,
    padding: 30,
    paddingTop: 50,
    paddingBottom: 20,
    borderWidth: 4,
    borderColor: '#FFD700',
    minWidth: width * 0.8,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  signBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
  },
  clawUpContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  clawText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
  },
  upText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
  },
  bannerContainer: {
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginTop: 10,
    position: 'relative',
  },
  bannerBorder: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
  },
  lightBulb: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  lightBulbSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 50,
    backgroundColor: '#1e3a5f',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2d4a6f',
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4169E1',
    borderRadius: 25,
  },
  avatarContainer: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 40,
  },
});

