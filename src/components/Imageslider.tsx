import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProfileBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Images/Picture3.webp')}
        style={styles.image}
      />

      {/* Gradient-style overlay — two layered views for depth */}
      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />

      {/* Badge */}
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>PROTECTED</Text>
      </View>

      {/* Bottom content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Rakshak</Text>
        <Text style={styles.subtitle}>
          Stay safe with real-time SOS alerts and safety tips.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 16,
    // Subtle outer shadow (Android uses elevation)
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Subtle dark vignette at the top
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 32, 0.25)',
    top: 0,
    height: '50%',
  },
  // Stronger gradient at the bottom for text legibility
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: 'rgba(11, 17, 32, 0.72)',
  },

  // Live "Protected" badge
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 17, 32, 0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 214, 245, 0.35)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3DD6F5',
    letterSpacing: 1.2,
  },

  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  title: {
    color: '#E8F0FE',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(232, 240, 254, 0.7)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
});