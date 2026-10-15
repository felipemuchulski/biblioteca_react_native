import { BookTypeBadge } from "@/components/books/BookTypeBadge";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookHeader } from "./BookHeader";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books, selectedBook } = useBooks();
  const book = books?.find(
    (book) => book.id === selectedBook?.id && book.id === id,
  );

  if (!book) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Livro não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <BookHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: book.image }}
          style={styles.cover}
          defaultSource={require("@/assets/images/icon.png")}
        />
        <View style={styles.info}>
          <BookTypeBadge type={book.type} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={AppColors.graySecondary}
            />
            <Text style={styles.meta}>{book.distance}</Text>
            <Ionicons
              name="person-outline"
              size={14}
              color={AppColors.graySecondary}
            />
            <Text style={styles.meta}>{book.owner}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  backText: { fontSize: 15, color: AppColors.darkBlue, fontWeight: "500" },
  content: { alignItems: "center", padding: 24, gap: 16 },
  cover: {
    width: 180,
    height: 240,
    borderRadius: 14,
    backgroundColor: AppColors.border,
  },
  info: { width: "100%", gap: 8 },
  title: { fontSize: 22, fontWeight: "800", color: AppColors.darkBlue },
  author: { fontSize: 15, color: AppColors.graySecondary },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  meta: { fontSize: 13, color: AppColors.graySecondary },
  notFound: {
    textAlign: "center",
    marginTop: 40,
    color: AppColors.graySecondary,
  },
});
