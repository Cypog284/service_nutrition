import { Food } from '../types';

const BASE_SEARCH_URL = 'https://fr.openfoodfacts.org/cgi/search.pl';
const BASE_PRODUCT_URL = 'https://fr.openfoodfacts.org/api/v2/product';
const USER_AGENT = 'SuiviNutritionnel/1.0 (student project)';

type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  product_name_fr?: string;
  product_name_en?: string;
  brands?: string;
  image_url?: string;
  nutriscore_grade?: string;
  nutriments?: {
    ['energy-kcal_100g']?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

function normalizeFood(product: OpenFoodFactsProduct): Food {
  return {
    id: product.code ?? Math.random().toString(36).slice(2),
    name:
      product.product_name?.trim() ||
      product.product_name_fr?.trim() ||
      product.product_name_en?.trim() ||
      'Nom inconnu',
    brand: product.brands?.trim() || 'Marque inconnue',
    image_url: product.image_url || '',
    nutriscore: (product.nutriscore_grade || '').toLowerCase(),
    calories: Number(product.nutriments?.['energy-kcal_100g'] ?? 0),
    proteins: Number(product.nutriments?.proteins_100g ?? 0),
    carbs: Number(product.nutriments?.carbohydrates_100g ?? 0),
    fats: Number(product.nutriments?.fat_100g ?? 0),
  };
}

const commonFields = [
  'code',
  'product_name',
  'product_name_fr',
  'product_name_en',
  'brands',
  'image_url',
  'nutriscore_grade',
  'nutriments',
].join(',');

export async function searchFoods(query: string): Promise<Food[]> {
  if (!query.trim()) {
    return [];
  }

  const url =
    `${BASE_SEARCH_URL}?search_terms=${encodeURIComponent(query.trim())}` +
    `&search_simple=1&action=process&json=1&page_size=20&fields=${encodeURIComponent(commonFields)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Recherche Open Food Facts indisponible.');
  }

  const data = (await response.json()) as { products?: OpenFoodFactsProduct[] };
  return (data.products ?? []).map(normalizeFood);
}

export async function fetchFoodByBarcode(barcode: string): Promise<Food | null> {
  const code = barcode.trim();
  if (!code) {
    return null;
  }

  const url = `${BASE_PRODUCT_URL}/${encodeURIComponent(code)}.json?fields=${encodeURIComponent(commonFields)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Service Open Food Facts indisponible.');
  }

  const data = (await response.json()) as { status?: number; product?: OpenFoodFactsProduct };
  if (data.status !== 1 || !data.product) {
    return null;
  }

  return normalizeFood(data.product);
}
