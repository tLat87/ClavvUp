import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyProgress, AppSettings } from '../clavvupTypes';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: '@clavvup:onboarding_complete',
  DAILY_PROGRESS: '@clavvup:daily_progress',
  SETTINGS: '@clavvup:settings',
  LAST_CLAW_DATE: '@clavvup:last_claw_date',
  TODAY_MOOD: '@clavvup:today_mood',
};

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

export async function getDailyProgress(): Promise<DailyProgress | null> {
  const today = new Date().toDateString();
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  if (!data) return null;
  
  const progress: DailyProgress = JSON.parse(data);
  if (progress.date === today) {
    return progress;
  }
  return null;
}

export async function saveDailyProgress(progress: DailyProgress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
}

export async function getSettings(): Promise<AppSettings> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) {
    return {
      vibrationEnabled: true,
      notificationsEnabled: true,
      notificationTime: '09:00',
    };
  }
  const settings = JSON.parse(data);
  // Migration: convert soundEnabled to vibrationEnabled if needed
  if (settings.soundEnabled !== undefined && settings.vibrationEnabled === undefined) {
    settings.vibrationEnabled = settings.soundEnabled;
    delete settings.soundEnabled;
  }
  return settings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function wasClawUsedToday(): Promise<boolean> {
  const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CLAW_DATE);
  const today = new Date().toDateString();
  return lastDate === today;
}

export async function setClawUsedToday(): Promise<void> {
  const today = new Date().toDateString();
  await AsyncStorage.setItem(STORAGE_KEYS.LAST_CLAW_DATE, today);
}

export async function getTodayMood(): Promise<string | null> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TODAY_MOOD);
  if (!data) {
    return null;
  }

  try {
    const record = JSON.parse(data);
    const today = new Date().toDateString();
    if (record.date === today) {
      return record.mood;
    }
  } catch (error) {
    // ignore parse issues and reset mood
  }
  return null;
}

export async function saveTodayMood(mood: string): Promise<void> {
  const today = new Date().toDateString();
  await AsyncStorage.setItem(
    STORAGE_KEYS.TODAY_MOOD,
    JSON.stringify({ date: today, mood }),
  );
}

