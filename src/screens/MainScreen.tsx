import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserDocument } from "../services/auth";
import { PrimaryButton } from "@/components/ui/primary-button";

type Props = {
  onOpenProfile?: () => void;
};

export const MainScreen: React.FC<Props> = ({ onOpenProfile }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDocument | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data() as UserDocument);
      }
    };
    load();
  }, [user]);

  const name = profile?.name ?? user?.email ?? user?.uid ?? "there";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MAIN SCREEN</Text>
      <Text style={styles.subtitle}>Hello, {name}</Text>
      {onOpenProfile && (
        <PrimaryButton
          label="Profile"
          onPress={onOpenProfile}
          style={styles.profileButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  profileButton: {
    paddingHorizontal: 32,
  },
});
