import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Food, Meal, MealType } from '../types';
import { getDailyGoal, getMeals, setDailyGoal, setMeals } from '../storage/storage';
import { getTodayDateString } from '../utils/nutrition';

type MealsContextValue = {
  meals: Meal[];
  goal: number | null;
  draftMeal: {
    name: MealType | null;
    foods: Food[];
  };
  hydrated: boolean;
  setGoal: (value: number | null) => void;
  removeMeal: (mealId: string) => void;
  setDraftMealName: (name: MealType) => void;
  addFoodToDraft: (food: Food) => void;
  removeFoodFromDraft: (foodId: string, index?: number) => void;
  resetDraftMeal: () => void;
  addMealFromDraft: () => Meal | null;
};

const MealsContext = createContext<MealsContextValue | undefined>(undefined);

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMealsState] = useState<Meal[]>([]);
  const [goal, setGoalState] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [draftMeal, setDraftMeal] = useState<{ name: MealType | null; foods: Food[] }>({
    name: null,
    foods: [],
  });

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const [storedMeals, storedGoal] = await Promise.all([getMeals(), getDailyGoal()]);
      if (!mounted) {
        return;
      }

      setMealsState(storedMeals);
      setGoalState(storedGoal);
      setHydrated(true);
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    setMeals(meals).catch(() => undefined);
  }, [hydrated, meals]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    setDailyGoal(goal).catch(() => undefined);
  }, [hydrated, goal]);

  const value = useMemo<MealsContextValue>(() => {
    return {
      meals,
      goal,
      draftMeal,
      hydrated,
      setGoal: (value) => {
        setGoalState(value);
      },
      removeMeal: (mealId) => {
        setMealsState((prev) => prev.filter((meal) => meal.id !== mealId));
      },
      setDraftMealName: (name) => {
        setDraftMeal((prev) => ({ ...prev, name }));
      },
      addFoodToDraft: (food) => {
        setDraftMeal((prev) => ({ ...prev, foods: [...prev.foods, food] }));
      },
      removeFoodFromDraft: (foodId, index) => {
        setDraftMeal((prev) => {
          if (typeof index === 'number') {
            return { ...prev, foods: prev.foods.filter((_, i) => i !== index) };
          }
          return { ...prev, foods: prev.foods.filter((food) => food.id !== foodId) };
        });
      },
      resetDraftMeal: () => {
        setDraftMeal({ name: null, foods: [] });
      },
      addMealFromDraft: () => {
        if (!draftMeal.name || draftMeal.foods.length === 0) {
          return null;
        }

        const meal: Meal = {
          id: Date.now().toString(),
          name: draftMeal.name,
          date: getTodayDateString(),
          foods: draftMeal.foods,
        };

        setMealsState((prev) => [meal, ...prev]);
        setDraftMeal({ name: null, foods: [] });
        return meal;
      },
    };
  }, [draftMeal, goal, hydrated, meals]);

  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

export function useMeals() {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error('useMeals must be used inside MealsProvider');
  }

  return context;
}
