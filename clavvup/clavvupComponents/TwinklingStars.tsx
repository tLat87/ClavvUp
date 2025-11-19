import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

interface TwinklingStarsProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  durationRange?: [number, number];
  delayRange?: [number, number];
}

interface StarConfig {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const Star = ({ size, top, left, delay, duration, color }: StarConfig & { color: string }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 0.6,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: duration * 0.4,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [delay, duration, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top: `${top}%`,
          left: `${left}%`,
          opacity,
          backgroundColor: color,
        },
      ]}
    />
  );
};

export default function TwinklingStars({
  count = 24,
  minSize = 2,
  maxSize = 4,
  color = '#ffffff',
  style,
  durationRange = [2000, 4000],
  delayRange = [0, 1200],
}: TwinklingStarsProps) {
  const stars = useMemo<StarConfig[]>(() => {
    const [minDuration, maxDuration] = durationRange;
    const [minDelay, maxDelay] = delayRange;

    return Array.from({ length: count }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      delay: minDelay + Math.random() * (maxDelay - minDelay),
      duration: minDuration + Math.random() * (maxDuration - minDuration),
    }));
  }, [count, minSize, maxSize, durationRange, delayRange]);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {stars.map((star, index) => (
        <Star
          key={`twinkle-${index}-${star.left.toFixed(2)}`}
          {...star}
          color={color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

