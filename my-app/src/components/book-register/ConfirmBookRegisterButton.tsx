import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  footer?: string;
  loading?: boolean;
  disabled?: boolean;
};

export function ConfirmBookRegisterButton({
  label,
  onPress,
  icon,
  footer,
  loading = false,
  disabled = false,
}: Props) {
  const inactive = disabled || loading;

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: inactive, busy: loading }}
        onPress={onPress}
        disabled={inactive}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          inactive && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={AppColors.white} />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={22} color={AppColors.white} />}
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </Pressable>
      {!!footer && <Text style={styles.footer}>{footer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 12 },
  button: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
  footer: { fontSize: 13, color: AppColors.graySecondary },
});
