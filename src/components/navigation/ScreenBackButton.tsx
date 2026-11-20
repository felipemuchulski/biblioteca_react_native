import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import { AppColors } from "@/constants/colors";

const ScreenBackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/");
  };

  return (
    <TouchableOpacity
      accessibilityLabel="Voltar"
      onPress={handleGoBack}
      style={styles.button}
    >
      <Ionicons name="arrow-back" size={22} color={AppColors.darkBlue} />
    </TouchableOpacity>
  );
};

export default ScreenBackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
});
