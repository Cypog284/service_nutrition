import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../../src/context/MealsContext';
import { calculateMealTotals } from '../../../src/utils/nutrition';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { meals, removeMeal } = useMeals();

  const meal = meals.find((item) => item.id === id);
  const totals = useMemo(() => calculateMealTotals(meal?.foods ?? []), [meal]);

  function onDelete() {
    if (!meal) {
      return;
    }

    Alert.alert('Supprimer ce repas ?', 'Cette action est definitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          removeMeal(meal.id);
          router.back();
        },
      },
    ]);
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <Text>Repas introuvable.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>{meal.name}</Text>
      <Text style={styles.subtitle}>{meal.date}</Text>

      <FlatList
        data={meal.foods}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodBrand}>{item.brand}</Text>
            <Text style={styles.foodInfo}>
              {Math.round(item.calories)} kcal | P {item.proteins.toFixed(1)}g | G {item.carbs.toFixed(1)}g | L {item.fats.toFixed(1)}g
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.totalBox}>
            <Text style={styles.totalTitle}>Total repas</Text>
            <Text>{Math.round(totals.calories)} kcal</Text>
            <Text>Proteines: {totals.proteins.toFixed(1)} g</Text>
            <Text>Glucides: {totals.carbs.toFixed(1)} g</Text>
            <Text>Lipides: {totals.fats.toFixed(1)} g</Text>
            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>Supprimer le repas</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginBottom: 10 },
  foodName: { fontWeight: '700' },
  foodBrand: { color: '#4b5563' },
  foodInfo: { marginTop: 4 },
  totalBox: { marginTop: 8, paddingBottom: 24, gap: 4 },
  totalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  deleteButton: { marginTop: 12, backgroundColor: '#b91c1c', borderRadius: 10, alignItems: 'center', padding: 12 },
  deleteText: { color: '#fff', fontWeight: '700' },
});
