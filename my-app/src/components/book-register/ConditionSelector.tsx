import { AppColors } from "@/constants/colors";
import type { BookCondition } from "@/types/book";
import { Pressable, StyleSheet, Text, View } from "react-native";

const OPTIONS: { value: BookCondition; label: string; hint: string }[] = [
  {
    value: "new",
    label: "Novo",
    hint: "Nunca foi lido e não tem nenhuma marca.",
  },
  {
    value: "like_new",
    label: "Seminovo",
    hint: "Lido uma vez, praticamente sem sinais de uso.",
  },
  {
    value: "good",
    label: "Bom",
    hint: "Algumas marcas leves, com páginas limpas.",
  },
  {
    value: "worn",
    label: "Usado",
    hint: "Com marcas de uso, mas pronto para outra leitura.",
  },
];

type Props = {
  value: BookCondition | null;
  onChange: (value: BookCondition) => void;
  error?: string;
};

export function ConditionSelector({ value, onChange, error }: Props) {
  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Condição do livro</Text>

      <View accessibilityRole="radiogroup" style={styles.grid}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  option: {
    width: "48.5%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: AppColors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderWidth: 2 },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.blue,
  },
  hint: { fontSize: 13, color: AppColors.graySecondary },
  error: { fontSize: 13, color: AppColors.danger },
});
