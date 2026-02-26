import AsyncStorage from "@react-native-async-storage/async-storage";
// import Tts from "react-native-tts";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const tipsData = {
  Home: {
    icon: "🏠",
    color: { bg: "#FFF7ED", border: "#FED7AA", text: "#9A3412", label: "#EA580C" },
    tips: [
      {
        id: 1,
        en: { title: "Always Share Your Location", description: "Share your live location with a trusted contact whenever you're home alone or feel unsafe." },
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
    ]
  },
  Travel: {
    icon: "🚗",
    color: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A", label: "#2563EB" },
    tips: [
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
    ]
  },
  Digital: {
    icon: "💻",
    color: { bg: "#F0FDF4", border: "#BBF7D0", text: "#14532D", label: "#16A34A" },
    tips: [
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
    ]
  },
  Workplace: {
    icon: "🏢",
    color: { bg: "#FDF4FF", border: "#E9D5FF", text: "#581C87", label: "#9333EA" },
    tips: [
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
  }
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FC",
  border: "#E2E8F2",
  borderSubtle: "#EDF0F7",
  accent: "#C0232B",
  accentBright: "#E02E38",
  accentSoft: "#FFF0F1",
  accentMuted: "#FACCCE",
  accentText: "#B01D24",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  shadow: "rgba(15,23,42,0.07)",
  white: "#FFFFFF",
};

export default function SafetyTipsScreen() {
  // const [favorites, setFavorites] = useState<number[]>([]);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    (async () => {
      const savedFavs = await AsyncStorage.getItem("favoriteTips");
      const savedLang = await AsyncStorage.getItem("langMode");
      // if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedLang === "hi") setLanguage("hi");
    })();
  }, []);

  // const toggleFavorite = async (id: number) => {
  //   const updated = favorites.includes(id)
  //     ? favorites.filter(item => item !== id)
  //     : [...favorites, id];
  //   setFavorites(updated);
  //   await AsyncStorage.setItem("favoriteTips", JSON.stringify(updated));
  // };

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    await AsyncStorage.setItem("langMode", newLang);
  };

  const totalTips = Object.values(tipsData).reduce((acc, cat) => acc + cat.tips.length, 0);
  // const favCount = favorites.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>SAFETY GUIDE</Text>
          <Text style={styles.headerTitle}>
            {language === "en" ? "Women Safety Tips" : "महिला सुरक्षा टिप्स"}
          </Text>
        </View>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage} activeOpacity={0.8}>
          <Text style={styles.langBtnText}>
            {language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 ENG"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Stats strip ── */}
      <View style={styles.statsStrip}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{totalTips}</Text>
          <Text style={styles.statLbl}>{language === "en" ? "Tips" : "सुझाव"}</Text>
        </View>
        
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{Object.keys(tipsData).length}</Text>
          <Text style={styles.statLbl}>{language === "en" ? "Topics" : "विषय"}</Text>
        </View>
      </View>

      {/* ── Nearby safe places ── */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          style={styles.safeBtn}
          onPress={() => Linking.openURL("https://www.google.com/maps/search/Police+Station+near+me")}
          activeOpacity={0.82}
        >
          <View style={styles.safeBtnIcon}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </View>
          <View style={styles.safeBtnText}>
            <Text style={styles.safeBtnTitle}>
              {language === "en" ? "Nearby Safe Places" : "सुरक्षित स्थान"}
            </Text>
            <Text style={styles.safeBtnSub}>
              {language === "en" ? "Police stations & safety zones near you" : "आपके नज़दीक पुलिस व सुरक्षित स्थान"}
            </Text>
          </View>
          <Text style={styles.safeBtnChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tips by category ── */}
      {Object.entries(tipsData).map(([cat, catData]) => (
        <View key={cat} style={styles.section}>
          {/* Category header */}
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryIconBox, { backgroundColor: catData.color.bg, borderColor: catData.color.border }]}>
              <Text style={{ fontSize: 18 }}>{catData.icon}</Text>
            </View>
            <Text style={[styles.categoryTitle, { color: catData.color.label }]}>{cat}</Text>
            <View style={[styles.categoryCount, { backgroundColor: catData.color.bg, borderColor: catData.color.border }]}>
              <Text style={[styles.categoryCountText, { color: catData.color.label }]}>{catData.tips.length}</Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.cardGroup}>
            {catData.tips.map((item, idx) => {
              // const isFav = favorites.includes(item.id);
              return (
                <View key={item.id}>
                  <View style={styles.card}>
                    {/* Left accent bar */}
                    <View style={[styles.cardAccentBar, { backgroundColor: catData.color.label }]} />
                    <View style={styles.cardBody}>
                      <View style={styles.cardTop}>
                        <Text style={[styles.cardTitle, { color: catData.color.text }]}>
                          {item[language].title}
                        </Text>
                        {/* <TouchableOpacity
                          onPress={() => toggleFavorite(item.id)}
                          style={styles.favBtn}
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 18 }}>{isFav ? "❤️" : "🤍"}</Text>
                        </TouchableOpacity> */}
                      </View>
                      <Text style={styles.cardDesc}>{item[language].description}</Text>
                    </View>
                  </View>
                  {idx < catData.tips.length - 1 && <View style={styles.cardSep} />}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    backgroundColor: C.surface,
    paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    borderBottomWidth: 1, borderBottomColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 4,
  },
  headerEyebrow: {
    fontSize: 10, fontWeight: "800", color: C.accentBright,
    letterSpacing: 2.5, marginBottom: 3,
  },
  headerTitle: {
    fontSize: 26, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.4,
  },
  langBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
  },
  langBtnText: { fontSize: 13, fontWeight: "700", color: C.textSecondary },

  // Stats strip
  statsStrip: {
    flexDirection: "row", backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 12,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statNum: { fontSize: 20, fontWeight: "800", color: C.textPrimary },
  statLbl: { fontSize: 10, fontWeight: "600", color: C.textMuted, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: C.border, marginVertical: 4 },

  // Safe places button
  safeBtn: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.surface, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: "#BFDBFE",
    marginTop: 16,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  safeBtnIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE",
    justifyContent: "center", alignItems: "center",
  },
  safeBtnText: { flex: 1 },
  safeBtnTitle: { fontSize: 15, fontWeight: "700", color: "#1E3A8A" },
  safeBtnSub: { fontSize: 12, color: "#60A5FA", marginTop: 2 },
  safeBtnChevron: { fontSize: 22, color: "#93C5FD", fontWeight: "600" },

  // Section
  section: { paddingHorizontal: 16, marginBottom: 20 },
  categoryHeader: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginBottom: 10,
  },
  categoryIconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1,
  },
  categoryTitle: {
    fontSize: 15, fontWeight: "800", flex: 1, letterSpacing: 0.2,
  },
  categoryCount: {
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8, borderWidth: 1,
  },
  categoryCountText: { fontSize: 12, fontWeight: "800" },

  // Card group (all tips in one surface)
  cardGroup: {
    backgroundColor: C.surface, borderRadius: 20,
    borderWidth: 1, borderColor: C.border, overflow: "hidden",
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  card: {
    flexDirection: "row",
    paddingVertical: 14, paddingRight: 14,
  },
  cardAccentBar: { width: 4, borderRadius: 4, marginLeft: 6, marginRight: 12, marginVertical: 2 },
  cardBody: { flex: 1 },
  cardTop: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", flex: 1, lineHeight: 20 },
  cardDesc: {
    fontSize: 13, color: C.textSecondary, marginTop: 5, lineHeight: 19,
  },
  favBtn: { padding: 2 },
  cardSep: { height: 1, backgroundColor: C.borderSubtle, marginLeft: 22 },
});