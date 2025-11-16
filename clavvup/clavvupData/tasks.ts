import { Task, TaskType } from '../clavvupTypes';

const selfCareTasks: string[] = [
  'Breathe slow for one minute.',
  'Drink a glass of water mindfully.',
  'Take a 5-minute break to stretch.',
  'Write down three things you\'re grateful for.',
  'Do a quick body scan meditation.',
  'Listen to your favorite calming song.',
  'Spend 10 minutes in nature or near a window.',
  'Practice deep breathing for 2 minutes.',
];

const focusTasks: string[] = [
  'Plan your top three tasks.',
  'Set a timer and focus on one task for 25 minutes.',
  'Write down your goals for today.',
  'Organize your workspace.',
  'Review your calendar for the week.',
  'Create a priority list.',
  'Eliminate one distraction for the day.',
  'Complete the most important task first.',
];

const socialTasks: string[] = [
  'Send a kind message to someone.',
  'Call a friend or family member.',
  'Write a thank you note.',
  'Compliment someone genuinely.',
  'Share something positive with a colleague.',
  'Reach out to someone you haven\'t talked to in a while.',
  'Express appreciation to someone who helped you.',
  'Have a meaningful conversation with someone.',
];

const movementTasks: string[] = [
  'Take a 10-minute walk.',
  'Do 5 minutes of stretching.',
  'Dance to one song.',
  'Take the stairs instead of the elevator.',
  'Do 10 jumping jacks.',
  'Go for a bike ride.',
  'Do yoga poses for 5 minutes.',
  'Walk around while on a phone call.',
];

export const taskTemplates: Record<TaskType, string[]> = {
  'self-care': selfCareTasks,
  'focus': focusTasks,
  'social': socialTasks,
  'movement': movementTasks,
};

export function generateRandomTasks(count: number = 3): Task[] {
  const types: TaskType[] = ['self-care', 'focus', 'social', 'movement'];
  const selectedTypes: TaskType[] = [];
  const tasks: Task[] = [];

  // Ensure we get different types
  while (selectedTypes.length < count && selectedTypes.length < types.length) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    if (!selectedTypes.includes(randomType)) {
      selectedTypes.push(randomType);
    }
  }

  // Fill remaining slots with random types
  while (selectedTypes.length < count) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    selectedTypes.push(randomType);
  }

  selectedTypes.forEach((type, index) => {
    const templates = taskTemplates[type];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    tasks.push({
      id: `task-${Date.now()}-${index}`,
      text: randomTemplate,
      type,
      completed: false,
    });
  });

  return tasks;
}

export function getTaskTypeColor(type: TaskType): string {
  const colors: Record<TaskType, string> = {
    'self-care': '#FF69B4', // Pink
    'focus': '#4169E1', // Blue
    'social': '#FFD700', // Yellow
    'movement': '#32CD32', // Green
  };
  return colors[type];
}

