import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

const API_BASE = 'https://rakshak-gamma.vercel.app/api/user'; // ← adjust to your actual base

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
    // ── Animations (unchanged) ──────────────────────────────────────────────

    Animated.parallel([
      Animated.spring(logoScale,   { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, 300);

    setTimeout(() => {
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 600);

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

    // ── Auth + fresh user detail fetch ─────────────────────────────────────
    const checkLoginAndPrefetch = async () => {
      try {
        const userData = await AsyncStorage.getItem('loggedInUser');
        const code     = await AsyncStorage.getItem('codeWord');
        console.log('User:', userData);
        console.log('Code Word:', code);

        if (!userData) {
          navigation.replace('Login');
          return;
        }

        const parsedUser = JSON.parse(userData);

        // Fetch fresh user details
        const res  = await fetch(`${API_BASE}/${parsedUser.id}/details`);
        const data = await res.json();

        if (data.success && data.details) {
          // Merge fresh details back into stored user and persist
          const updatedUser = { ...parsedUser, details: data.details };
          await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

          // Persist codeWord separately for quick access
          if (data.details.codeWord) {
            await AsyncStorage.setItem('codeWord', data.details.codeWord as string);
            const code = await AsyncStorage.getItem('codeWord');
            console.log('code word:', code);
          }

          // Optionally resolve human-readable location from permanentAddress
          if (data.details.permanentAddress) {
            try {
              const { lat, lng } = data.details.permanentAddress;
              const geo = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
              );
              const g = await geo.json();
              if (g?.address) {
                const { city, town, village, state, country } = g.address;
                const place = [city || town || village, state, country]
                  .filter(Boolean)
                  .join(', ');
                // Store resolved location so other screens can read it without re-fetching
                await AsyncStorage.setItem('userLocationName', place || 'Unknown location');
              }
            } catch (geoErr) {
              console.log('Reverse geocode failed (non-fatal):', geoErr);
              // Non-fatal — app still navigates normally
            }
          }
        } else {
          console.log('Detail fetch returned no data — navigating with cached user');
        }

        navigation.replace('MainApp');
      } catch (error) {
        console.error('Splash auth/fetch error:', error);
        // Always navigate — never leave user stuck on splash
        try {
          const fallback = await AsyncStorage.getItem('loggedInUser');
          navigation.replace(fallback ? 'MainApp' : 'Login');
        } catch {
          navigation.replace('Login');
        }
      }
    };

    // Give animations a head-start, then kick off the fetch
    setTimeout(checkLoginAndPrefetch, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Soft background circles */}
      <View style={styles.bgCircleLarge} />
      <View style={styles.bgCircleSmall} />

      {/* Logo with pulse ring */}
      <View style={styles.logoWrapper}>
        <Animated.View
          style={[styles.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
        />
        <Animated.View
          style={[styles.logoBox, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        >
          <Image
            source={require('../assets/images/rakshak.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Brand name */}
      <Animated.Text
        style={[styles.brandTitle, { opacity: textOpacity, transform: [{ translateY: textY }] }]}
      >
        Rakshak
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Your Safety, Our Priority
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.bg,
  },

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

  brandTitle: {
    fontSize: 42, fontWeight: '800', color: C.accentText,
    letterSpacing: -1, marginBottom: 8,
  },
  tagline: {
    fontSize: 14, color: C.textMuted,
    fontStyle: 'italic', letterSpacing: 0.3,
    marginBottom: 48,
  },
});