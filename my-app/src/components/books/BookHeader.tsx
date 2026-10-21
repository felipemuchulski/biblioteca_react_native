import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppColors } from "@/constants/colors";
import { useRouter } from "expo-router";

export function BookHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={AppColors.darkBlue} />
      </TouchableOpacity>

      <Pressable onPress={() => router.push({ pathname: "/", params: {} })}>
        <Text style={styles.logo}>
          <TouchableOpacity style={styles.logoIcon}>
            <Ionicons
              name="book-outline"
              size={17}
              color={AppColors.darkBlue}
            />
          </TouchableOpacity>
          Livroei
        </Text>
      </Pressable>

      <TouchableOpacity style={styles.wishlistBtn}>
        <Ionicons name="heart-outline" size={20} color={AppColors.darkBlue} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: AppColors.darkBlue,
    letterSpacing: 0.5,
    alignItems: "center",
    justifyContent: "center",
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
  addBtn: {
    backgroundColor: AppColors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistBtn: {
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
});
