import { ScreenBackButton } from "@/components/navigation/ScreenBackButton";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { useProfile } from "@/hooks/use-profile";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TradeOfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, loading } = useBooks();
  const { user } = useProfile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const requestedBook = books.find((book) => book.id === id);
  const myBooks = useMemo(
    () => books.filter((book) => book.ownerId === user?.uid && book.id !== id && book.available && book.type === "exchange"),
    [books, id, user?.uid],
  );

  const toggleBook = (bookId: string) => {
    setSelectedIds((current) =>
      current.includes(bookId)
        ? current.filter((selectedId) => selectedId !== bookId)
        : [...current, bookId],
    );
  };

  const reviewOffer = () => {
    const titles = myBooks
      .filter((book) => selectedIds.includes(book.id))
      .map((book) => book.title);
    Alert.alert(
      "Livros selecionados",
      `${titles.join(", ")}\n\nO envio de propostas será habilitado em uma próxima etapa.`,
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <ScreenBackButton />
        <Text style={styles.headerTitle}>Oferecer troca</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Qual livro você oferece?</Text>
        <Text style={styles.description}>
          Selecione um ou mais livros seus disponíveis para troca
          {requestedBook ? ` por “${requestedBook.title}”.` : "."}
        </Text>

        {loading ? (
          <Text style={styles.empty}>Carregando seus livros...</Text>
        ) : myBooks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={32} color={AppColors.graySecondary} />
            <Text style={styles.emptyTitle}>Nenhum livro disponível para troca</Text>
            <Text style={styles.empty}>
              Seus livros marcados como troca e disponíveis aparecerão aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {myBooks.map((book) => {
              const selected = selectedIds.includes(book.id);
              return (
                <Pressable
                  key={book.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  onPress={() => toggleBook(book.id)}
                  style={({ pressed }) => [styles.bookCard, selected && styles.bookCardSelected, pressed && styles.pressed]}
                >
                  <Image source={{ uri: book.thumbnail }} style={styles.cover} />
                  <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                    <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
                    <Text style={styles.availability}>Disponível para troca</Text>
                  </View>
                  <Ionicons
                    name={selected ? "checkbox" : "square-outline"}
                    size={25}
                    color={selected ? AppColors.lightBlue : AppColors.graySecondary}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={reviewOffer}
          disabled={selectedIds.length === 0}
          style={({ pressed }) => [styles.submit, selectedIds.length === 0 && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={styles.submitLabel}>
            {selectedIds.length ? `Revisar oferta (${selectedIds.length})` : "Selecione um livro"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  headerSpacer: { width: 40 },
  content: { padding: 20, gap: 16, flexGrow: 1 },
  title: { color: AppColors.bookTitleText, fontSize: 24, fontWeight: "800" },
  description: { color: AppColors.categoryText, fontSize: 15, lineHeight: 22 },
  list: { gap: 12, paddingBottom: 20 },
  bookCard: { minHeight: 112, flexDirection: "row", alignItems: "center", gap: 14, padding: 12, backgroundColor: AppColors.white, borderWidth: 1, borderColor: AppColors.border, borderRadius: 16 },
  bookCardSelected: { borderColor: AppColors.lightBlue, borderWidth: 2, backgroundColor: AppColors.panel },
  cover: { width: 64, height: 88, borderRadius: 8, backgroundColor: AppColors.border },
  bookDetails: { flex: 1, gap: 5 },
  bookTitle: { color: AppColors.bookTitleText, fontSize: 16, fontWeight: "700" },
  author: { color: AppColors.categoryText, fontSize: 14 },
  availability: { color: AppColors.exchangeText, fontSize: 12, fontWeight: "600" },
  emptyCard: { alignItems: "center", padding: 28, gap: 12, backgroundColor: AppColors.white, borderRadius: 16 },
  emptyTitle: { color: AppColors.bookTitleText, fontSize: 16, fontWeight: "700", textAlign: "center" },
  empty: { color: AppColors.graySecondary, textAlign: "center", lineHeight: 21 },
  footer: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: AppColors.background },
  submit: { minHeight: 54, alignItems: "center", justifyContent: "center", borderRadius: 27, backgroundColor: AppColors.lightBlue },
  submitLabel: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
});
