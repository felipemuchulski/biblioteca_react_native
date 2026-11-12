import { BookHeader } from "@/components/book-details/BookHeader";
import { ConditionSelector } from "@/components/book-register/ConditionSelector";
import { BookFormField } from "@/components/book-register/BookFormField";
import { PhotoPicker } from "@/components/book-register/PhotoPicker";
import { ConfirmBookRegisterButton } from "@/components/book-register/ConfirmBookRegisterButton";
import { AppColors } from "@/constants/colors";
import type { BookCondition } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import { getFirebaseAuth } from "../../../database/firebase";
import { registerBook } from "../../../database/books";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type FormErrors = Partial<
  Record<"title" | "author" | "photos" | "condition", string>
>;

export type NewBookInput = {
  title: string;
  author: string;
  images: string[];
  thumbnail: string;
  category: string[];
  condition: BookCondition;
  conditionNote?: string;
  tradeWithBookId?: string;
};

const parseCategories = (value: string) =>
  value
    .split(/,|;|\se\s/i)
    .map((c) => c.trim())
    .filter(Boolean);

export default function NewBookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tradeWithBookId } = useLocalSearchParams<{
    tradeWithBookId?: string | string[];
  }>();
  const relatedBookId =
    typeof tradeWithBookId === "string" ? tradeWithBookId : undefined;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [condition, setCondition] = useState<BookCondition | null>(null);
  const [conditionNote, setConditionNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Informe o título do livro.";
    if (!author.trim()) next.author = "Informe o autor.";
    if (photos.length === 0) next.photos = "Adicione pelo menos uma foto.";
    if (!condition) next.condition = "Selecione a condição do livro.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;

    let auth;
    try {
      auth = getFirebaseAuth();
    } catch (cause) {
      Alert.alert(
        "Configuração necessária",
        cause instanceof Error
          ? cause.message
          : "Não foi possível acessar o Firebase.",
      );
      return;
    }

    if (!auth.currentUser) {
      Alert.alert(
        "Entre na sua conta",
        "Você precisa estar logado para cadastrar um livro.",
        [
          {
            text: "Criar perfil",
            onPress: () => router.push("/register-user"),
          },
        ],
      );
      return;
    }

    if (!validate() || !condition) return;

    const payload: NewBookInput = {
      title: title.trim(),
      author: author.trim(),
      images: photos,
      thumbnail: photos[0],
      category: parseCategories(categories),
      condition,
      conditionNote: conditionNote.trim() || undefined,
      tradeWithBookId: relatedBookId,
    };

    setSubmitting(true);
    try {
      await registerBook(payload);
      Alert.alert("Livro cadastrado!", "Seu exemplar já está na estante.");
      router.back();
    } catch (cause) {
      Alert.alert(
        "Ops",
        cause instanceof Error
          ? cause.message
          : "Não foi possível cadastrar o livro. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <BookHeader />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text accessibilityRole="header" style={styles.pageTitle}>
              Cadastrar livro
            </Text>
            <Text style={styles.pageSubtitle}>
              Uma nova história começa na sua estante. Conte um pouco sobre o
              seu exemplar.
            </Text>
          </View>

          <View style={styles.section}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Sobre o livro
            </Text>
            <BookFormField
              label="Título do livro"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                clearError("title");
              }}
              error={errors.title}
              returnKeyType="next"
              autoCapitalize="sentences"
            />
            <BookFormField
              label="Autor"
              value={author}
              onChangeText={(t) => {
                setAuthor(t);
                clearError("author");
              }}
              error={errors.author}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <BookFormField
              label="Categorias do livro"
              placeholder="Ex.: Ficção, Romance e Fantasia."
              value={categories}
              onChangeText={setCategories}
              autoCapitalize="sentences"
            />
          </View>

          <PhotoPicker
            photos={photos}
            onChange={(p) => {
              setPhotos(p);
              clearError("photos");
            }}
            error={errors.photos}
          />

          <View style={styles.section}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Como está o seu exemplar?
            </Text>
            <ConditionSelector
              value={condition}
              onChange={(c) => {
                setCondition(c);
                clearError("condition");
              }}
              error={errors.condition}
            />
            <BookFormField
              label="Descrição da condição"
              placeholder="Ex.: Está praticamente como novo."
              value={conditionNote}
              onChangeText={setConditionNote}
              multiline
              maxLength={300}
              hint="Conte se há grifos, anotações ou marcas na capa e nas páginas."
            />
          </View>

          <View style={styles.banner}>
            <Ionicons
              name="book-outline"
              size={22}
              color={AppColors.darkBlue}
            />
            <Text style={styles.bannerText}>
              Seu livro pode ser a próxima descoberta de alguém da vizinhança.
            </Text>
          </View>

          <ConfirmBookRegisterButton
            label="Cadastrar livro"
            icon="add-circle-outline"
            footer="Faça boas histórias circularem."
            onPress={handleSubmit}
            disabled={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: AppColors.background },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 28 },
  intro: { gap: 6 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: AppColors.bookTitleText,
  },
  pageSubtitle: { fontSize: 16, lineHeight: 23, color: AppColors.categoryText },
  section: { gap: 14 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.bookTitleText,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: AppColors.panel,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.darkBlue,
  },
});
