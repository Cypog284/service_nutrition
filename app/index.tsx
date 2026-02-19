import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(main)/(home)" />;
  }

  return (
    <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
