import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Home from "./Home";
import Tips from "./Tips";
import TrustedContacts from "../screens/Trustedcontact(export)";
import Profile from "./Profile";

import {
  HomeIcon as HomeIconOutline,
  LightBulbIcon as LightBulbIconOutline,
  UsersIcon as UsersIconOutline,
  UserIcon as UserIconOutline,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeIconSolid,
  LightBulbIcon as LightBulbIconSolid,
  UsersIcon as UsersIconSolid,
  UserIcon as UserIconSolid,
} from "react-native-heroicons/solid";

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
  { name: "Contacts", component: TrustedContacts, IconOutline: UsersIconOutline, IconSolid: UsersIconSolid },
  { name: "Profile", component: Profile, IconOutline: UserIconOutline, IconSolid: UserIconSolid },
];

export default function TabNavigation() {
  const insets = useSafeAreaInsets();

  // Base visible tab bar content height (icon + label)
  const TAB_CONTENT_HEIGHT = 58;
  // Total bar height = content + system gesture area
  const tabBarHeight = TAB_CONTENT_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ focused }) => {
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
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    paddingTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  iconWrapper: {
    width: 42,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperActive: {
    backgroundColor: C.accentSoft,
  },
});