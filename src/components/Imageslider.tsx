import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';

export default function ProfileBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Images/Picture3.webp')}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Rakshak</Text>
        <Text style={styles.subtitle}>
          Stay safe and secure with our SOS alerts and tips.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',       // full width of parent
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,


  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },
});
