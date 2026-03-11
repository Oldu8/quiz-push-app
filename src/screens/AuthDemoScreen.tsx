import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { loginUser, logoutUser, registerUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export const AuthDemoScreen: React.FC = () => {
  const { user, isLoading } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateCommonFields = () => {
    if (!email.trim()) {
      return "Email is required.";
    }
    if (!password) {
      return "Password is required.";
    }
    return null;
  };

  const handleRegister = async () => {
    const commonError = validateCommonFields();
    if (commonError) {
      setError(commonError);
      return;
    }
    if (!name.trim()) {
      setError("Name is required for registration.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await registerUser(email.trim(), password, name.trim());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const commonError = validateCommonFields();
    if (commonError) {
      setError(commonError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await loginUser(email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await logoutUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = isLoading || submitting;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Firebase Auth Demo</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name (for register)</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.section}>
        <View style={styles.button}>
          <Button
            title="Register"
            onPress={handleRegister}
            disabled={isBusy}
          />
        </View>
        <View style={styles.button}>
          <Button title="Login" onPress={handleLogin} disabled={isBusy} />
        </View>
        <View style={styles.button}>
          <Button title="Logout" onPress={handleLogout} disabled={isBusy} />
        </View>
      </View>

      {(isLoading || submitting) && (
        <View style={styles.section}>
          <ActivityIndicator size="small" />
          <Text style={styles.helperText}>
            {isLoading ? "Checking auth status..." : "Processing..."}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.section}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User</Text>
        <Text style={styles.helperText}>
          Status: {user ? "Logged in" : "Logged out"}
        </Text>
        <Text style={styles.helperText}>UID: {user?.uid ?? "N/A"}</Text>
        <Text style={styles.helperText}>Email: {user?.email ?? "N/A"}</Text>
        <Text style={styles.helperText}>
          Display name: {user?.displayName ?? "N/A"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: "#b00020",
    fontSize: 14,
  },
});

