import { Ionicons } from "@expo/vector-icons";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "@/constants/colors";
import { AddressFields } from "@/components/profile/AddressFields";
import { Address, emptyAddress, validateAddress } from "@/utils/address";
import {
  setAddressSelectionHandler,
  type SelectedLocation,
} from "@/utils/address-selection";
import {
  formatWhatsappInput,
  normalizeWhatsappNumber,
  registerUser,
  UserProfileSaveError,
} from "../../../database/users";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [coordinates, setCoordinates] = useState<SelectedLocation | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState<Address>({ ...emptyAddress });

  useEffect(() => {
    setAddressSelectionHandler(setCoordinates);
    return () => setAddressSelectionHandler(undefined);
  }, []);

  const handleRegister = async () => {
    if (submitting) return;
    setError("");
    const addressError = validateAddress(address);
    if (addressError) {
      setError(addressError);
      return;
    }
    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha seu nome, e-mail e senha.");
      return;
    }
    const normalizedWhatsapp = normalizeWhatsappNumber(whatsapp);
    if (!normalizedWhatsapp) {
      setError("Informe um WhatsApp válido com DDD. Ex.: +55 (11) 99999-9999.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("A senha precisa ter pelo menos uma letra maiúscula.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("A senha precisa ter pelo menos um número.");
      return;
    }
    if (!/[^A-Za-z0-9\s]/.test(password)) {
      setError("A senha precisa ter pelo menos um caractere especial.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      await registerUser(
        name,
        email,
        password,
        normalizedWhatsapp,
        address,
      );
      router.replace("/profile");
    } catch (cause) {
      if (cause instanceof UserProfileSaveError) {
        const firestoreCause = cause.originalCause;
        if (
          firestoreCause instanceof FirebaseError &&
          firestoreCause.code === "permission-denied"
        ) {
          setError(
            "O Firestore recusou os campos do perfil. Publique as regras atualizadas de database/firestore.rules e tente novamente; a conta já foi criada.",
          );
        } else {
          setError(
            firestoreCause instanceof FirebaseError
              ? `A conta foi criada, mas o perfil não foi salvo (${firestoreCause.code}). Tente novamente após corrigir a configuração do Firestore.`
              : "A conta foi criada, mas o perfil não foi salvo. Tente novamente após conferir a configuração do Firestore.",
          );
        }
      } else if (cause instanceof FirebaseError) {
        const messages: Record<string, string> = {
          "auth/email-already-in-use": "Este e-mail já está cadastrado.",
          "auth/invalid-email": "Digite um e-mail válido.",
          "auth/weak-password": "Escolha uma senha mais forte.",
          "auth/network-request-failed":
            "Sem conexão. Verifique sua internet e tente novamente.",
          "auth/operation-not-allowed":
            "Ative o cadastro por e-mail e senha no Firebase Console.",
        };
        setError(
          messages[cause.code] ??
            "Não foi possível criar a conta. Tente novamente.",
        );
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível criar a conta.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={AppColors.darkBlue} />
          </TouchableOpacity>

          <View style={styles.heading}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="person-add-outline"
                size={28}
                color={AppColors.blue}
              />
            </View>
            <Text style={styles.title}>Crie seu perfil</Text>
            <Text style={styles.subtitle}>
              Entre para fazer parte da comunidade Livroei.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              autoCapitalize="words"
              autoComplete="name"
              onChangeText={setName}
              placeholder="Como podemos chamar você?"
              placeholderTextColor={AppColors.graySecondary}
              style={styles.input}
              value={name}
              returnKeyType="next"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="voce@exemplo.com"
              placeholderTextColor={AppColors.graySecondary}
              style={styles.input}
              value={email}
              returnKeyType="next"
            />

            <Text style={styles.label}>WhatsApp</Text>
            <TextInput
              autoComplete="tel"
              keyboardType="phone-pad"
              onChangeText={(value) => setWhatsapp(formatWhatsappInput(value))}
              placeholder="+55 (11) 99999-9999"
              placeholderTextColor={AppColors.graySecondary}
              style={styles.input}
              value={whatsapp}
              returnKeyType="next"
            />

            <AddressFields
              value={address}
              onChange={setAddress}
              disabled={submitting}
            />
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push("/address-picker" as never)}
              style={styles.mapButton}
            >
              <Ionicons name="map-outline" size={20} color={AppColors.blue} />
              <Text style={styles.mapButtonText}>
                {coordinates
                  ? `Latitude: ${coordinates.latitude.toFixed(5)}... | Longitude: ${coordinates.longitude.toFixed(5)}...`
                  : "Selecionar localização no mapa"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={AppColors.graySecondary}
              />
            </TouchableOpacity>
            {coordinates ? (
              <Text style={styles.coordinates}>
                Local selecionado: {coordinates.latitude.toFixed(5)},{" "}
                {coordinates.longitude.toFixed(5)}
              </Text>
            ) : null}

            <Text style={styles.label}>Senha</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              onChangeText={setPassword}
              placeholder="Pelo menos 6 caracteres"
              placeholderTextColor={AppColors.graySecondary}
              secureTextEntry
              style={styles.input}
              value={password}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <Text style={styles.label}>Confirme sua senha</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              onChangeText={setConfirmPassword}
              placeholder="Digite a senha novamente"
              placeholderTextColor={AppColors.graySecondary}
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleRegister}
              style={[styles.submit, submitting && styles.submitDisabled]}
            >
              {submitting ? (
                <ActivityIndicator color={AppColors.white} />
              ) : (
                <Text style={styles.submitText}>Criar conta</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: AppColors.background },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  backButton: { width: 44, height: 44, justifyContent: "center" },
  heading: { alignItems: "center", marginTop: 36, marginBottom: 36 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F3FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    color: AppColors.darkBlue,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: AppColors.graySecondary,
    fontSize: 14,
    textAlign: "center",
  },
  form: { gap: 10 },
  label: {
    color: AppColors.darkBlue,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: AppColors.darkBlue,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  mapButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppColors.white,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  mapButtonText: { color: AppColors.darkBlue, flex: 1, fontSize: 14 },
  coordinates: { color: AppColors.graySecondary, fontSize: 12 },
  error: { color: "#B42318", fontSize: 13, lineHeight: 19, marginTop: 4 },
  submit: {
    alignItems: "center",
    backgroundColor: AppColors.blue,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 50,
    marginTop: 18,
  },
  submitDisabled: { opacity: 0.7 },
  submitText: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
