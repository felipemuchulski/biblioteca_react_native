import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IConfirmBookRegisterButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  footer?: string;
  loading?: boolean;
  disabled?: boolean;
}

const ConfirmBookRegisterButton = (
  props: IConfirmBookRegisterButtonProps,
) => {
  const {
    label,
    onPress,
    icon,
    footer,
    loading = false,
    disabled = false,
  } = props;
  const inactive = disabled || loading;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        accessibilityLabel={label}
        onPress={onPress}
        disabled={inactive}
        style={[styles.button, inactive && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={AppColors.white} />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={22} color={AppColors.white} />}
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
      {!!footer && <Text style={styles.footer}>{footer}</Text>}
    </View>
  );
};

export default ConfirmBookRegisterButton;

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
  disabled: { opacity: 0.5 },
  label: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
  footer: { fontSize: 13, color: AppColors.graySecondary },
});
