import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteBook } from "../../../database/books";
import BookGridCard from "@/components/common/BookGridCard";
import AddBookButton from "@/components/home/AddBookButton";
import ScreenBackButton from "@/components/navigation/ScreenBackButton";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { useProfile } from "@/hooks/use-profile";
import { useProfileRecords } from "@/hooks/use-profile-records";
import type { Book } from "@/types";

export default function MyBooksScreen() {
  const router = useRouter();
  const { setSelectedBook } = useBooks();
  const {
    user,
    loading: authLoading,
    error: authError,
    retry: retryAuth,
  } = useProfile();
  const { records, loading, error, hasMore, retry, loadMore } =
    useProfileRecords(user?.uid, "books");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const books: Book[] = records.map((record) => {
    const data = record.data;
    const images = Array.isArray(data.images)
      ? data.images.filter(
          (image: unknown): image is string =>
            typeof image === "string" && !!image.trim(),
        )
      : [];
    const thumbnail =
      typeof data.thumbnail === "string" && data.thumbnail
        ? data.thumbnail
        : images[0] || "";
    const type =
      data.type === "donation" || data.type === "exchange"
        ? data.type
        : "donation";
    const condition =
      data.bookCondition === "new" ||
      data.bookCondition === "like_new" ||
      data.bookCondition === "good" ||
      data.bookCondition === "worn"
        ? data.bookCondition
        : "good";

    return {
      id: record.id,
      ownerId: typeof data.ownerId === "string" ? data.ownerId : user?.uid,
      title: typeof data.title === "string" ? data.title : "Livro sem título",
      author:
        typeof data.author === "string" ? data.author : "Autor não informado",
      images,
      thumbnail,
      type,
      distance: "Distância indisponível",
      owner: typeof data.owner === "string" ? data.owner : "Usuário",
      isFavorite: false,
      category: Array.isArray(data.category)
        ? data.category.filter(
            (category: unknown): category is string =>
              typeof category === "string",
          )
        : [],
      available: typeof data.available === "boolean" ? data.available : true,
      bookCondition: condition,
      ...(typeof data.bookConditionNote === "string"
        ? { bookConditionNote: data.bookConditionNote }
        : {}),
    };
  });

  const handlePress = (book: Book) => {
    setSelectedBook(book);
    router.push({
      pathname: "/book/[id]",
      params: { id: book.id },
    });
  };

  const confirmDelete = (id: string, title: string) => {
    const remove = async () => {
      setDeletingId(id);
      try {
        await deleteBook(id);
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Não foi possível excluir o livro.";
        Alert.alert("Erro ao excluir", message);
      } finally {
        setDeletingId(null);
      }
    };

    Alert.alert(
      "Excluir livro",
      `Tem certeza de que deseja excluir "${title}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => void remove() },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.recordsHeader}>
          <View style={styles.backButton}>
            <ScreenBackButton />
          </View>
          <Text style={styles.recordsHeaderTitle}>Meus Livros Cadastrados</Text>
          <View style={styles.addBookButton}>
            <AddBookButton />
          </View>
        </View>

        {authLoading || (user && loading) ? (
          <ActivityIndicator
            accessibilityLabel="Carregando lista"
            color={AppColors.blue}
          />
        ) : authError || error ? (
          <View style={styles.card}>
            <Text style={styles.body}>{authError || error}</Text>
            <TouchableOpacity
              onPress={authError ? retryAuth : retry}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : !user ? (
          <View style={styles.card}>
            <Text style={styles.body}>
              Crie seu perfil para acessar esta lista.
            </Text>
            <Link href="/login" style={styles.link}>
              Ir para o login
            </Link>
          </View>
        ) : records.length === 0 ? (
          <Text style={styles.body}>
            Você ainda não tem livros cadastrados.
          </Text>
        ) : (
          <FlatList
            style={styles.list}
            data={books}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookGridCard
                book={item}
                showDistance={false}
                onPress={handlePress}
                onDelete={(book) => confirmDelete(book.id, book.title)}
                deleting={deletingId === item.id}
              />
            )}
          />
        )}

        {user && !authError && !error && hasMore ? (
          <TouchableOpacity style={styles.button} onPress={loadMore}>
            <Text style={styles.buttonText}>Carregar mais</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  recordsHeader: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    position: "relative",
  },
  recordsHeaderTitle: {
    color: AppColors.darkBlue,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  backButton: { position: "absolute", left: 0, top: 2 },
  addBookButton: { position: "absolute", right: 0, top: 4 },
  card: {
    position: "relative",
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  body: { color: AppColors.categoryText, lineHeight: 22 },
  list: { flex: 1, width: "100%" },
  recordItem: { marginBottom: 16 },
  button: {
    backgroundColor: AppColors.blue,
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
  },
  buttonText: { color: AppColors.white, fontWeight: "700" },
  link: { color: AppColors.blue, paddingVertical: 12 },
});
