// app/tabs/qr/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function RepositoryScreen() {
  return (
    <View style={styles.container}>
      <QRCode value="https://github.com/The-Albertox" size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
