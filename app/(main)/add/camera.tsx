import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchFoodByBarcode } from '../../../src/api/openFoodFacts';
import { useMeals } from '../../../src/context/MealsContext';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const { addFoodToDraft } = useMeals();

  async function onScan(code: string) {
    if (scanning) {
      return;
    }

    try {
      setScanning(true);
      const food = await fetchFoodByBarcode(code);
      if (!food) {
        Alert.alert('Produit introuvable', 'Aucun produit correspondant a ce code-barres.');
        return;
      }

      addFoodToDraft(food);
      Alert.alert('Produit ajoute', food.name);
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur scanner', error?.message || 'Impossible de recuperer ce produit.');
    } finally {
      setTimeout(() => setScanning(false), 600);
    }
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <Text style={styles.text}>Autorise la camera pour scanner un code-barres.</Text>
        <Text style={styles.link} onPress={requestPermission}>
          Donner la permission
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Cadre le code-barres</Text>
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
          onBarcodeScanned={({ data }) => onScan(data)}
        />
      </View>
      <Text style={styles.text}>{scanning ? 'Analyse en cours...' : 'Scan actif'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  cameraWrap: { flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#d1d5db' },
  text: { textAlign: 'center' },
  link: { color: '#1d4ed8', fontWeight: '700' },
});
