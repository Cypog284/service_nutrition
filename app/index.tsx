import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.center}>
     <Text>Loading...</Text>
     <Link href="/login" style={{ marginTop: 20, color: 'blue' }}>
        Go to Login
      </Link>
    </View>
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
