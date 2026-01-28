import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('loggedInUser');
        const code = await AsyncStorage.getItem('codeWord');
        console.log("User:",user);
        console.log("Code Word",code);
        
        

        if (user) {
          // User already logged in
          navigation.replace('MainApp');
        } else {
          // No user found
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error reading user from AsyncStorage', error);
        navigation.replace('Login');
      }
    };

    setTimeout(checkLogin, 1500); // optional delay to show splash
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/rakshak.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Rakshak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 150, height: 150, marginBottom: 20 },
  text: { fontSize: 28, fontWeight: 'bold' },
});
