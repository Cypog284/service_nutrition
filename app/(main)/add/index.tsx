import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchFoods } from '../../../src/api/openFoodFacts';
import { useMeals } from '../../../src/context/MealsContext';
import { Food, MealType } from '../../../src/types';
import { calculateMealTotals } from '../../../src/utils/nutrition';

const mealTypes: MealType[] = ['Petit-dejeuner', 'Dejeuner', 'Diner', 'Snack'];

export default function AddMealScreen() {
  const router = useRouter();
  const {
    draftMeal,
    setDraftMealName,
    addFoodToDraft,
    removeFoodFromDraft,
    addMealFromDraft,
    resetDraftMeal,
  } = useMeals();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      try {
        setSearching(true);
        setError(null);
        const foods = await searchFoods(query);
        setResults(foods);
      } catch (e: any) {
        setError(e?.message || 'Erreur reseau pendant la recherche.');
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => clearTimeout(handle);
  }, [query]);

  const totals = useMemo(() => calculateMealTotals(draftMeal.foods), [draftMeal.foods]);

  function onValidate() {
    const meal = addMealFromDraft();
    if (!meal) {
      Alert.alert('Repas incomplet', 'Selectionne un type de repas et au moins un aliment.');
      return;
    }

    setQuery('');
    setResults([]);
    Alert.alert('Repas ajoute', `${meal.name} enregistre.`);
    router.replace('/(main)/(home)');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.sectionTitle}>1) Type de repas</Text>
      <View style={styles.typeRow}>
        {mealTypes.map((type) => (
          <Pressable
            key={type}
            onPress={() => setDraftMealName(type)}
            style={[styles.chip, draftMeal.name === type && styles.chipActive]}
          >
            <Text style={draftMeal.name === type ? styles.chipTextActive : styles.chipText}>{type}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>2) Ajouter des aliments</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un aliment"
      />

      <View style={styles.actionRow}>
        <Pressable style={styles.scanButton} onPress={() => router.push('/(main)/add/camera')}>
          <Text style={styles.primaryText}>Scanner un code-barres</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={resetDraftMeal}>
          <Text style={styles.secondaryText}>Reinitialiser</Text>
        </Pressable>
      </View>

      {searching ? <Text>Recherche...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        style={styles.resultsList}
        renderItem={({ item }) => (
          <Pressable style={styles.resultCard} onPress={() => addFoodToDraft(item)}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultMeta}>{item.brand} | {Math.round(item.calories)} kcal</Text>
          </Pressable>
        )}
        ListEmptyComponent={query.trim() ? <Text style={styles.empty}>Aucun resultat.</Text> : null}
      />

      <Text style={styles.sectionTitle}>Repas en cours ({draftMeal.foods.length})</Text>
      <FlatList
        data={draftMeal.foods}
        keyExtractor={(item, index) => `${item.id}-draft-${index}`}
        style={styles.draftList}
        renderItem={({ item, index }) => (
          <View style={styles.draftCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultMeta}>{item.brand} | {Math.round(item.calories)} kcal</Text>
            </View>
            <Pressable onPress={() => removeFoodFromDraft(item.id, index)}>
              <Text style={styles.remove}>Retirer</Text>
            </Pressable>
          </View>
        )}
      />

      <Text style={styles.total}>Total: {Math.round(totals.calories)} kcal</Text>
      <Pressable style={styles.validateButton} onPress={onValidate}>
        <Text style={styles.primaryText}>Valider</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 6 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  chipActive: { backgroundColor: '#0f766e', borderColor: '#0f766e' },
  chipText: { color: '#0f172a' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 10 },
  actionRow: { flexDirection: 'row', gap: 8 },
  scanButton: { flex: 1, backgroundColor: '#1d4ed8', borderRadius: 10, padding: 11, alignItems: 'center' },
  secondaryButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 11, alignItems: 'center' },
  secondaryText: { fontWeight: '600' },
  primaryText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c' },
  resultsList: { maxHeight: 170 },
  resultCard: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8 },
  resultName: { fontWeight: '700' },
  resultMeta: { color: '#4b5563' },
  empty: { color: '#6b7280' },
  draftList: { maxHeight: 170 },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  remove: { color: '#b91c1c', fontWeight: '700' },
  total: { fontSize: 16, fontWeight: '700' },
  validateButton: { backgroundColor: '#0f766e', borderRadius: 10, padding: 14, alignItems: 'center' },
});
