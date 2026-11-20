import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types";
import BookTypeBadge from "../book-details/BookTypeBadge";

const CARD_WIDTH = (Dimensions.get("window").width - 60) / 2;

interface IBookGridCardProps {
  book: Book;
  onPress: (book: Book) => void;
  showDistance?: boolean;
  onDelete?: (book: Book) => void;
  deleting?: boolean;
}

const BookGridCard = (props: IBookGridCardProps) => {
  const { book, onPress, showDistance = true, onDelete, deleting = false } =
    props;
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(book)}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: book.thumbnail }} style={styles.cover} />
          <View style={styles.badgeOverlay}>
            <BookTypeBadge type={book.type} size="sm" />
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
          {showDistance && (
            <View style={styles.distanceRow}>
              <Ionicons
                name="location-outline"
                size={12}
                color={AppColors.graySecondary}
              />
              <Text style={styles.distance}>{book.distance}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {onDelete ? (
        <TouchableOpacity
          disabled={deleting}
          onPress={() => onDelete(book)}
          style={styles.deleteButton}
        >
          {deleting ? (
            <ActivityIndicator color={AppColors.danger} size="small" />
          ) : (
            <Ionicons name="trash-outline" size={18} color={AppColors.danger} />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default BookGridCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    position: "relative",
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.white,
    elevation: 2,
  },
  imageContainer: { position: "relative" },
  cover: { width: "100%", height: 150, backgroundColor: AppColors.border },
  badgeOverlay: { position: "absolute", bottom: 8, left: 8 },
  info: { padding: 10, gap: 3 },
  title: { fontSize: 13, fontWeight: "700", color: AppColors.darkBlue },
  author: { fontSize: 12, color: AppColors.graySecondary },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  distance: { fontSize: 11, color: AppColors.graySecondary },
});
