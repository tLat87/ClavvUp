export type TaskType = 'self-care' | 'focus' | 'social' | 'movement';

export interface Task {
  id: string;
  text: string;
  type: TaskType;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  tasks: Task[];
  completedCount: number;
  clawUsed: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  quote: string;
  rating?: number;
  image?: any; // Image source (require() or { uri: '...' })
}

export interface Quote {
  text: string;
  author?: string;
}

export interface AppSettings {
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;
}

