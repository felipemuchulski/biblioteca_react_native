import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { AddBookButton } from "@/components/home/AddBookButton";

export function HomeHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Meu perfil"
        onPress={() => router.push("/profile")}
        style={styles.iconBtn}
      >
        <Ionicons
          name="person-circle-outline"
          size={28}
          color={AppColors.darkBlue}
        />
      </TouchableOpacity>
      <Text style={styles.logo}>
        <TouchableOpacity style={styles.logoIcon}>
          <Ionicons name="book-outline" size={17} color={AppColors.darkBlue} />
        </TouchableOpacity>
        Livroei
      </Text>
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="search-outline"
            size={24}
            color={AppColors.darkBlue}
          />
        </TouchableOpacity>
        <AddBookButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: AppColors.darkBlue,
    letterSpacing: 0.5,
  },
  logoIcon: {
    backgroundColor: AppColors.logoBox,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  rightActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { padding: 4 },
});
