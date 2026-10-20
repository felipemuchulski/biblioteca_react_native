import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { BookType } from "@/types/book";
import { formatCarouselPagination } from "@/utils/formatter";

interface BookTypeBadgeProps {
  type: BookType;
  size?: "sm" | "md";
  index?: number;
  maxLength?: number;
}

interface BookTypeBadgeConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  textColor: string;
}

const BOOK_TYPE_CONFIG: Record<BookType, BookTypeBadgeConfig> = {
  donation: {
    label: "Doação",
    icon: "heart",
    backgroundColor: AppColors.donationBg,
    textColor: AppColors.donationText,
  },
  exchange: {
    label: "Troca",
    icon: "swap-horizontal",
    backgroundColor: AppColors.exchangeBg,
    textColor: AppColors.exchangeText,
  },
  pagination: {
    label: "x / y",
    icon: "images-sharp",
    backgroundColor: AppColors.white,
    textColor: AppColors.blue,
  },
};
export function BookTypeBadge({
  type,
  size = "md",
  index = 0,
  maxLength = 0,
}: BookTypeBadgeProps) {
  const bookBadgeConfig = BOOK_TYPE_CONFIG[type];
  const isSmall = size === "sm";
  const isPagination = type === "pagination";
  const text = formatCarouselPagination(
    bookBadgeConfig.label,
    index,
    maxLength,
  );

  if (type === "pagination" && !index && !maxLength) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bookBadgeConfig.backgroundColor },
        isSmall && styles.badgeSm,
        isPagination && styles.pagination,
      ]}
    >
      <Ionicons
        name={bookBadgeConfig.icon}
        size={isSmall ? 10 : 12}
        color={bookBadgeConfig.textColor}
      />
      <Text
        style={[
          styles.text,
          { color: bookBadgeConfig.textColor },
          isSmall && styles.textSm,
        ]}
      >
        {type !== "pagination" ? bookBadgeConfig.label : text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  donationBg: { backgroundColor: AppColors.donationBg },
  exchangeBg: { backgroundColor: AppColors.exchangeBg },
  text: { fontSize: 12, fontWeight: "600" },
  textSm: { fontSize: 10 },
  donationText: { color: AppColors.donationText },
  exchangeText: { color: AppColors.exchangeText },
  pagination: {
    gap: 6,
    position: "absolute",
    bottom: 14,
    right: 14,
  },
});
