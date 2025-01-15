import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="welcome/index"
          options={{
            drawerLabel: "Bienvenido",
            title: "Bienvenido",
          }}
        />
        <Drawer.Screen
          name="portfolio"
          options={{
            drawerLabel: "Portfolio",
            title: "Portfolio",
          }}
        />
        <Drawer.Screen
          name="shoppingList/index"
          options={{
            drawerLabel: "Lista de Compras",
            title: "Lista de Compras",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({});
