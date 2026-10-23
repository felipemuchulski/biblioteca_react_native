import { AppColors } from "@/constants/colors";
import type { Book } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type BookOwnerCardProps = Pick<
  Book,
  "owner" | "distance" | "ownerNeighborhood" | "ownerCity"
>;

export function BookOwnerCard({
  owner,
  distance,
  ownerNeighborhood,
  ownerCity,
}: BookOwnerCardProps) {
  const formattedOwnerName = owner?.trim().charAt(0).toUpperCase() || "?";
  const formattedLocation = [ownerNeighborhood, ownerCity]
    .filter(Boolean)
    .join(", ");

  if (!formattedOwnerName || !formattedLocation) return null;

  return (
    <View>
      <Text style={styles.title}>Na estante de</Text>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{formattedOwnerName}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{owner}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color={AppColors.blue} />
          <View style={{ flex: 1 }}>
            <Text style={styles.distance}>
              A aproximadamente {distance} de você
            </Text>
            {formattedLocation && (
              <Text style={styles.place}>{formattedLocation}</Text>
            )}
          </View>
        </View>

        <Text style={styles.privacy}>
          Para sua privacidade, não exibimos endereços exatos.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: AppColors.darkBlue,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: AppColors.darkBlue },
  name: { fontSize: 17, fontWeight: "700", color: AppColors.darkBlue },
  locationRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  distance: { fontSize: 15, fontWeight: "700", color: AppColors.blue },
  place: { fontSize: 13, color: AppColors.categoryText, marginTop: 2 },
  privacy: { fontSize: 12, color: AppColors.categoryText },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.darkBlue,
    marginBottom: 10,
  },
});
