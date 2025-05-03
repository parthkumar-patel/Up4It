import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../src/components/common/theme/ThemeProvider";
import NeumorphicButton from "../../src/components/common/ui/NeumorphicButton";
import TextField from "../../src/components/common/ui/TextField";
import { auth } from "../../src/lib/appwrite";

/**
 * Login screen for the Up4It app
 * Handles user authentication with university email validation
 */
export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    } else if (!auth.validateUniversityEmail(email)) {
      newErrors.email = "Please use your university email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    setErrorMessage("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await auth.login(email, password);
      router.replace("/");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.message?.includes("Invalid credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("not verified")) {
        errorMessage = "Please verify your email before logging in";
      }
      setErrorMessage(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.bigTitle}>Up4It</Text>
        <Text style={styles.subtitle}>Sign in to find and create spontaneous hangouts with fellow UBC students.</Text>
        <View style={styles.formFields}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            style={styles.input}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            error={errors.password}
            style={styles.input}
          />
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
        <NeumorphicButton
          label={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.signInButtonBig}
          textStyle={styles.signInButtonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D12',
    justifyContent: 'space-between',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bigTitle: {
    fontSize: 56,
    fontWeight: '400', // Regular weight for a modern look
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter', // Use Inter if available, or system default
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  formFields: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    marginBottom: 20,
    borderRadius: 16,
  },
  errorMessage: {
    color: '#ff4c4c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    width: '100%',
  },
  signInButtonBig: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: 'transparent',
  },
  signInButtonText: {
    color: '#0B0D12',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
