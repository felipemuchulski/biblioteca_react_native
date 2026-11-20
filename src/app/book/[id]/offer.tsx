import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { useProfile } from "@/hooks/use-profile";
import { createTrade } from "../../../../database/trades";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenBackButton from "@/components/navigation/ScreenBackButton";

export default function TradeOfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, loading } = useBooks();
  const { user, profile } = useProfile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const requestedBook = books.find((book) => book.id === id);
  const myBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.ownerId === user?.uid &&
          book.id !== id &&
          book.available &&
          book.type === "exchange",
      ),
    [books, id, user?.uid],
  );

  const toggleBook = (bookId: string) => {
    if (!selectedIds.includes(bookId) && selectedIds.length >= 20) {
      setFeedback("Você pode oferecer até 20 livros em uma solicitação.");
      return;
    }
    setFeedback("");
    setSelectedIds((current) =>
      current.includes(bookId)
        ? current.filter((selectedId) => selectedId !== bookId)
        : [...current, bookId],
    );
  };

  const reviewOffer = () => {
    const offeredBooks = myBooks.filter((book) =>
      selectedIds.includes(book.id),
    );
    if (!requestedBook || !requestedBook.ownerId || !offeredBooks.length) {
      setFeedback(
        "Não foi possível criar a solicitação. Confira se o livro solicitado e os livros selecionados ainda estão disponíveis.",
      );
      return;
    }
    setFeedback("");
    setReviewing(true);
  };

  const submitOffer = async (offeredBooks: typeof myBooks) => {
    if (!requestedBook?.ownerId) return;
    setSubmitting(true);
    try {
      await createTrade({
        senderName: profile?.displayName || user?.displayName || "Usuário",
        senderContact: {
          email: user?.email ?? profile?.email ?? "",
          whatsapp: profile?.whatsapp ?? "",
        },
        recipientId: requestedBook.ownerId,
        recipientName: requestedBook.owner,
        offeredBooks: offeredBooks.map(({ id, title, author, thumbnail }) => ({
          id,
          title,
          author,
          thumbnail,
        })),
        requestedBook: {
          id: requestedBook.id,
          title: requestedBook.title,
          author: requestedBook.author,
          thumbnail: requestedBook.thumbnail,
        },
      });
      setReviewing(false);
      router.replace("/profile/my-trades");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Tente novamente mais tarde.";
      setFeedback(`Não foi possível enviar a solicitação. ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Modal
        visible={reviewing}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!submitting) setReviewing(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>
              Confirmar solicitação de troca
            </Text>
            <Text style={styles.reviewLabel}>Você oferece:</Text>
            {myBooks
              .filter((book) => selectedIds.includes(book.id))
              .map((book) => (
                <Text key={book.id} style={styles.reviewBook}>
                  • {book.title}
                </Text>
              ))}
            <Text style={styles.reviewLabel}>Em troca de:</Text>
            <Text style={styles.reviewBook}>{requestedBook?.title}</Text>
            <Text style={styles.reviewNote}>
              A solicitação será enviada como pendente. O destinatário poderá
              aceitá-la ou recusá-la.
            </Text>
            {!!feedback && (
              <Text accessibilityRole="alert" style={styles.feedback}>
                {feedback}
              </Text>
            )}
            <View style={styles.reviewActions}>
              <Pressable
                disabled={submitting}
                onPress={() => setReviewing(false)}
                style={({ pressed }) => [
                  styles.reviewButton,
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.backButtonLabel}>Voltar</Text>
              </Pressable>
              <Pressable
                disabled={submitting}
                onPress={() =>
                  void submitOffer(
                    myBooks.filter((book) => selectedIds.includes(book.id)),
                  )
                }
                style={({ pressed }) => [
                  styles.reviewButton,
                  styles.confirmButton,
                  submitting && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.submitLabel}>
                  {submitting ? "Enviando..." : "Confirmar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
        {!!feedback && !reviewing && (
          <Text accessibilityRole="alert" style={styles.feedback}>
            {feedback}
          </Text>
        )}

        {loading ? (
          <Text style={styles.empty}>Carregando seus livros...</Text>
        ) : myBooks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="book-outline"
              size={32}
              color={AppColors.graySecondary}
            />
            <Text style={styles.emptyTitle}>
              Nenhum livro disponível para troca
            </Text>
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
                  style={({ pressed }) => [
                    styles.bookCard,
                    selected && styles.bookCardSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    source={{ uri: book.thumbnail }}
                    style={styles.cover}
                  />
                  <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text style={styles.author} numberOfLines={1}>
                      {book.author}
                    </Text>
                    <Text style={styles.availability}>
                      Disponível para troca
                    </Text>
                  </View>
                  <Ionicons
                    name={selected ? "checkbox" : "square-outline"}
                    size={25}
                    color={
                      selected ? AppColors.lightBlue : AppColors.graySecondary
                    }
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
          disabled={selectedIds.length === 0 || submitting}
          style={({ pressed }) => [
            styles.submit,
            (selectedIds.length === 0 || submitting) && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.submitLabel}>
            {submitting
              ? "Enviando solicitação..."
              : selectedIds.length
                ? `Revisar oferta (${selectedIds.length})`
                : "Selecione um livro"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  headerSpacer: { width: 40 },
  content: { padding: 20, gap: 16, flexGrow: 1 },
  title: { color: AppColors.bookTitleText, fontSize: 24, fontWeight: "800" },
  description: { color: AppColors.categoryText, fontSize: 15, lineHeight: 22 },
  list: { gap: 12, paddingBottom: 20 },
  bookCard: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
  },
  bookCardSelected: {
    borderColor: AppColors.lightBlue,
    borderWidth: 2,
    backgroundColor: AppColors.panel,
  },
  cover: {
    width: 64,
    height: 88,
    borderRadius: 8,
    backgroundColor: AppColors.border,
  },
  bookDetails: { flex: 1, gap: 5 },
  bookTitle: {
    color: AppColors.bookTitleText,
    fontSize: 16,
    fontWeight: "700",
  },
  author: { color: AppColors.categoryText, fontSize: 14 },
  availability: {
    color: AppColors.exchangeText,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyCard: {
    alignItems: "center",
    padding: 28,
    gap: 12,
    backgroundColor: AppColors.white,
    borderRadius: 16,
  },
  emptyTitle: {
    color: AppColors.bookTitleText,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  empty: {
    color: AppColors.graySecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: AppColors.background,
  },
  submit: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: AppColors.lightBlue,
  },
  submitLabel: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  reviewCard: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    padding: 22,
    gap: 12,
    borderRadius: 20,
    backgroundColor: AppColors.white,
  },
  reviewTitle: {
    color: AppColors.bookTitleText,
    fontSize: 20,
    fontWeight: "800",
  },
  reviewLabel: {
    marginTop: 4,
    color: AppColors.categoryText,
    fontSize: 14,
    fontWeight: "700",
  },
  reviewBook: { color: AppColors.darkBlue, fontSize: 15, lineHeight: 21 },
  reviewNote: { color: AppColors.graySecondary, fontSize: 13, lineHeight: 19 },
  feedback: { color: AppColors.danger, fontSize: 14, lineHeight: 20 },
  reviewActions: { flexDirection: "row", gap: 10, marginTop: 6 },
  reviewButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  backButton: { backgroundColor: AppColors.border },
  backButtonLabel: {
    color: AppColors.darkBlue,
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButton: { backgroundColor: AppColors.lightBlue },
});
