import { Stack } from 'expo-router';

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Ajouter un repas' }} />
      <Stack.Screen name="camera" options={{ title: 'Scanner' }} />
    </Stack>
  );
}
