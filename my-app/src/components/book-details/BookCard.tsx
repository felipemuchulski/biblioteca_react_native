import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types/book";
import { BookTypeBadge } from "./BookTypeBadge";

interface BookCardProps {
  book: Book;
  onToggleFavorite: (id: string) => void;
  onPress: (book: Book) => void;
}

export function BookCard({ book, onToggleFavorite, onPress }: BookCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(book)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: book.thumbnail }}
        style={styles.cover}
        defaultSource={require("@/assets/images/icon.png")}
      />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <BookTypeBadge type={book.type} />
          <TouchableOpacity
            onPress={() => onToggleFavorite(book.id)}
            hitSlop={8}
          >
            <Ionicons
              name={book.isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={book.isFavorite ? "#E05C5C" : AppColors.graySecondary}
            />
          </TouchableOpacity>
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
            <Text style={styles.meta}>{book.owner}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
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
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  meta: { fontSize: 12, color: AppColors.graySecondary },
});
