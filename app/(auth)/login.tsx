import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/(main)/(home)');
      }
    } catch (error: any) {
      Alert.alert('Connexion impossible', error?.errors?.[0]?.message || 'Verifie tes identifiants.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Pressable style={styles.button} disabled={loading} onPress={onLogin}>
        <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
      </Pressable>
      <View style={styles.row}>
        <Text>Pas de compte ? </Text>
        <Link href="/(auth)/signup" style={styles.link}>
          S'inscrire
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  button: { backgroundColor: '#0f766e', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', marginTop: 8 },
  link: { color: '#0f766e', fontWeight: '700' },
});
