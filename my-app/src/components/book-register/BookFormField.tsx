import { AppColors } from "@/constants/colors";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function BookFormField({
  label,
  error,
  hint,
  style,
  multiline,
  ...inputProps
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={AppColors.graySecondary}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[
          styles.input,
          multiline && styles.multiline,
          !!error && styles.inputError,
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: AppColors.darkBlue },
  input: {
    minHeight: 52,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.actionborder,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: AppColors.bookTitleText,
  },
  multiline: { minHeight: 112, paddingTop: 14, paddingBottom: 14 },
  inputError: { borderColor: AppColors.danger },
  hint: { fontSize: 13, color: AppColors.graySecondary, lineHeight: 18 },
  error: { fontSize: 13, color: AppColors.danger },
});
