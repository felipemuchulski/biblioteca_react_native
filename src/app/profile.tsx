import { Link, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProfileEditor from "@/components/profile/ProfileEditor";
import ScreenBackButton from "@/components/navigation/ScreenBackButton";
import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";
import { formatAddress } from "@/utils/address";
import { formatWhatsappInput } from "../../database/users";
import { getFirebaseAuth } from "../../database/firebase";

export default function ProfileScreen() {
  const router = useRouter();
  const { loading, user, profile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={AppColors.blue} />
      </View>
    );
  }

  if (!user) return null;

  const name = profile?.displayName || user.displayName || "Seu perfil";

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await signOut(getFirebaseAuth());
      router.replace("/login");
    } catch (cause) {
      setLogoutError(
        cause instanceof Error ? cause.message : "Não foi possível sair da conta.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenBackButton />
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{name.trim().charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>Seu perfil na comunidade Livroei</Text>
      </View>

      {editing ? (
        <ProfileEditor
          key={user.uid}
          profile={profile ?? { displayName: user.displayName ?? "", email: user.email ?? "", whatsapp: "" }}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setSaved(true);
          }}
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text selectable style={styles.value}>{name}</Text>
          <Text style={styles.label}>E-mail</Text>
          <Text selectable style={styles.value}>{profile?.email || user.email || "Não informado"}</Text>
          <Text style={styles.label}>WhatsApp</Text>
          <Text selectable style={styles.value}>
            {profile?.whatsapp ? formatWhatsappInput(profile.whatsapp) : "Não informado"}
          </Text>
          <Text style={styles.label}>Endereço</Text>
          <Text selectable style={styles.value}>{formatAddress(profile?.address)}</Text>
          <Text style={styles.description}>Seu endereço completo fica visível apenas para você.</Text>
          <TouchableOpacity onPress={() => { setEditing(true); setSaved(false); }} style={styles.primary}>
            <Text style={styles.primaryText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      )}

      {saved && <Text style={styles.description}>Perfil atualizado com sucesso.</Text>}
      <View style={styles.card}>
        <Link href="/profile/my-books" style={styles.navigation}>Meus livros cadastrados →</Link>
        <Link href="/profile/my-trades" style={styles.navigation}>Histórico de trocas →</Link>
      </View>
      <TouchableOpacity onPress={() => void handleLogout()} style={styles.logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
      {!!logoutError && <Text style={styles.error}>{logoutError}</Text>}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, padding: 24, gap: 24, backgroundColor: AppColors.background },
  center: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: AppColors.border, alignItems: "center", justifyContent: "center" },
  initial: { fontSize: 32, fontWeight: "700", color: AppColors.darkBlue },
  card: { backgroundColor: AppColors.white, borderRadius: 18, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: "800", color: AppColors.darkBlue },
  description: { fontSize: 15, lineHeight: 22, color: AppColors.categoryText, textAlign: "center" },
  label: { fontSize: 13, fontWeight: "600", color: AppColors.categoryText },
  value: { fontSize: 17, color: AppColors.darkBlue, marginBottom: 12 },
  primary: { backgroundColor: AppColors.blue, padding: 16, borderRadius: 12, alignItems: "center" },
  primaryText: { color: AppColors.white, fontWeight: "700" },
  navigation: { color: AppColors.blue, fontSize: 16, paddingVertical: 14, fontWeight: "600" },
  logout: { borderColor: "#B42318", borderWidth: 1, borderRadius: 12, padding: 16, alignItems: "center" },
  logoutText: { color: "#B42318", fontWeight: "700" },
  error: { color: "#B42318", lineHeight: 22 },
});
