import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IBookTradeButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showHelpButtonOnSide?: boolean;
}

const BookTradeButton = (props: IBookTradeButtonProps) => {
  const {
    onPress,
    loading = false,
    disabled = false,
    showHelpButtonOnSide = true,
  } = props;
  const inactive = disabled || loading;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPress}
        disabled={inactive}
        style={[
          styles.button,
          showHelpButtonOnSide && styles.buttonWithInfo,
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
      </TouchableOpacity>
      {showHelpButtonOnSide && (
        <TouchableOpacity
          onPress={onPress}
          disabled={inactive}
          style={[
            styles.infoButton,
            inactive && styles.disabled,
          ]}
        >
          <Ionicons name="information" size={25} color={AppColors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BookTradeButton;

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
  buttonWithInfo: { flex: 1 },
  infoButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AppColors.lightBlue,
    borderWidth: 2,
  },
  disabled: { opacity: 0.5 },
  buttonLabel: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
