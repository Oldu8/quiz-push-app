import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { logoutUser, type UserDocument } from "../services/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

type Props = {
  onBack?: () => void;
};

export const ProfileScreen: React.FC<Props> = ({ onBack }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as UserDocument);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleLogout = async () => {
    setError(null);
    try {
      await logoutUser();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Logout failed. Please try again.";
      setError(message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>You are not logged in.</Text>
        {onBack && (
          <SecondaryButton
            label="Back"
            onPress={onBack}
            style={styles.wideButton}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {loading ? (
        <Text style={styles.subtitle}>Loading profile...</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>UID: {user.uid}</Text>
          <Text style={styles.subtitle}>Email: {user.email ?? "N/A"}</Text>
          <Text style={styles.subtitle}>
            Name: {profile?.name ?? "N/A"}
          </Text>
          <Text style={styles.subtitle}>Role: {profile?.role ?? "user"}</Text>
          <Text style={styles.subtitle}>
            Platform: {profile?.platform ?? "N/A"}
          </Text>
          <Text style={styles.subtitle}>
            Expo push token: {profile?.expoPushToken ?? "N/A"}
          </Text>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonsRow}>
        <PrimaryButton
          label="Logout"
          onPress={handleLogout}
          style={styles.wideButton}
        />
      </View>

      {onBack && (
        <View style={styles.buttonsRow}>
          <SecondaryButton
            label="Back to main"
            onPress={onBack}
            style={styles.wideButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    color: "#B00020",
  },
  buttonsRow: {
    marginTop: 16,
  },
  wideButton: {
    alignSelf: "stretch",
  },
});

