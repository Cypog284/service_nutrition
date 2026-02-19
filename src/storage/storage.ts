import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '../types';

export const MEALS_KEY = 'meals';
export const DAILY_GOAL_KEY = 'dailyCalorieGoal';

export async function getMeals(): Promise<Meal[]> {
  const raw = await AsyncStorage.getItem(MEALS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Meal[];
  } catch {
    return [];
  }
}

export async function setMeals(meals: Meal[]): Promise<void> {
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export async function getDailyGoal(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(DAILY_GOAL_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function setDailyGoal(goal: number | null): Promise<void> {
  if (goal === null) {
    await AsyncStorage.removeItem(DAILY_GOAL_KEY);
    return;
  }

  await AsyncStorage.setItem(DAILY_GOAL_KEY, String(goal));
}
