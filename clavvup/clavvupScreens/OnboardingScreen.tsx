import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';
import TwinklingStars from '../clavvupComponents/TwinklingStars';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    title: 'Start small, grow steady',
    description: 'Every day begins with three simple quests — small actions that shape a stronger, calmer, more focused you.',
    buttonText: 'Next',
  },
  {
    title: 'Words that move you',
    description: 'Each day brings a new phrase to remind you why you started. Sometimes gentle, sometimes bold — always exactly what you need.',
    buttonText: 'Next',
  },
  {
    title: 'A spark of surprise',
    description: 'Once a day, let the claw choose a random challenge for you. A small twist of fate to keep things playful and unexpected.',
    buttonText: 'Next',
  },
  {
    title: 'Stories that stay with you',
    description: 'Short reflections that inspire, touch, and remind you that growth can be quiet too.',
    buttonText: 'Begin',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardAnim = useRef(new Animated.Value(1)).current;
  const heroFloat = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentData = onboardingData[currentIndex];

  useEffect(() => {
    cardAnim.setValue(0);
    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardAnim, currentIndex]);

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [buttonPulse, heroFloat]);

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <TwinklingStars count={36} />

        {/* Content */}
        <Animated.Image
          source={require('../clavvupAssets/img/teta.png')}
          style={[
            styles.heroImage,
            {
              transform: [
                {
                  translateY: heroFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 8],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.textBox,
              {
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                  {
                    scale: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.title}>{currentData.title}</Text>
            <Text style={styles.description}>{currentData.description}</Text>
          </Animated.View>

          <Animated.View style={[styles.dotsContainer, { opacity: cardAnim }]}>
            {onboardingData.map((_, index) => {
              const active = index === currentIndex;
              const activeScale = cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              });
              return (
                <Animated.View
                  key={`dot-${index}`}
                  style={[
                    styles.progressDot,
                    active && styles.progressDotActive,
                    active ? { transform: [{ scale: activeScale }] } : undefined,
                  ]}
                />
              );
            })}
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                transform: [
                  {
                    scale: buttonPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.buttonText}>{currentData.buttonText}</Text>
            </TouchableOpacity>
          </Animated.View>
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
  heroImage: {
    width: 300,
    height: 300,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 100,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    opacity: 0.8,
  },
  content: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  textBox: {
    backgroundColor: '#DC143C',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#FFD700',
  },
  buttonWrapper: {
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

