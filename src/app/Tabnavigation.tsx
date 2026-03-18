import { Platform, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeIcon as HomeIconOutline, LightBulbIcon as LightBulbIconOutline, UsersIcon as UsersIconOutline, UserIcon as UserIconOutline } from "react-native-heroicons/outline";
import { HomeIcon as HomeIconSolid, LightBulbIcon as LightBulbIconSolid, UsersIcon as UsersIconSolid, UserIcon as UserIconSolid } from "react-native-heroicons/solid";
import Home from "./Home";
import Trustedcontacts from "./Trustedcontacts";
import Tips from "./Tips";
import Profile from "./Profile";
import { useEffect } from "react";

import {
  initVoiceRecognizer,
  stopVoiceRecognizer,
} from "../services/voiceRecognizer";
import { sosHandlerRef } from "../services/sosHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";


// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  border: "#E2E8F2",
  accent: "#E02E38",
  accentSoft: "#FFF0F1",
  accentMuted: "#FACCCE",
  inactive: "#94A3B8",
  shadow: "rgba(15,23,42,0.08)",
};

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home", component: Home, IconOutline: HomeIconOutline, IconSolid: HomeIconSolid },
  { name: "Tips", component: Tips, IconOutline: LightBulbIconOutline, IconSolid: LightBulbIconSolid },
  { name: "Contacts", component: Trustedcontacts, IconOutline: UsersIconOutline, IconSolid: UsersIconSolid },
  { name: "Profile", component: Profile, IconOutline: UserIconOutline, IconSolid: UserIconSolid },
];

export default function TabNavigation() {
  const insets = useSafeAreaInsets();

  // ─── Start Voice SOS Listener ───────────────────────────────────────────────
  // useEffect(() => {
  //   initVoiceRecognizer(() => {
  //     sosHandlerRef.current?.();
  //   });

  //   return () => {
  //     stopVoiceRecognizer();
  //   };
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const setupVoice = async () => {
      try {
        const activeSOS = await AsyncStorage.getItem("activeSOS");

        if (!activeSOS && isMounted) {
          console.log("🎤 Starting voice listener (no active SOS)");

          initVoiceRecognizer(() => {
            sosHandlerRef.current?.();
          });
        } else {
          console.log("⛔ Voice listener NOT started (SOS already active)");
        }
      } catch (err) {
        console.error("Voice init error:", err);
      }
    };

    setupVoice();

    return () => {
      isMounted = false;
      stopVoiceRecognizer();
    };
  }, []);

  // Base visible tab bar content height (icon + label)
  const TAB_CONTENT_HEIGHT = 58;

  // Total bar height = content + system gesture area
  const tabBarHeight = TAB_CONTENT_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.inactive,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: insets.bottom + 4,
        },
        tabBarItemStyle: styles.tabItem,

        tabBarIcon: ({ focused }: { focused: any }) => {
          const tab = TABS.find(t => t.name === route.name);
          const IconComponent = focused ? tab?.IconSolid : tab?.IconOutline;

          if (!IconComponent) return null;

          return (
            <SafeAreaView>
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <IconComponent
                  size={22}
                  color={focused ? C.accent : C.inactive}
                  strokeWidth={1.8}
                />
              </View>
            </SafeAreaView>
          );
        },
      })}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingVertical: 15,
    // backgroundColor: C.bg,
    // borderTopWidth: 1,
    // borderTopColor: C.border,
    // padding: 6,
    // shadowColor: C.shadow,
    // // shadowOffset: { width: 0, height: -3 },
    // shadowOpacity: 1,
    // shadowRadius: 12,
    // elevation: 12,
    // height: Platform.OS === "ios" ? 80 : 60, 
  },
  tabItem: {
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  iconWrapper: {
    width: 35,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperActive: {
    backgroundColor: C.accentSoft,
  },
});