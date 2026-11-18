import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import { AppColors } from "@/constants/colors";

const AddBookButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      accessibilityLabel="Cadastrar um livro"
      onPress={() => router.push("/register-book")}
      style={styles.button}
    >
      <Ionicons name="add" size={22} color={AppColors.white} />
    </TouchableOpacity>
  );
};

export default AddBookButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
