import { PasswordInput } from "@/components/ui/password-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextInput } from "@/components/ui/text-input";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { loginUser, registerUser } from "../services/auth";

export const AuthDemoScreen: React.FC = () => {
  const { isLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
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

  const isBusy = isLoading || submitting;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "login"
            ? "Log in with your email and password."
            : "Sign up with your details to get started."}
        </Text>

        <View style={styles.section}>
          {mode === "signup" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.buttonRow}>
            <PrimaryButton
              label={mode === "login" ? "Login" : "Sign up"}
              onPress={mode === "login" ? handleLogin : handleRegister}
              loading={isBusy}
              style={styles.buttonFlex}
            />
          </View>

          <View style={styles.switchRow}>
            {mode === "login" ? (
              <Text style={styles.switchText}>
                Don&apos;t have an account?{" "}
                <Pressable onPress={() => setMode("signup")}>
                  <Text style={styles.switchLink}>Sign up</Text>
                </Pressable>
              </Text>
            ) : (
              <Text style={styles.switchText}>
                Already have an account?{" "}
                <Pressable onPress={() => setMode("login")}>
                  <Text style={styles.switchLink}>Log in</Text>
                </Pressable>
              </Text>
            )}
          </View>
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

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: 420,
    paddingVertical: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  buttonRow: {
    marginBottom: 12,
  },
  buttonFlex: {
    alignSelf: "stretch",
  },
  switchRow: {
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
    textAlign: "center",
  },
  switchLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E0607E",
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

