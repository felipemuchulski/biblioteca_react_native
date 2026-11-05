import { AppColors } from "@/constants/colors";
import type { Book, BookCondition } from "@/types/book";
import { isEmptyObject } from "@/utils/verify";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const CONDITION_VALUES: Record<
  BookCondition,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  new: {
    label: "Novo",
    color: AppColors.donationText,
    icon: "checkmark-circle-outline",
  },
  like_new: {
    label: "Seminovo",
    color: AppColors.donationText,
    icon: "checkmark-circle-outline",
  },
  good: {
    label: "Em bom estado",
    color: AppColors.donationText,
    icon: "checkmark-circle-outline",
  },
  worn: {
    label: "Com marcas de uso",
    color: AppColors.exchangeText,
    icon: "alert-circle-outline",
  },
};

type BookAboutCardProps = Pick<Book, "bookCondition" | "bookConditionNote">;

export function BookAboutCard({
  bookCondition,
  bookConditionNote,
}: BookAboutCardProps) {
  const bookConditionInfos = bookCondition
    ? CONDITION_VALUES[bookCondition]
    : null;

  if (
    (isEmptyObject(bookConditionInfos) || bookConditionInfos === null) &&
    !bookConditionNote
  )
    return null;

  return (
    <View>
      <Text style={styles.title}>Sobre este exemplar</Text>
      <View style={styles.card}>
        {!isEmptyObject(bookConditionInfos) && (
          <View style={styles.conditionRow}>
            <Ionicons
              name={bookConditionInfos?.icon}
              size={20}
              color={bookConditionInfos?.color}
            />
            <Text
              style={[
                styles.conditionLabel,
                { color: bookConditionInfos?.color },
              ]}
            >
              {bookConditionInfos?.label}
            </Text>
          </View>
        )}

        {bookConditionNote ? (
          <Text style={styles.note}>“{bookConditionNote}”</Text>
        ) : (
          <Text>
            Opa, parece que esta obra não possui informações sobre sua condição!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: AppColors.darkBlue,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  conditionLabel: { fontSize: 14, fontWeight: "700" },
  note: { fontSize: 16, lineHeight: 24, color: AppColors.black },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.darkBlue,
    marginBottom: 10,
  },
});
