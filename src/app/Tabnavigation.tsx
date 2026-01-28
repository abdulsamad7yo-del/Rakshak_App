import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Tips from "./Tips";
import TrustedContacts from "../screens/Trustedcontact(export)";
import Profile from "./Profile";

// Heroicons imports
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

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent: any;

          switch (route.name) {
            case "Home":
              IconComponent = focused ? HomeIconSolid : HomeIconOutline;
              break;
            case "Tips":
              IconComponent = focused ? LightBulbIconSolid : LightBulbIconOutline;
              break;
            case "Contacts":
              IconComponent = focused ? UsersIconSolid : UsersIconOutline;
              break;
            case "Profile":
              IconComponent = focused ? UserIconSolid : UserIconOutline;
              break;
            default:
              IconComponent = HomeIconOutline;
          }

          return <IconComponent color={color} width={size} height={size} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60, paddingBottom: 5 },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tips" component={Tips} />
      <Tab.Screen name="Contacts" component={TrustedContacts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
