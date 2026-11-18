import { AppColors } from "@/constants/colors";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { StyleProp, TextStyle } from "react-native";

interface IBookFormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  multiline?: boolean;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<TextStyle>;
}

const BookFormField = (props: IBookFormFieldProps) => {
  const {
    label,
    value,
    onChangeText,
    placeholder,
    error,
    hint,
    style,
    multiline,
    maxLength,
    autoCapitalize,
  } = props;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multiline,
          !!error && styles.inputError,
          style,
        ]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

export default BookFormField;

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
