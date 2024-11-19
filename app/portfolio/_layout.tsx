import { StyleSheet, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import Header from "../../components/header";

const portfolioApp = () => {
  return (
    <Tabs
      screenOptions={{
        header: () => (
          <Text>
            {" "}
            <Header />
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="hobbies"
        options={{ title: "Hobbies", href: "/portfolio/hobbies" }}
      />
      <Tabs.Screen
        name="repository"
        options={{ title: "Repository", href: "/portfolio/repository" }}
      />
    </Tabs>
  );
};

export default portfolioApp;

const styles = StyleSheet.create({});
