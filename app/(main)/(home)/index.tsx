import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../../src/context/MealsContext';
import { calculateMealCalories, getTodayDateString } from '../../../src/utils/nutrition';
import { Meal } from '../../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { meals, goal, setGoal, hydrated } = useMeals();
  const [goalInput, setGoalInput] = useState(goal ? String(goal) : '');

  const today = getTodayDateString();
  const todayCalories = useMemo(() => {
    return meals.filter((meal) => meal.date === today).reduce((sum, meal) => sum + calculateMealCalories(meal), 0);
  }, [meals, today]);

  const progress = goal && goal > 0 ? Math.min(todayCalories / goal, 1) : 0;

  function saveGoal() {
    const parsed = Number(goalInput);
    if (!goalInput.trim()) {
      setGoal(null);
      return;
    }
    if (Number.isFinite(parsed) && parsed > 0) {
      setGoal(parsed);
    }
  }

  function renderMeal({ item }: { item: Meal }) {
    return (
      <Pressable style={styles.card} onPress={() => router.push(`/(main)/(home)/${item.id}`)}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>{item.date}</Text>
        <Text style={styles.cardText}>{Math.round(calculateMealCalories(item))} kcal</Text>
      </Pressable>
    );
  }

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <Text>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.heading}>Objectif du jour</Text>
      <View style={styles.goalRow}>
        <TextInput
          style={styles.goalInput}
          value={goalInput}
          onChangeText={setGoalInput}
          keyboardType="numeric"
          placeholder="Ex: 2000"
        />
        <Pressable style={styles.primaryButton} onPress={saveGoal}>
          <Text style={styles.primaryText}>Enregistrer</Text>
        </Pressable>
      </View>

      {goal ? (
        <>
          <Text style={styles.progressLabel}>
            {Math.round(todayCalories)} / {goal} kcal
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </>
      ) : (
        <Text style={styles.cta}>Definir un objectif calorique journalier.</Text>
      )}

      <Pressable style={styles.addButton} onPress={() => router.push('/(main)/add')}>
        <Text style={styles.primaryText}>Ajouter un repas</Text>
      </Pressable>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        ListEmptyComponent={<Text style={styles.empty}>Aucun repas enregistre.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '700' },
  goalRow: { flexDirection: 'row', gap: 8 },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: { backgroundColor: '#0f766e', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  progressLabel: { fontWeight: '600' },
  progressTrack: { height: 14, backgroundColor: '#e5e7eb', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#14b8a6' },
  cta: { color: '#374151', marginBottom: 4 },
  addButton: { backgroundColor: '#1d4ed8', borderRadius: 10, alignItems: 'center', padding: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginTop: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardText: { color: '#4b5563' },
  empty: { textAlign: 'center', marginTop: 20, color: '#6b7280' },
});
