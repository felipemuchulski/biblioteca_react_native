import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface IBookTradeButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const BookTradeButton = (props: IBookTradeButtonProps) => {
  const { onPress, loading = false, disabled = false } = props;
  const inactive = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inactive}
      style={[styles.button, inactive && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={AppColors.white} />
      ) : (
        <>
          <Ionicons name="repeat" size={22} color={AppColors.white} />
          <Text style={styles.buttonLabel}>Oferecer livro para trocar</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default BookTradeButton;

const styles = StyleSheet.create({
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
  disabled: { opacity: 0.5 },
  buttonLabel: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
