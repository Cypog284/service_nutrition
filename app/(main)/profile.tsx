import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  async function onLogout() {
    try {
      await signOut();
    } catch {
      Alert.alert('Erreur', 'Impossible de se deconnecter.');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.primaryEmailAddress?.emailAddress || 'Inconnu'}</Text>
      </View>
      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Se deconnecter</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14 },
  label: { color: '#6b7280', marginBottom: 6 },
  value: { fontSize: 16, fontWeight: '700' },
  button: { marginTop: 8, backgroundColor: '#b91c1c', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
