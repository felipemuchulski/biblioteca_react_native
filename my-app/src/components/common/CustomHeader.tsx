import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";

type Props = {
  isToShowBackArrow?: boolean;
  backArrowRoute?: Href;
  isToShowLike?: boolean;
  isLiked?: boolean;
  onLikePress?: () => void;
};

export function CustomHeader({
  isToShowBackArrow = false,
  backArrowRoute,
  isToShowLike = false,
  isLiked = false,
  onLikePress,
}: Props) {
  const router = useRouter();
  const { loading, user } = useProfile();

  return (
    <View style={styles.container}>
      {isToShowBackArrow ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() =>
            backArrowRoute ? router.push(backArrowRoute) : router.back()
          }
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color={AppColors.darkBlue} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Meu perfil"
          disabled={loading}
          onPress={() => router.push(user ? "/profile" : "/login")}
          style={styles.iconButton}
        >
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={AppColors.darkBlue}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.logo}>
        <TouchableOpacity style={styles.logoIcon}>
          <Ionicons name="book-outline" size={17} color={AppColors.darkBlue} />
        </TouchableOpacity>
        Livroei
      </Text>
      <View style={styles.actions}>
        {isToShowLike ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isLiked ? "Remover dos favoritos" : "Favoritar"}
            disabled={!onLikePress}
            onPress={onLikePress}
            style={styles.likeButton}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={AppColors.darkBlue}
            />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.push("/register-book")}
              style={styles.addButton}
            >
              <Ionicons name="add" size={22} color={AppColors.white} />
            </TouchableOpacity>
          </>
        )}
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
    marginRight: 10,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconButton: { padding: 4 },
  likeButton: {
    backgroundColor: AppColors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: AppColors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
