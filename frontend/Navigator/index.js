import React, { useContext } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

import HomeNavigation from "./HomeNavigation";
import CartNavigation from "./CartNavigation";
import UserNavigation from "./UserNavigation";
import AdminNavigation from "./AdminNavigation";

import CartIcon from "../Shared/CartIcon";
import AuthGlobal from "../Context/store/AuthGlobal";

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "#e91e63",
        keyboardHidesTabBar: true,
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Icon
                name="home"
                style={{
                  position: "relative",
                  color: color,
                }}
                size={30}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartNavigation}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View>
                <Icon name="shopping-cart" style={{ color: color }} size={30} />
                <CartIcon />
              </View>
            );
          },
        }}
      />
      {context.stateUser.admin == true ? (
        <Tab.Screen
          name="Admin"
          component={AdminNavigation}
          options={{
            tabBarIcon: ({ color }) => {
              return <Icon name="gear" color={color} size={30} />;
            },
          }}
        />
      ) : null}

      <Tab.Screen
        name="User"
        component={UserNavigation}
        options={{
          tabBarIcon: ({ color }) => {
            return <Icon name="user" color={color} size={30} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
