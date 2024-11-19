// screens/HobbiesScreen.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

export default function HobbiesScreen() {
  const hobbies = [
    "Salir con mi pareja",
    "Ir a la playa",
    "Escuchar música",
    "Leer manga",
    "Jugar videojuegos",
    "Ir de cenar romántica",
    "Romper el código",
  ];

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.hobbiesContainer}>
        {hobbies.map((hobby, index) => (
          <Text key={index} style={styles.hobbyText}>
            {hobby}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center", 
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  hobbiesContainer: {
    flexGrow: 1, 
    alignItems: "center", 
  },
  hobbyText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
});
