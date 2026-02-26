import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#FFF0F1",
  surface: "#FFFFFF",
  accentBright: "#E02E38",
  accentSoft: "#FFF0F1",
  accentMuted: "#FACCCE",
  accentText: "#B01D24",
  textPrimary: "#0F172A",
  textMuted: "#94A3B8",
  shadow: "rgba(192,35,43,0.18)",
};

export default function SplashScreen({ navigation }: any) {
  const logoScale   = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(16)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const ringScale   = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Logo pop-in
    Animated.parallel([
      Animated.spring(logoScale,   { toValue: 1,   useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(logoOpacity, { toValue: 1,   duration: 400, useNativeDriver: true }),
    ]).start();

    // Text slide-up after logo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, 300);

    // Tagline after title
    setTimeout(() => {
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 600);

    // Pulsing ring
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale,   { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0,   duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale,   { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Auth check
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('loggedInUser');
        const code = await AsyncStorage.getItem('codeWord');
        console.log("User:", user);
        console.log("Code Word", code);
        navigation.replace(user ? 'MainApp' : 'Login');
      } catch (error) {
        console.error('Error reading user from AsyncStorage', error);
        navigation.replace('Login');
      }
    };

    setTimeout(checkLogin, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Soft background circles */}
      <View style={styles.bgCircleLarge} />
      <View style={styles.bgCircleSmall} />

      {/* Logo with pulse ring */}
      <View style={styles.logoWrapper}>
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        <Animated.View style={[styles.logoBox, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Image
            source={require('../assets/images/rakshak.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Brand name */}
      <Animated.Text style={[styles.brandTitle, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
        Rakshak
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Your Safety, Our Priority
      </Animated.Text>

      {/* Bottom loader dots
      <Animated.View style={[styles.dotsRow, { opacity: tagOpacity }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotAccent]} />
        ))}
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.bg,
  },

  // Background decorative circles
  bgCircleLarge: {
    position: 'absolute', width: 360, height: 360, borderRadius: 180,
    backgroundColor: C.accentMuted, opacity: 0.18,
    top: -80, right: -80,
  },
  bgCircleSmall: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.accentMuted, opacity: 0.14,
    bottom: -50, left: -60,
  },

  // Logo
  logoWrapper: {
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 28,
  },
  pulseRing: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: C.accentBright, opacity: 0.5,
  },
  logoBox: {
    width: 110, height: 110, borderRadius: 30,
    backgroundColor: C.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: C.accentMuted,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 10,
  },
  logo: { width: 72, height: 72 },

  // Text
  brandTitle: {
    fontSize: 42, fontWeight: '800', color: C.accentText,
    letterSpacing: -1, marginBottom: 8,
  },
  tagline: {
    fontSize: 14, color: C.textMuted,
    fontStyle: 'italic', letterSpacing: 0.3,
    marginBottom: 48,
  },

  // Loader dots
  dotsRow: {
    position: 'absolute', bottom: 52,
    flexDirection: 'row', gap: 8, alignItems: 'center',
  },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: C.accentMuted,
  },
  dotAccent: {
    width: 20, backgroundColor: C.accentBright, borderRadius: 4,
  },
});