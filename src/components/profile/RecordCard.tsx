import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppColors } from "@/constants/colors";
import type { ProfileRecord, RecordKind } from "@/hooks/use-profile-records";
import BookCover from "./BookCover";
import TradeRecordCard from "./TradeRecordCard";
import { Book, TradeAction } from "@/types";

interface IRecordCardProps {
  item: ProfileRecord;
  kind: RecordKind;
  deleting: boolean;
  onDelete: (id: string, title: string) => void;
  currentUid?: string;
  responding?: boolean;
  onTradeAction?: (id: string, action: TradeAction) => void;
}

const RecordCard = (props: IRecordCardProps) => {
  const {
    item,
    kind,
    deleting,
    onDelete,
    currentUid,
    responding,
    onTradeAction,
  } = props;

  if (kind === "trades") {
    return (
      <TradeRecordCard
        item={item}
        currentUid={currentUid}
        responding={responding}
        onTradeAction={onTradeAction}
      />
    );
  }

  const data = item.data as Book;
  const imageUri =
    data.images?.find((image) => !!image.trim()) || data.thumbnail;

  return (
    <View style={styles.card}>
      <View style={styles.bookImageContainer}>
        {imageUri ? (
          <BookCover uri={imageUri} />
        ) : (
          <Text style={styles.imageFallback}>Falha ao carregar imagem</Text>
        )}
      </View>
      <Text style={styles.title}>{data.title || "Livro sem título"}</Text>
      <Text style={styles.body}>{data.author || "Autor não informado"}</Text>
      <Text style={styles.body}>
        {data.type === "donation"
          ? "Doação"
          : data.type === "exchange"
            ? "Troca"
            : "Modalidade não informada"}
      </Text>
      <Text style={styles.body}>
        {data.available === true
          ? "Disponível"
          : data.available === false
            ? "Indisponível"
            : "Disponibilidade não informada"}
      </Text>
      <TouchableOpacity
        accessibilityLabel={`Excluir livro ${data.title ?? ""}`}
        disabled={deleting}
        onPress={() => onDelete(item.id, data.title || "este livro")}
        style={[styles.deleteButton, deleting && styles.disabledButton]}
      >
        {deleting ? (
          <ActivityIndicator color={AppColors.danger} size="small" />
        ) : (
          <Ionicons name="trash-outline" size={19} color={AppColors.danger} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RecordCard;

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  bookImageContainer: {
    width: 112,
    height: 148,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: AppColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  imageFallback: {
    color: AppColors.categoryText,
    textAlign: "center",
    padding: 8,
    lineHeight: 20,
  },
  title: {
    color: AppColors.darkBlue,
    fontSize: 18,
    fontWeight: "700",
  },
  body: { color: AppColors.categoryText, lineHeight: 22 },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FCEBEC",
  },
  disabledButton: { opacity: 0.6 },
});
