import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type BookTradeInfoCardProps = {
  ownerName: string;
};

export function BookTradeInfoCard({ ownerName }: BookTradeInfoCardProps) {
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.title}>
        Gostou? Ofereça um livro.
      </Text>
      <Text style={styles.subtitle}>
        No Livroei não há chat. Você demonstra interesse anunciando um livro em
        troca.
      </Text>

      <View style={styles.step}>
        <View style={styles.iconBox}>
          <Ionicons name="book-outline" size={20} color={AppColors.lightBlue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>Anuncie o seu exemplar</Text>
          <Text style={styles.stepDesc}>
            Adicione fotos e informações do livro que quer oferecer.
          </Text>
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.iconBox}>
          <Ionicons
            name="swap-horizontal-outline"
            size={20}
            color={AppColors.lightBlue}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={styles.stepTitle}
          >{`Ofereça a troca ao ${ownerName}`}</Text>
          <Text style={styles.stepDesc}>
            Ele recebe seu anúncio para avaliar a proposta.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#d1d5e0",
    borderRadius: 18,
    padding: 16,
    shadowColor: AppColors.darkBlue,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.darkBlue,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.categoryText,
    marginBottom: 14,
  },
  step: { flexDirection: "row", gap: 12, marginBottom: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { fontSize: 15, fontWeight: "700", color: AppColors.darkBlue },
  stepDesc: { fontSize: 13, color: AppColors.black, marginTop: 2 },
});
