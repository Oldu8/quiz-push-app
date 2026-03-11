import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../src/hooks/useAuth";
import { AuthDemoScreen } from "../src/screens/AuthDemoScreen";
import { MainScreen } from "../src/screens/MainScreen";
import { ProfileScreen } from "../src/screens/ProfileScreen";

export default function IndexRoute() {
  const { user, isLoading } = useAuth();
  const [active, setActive] = useState<"main" | "profile">("main");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthDemoScreen />;
  }

  if (active === "profile") {
    return <ProfileScreen onBack={() => setActive("main")} />;
  }

  return <MainScreen onOpenProfile={() => setActive("profile")} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});

