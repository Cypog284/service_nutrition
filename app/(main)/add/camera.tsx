import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchFoodByBarcode } from '../../../src/api/openFoodFacts';
import { useMeals } from '../../../src/context/MealsContext';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const scanLockRef = useRef(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { addFoodToDraft } = useMeals();

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
      }
    };
  }, []);

  const releaseScanLock = useCallback(() => {
    if (releaseTimerRef.current) {
      clearTimeout(releaseTimerRef.current);
    }

    releaseTimerRef.current = setTimeout(() => {
      scanLockRef.current = false;
      setScanning(false);
    }, 900);
  }, []);

  const onScan = useCallback(async (code: string) => {
    const normalizedCode = code.trim();
    if (!normalizedCode || scanLockRef.current) {
      return;
    }

    scanLockRef.current = true;
    setScanning(true);

    try {
      const food = await fetchFoodByBarcode(normalizedCode);
      if (!food) {
        Alert.alert('Produit introuvable', 'Aucun produit correspondant a ce code-barres.');
        return;
      }

      addFoodToDraft(food);
      router.back();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Impossible de recuperer ce produit.';
      Alert.alert('Erreur scanner', message);
    } finally {
      releaseScanLock();
    }
  }, [addFoodToDraft, releaseScanLock, router]);

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
        <Pressable style={styles.permissionButton} onPress={() => void requestPermission()}>
          <Text style={styles.permissionButtonText}>Donner la permission</Text>
        </Pressable>
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
          onBarcodeScanned={scanning ? undefined : ({ data }) => void onScan(data)}
        />
      </View>
      <Text style={styles.text}>{scanning ? 'Analyse en cours...' : 'Scan actif: place le code-barres dans le cadre'}</Text>
      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  cameraWrap: { flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#d1d5db' },
  text: { textAlign: 'center' },
  permissionButton: { backgroundColor: '#1d4ed8', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 16 },
  permissionButtonText: { color: '#fff', fontWeight: '700' },
  cancelButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
});
