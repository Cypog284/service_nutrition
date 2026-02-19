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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSignup() {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const normalizedUsername = username.trim().toLowerCase().replace(/\s+/g, '');
      const createdSignUp = await signUp.create({
        emailAddress: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: normalizedUsername,
      });

      if (createdSignUp.status === 'complete' && createdSignUp.createdSessionId) {
        await setActive({ session: createdSignUp.createdSessionId });
        router.replace('/(main)/(home)');
      } else {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setVerificationEmail(email.trim().toLowerCase());
        setCode('');
        setPendingVerification(true);
      }
    } catch (error: any) {
      Alert.alert('Inscription impossible', error?.errors?.[0]?.message || 'Verifie les informations.');
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyEmail() {
    if (!isLoaded || !pendingVerification) {
      return;
    }

    try {
      setLoading(true);
      const verification = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (verification.status === 'complete' && verification.createdSessionId) {
        await setActive({ session: verification.createdSessionId });
        router.replace('/(main)/(home)');
      } else {
        Alert.alert('Verification impossible', 'Le compte n est pas encore valide.');
      }
    } catch (error: any) {
      Alert.alert('Code invalide', error?.errors?.[0]?.message || 'Verifie le code saisi.');
    } finally {
      setLoading(false);
    }
  }

  async function onResendCode() {
    if (!isLoaded || !pendingVerification) {
      return;
    }

    try {
      setLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Code renvoye', 'Un nouveau code a ete envoye par email.');
    } catch (error: any) {
      Alert.alert('Erreur', error?.errors?.[0]?.message || 'Impossible de renvoyer le code.');
    } finally {
      setLoading(false);
    }
  }

  function onBackToForm() {
    if (loading) {
      return;
    }
    setPendingVerification(false);
    setCode('');
  }

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Text style={styles.title}>Verification email</Text>
        <Text style={styles.subtitle}>
          Saisis le code recu sur {verificationEmail || email.trim().toLowerCase()}.
        </Text>
        <TextInput
          placeholder="Code de verification"
          value={code}
          keyboardType="number-pad"
          onChangeText={setCode}
          style={styles.input}
        />
        <Pressable style={styles.button} disabled={loading} onPress={onVerifyEmail}>
          <Text style={styles.buttonText}>{loading ? 'Verification...' : 'Valider le code'}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} disabled={loading} onPress={onResendCode}>
          <Text style={styles.secondaryButtonText}>Renvoyer un code</Text>
        </Pressable>
        <Pressable style={styles.ghostButton} disabled={loading} onPress={onBackToForm}>
          <Text style={styles.ghostButtonText}>Modifier mes informations</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Inscription</Text>
      <Text style={styles.subtitle}>Etape 1 sur 2: cree ton compte.</Text>
      <TextInput
        placeholder="Prenom"
        value={firstName}
        autoCapitalize="words"
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nom"
        value={lastName}
        autoCapitalize="words"
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setUsername}
        style={styles.input}
      />
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
        <Text style={styles.buttonText}>{loading ? 'Inscription...' : 'Continuer vers la verification'}</Text>
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
  subtitle: { color: '#475569', marginTop: -4, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  button: { backgroundColor: '#0f766e', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#0f766e', padding: 14, borderRadius: 10, alignItems: 'center' },
  secondaryButtonText: { color: '#0f766e', fontWeight: '700' },
  ghostButton: { padding: 10, alignItems: 'center' },
  ghostButtonText: { color: '#334155', fontWeight: '600' },
  row: { flexDirection: 'row', marginTop: 8 },
  link: { color: '#0f766e', fontWeight: '700' },
});
