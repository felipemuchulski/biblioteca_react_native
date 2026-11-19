import BookAboutCard from "@/components/book-details/BookAboutCard";
import BookCategoryList from "@/components/book-details/BookCategoryList";
import BookImagesCarousel from "@/components/book-details/BookImagesCarousel";
import BookOwnerCard from "@/components/book-details/BookOwnerCard";
import BookTradeButton from "@/components/book-details/BookTradeButton";
import BookTradeInfoCard from "@/components/book-details/BookTradeInfoCard";
import BookTypeBadge from "@/components/book-details/BookTypeBadge";
import CustomHeader from "@/components/common/CustomHeader";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { useProfile } from "@/hooks/use-profile";
import { deleteBook } from "../../../database/books";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books } = useBooks();
  const router = useRouter();
  const { user } = useProfile();
  const book = books?.find((book) => book.id === id);
  const [deleting, setDeleting] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string>(
    book?.images[0] || "",
  );

  const mainImage =
    selectedImage && book?.images.includes(selectedImage)
      ? selectedImage
      : book?.images[0];

  if (!book) {
    return (
      <View style={styles.safe}>
        <Text style={styles.notFound}>Livro não encontrado.</Text>
      </View>
    );
  }

  const currentImageIndex = mainImage ? book.images.indexOf(mainImage) + 1 : 0;

  const isExchange = book.type === "exchange";
  const isOwner = !!user?.uid && book.ownerId === user.uid;

  const confirmDelete = () => {
    Alert.alert(
      "Excluir livro",
      `Tem certeza de que deseja excluir "${book.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void removeBook(),
        },
      ],
    );
  };

  const removeBook = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteBook(book.id);
      router.replace("/");
    } catch (cause) {
      Alert.alert(
        "Erro ao excluir",
        cause instanceof Error
          ? cause.message
          : "Não foi possível excluir o livro.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.safe}>
      <CustomHeader isToShowBackArrow backArrowRoute="/" isToShowLike />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: mainImage }} style={styles.cover} />
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
            <Text style={styles.meta}>{book.distance}</Text>
            <Ionicons
              name="person-outline"
              size={14}
              color={AppColors.graySecondary}
            />
            <Text
              style={styles.ownerMeta}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {book.owner}
              {isOwner ? <Text style={styles.you}> (você)</Text> : null}
            </Text>
          </View>
        </View>

        <View style={styles.sections}>
          <BookAboutCard
            bookCondition={book.bookCondition}
            bookConditionNote={book.bookConditionNote}
          />

          <BookOwnerCard
            owner={book.owner}
            isOwner={isOwner}
            distance={book.distance}
            distanceMeters={book.distanceMeters}
            ownerNeighborhood={book.ownerNeighborhood}
            ownerCity={book.ownerCity}
          />

          {isExchange && !isOwner && (
            <>
              <BookTradeInfoCard ownerName={book.owner} />
              <BookTradeButton
                onPress={() => router.push(`/book/${book.id}/offer`)}
                disabled={!book.available}
              />
            </>
          )}
          {isOwner && (
            <TouchableOpacity
              disabled={deleting}
              onPress={confirmDelete}
              style={[styles.deleteButton, deleting && styles.disabled]}
            >
              {deleting ? (
                <ActivityIndicator color={AppColors.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={AppColors.white}
                  />
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: 24, backgroundColor: AppColors.background },
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
  ownerMeta: {
    flexShrink: 1,
    maxWidth: 160,
    fontSize: 13,
    color: AppColors.graySecondary,
  },
  you: { fontSize: 11, color: AppColors.graySecondary },
  deleteButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  deleteButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: { opacity: 0.5 },
  notFound: {
    textAlign: "center",
    marginTop: 40,
    color: AppColors.graySecondary,
  },
  imageContainer: { width: "100%", position: "relative" },
  sections: { width: "100%", gap: 24, marginTop: 12 },
});
