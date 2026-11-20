import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import RegisterForm from "@/components/profile/RegisterForm";
import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";
import { getFirebaseAuth } from "../../database/firebase";

const LOGIN_MODE = "login";
const REGISTER_MODE = "register";
const REGISTER_BOOK_ROUTE = "/register-book";
const PROFILE_ROUTE = "/profile";

const LoginScreen = () => {
  const [mode, setMode] = useState<"login" | "register">(LOGIN_MODE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { loading, user } = useProfile();
  const isRegisterMode = mode === REGISTER_MODE;
  const nextRoute =
    returnTo === REGISTER_BOOK_ROUTE ? REGISTER_BOOK_ROUTE : PROFILE_ROUTE;

  const handleRegister = () => {
    setMode(REGISTER_MODE);
  };

  const handleLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim().toLowerCase(),
        password,
      );
      router.replace(nextRoute);
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextRoute);
    }
  }, [loading, nextRoute, router, user]);

  if (loading || user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={AppColors.blue} />
      </View>
    );
  }

  if (isRegisterMode) {
    return (
      <RegisterForm onBack={() => setMode(LOGIN_MODE)} returnTo={returnTo} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={AppColors.blue}
          />
          <Text style={styles.title}>Entre na sua conta</Text>
          <Text style={styles.description}>
            Faça login ou crie sua conta para acessar seu perfil.
          </Text>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={styles.input}
            value={email}
          />
          <Text style={styles.label}>Senha</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {!!error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => void handleLogin()}
            disabled={submitting}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>Entrar</Text>
          </TouchableOpacity>
          <Text style={styles.description}>Ainda não possui uma conta?</Text>
          <TouchableOpacity onPress={handleRegister} style={styles.secondary}>
            <Text style={styles.secondaryText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.background,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 24,
    gap: 12,
  },
  title: { color: AppColors.darkBlue, fontSize: 24, fontWeight: "800" },
  description: { color: AppColors.categoryText, fontSize: 15, lineHeight: 22 },
  label: { color: AppColors.categoryText, fontSize: 13, fontWeight: "600" },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: AppColors.darkBlue,
  },
  error: { color: "#B42318" },
  primary: {
    backgroundColor: AppColors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: AppColors.white, fontWeight: "700" },
  secondary: {
    borderWidth: 1,
    borderColor: AppColors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: { color: AppColors.blue, fontWeight: "700" },
});
