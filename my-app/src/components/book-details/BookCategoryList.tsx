import { StyleSheet, Text, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types/book";
import { formatTitleToInternValue } from "@/utils/formatter";

interface BookCategoryListProps {
  book: Book;
}

export function BookCategoryList({ book }: BookCategoryListProps) {
  const { title, category } = book;

  function formatCategoryName(name: string) {
    if (!name) return "";

    const normalizedName = name.toLowerCase();

    return `${normalizedName.toLowerCase().charAt(0).toUpperCase()}${normalizedName.slice(1)}`;
  }

  return (
    <View style={styles.categoryListContainer}>
      {category.map((categoryItem, index) => (
        <Text
          key={`${formatTitleToInternValue(title)}-category-item-${index}`}
          style={styles.categoryText}
        >
          {`${index > 0 ? " \u2022 " : ""}${formatCategoryName(categoryItem)}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryListContainer: { flex: 1, flexDirection: "row" },
  categoryText: { color: AppColors.categoryText },
});
