export type MealType = 'Petit-dejeuner' | 'Dejeuner' | 'Diner' | 'Snack';

export type Food = {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  nutriscore: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
};

export type Meal = {
  id: string;
  name: MealType;
  date: string;
  foods: Food[];
};

export type DraftMeal = {
  name: MealType | null;
  foods: Food[];
};
