import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types/book";
import BookTypeBadge from "./BookTypeBadge";

const CARD_WIDTH = (Dimensions.get("window").width - 48) / 2;

interface IBookGridCardProps {
  book: Book;
  onPress: (book: Book) => void;
  showDistance?: boolean;
}

const BookGridCard = (props: IBookGridCardProps) => {
  const { book, onPress, showDistance = true } = props;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(book)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.thumbnail }}
          style={styles.cover}
        />
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
        {showDistance && <View style={styles.distanceRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={AppColors.graySecondary}
          />
          <Text style={styles.distance}>{book.distance}</Text>
        </View>}
      </View>
    </TouchableOpacity>
  );
};

export default BookGridCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 12,
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
