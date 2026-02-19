import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Repas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail du repas' }} />
    </Stack>
  );
}
