import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ImageBackground,
  Image,
} from 'react-native';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { generateRandomTasks } from '../clavvupData/tasks';
import { stories } from '../clavvupData/stories';
import { getDailyProgress, saveDailyProgress, getTodayMood, saveTodayMood } from '../clavvupUtils/storage';
import { Task, DailyProgress, Story } from '../clavvupTypes';
import { BACKGROUND_IMAGE, CHARACTER_IMAGE } from '../clavvupConstants/Images';
import TwinklingStars from '../clavvupComponents/TwinklingStars';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const { width, height } = Dimensions.get('window');

// Конкретні кольори для завдань як на фото
const TASK_COLORS = ['#FF69B4', '#4169E1', '#FFD700']; // Pink, Blue, Yellow
const MOOD_OPTIONS = [
  { id: 'energized', label: 'Energized', emoji: '⚡️' },
  { id: 'calm', label: 'Calm', emoji: '🌙' },
  { id: 'reflective', label: 'Reflective', emoji: '🪞' },
  { id: 'playful', label: 'Playful', emoji: '🎈' },
];
const FOCUS_THEMES = [
  'Protect your morning energy.',
  'Choose one micro win and elevate it.',
  'Move slowly but with intention.',
  'Pause before reacting today.',
  'Gift yourself an extra breath.',
];
const WEEK_TEMPLATE = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TodaysQuestScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [fireworksAnim] = useState(new Animated.Value(0));
  const characterFloat = useRef(new Animated.Value(0)).current;
  const quotePulse = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const taskScales = useRef<Record<string, Animated.Value>>({}).current;
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [dailyFocus, setDailyFocus] = useState<string>('');
  const [highlightStory, setHighlightStory] = useState<Story | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadDailyProgress();
    loadMood();
  }, []);

  useEffect(() => {
    setDailyFocus(FOCUS_THEMES[Math.floor(Math.random() * FOCUS_THEMES.length)]);
    setHighlightStory(stories[Math.floor(Math.random() * stories.length)]);
  }, []);

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(characterFloat, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(characterFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(quotePulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(quotePulse, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [characterFloat, quotePulse]);

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: completedCount / 3,
      useNativeDriver: false,
      speed: 2,
      bounciness: 6,
    }).start();
  }, [completedCount, progressAnim]);

  const loadDailyProgress = async () => {
    const progress = await getDailyProgress();
    if (progress) {
      setTasks(progress.tasks);
      setCompletedCount(progress.completedCount);
      if (progress.completedCount === 3) {
        setShowQuote(true);
      }
    } else {
      const newTasks = generateRandomTasks(3);
      setTasks(newTasks);
      setCompletedCount(0);
      const today = new Date().toDateString();
      await saveDailyProgress({
        date: today,
        tasks: newTasks,
        completedCount: 0,
        clawUsed: false,
      });
    }
  };

  const toggleTask = async (taskId: string) => {
    const getTaskScale = (id: string) => {
      if (!taskScales[id]) {
        taskScales[id] = new Animated.Value(1);
      }
      return taskScales[id];
    };

    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    const newCompletedCount = updatedTasks.filter(t => t.completed).length;
    setCompletedCount(newCompletedCount);

    if (newCompletedCount === 3 && !showQuote) {
      setShowQuote(true);
      // Fireworks animation
      Animated.sequence([
        Animated.timing(fireworksAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fireworksAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const scale = getTaskScale(taskId);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    const progress = await getDailyProgress();
    if (progress) {
      await saveDailyProgress({
        ...progress,
        tasks: updatedTasks,
        completedCount: newCompletedCount,
      });
    }
  };

  const loadMood = async () => {
    const mood = await getTodayMood();
    if (mood) {
      setSelectedMood(mood);
    }
  };

  const handleShareQuote = async () => {
    try {
      await Share.share({
        message: '"Small steps, real change." - ClavvUp',
        title: 'Share Quote',
      });
    } catch (error) {
      // User cancelled
    }
  };

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    await saveTodayMood(moodId);
  };

  const handleStoryHighlightPress = () => {
    if (!highlightStory) {
      return;
    }
    navigation.navigate('Stories', {
      screen: 'StoryDetail',
      params: { storyId: highlightStory.id },
    });
  };

  const weeklySnapshot = useMemo(
    () =>
      WEEK_TEMPLATE.map((label, index) => {
        const jsDay = new Date().getDay();
        const mappedDay = index === 6 ? 0 : index + 1; // align Mon-Sun with JS Sunday=0
        const isToday = jsDay === mappedDay;
        const intensity =
          completedCount === 0
            ? 0
            : Math.min(1, (completedCount + index) / 4);
        return { label, isToday, intensity };
      }),
    [completedCount]
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <TwinklingStars count={28} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Focus Header */}
          <View style={styles.focusRow}>
            <View style={styles.focusCard}>
              <Text style={styles.focusLabel}>Today’s focus</Text>
              <Text style={styles.focusTitle}>{dailyFocus}</Text>
              <TouchableOpacity
                style={styles.focusButton}
                onPress={() =>
                  setDailyFocus(FOCUS_THEMES[Math.floor(Math.random() * FOCUS_THEMES.length)])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.focusButtonText}>Shuffle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.characterContainer}>
              <Animated.Image
                source={CHARACTER_IMAGE}
                style={[
                  styles.characterImage,
                  {
                    transform: [
                      {
                        translateY: characterFloat.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 8],
                        }),
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Weekly Rhythm */}
          <View style={styles.weekWrapper}>
            <Text style={styles.sectionHeading}>Weekly rhythm</Text>
            <View style={styles.weekRow}>
              {weeklySnapshot.map(day => (
                <View key={day.label} style={[styles.weekDay, day.isToday && styles.weekDayActive]}>
                  <View
                    style={[
                      styles.weekPulse,
                      { opacity: 0.35 + day.intensity * 0.6 },
                      day.isToday && styles.weekPulseActive,
                    ]}
                  />
                  <Text style={[styles.weekLabel, day.isToday && styles.weekLabelActive]}>
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mood Selector */}
          <View style={styles.moodCard}>
            <View style={styles.moodHeader}>
              <Text style={styles.sectionHeading}>Mood check-in</Text>
              {selectedMood && <Text style={styles.moodHint}>saved for today</Text>}
            </View>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map(option => {
                const isActive = selectedMood === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleMoodSelect(option.id)}
                    style={[styles.moodPill, isActive && styles.moodPillActive]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.moodEmoji}>{option.emoji}</Text>
                    <Text style={[styles.moodLabel, isActive && styles.moodLabelActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Micro wins */}
          <View style={styles.statsCard}>
            <View>
              <Text style={styles.sectionHeading}>Micro wins</Text>
              <Text style={styles.statsValue}>{completedCount}/3</Text>
              <Text style={styles.statsHint}>quests checked off</Text>
            </View>
            <View style={styles.statsDivider} />
            <View>
              <Text style={styles.sectionHeading}>Share mantra</Text>
              <TouchableOpacity onPress={handleShareQuote} style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Motivational Banner */}
          <Animated.View
            style={[
              styles.quoteBanner,
              {
                transform: [
                  {
                    scale: quotePulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.03],
                    }),
                  },
                ],
                shadowOpacity: quotePulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ]}
          >
            <Text style={styles.quoteText}>Small steps, real change.</Text>
            <Text style={styles.quoteSubText}>Remind someone why gentle consistency works.</Text>
          </Animated.View>

          {/* Highlight Story */}
          {highlightStory && (
            <TouchableOpacity
              style={styles.storyHighlight}
              onPress={handleStoryHighlightPress}
              activeOpacity={0.85}
            >
              <ImageBackground
                source={highlightStory.image}
                style={styles.storyHighlightImage}
                imageStyle={styles.storyHighlightImageStyle}
              >
                <View style={styles.storyOverlay} />
                <Text style={styles.storyHighlightLabel}>Spark of the day</Text>
                <Text style={styles.storyHighlightTitle}>{highlightStory.title}</Text>
                <Text numberOfLines={2} style={styles.storyHighlightQuote}>
                  “{highlightStory.quote}”
                </Text>
                <Text style={styles.storyHighlightCta}>Read story →</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}

          {/* Daily Tasks */}
          <Text style={styles.sectionTitle}>Daily quests</Text>
          {tasks.map((task, index) => {
            const taskColor = TASK_COLORS[index] || '#FF69B4';
            if (!taskScales[task.id]) {
              taskScales[task.id] = new Animated.Value(1);
            }
            return (
              <AnimatedTouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: taskColor },
                  { transform: [{ scale: taskScales[task.id] }] },
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <Text style={styles.taskText}>{task.text}</Text>
            <View style={styles.checkbox}>
              {task.completed && <View style={styles.checkmarkFill} />}
            </View>
              </AnimatedTouchableOpacity>
            );
          })}

          {/* Daily Progress */}
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <View style={styles.progressCard}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <Text style={styles.progressText}>{completedCount}/3</Text>
          </View>

          {/* Fireworks Animation */}
          {showQuote && (
            <Animated.View
              style={[
                styles.fireworks,
                {
                  opacity: fireworksAnim,
                  transform: [
                    {
                      scale: fireworksAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.fireworkRing} />
              <View style={styles.fireworkCore} />
            </Animated.View>
          )}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  focusCard: {
    flex: 1,
    backgroundColor: '#DC143C',
    borderRadius: 18,
    padding: 18,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  focusLabel: {
    color: '#FFD700',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  focusTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  focusButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  focusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B0082',
    textTransform: 'uppercase',
  },
  characterContainer: {
    width: 110,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterImage: {
    width: 110,
    height: 140,
  },
  weekWrapper: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },
  sectionHeading: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  weekDay: {
    alignItems: 'center',
    gap: 6,
  },
  weekDayActive: {},
  weekPulse: {
    width: 30,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#4169E1',
  },
  weekPulseActive: {
    backgroundColor: '#FFD700',
  },
  weekLabel: {
    color: '#FFFFFFaa',
    fontSize: 12,
  },
  weekLabelActive: {
    color: '#FFD700',
    fontWeight: '700',
  },
  quoteBanner: {
    backgroundColor: '#DC143C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    // Marquee lights effect
    position: 'relative',
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    flex: 1,
  },
  quoteSubText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    opacity: 0.8,
  },
  shareButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFD700',
  },
  shareButtonText: {
    color: '#4B0082',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsValue: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: '800',
  },
  statsHint: {
    color: '#FFFFFFcc',
    fontSize: 12,
  },
  statsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 18,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  checkmarkFill: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressCard: {
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    overflow: 'hidden',
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  progressText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  moodCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodHint: {
    color: '#FFFFFF99',
    fontSize: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
    minWidth: '45%',
  },
  moodPillActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  moodLabel: {
    color: '#FFFFFFcc',
    fontWeight: '500',
  },
  moodLabelActive: {
    color: '#FFD700',
  },
  storyHighlight: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  storyHighlightImage: {
    height: 180,
    justifyContent: 'flex-end',
    padding: 16,
  },
  storyHighlightImageStyle: {
    borderRadius: 18,
  },
  storyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,35,0.6)',
  },
  storyHighlightLabel: {
    color: '#FFD700',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  storyHighlightTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  storyHighlightQuote: {
    color: '#FFFFFFcc',
    marginTop: 4,
  },
  storyHighlightCta: {
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 10,
  },
  fireworks: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  fireworkRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#FFD700',
    opacity: 0.6,
  },
  fireworkCore: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
});
