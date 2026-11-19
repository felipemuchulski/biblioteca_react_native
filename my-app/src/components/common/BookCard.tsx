import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types";
import BookTypeBadge from "../book-details/BookTypeBadge";

interface IBookCardProps {
  book: Book;
  onToggleFavorite: (id: string) => void;
  onPress: (book: Book) => void;
}

const BookCard = (props: IBookCardProps) => {
  const { book, onPress } = props;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(book)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: book.thumbnail }} style={styles.cover} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <BookTypeBadge type={book.type} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="location-outline"
              size={13}
              color={AppColors.graySecondary}
            />
            <Text style={styles.meta}>{book.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="person-outline"
              size={13}
              color={AppColors.graySecondary}
            />
            <Text
              style={styles.ownerName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {book.owner}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 3,
  },
  cover: {
    width: 96,
    height: 128,
    borderRadius: 10,
    backgroundColor: AppColors.border,
  },
  info: { flex: 1, justifyContent: "space-between" },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.darkBlue,
    marginTop: 6,
  },
  author: { fontSize: 13, color: AppColors.graySecondary, marginTop: 2 },
  bottomRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3, flexShrink: 1 },
  meta: { fontSize: 12, color: AppColors.graySecondary },
  ownerName: {
    flexShrink: 1,
    maxWidth: 120,
    fontSize: 12,
    color: AppColors.graySecondary,
  },
});
