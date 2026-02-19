# Suivi Nutritionnel (Expo + TypeScript)

Application mobile simple avec Expo Router, auth Clerk, recherche/scan Open Food Facts, persistance locale AsyncStorage, et objectif calorique journalier.

## Commandes de creation / installation

```bash
npx create-expo-app@latest suivi-nutritionnel --template
cd suivi-nutritionnel
npm install expo-router @clerk/clerk-expo expo-secure-store expo-camera @react-native-async-storage/async-storage react-native-safe-area-context --legacy-peer-deps
```

## Configuration

1. Copier `.env.example` vers `.env`.
2. Renseigner `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Lancer:

```bash
npm start
```

## Notes

- Recherche Open Food Facts: API v1 `cgi/search.pl` avec debounce 450ms.
- Scan code-barres: API v2 `api/v2/product/{barcode}.json`.
- Header `User-Agent` envoye sur tous les appels OFF.
- Persistance locale:
  - `meals` (Meal[])
  - `dailyCalorieGoal` (number)
- Safe area: `SafeAreaProvider` + `SafeAreaView` (react-native-safe-area-context).
- Les routes `(main)` sont protegees: redirection vers `/login` si non connecte.
