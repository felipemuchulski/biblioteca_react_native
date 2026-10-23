import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type BookTradeButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showHelpButtonOnSide?: boolean;
};

export function BookTradeButton({
  onPress,
  loading = false,
  disabled = false,
  showHelpButtonOnSide = true,
}: BookTradeButtonProps) {
  const inactive = disabled || loading;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        disabled={inactive}
        style={({ pressed }) => [
          styles.button,
          { flex: showHelpButtonOnSide ? 1 : undefined },
          pressed && styles.pressed,
          inactive && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={AppColors.white} />
        ) : (
          <>
            <Ionicons name="repeat" size={22} color={AppColors.white} />
            <Text style={styles.buttonLabel}>Oferecer livro para trocar</Text>
          </>
        )}
      </Pressable>
      {showHelpButtonOnSide && (
        <Pressable
          onPress={onPress}
          disabled={inactive}
          style={({ pressed }) => [
            styles.infoButton,
            pressed && styles.pressed,
            inactive && styles.disabled,
          ]}
        >
          <Ionicons name="information" size={25} color={AppColors.black} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12, flexDirection: "row", alignItems: "center" },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  infoButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AppColors.lightBlue,
    borderWidth: 2,
  },
  pressed: { backgroundColor: AppColors.darkBlue },
  disabled: { opacity: 0.5 },
  buttonLabel: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
