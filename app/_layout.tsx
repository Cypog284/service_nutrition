import React from 'react';
import { Slot } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { MealsProvider } from '../src/context/MealsContext';
import { ClerkProvider } from '@clerk/clerk-expo';

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
          <MealsProvider>
            <Slot />
          </MealsProvider>
    </ClerkProvider>
  );
}
