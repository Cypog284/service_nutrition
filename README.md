# Service Nutrition (Expo + TypeScript)

App mobile de suivi nutritionnel avec:
- authentification Clerk
- recherche et scan Open Food Facts
- stockage local AsyncStorage
- navigation Expo Router

## Prerequis

- Node.js 22 LTS recommande
- npm
- Expo Go sur mobile (ou simulateur iOS/Android)

Verification rapide:

```bash
node -v
npm -v
```

## Installation (nouveau PC)

```bash
git clone <URL_DU_REPO>
cd service_nutrition

copy .env
# ajouter la cle EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dans .env

npm ci
npx expo-doctor
npx tsc --noEmit
npx expo start -c
```

## Scripts utiles

```bash
npm start
npm run ios
npm run android
npm run web
```

## Pack de verification

```bash
npm ls --depth=0
npx expo install --check
npx expo-doctor
npx tsc --noEmit
```

## Depannage rapide

### 1) Erreur `Unable to resolve "./ExpoFontUtils"`

```bash
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force node_modules,.expo,node_modules\.cache -ErrorAction SilentlyContinue
npm ci
npx expo install @expo/vector-icons expo-font expo-constants react-native-screens react-native-safe-area-context
npx expo start -c
```

### 2) Erreur React Native `expected dynamic type 'boolean', but had type 'string'`

```bash
npx expo install expo-constants react-native-screens
npx expo start -c
```

### 3) Clerk login: `Ce compte ne peut pas se connecter avec mot de passe`

Verifier dans Clerk Dashboard:
- que l'utilisateur a bien un mot de passe
- que la methode Email + Password est activee
- que la cle `.env` utilisee est celle de la bonne instance

## Grandes lignes de l'architecture

- `app/(auth)`: login + signup (inscription puis verification email en 2 etapes)
- `app/(main)/(home)`: accueil, liste des repas, detail repas
- `app/(main)/add`: ajout repas, recherche aliments, scanner code-barres
- `app/(main)/profile`: infos utilisateur et deconnexion
- `src/context/MealsContext.tsx`: etat global des repas/objectifs/brouillon
- `src/api/openFoodFacts.ts`: appels API Open Food Facts
- `src/storage/storage.ts`: persistance AsyncStorage

## Notes techniques

- `scheme` Expo configure dans `app.json`
- plugin `expo-font` configure dans `app.json`
- tabs custom avec icones `Ionicons`
