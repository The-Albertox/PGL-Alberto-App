import { StyleSheet, Text, View, Image } from "react-native";
import React, { Component, useEffect } from "react";
import { Link, Redirect, router } from "expo-router";
import { asyncStorageService } from "../service/async-storage-service";
export default function AppPage() {
  const USER_TOKEN_KEY = asyncStorageService.KEYS.userToken;
  let isUserTokenSaved = false;

  useEffect(() => {
    const getSavedUserToken = async () => {
      const token = await asyncStorageService.get<string>(USER_TOKEN_KEY);
      // const token = null; // La buena es la anterior, esta es solo para entrar en el drawer
      const isTokenValid = true;
      if (token != null && isTokenValid) {
        isUserTokenSaved = true;
        router.navigate("/(drawer)/welcome");
      } else {
        router.navigate("/user-management/login");
      }
    };

    getSavedUserToken();
  }, []);

  return <Text>Loading...</Text>;
}

const styles = StyleSheet.create({});
