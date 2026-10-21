import { BookCategoryList } from "@/components/books/BookCategoryList";
import { BookImagesCarousel } from "@/components/books/BookImagesCarousel";
import { BookTypeBadge } from "@/components/books/BookTypeBadge";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookHeader } from "../../components/books/BookHeader";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books } = useBooks();
  const book = books?.find((book) => book.id === id);

  const [selectedImage, setSelectedImage] = useState<string>(
    book?.images[0] || "",
  );

  const mainImage =
    selectedImage && book?.images.includes(selectedImage)
      ? selectedImage
      : book?.images[0];

  if (!book) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Livro não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const currentImageIndex = mainImage
    ? book?.images?.indexOf(mainImage) + 1
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <BookHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: mainImage }}
            style={styles.cover}
            defaultSource={require("@/assets/images/icon.png")}
          />
          <BookTypeBadge
            type="pagination"
            index={currentImageIndex}
            maxLength={book.images.length}
          />
        </View>
        <BookImagesCarousel
          book={book}
          bookImages={book.images}
          selectedImage={selectedImage}
          onPress={setSelectedImage}
        />
        <View style={styles.info}>
          <BookTypeBadge type={book.type} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <BookCategoryList book={book} />
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={AppColors.graySecondary}
            />
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
  content: { alignItems: "center", padding: 20, gap: 12 },
  cover: {
    width: "100%",
    height: 350,
    borderRadius: 24,
    backgroundColor: AppColors.border,
  },
  info: { width: "100%", gap: 8 },
  title: { fontSize: 22, fontWeight: "800", color: AppColors.bookTitleText },
  author: { fontSize: 15, color: AppColors.categoryText },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  meta: { fontSize: 13, color: AppColors.graySecondary },
  notFound: {
    textAlign: "center",
    marginTop: 40,
    color: AppColors.graySecondary,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },
});
