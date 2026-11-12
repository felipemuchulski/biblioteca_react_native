import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
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

import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";
import { formatWhatsappInput } from "../../database/users";
import { getFirebaseAuth } from "../../database/firebase";
import { formatAddress } from "@/utils/address";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export default function ProfileScreen() {
  const router = useRouter();
  const { loading, user, profile, error, retry } = useProfile();
  const name = profile?.displayName || user?.displayName || "Seu perfil";
  const whatsapp = profile?.whatsapp;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await signOut(getFirebaseAuth());
    } catch (cause) {
      setLogoutError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível sair da conta.",
      );
    }
  };

  const handleLogin = async () => {
    if (loginSubmitting) return;

    setLoginError("");
    setLoginSubmitting(true);
    try {
      await signInWithEmailAndPassword(
        getFirebaseAuth(),
        loginEmail.trim().toLowerCase(),
        loginPassword,
      );
      router.replace("/");
    } catch {
      setLoginError("E-mail ou senha incorretos");
    } finally {
      setLoginSubmitting(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          style={styles.screen}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={AppColors.blue} />
              <Text style={styles.description}>Carregando perfil…</Text>
            </View>
          ) : !user ? (
            <View style={styles.card}>
              <Ionicons
                name="person-circle-outline"
                size={64}
                color={AppColors.blue}
              />
              <Text style={styles.title}>Seu perfil</Text>
              <Text style={styles.description}>
                Faça o login ou cadastre-se para ter acesso ao seu perfil na
                comunidade Livroei.
              </Text>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setLoginEmail}
                placeholder="voce@exemplo.com"
                placeholderTextColor={AppColors.graySecondary}
                style={styles.input}
                value={loginEmail}
              />
              <Text style={styles.label}>Senha</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setLoginPassword}
                placeholder="Digite sua senha"
                placeholderTextColor={AppColors.graySecondary}
                secureTextEntry
                style={styles.input}
                value={loginPassword}
                onSubmitEditing={() => void handleLogin()}
              />
              {!!loginError && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {loginError}
                </Text>
              )}
              <TouchableOpacity
                disabled={loginSubmitting}
                onPress={() => void handleLogin()}
                style={[styles.loginButton, loginSubmitting && styles.disabled]}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
              <Text style={styles.accountPrompt}>Ainda não possui uma conta?</Text>
              <Link href="/register-user" style={styles.button}>
                <Text style={styles.buttonText}>Criar perfil</Text>
              </Link>
            </View>
          ) : (
            <>
              <View style={styles.center}>
                <View style={styles.avatar}>
                  <Text style={styles.initial}>
                    {name.trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>
                  Seu perfil na comunidade Livroei
                </Text>
              </View>
              {editing ? (
                <ProfileEditor
                  key={user?.uid}
                  profile={
                    profile ?? {
                      displayName: user?.displayName ?? "",
                      email: user?.email ?? "",
                      whatsapp: "",
                    }
                  }
                  onClose={() => setEditing(false)}
                  onSaved={() => {
                    setEditing(false);
                    setSaved(true);
                  }}
                />
              ) : (
                <View style={styles.card}>
                  <Text style={styles.label}>Nome</Text>
                  <Text selectable style={styles.value}>
                    {name}
                  </Text>
                  <Text style={styles.label}>E-mail</Text>
                  <Text selectable style={styles.value}>
                    {profile?.email || user?.email || "Não informado"}
                  </Text>
                  <Text style={styles.label}>WhatsApp</Text>
                  <Text selectable style={styles.value}>
                    {whatsapp
                      ? whatsapp.startsWith("+55")
                        ? formatWhatsappInput(whatsapp)
                        : whatsapp
                      : "Não informado"}
                  </Text>
                  <Text style={styles.label}>Endereço</Text>
                  <Text selectable style={styles.value}>
                    {formatAddress(profile?.address)}
                  </Text>
                  <Text style={styles.description}>
                    Seu endereço completo fica visível apenas para você.
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.button}
                    onPress={() => {
                      setEditing(true);
                      setSaved(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Editar perfil</Text>
                  </TouchableOpacity>
                </View>
              )}
              {saved && (
                <Text accessibilityRole="alert" style={styles.description}>
                  Perfil atualizado com sucesso.
                </Text>
              )}
              {!profile && !editing && (
                <Text style={styles.error}>
                  Os dados complementares do seu perfil ainda não foram salvos.
                  Se você acabou de se cadastrar, aguarde a conclusão do
                  cadastro.
                </Text>
              )}
              <View style={styles.card}>
                <Link href="./profile-books" style={styles.navigation}>
                  Meus livros cadastrados →
                </Link>
                <Link href="./profile-trades" style={styles.navigation}>
                  Histórico de trocas →
                </Link>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => void handleLogout()}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Sair da conta</Text>
              </TouchableOpacity>
              {!!logoutError && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {logoutError}
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  center: { alignItems: "center", gap: 12, paddingVertical: 24 },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 24,
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontSize: 32, fontWeight: "700", color: AppColors.darkBlue },
  title: { fontSize: 24, fontWeight: "800", color: AppColors.darkBlue },
  description: { fontSize: 15, lineHeight: 22, color: AppColors.categoryText },
  label: { fontSize: 13, fontWeight: "600", color: AppColors.categoryText },
  value: { fontSize: 17, color: AppColors.darkBlue, marginBottom: 12 },
  error: { color: "#B42318", lineHeight: 22 },
  accountPrompt: {
    color: AppColors.categoryText,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: AppColors.blue,
    padding: 16,
    borderRadius: 12,
    textAlign: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: AppColors.white, fontWeight: "700", fontSize: 16 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: AppColors.darkBlue,
    marginBottom: 4,
  },
  loginButton: {
    borderColor: AppColors.blue,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  loginButtonText: { color: AppColors.blue, fontWeight: "700", fontSize: 16 },
  disabled: { opacity: 0.5 },
  navigation: {
    color: AppColors.blue,
    fontSize: 16,
    paddingVertical: 14,
    fontWeight: "600",
  },
  logoutButton: {
    borderColor: "#B42318",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  logoutText: { color: "#B42318", fontWeight: "700", fontSize: 16 },
});
