import { Food, Meal } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFoodCalories(food: Food): number {
  return food.calories || 0;
}

export function calculateMealTotals(foods: Food[]) {
  return foods.reduce(
    (acc, food) => {
      acc.calories += food.calories || 0;
      acc.proteins += food.proteins || 0;
      acc.carbs += food.carbs || 0;
      acc.fats += food.fats || 0;
      return acc;
    },
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );
}

export function calculateMealCalories(meal: Meal): number {
  return meal.foods.reduce((sum, food) => sum + getFoodCalories(food), 0);
}
