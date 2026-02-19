import React from 'react';
import { Slot } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { MealsProvider } from '../src/context/MealsContext';
import { ClerkProvider } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ textAlign: 'center' }}>
          Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
          <MealsProvider>
            <Slot />
          </MealsProvider>
    </ClerkProvider>
  );
}
