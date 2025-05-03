import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Easing, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animatingRef = useRef(false);
  const passwordRef = useRef(null);

  const runSmoothAnimation = (toValueY, toValueFade, cb) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: toValueY,
        duration: 1200,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: toValueFade,
        duration: 900,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      animatingRef.current = false;
      if (cb) cb();
    });
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    if (!isInputFocused) {
      setIsInputFocused(true);
      runSmoothAnimation(-180, 0);
    }
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (!passwordFocused) {
      runSmoothAnimation(0, 1, () => {
        setIsInputFocused(false);
        fadeAnim.setValue(1);
      });
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    if (!isInputFocused) {
      setIsInputFocused(true);
      runSmoothAnimation(-180, 0);
    }
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    if (!emailFocused) {
      runSmoothAnimation(0, 1, () => {
        setIsInputFocused(false);
        fadeAnim.setValue(1);
      });
    }
  };

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={32}
      >
        <Animated.View style={[styles.centeredContent, { transform: [{ translateY }] }]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.bigTitle}>Up4It</Text>
            <Text style={styles.subtitle}>Sign in to find and create spontaneous hangouts with fellow UBC students.</Text>
          </Animated.View>
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
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef?.current?.focus && passwordRef.current.focus();
              }}
            />
            <TextField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              error={errors.password}
              style={styles.input}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                handlePasswordBlur();
              }}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <NeumorphicButton
                label={isLoading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                disabled={isLoading}
                style={isInputFocused ? styles.signInButtonSmall : styles.signInButtonBig}
                textStyle={isInputFocused ? styles.signInButtonTextSmall : styles.signInButtonText}
              />
            </View>
          </View>
        </Animated.View>
        {!isInputFocused && (
          <Animated.View style={[styles.bottomButtonContainer, { opacity: fadeAnim }]}>
            {/* Empty to preserve layout, button is now above */}
          </Animated.View>
        )}
      </KeyboardAvoidingView>
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
  signInButtonSmall: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: 'transparent',
  },
  signInButtonTextSmall: {
    color: '#0B0D12',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
