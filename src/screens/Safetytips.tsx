import AsyncStorage from "@react-native-async-storage/async-storage";
// import Tts from "react-native-tts";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const tipsData = {
  Home: [
    {
      id: 1,
      en: { title: "Always Share Your Location", description: "Share your live location with a trusted contact whenever you’re home alone or feel unsafe." },
      hi: { title: "हमेशा अपनी लोकेशन शेयर करें", description: "जब भी आप अकेले हों या असुरक्षित महसूस करें, अपनी लोकेशन किसी भरोसेमंद व्यक्ति को भेजें।" }
    },
    {
      id: 2,
      en: { title: "Keep Emergency Contacts Handy", description: "Save police, neighbours, and family contacts for quick access in emergencies." },
      hi: { title: "आपातकालीन नंबर पास रखें", description: "आपात स्थिति के लिए पुलिस, पड़ोसी और परिवार के नंबर फोन में सेव रखें।" }
    },
    {
      id: 3,
      en: { title: "Lock Doors and Windows Properly", description: "Ensure all doors and windows are locked securely before sleeping or leaving." },
      hi: { title: "दरवाजे और खिड़कियाँ बंद रखें", description: "सोने या बाहर जाने से पहले सुनिश्चित करें कि सभी दरवाजे और खिड़कियाँ सुरक्षित रूप से बंद हैं।" }
    }
  ],
  Travel: [
    {
      id: 4,
      en: { title: "Check Vehicle Details Before Boarding", description: "Verify cab number and driver identity. Share trip info." },
      hi: { title: "गाड़ी में बैठने से पहले जानकारी जांचें", description: "कैब नंबर और ड्राइवर का नाम चेक करें और यात्रा सूचना भेजें।" }
    },
    {
      id: 5,
      en: { title: "Avoid Late-Night Travel Alone", description: "Avoid late-night travel; use safe main roads if needed." },
      hi: { title: "रात में अकेले यात्रा न करें", description: "संभव हो तो रात में अकेले यात्रा से बचें।" }
    },
    {
      id: 6,
      en: { title: "Use Public Transport Safely", description: "Sit near other travelers or near the driver's cabin." },
      hi: { title: "सार्वजनिक परिवहन में सुरक्षित रहें", description: "अन्य यात्रियों या ड्राइवर के पास बैठने का प्रयास करें।" }
    }
  ],
  Digital: [
    {
      id: 7,
      en: { title: "Avoid Sharing Personal Info Online", description: "Do not share personal or location info online." },
      hi: { title: "अपनी निजी जानकारी ऑनलाइन साझा न करें", description: "सोशल मीडिया पर अपनी लोकेशन या निजी जानकारी न डालें।" }
    },
    {
      id: 8,
      en: { title: "Enable Two-Factor Authentication", description: "Add extra security to important accounts." },
      hi: { title: "टू-फैक्टर ऑथेंटिकेशन चालू करें", description: "जहाँ संभव हो, खातों को अतिरिक्त सुरक्षा दें।" }
    },
    {
      id: 9,
      en: { title: "Be Cautious of Unknown Links", description: "Avoid unknown downloads and suspicious links." },
      hi: { title: "अज्ञात लिंक से सावधान रहें", description: "संदिग्ध लिंक या अटैचमेंट न खोलें।" }
    }
  ],
  Workplace: [
    {
      id: 10,
      en: { title: "Stay Alert and Aware", description: "Avoid isolated places during late hours." },
      hi: { title: "सतर्क और जागरूक रहें", description: "देर रात सुनसान जगहों से बचें।" }
    },
    {
      id: 11,
      en: { title: "Trust Your Instincts", description: "Maintain distance, notify HR or security." },
      hi: { title: "अपनी भावना पर भरोसा करें", description: "दूरी बनाए रखें और HR या सुरक्षा टीम को बताएं।" }
    },
    {
      id: 12,
      en: { title: "Know Exit Routes and Security Points", description: "Learn office emergency exits & security desk." },
      hi: { title: "निकास मार्ग और सुरक्षा बिंदु जानें", description: "आपातकालीन निकास और सुरक्षा स्थानों की पहचान करें।" }
    }
  ]
};

export default function SafetyTipsScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    (async () => {
      const savedFavs = await AsyncStorage.getItem("favoriteTips");
      const savedTheme = await AsyncStorage.getItem("themeMode");
      const savedLang = await AsyncStorage.getItem("langMode");

      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedTheme === "dark") setDarkMode(true);
      if (savedLang === "hi") setLanguage("hi");
    })();
  }, []);

  const toggleFavorite = async (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter(item => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem("favoriteTips", JSON.stringify(updated));
  };

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    await AsyncStorage.setItem("langMode", newLang);
  };

  // const speak = async (text: string) => {
  //   Tts.stop();
  //   try {
  //     await Tts.setDefaultLanguage(language === "en" ? "en-US" : "hi-IN");
  //   } catch (e) {
  //     // ignore errors if language not supported on device
  //   }
  //   Tts.speak(text);
  // };

  const theme = {
    bg: darkMode ? "#0D0D0D" : "#fff",
    txt: darkMode ? "#EAEAEA" : "#222",
    box: darkMode ? "#1A1A1A" : "#FFE4EC",
    title: darkMode ? "#FF8FAB" : "#880E4F",
    description: darkMode ? "#C8B6FF" : "#4A148C",
    accent: darkMode ? "#BB86FC" : "#E91E63",
  };

  return (
    <ScrollView style={[styles.container]}>
      <View style={styles.row}>
        <Text style={[styles.header,{color:"white"} ]}>
          {language === "en" ? "Women Safety Tips" : "महिला सुरक्षा टिप्स"}
        </Text>

        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={{ color:"white", fontWeight: "bold" }}>
            {language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.safeButton, { backgroundColor: "#1976D2" }]}
        onPress={() =>
          Linking.openURL(
            "https://www.google.com/maps/search/Police+Station+near+me"
          )
        }
      >
        <Text style={styles.btnTxt}>
          📍 {language === "en" ? "Nearby Safe Places" : "सुरक्षित स्थान"}
        </Text>
      </TouchableOpacity>

      {Object.entries(tipsData).map(([cat, arr]) => (
        <View key={cat}>
          <Text style={[styles.category, { color: theme.title }]}>{cat}</Text>

          {arr.map(item => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.box }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.title, { color: theme.title }]}>
                  {item[language].title}
                </Text>

                
              </View>

              <Text style={[styles.desc, { color: theme.description }]}>
                {item[language].description}
              </Text>

              {/* <TouchableOpacity
                style={[styles.listenBtn, { backgroundColor: theme.accent }]}
                // onPress={() => speak(item[language].description)}
              >
                <Text style={styles.btnTxt}>
                  🔈 {language === "en" ? "Listen" : "सुनें"}
                </Text>
              </TouchableOpacity> */}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,backgroundColor:"red", marginBottom: 20, paddingVertical: 20, paddingHorizontal: 20,
    color: "white", },

  header: { fontSize: 24, fontWeight: "800", },
  safeButton: { padding: 10, borderRadius: 8, alignItems: "center",marginHorizontal:50 },
  category: { fontSize: 18, fontWeight: "700", marginVertical: 8,marginHorizontal:20 },
  card: { padding: 14, borderRadius: 10, marginBottom: 16,marginHorizontal:20 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", },
  title: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 10, },
  desc: { fontSize: 14, marginTop: 8, marginBottom: 12 },
  listenBtn: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnTxt: { color: "#fff", fontSize: 14, fontWeight: "600" }
});
