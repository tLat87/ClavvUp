import React, { useState, useEffect } from 'react';
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
import { generateRandomTasks } from '../clavvupData/tasks';
import { getDailyProgress, saveDailyProgress } from '../clavvupUtils/storage';
import { Task, DailyProgress } from '../clavvupTypes';
import { Share } from 'react-native';
import { BACKGROUND_IMAGE, CHARACTER_IMAGE } from '../clavvupConstants/Images';

const { width, height } = Dimensions.get('window');

// Конкретні кольори для завдань як на фото
const TASK_COLORS = ['#FF69B4', '#4169E1', '#FFD700']; // Pink, Blue, Yellow

export default function TodaysQuestScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [fireworksAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDailyProgress();
  }, []);

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

    const progress = await getDailyProgress();
    if (progress) {
      await saveDailyProgress({
        ...progress,
        tasks: updatedTasks,
        completedCount: newCompletedCount,
      });
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

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Character Image */}
          <View style={styles.characterContainer}>
            <Image
              source={CHARACTER_IMAGE}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          {/* Motivational Banner - Always Visible */}
          <View style={styles.quoteBanner}>
            <Text style={styles.quoteText}>Small steps, real change.</Text>
            <TouchableOpacity onPress={handleShareQuote} style={styles.shareButton}>
            </TouchableOpacity>
          </View>

          {/* Daily Tasks */}
          <Text style={styles.sectionTitle}>Daily Tasks:</Text>
          {tasks.map((task, index) => {
            const taskColor = TASK_COLORS[index] || '#FF69B4';
            return (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: taskColor },
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <Text style={styles.taskText}>{task.text}</Text>
            <View style={styles.checkbox}>
              {task.completed && <View style={styles.checkmarkFill} />}
            </View>
              </TouchableOpacity>
            );
          })}

          {/* Daily Progress */}
          <Text style={styles.sectionTitle}>Daily Progress:</Text>
          <View style={styles.progressCard}>
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
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
    height: 180,
    justifyContent: 'center',
  },
  characterImage: {
    width: 150,
    height: 180,
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
  shareButton: {
    marginLeft: 12,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 12,
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
  },
  progressText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  fireworks: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
