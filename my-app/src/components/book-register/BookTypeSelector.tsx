import { AppColors } from "@/constants/colors";
import type { BookType } from "@/types/book";
import { Pressable, StyleSheet, Text, View } from "react-native";

const OPTIONS: { value: BookType; label: string; hint: string }[] = [
  {
    value: "exchange",
    label: "Troca",
    hint: "Troque este livro por outro exemplar.",
  },
  {
    value: "donation",
    label: "Doação",
    hint: "Disponibilize este livro para alguém.",
  },
];

type Props = {
  value: BookType | null;
  onChange: (value: BookType) => void;
  error?: string;
};

export function BookTypeSelector({ value, onChange, error }: Props) {
  const selected = OPTIONS.find((option) => option.value === value);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>O que pretende fazer com a obra?</Text>
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : selected ? (
        <Text style={styles.hint}>{selected.hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: AppColors.darkBlue },
  options: { flexDirection: "row", gap: 10 },
  option: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.actionborder,
    borderRadius: 14,
  },
  optionSelected: {
    backgroundColor: AppColors.panel,
    borderColor: AppColors.blue,
  },
  optionLabel: { fontSize: 15, color: AppColors.categoryText },
  optionLabelSelected: { color: AppColors.darkBlue, fontWeight: "700" },
  hint: { fontSize: 13, color: AppColors.graySecondary },
  error: { fontSize: 13, color: AppColors.danger },
});
