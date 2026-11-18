import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { BookType } from "@/types/book";
import { formatCarouselPagination } from "@/utils/formatter";

interface IBookTypeBadgeProps {
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
const BookTypeBadge = (props: IBookTypeBadgeProps) => {
  const { type, size = "md", index = 0, maxLength = 0 } = props;
  const bookBadgeConfig = BOOK_TYPE_CONFIG[type];
  const isSmall = size === "sm";
  const isPagination = type === "pagination";
  const text = formatCarouselPagination(
    bookBadgeConfig.label,
    index,
    maxLength,
  );

  const badgeBackgroundStyle =
    type === "exchange"
      ? styles.badgeExchange
      : type === "pagination"
        ? styles.badgePagination
        : styles.badgeDonation;
  const textColorStyle =
    type === "exchange"
      ? styles.textExchange
      : type === "pagination"
        ? styles.textPagination
        : styles.textDonation;

  if (type === "pagination" && !index && !maxLength) return null;

  return (
    <View
      style={[
        styles.badge,
        badgeBackgroundStyle,
        isSmall && styles.badgeSm,
        isPagination && styles.pagination,
      ]}
    >
      <Ionicons
        name={bookBadgeConfig.icon}
        size={isSmall ? 10 : 12}
        color={bookBadgeConfig.textColor}
      />
      <Text style={[styles.text, textColorStyle, isSmall && styles.textSm]}>
        {type !== "pagination" ? bookBadgeConfig.label : text}
      </Text>
    </View>
  );
};

export default BookTypeBadge;

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
  text: { fontSize: 12, fontWeight: "600" },
  badgeDonation: { backgroundColor: AppColors.donationBg },
  badgeExchange: { backgroundColor: AppColors.exchangeBg },
  badgePagination: { backgroundColor: AppColors.white },
  textDonation: { color: AppColors.donationText },
  textExchange: { color: AppColors.exchangeText },
  textPagination: { color: AppColors.blue },
  textSm: { fontSize: 10 },
  pagination: {
    minWidth: 60,
    gap: 6,
    position: "absolute",
    bottom: 14,
    right: 14,
    justifyContent: "space-between",
  },
});
