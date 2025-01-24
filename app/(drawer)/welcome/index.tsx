import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      router.navigate("/user-management/login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.welcome}>Bienvenido</Text>
      </View>

      <View style={styles.body}>
        <Image
          style={styles.image}
          source={require("../../../assets/img/authors.jpg")}
        />
      </View>

      <Pressable style={styles.button}>
        <Link style={styles.buttonText} href="./portfolio">
          Ir al portfolio
        </Link>
      </Pressable>

      <Pressable style={styles.button}>
        <Link style={styles.buttonText} href="./shoppingList">
          Ir a la lista de la compra
        </Link>
      </Pressable>

      <Pressable
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#4c4c4c",
  },
  welcome: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  body: {
    flex: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 100,
  },
  button: {
    backgroundColor: "#4c4c4c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
