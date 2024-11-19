import { StyleSheet, Text, View, Image } from "react-native";
import React, { Component } from "react";
import { Link, Redirect } from "expo-router";

export default function AppPage() {
  return <Redirect href="/welcome"></Redirect>;
}
