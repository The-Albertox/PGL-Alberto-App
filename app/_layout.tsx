import { Text, View, Image } from "react-native";
import React, { Component } from "react";
import { Slot } from "expo-router";

const AppLayout = () => {
  return (
    <View>
      <Slot />
    </View>
  );
};

export default AppLayout;
