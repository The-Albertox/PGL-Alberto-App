// components/Header.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";

export default function Header() {
  const meow = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../../assets/sounds/CATMEOW.mp3")
    );

    await sound.playAsync();
  };
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={meow}>
        <Image
          style={styles.avatar}
          source={require("../../../../assets/img/authors.jpg")}
        />
      </Pressable>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Descripción sobre mí!</Text>
        <Text style={styles.descriptionText}>
          Soy un alumno y me gusta estudiar(no es verdad) y en mi tiempo libre
          me gusta jugar videojuegos, y romper el código de maneras que ni yo sé
          cómo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
  },
});
