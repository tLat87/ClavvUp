import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ImageBackground,
  Image
} from 'react-native';
import { getTaskTypeColor, taskTemplates } from '../clavvupData/tasks';
import { wasClawUsedToday, setClawUsedToday, getDailyProgress, saveDailyProgress } from '../clavvupUtils/storage';
import { Task, TaskType } from '../clavvupTypes';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';

const { width, height } = Dimensions.get('window');

const BALL_COLORS: TaskType[] = ['self-care', 'focus', 'social', 'movement'];

export default function ClawScreen() {
  const [clawUsed, setClawUsed] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [clawTask, setClawTask] = useState<Task | null>(null);
  const [selectedBallType, setSelectedBallType] = useState<TaskType | null>(null);
  
  const clawY = useRef(new Animated.Value(-100)).current;
  const clawOpacity = useRef(new Animated.Value(0)).current;
  const ballY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkClawStatus();
  }, []);

  const checkClawStatus = async () => {
    const used = await wasClawUsedToday();
    setClawUsed(used);
  };

  const handleSurpriseMe = async () => {
    if (clawUsed) return;

    // Select random ball type
    const randomType = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    setSelectedBallType(randomType);

    // Animate claw dropping
    clawOpacity.setValue(1);
    clawY.setValue(-100);

    Animated.sequence([
      // Drop down
      Animated.timing(clawY, {
        toValue: height * 0.3,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Grab (pause)
      Animated.delay(300),
      // Lift up with ball
      Animated.parallel([
        Animated.timing(clawY, {
          toValue: -100,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(ballY, {
          toValue: -height * 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Generate task
      const templates = taskTemplates[randomType];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      const newTask: Task = {
        id: `claw-task-${Date.now()}`,
        text: randomTemplate,
        type: randomType,
        completed: false,
      };
      setClawTask(newTask);
      setShowTaskModal(true);
      clawOpacity.setValue(0);
      ballY.setValue(0);
      
      setClawUsed(true);
      setClawUsedToday();
    });
  };

  const handleTaskComplete = async () => {
    if (!clawTask) return;
    
    const progress = await getDailyProgress();
    if (progress) {
      const updatedTasks = [...progress.tasks, { ...clawTask, completed: true }];
      await saveDailyProgress({
        ...progress,
        tasks: updatedTasks,
        completedCount: progress.completedCount + 1,
      });
    }
    
    setShowTaskModal(false);
    setClawTask(null);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <Image source={require('../clavvupAssets/img/balls.png')} style={{position: 'absolute',right: 0, bottom: -50, width: 500, height: 300}} resizeMode="contain" />
        <View style={styles.content}>
        {/* Header */}
        {/* <Text style={styles.title}>Claw of Chance</Text> */}

        {/* Claw Animation */}
        <View style={styles.clawContainer}>
          <Animated.View
            style={[
              styles.claw,
              {
                transform: [{ translateY: clawY }],
                opacity: clawOpacity,
              },
            ]}
          >
            <View style={styles.clawBody} />
            <View style={styles.clawLeft} />
            <View style={styles.clawRight} />
            <View style={styles.clawCenter} />
          </Animated.View>
          
          {selectedBallType && (
            <Animated.View
              style={[
                styles.ball,
                {
                  backgroundColor: getTaskTypeColor(selectedBallType),
                  transform: [{ translateY: ballY }],
                },
              ]}
            />
          )}
        </View>

        {/* Balls Container */}
        <View style={styles.ballsContainer}>
          {BALL_COLORS.map((type, index) => (
            <View
              key={type}
              style={[
                styles.ballPlaceholder,
                { backgroundColor: getTaskTypeColor(type) },
              ]}
            />
          ))}
        </View>

        {/* Surprise Me Button */}
        <TouchableOpacity
          style={[styles.button, clawUsed && styles.buttonDisabled]}
          onPress={handleSurpriseMe}
          disabled={clawUsed}
        >
          <Text style={styles.buttonText}>
            {clawUsed ? 'Already Used Today' : 'Surprise Me'}
          </Text>
        </TouchableOpacity>

        {clawUsed && (
          <Text style={styles.hintText}>
            Come back tomorrow for another surprise!
          </Text>
        )}
      </View>

      {/* Task Modal */}
      <Modal
        visible={showTaskModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Challenge!</Text>
            {clawTask && (
              <>
                <View
                  style={[
                    styles.modalTaskCard,
                    { backgroundColor: getTaskTypeColor(clawTask.type) },
                  ]}
                >
                  <Text style={styles.modalTaskText}>
                    {clawTask.text}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleTaskComplete}
                >
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  clawContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  claw: {
    width: 60,
    height: 80,
    alignItems: 'center',
    position: 'relative',
  },
  clawBody: {
    width: 4,
    height: 40,
    backgroundColor: '#888',
    marginBottom: -4,
  },
  clawLeft: {
    width: 20,
    height: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#666',
    borderBottomWidth: 3,
    borderBottomColor: '#666',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  clawRight: {
    width: 20,
    height: 20,
    borderRightWidth: 3,
    borderRightColor: '#666',
    borderBottomWidth: 3,
    borderBottomColor: '#666',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  clawCenter: {
    width: 4,
    height: 4,
    backgroundColor: '#666',
    position: 'absolute',
    bottom: 8,
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: height * 0.3 + 20,
  },
  ballsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 20,
    minHeight: 150,
  },
  ballPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
  },
  button: {
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    top: 20,
    zIndex: 1000,
    // right: 20,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hintText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d1b4e',
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalTaskCard: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  modalTaskText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

