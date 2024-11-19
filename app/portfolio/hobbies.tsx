// app/tabs/hobbies/index.tsx
import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

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
    <ScrollView contentContainerStyle={styles.container}>
      {hobbies.map((hobby, index) => (
        <Text key={index} style={styles.hobbyText}>
          {hobby}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  hobbyText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
});
