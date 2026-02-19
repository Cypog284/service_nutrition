import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSignup() {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const result = await signUp.create({ emailAddress: email.trim(), password });
      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/(main)/(home)');
      } else {
        Alert.alert('Inscription creee', 'Verification supplementaire requise dans Clerk.');
      }
    } catch (error: any) {
      Alert.alert('Inscription impossible', error?.errors?.[0]?.message || 'Verifie les informations.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Inscription</Text>
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
      <Pressable style={styles.button} disabled={loading} onPress={onSignup}>
        <Text style={styles.buttonText}>{loading ? 'Inscription...' : "S'inscrire"}</Text>
      </Pressable>
      <View style={styles.row}>
        <Text>Deja un compte ? </Text>
        <Link href="/(auth)/login" style={styles.link}>
          Se connecter
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
