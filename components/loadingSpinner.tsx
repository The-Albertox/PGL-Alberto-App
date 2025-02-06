import { ActivityIndicator, View, StyleSheet } from "react-native";
import React from "react";

const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#007BFF" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;