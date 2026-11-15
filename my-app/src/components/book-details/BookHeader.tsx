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
import { ScreenBackButton } from "@/components/navigation/ScreenBackButton";

export function BookHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenBackButton />

      <Pressable
        style={styles.logoContainer}
        onPress={() => router.push({ pathname: "/", params: {} })}
      >
        <Text style={styles.logo}>
          <View style={styles.logoIcon}>
            <Ionicons
              name="book-outline"
              size={17}
              color={AppColors.darkBlue}
            />
          </View>
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
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    gap: 7,
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
});
