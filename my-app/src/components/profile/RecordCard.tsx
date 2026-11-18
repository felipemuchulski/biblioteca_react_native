import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppColors } from "@/constants/colors";
import type {
  ProfileRecord,
  RecordKind,
} from "@/hooks/use-profile-records";
import BookCover from "./BookCover";

interface IRecordCardProps {
  item: ProfileRecord;
  kind: RecordKind;
  deleting: boolean;
  onDelete: (id: string, title: string) => void;
}

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const statuses: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  completed: "Concluída",
  cancelled: "Cancelada",
  rejected: "Recusada",
};

const RecordCard = (props: IRecordCardProps) => {
  const { item, kind, deleting, onDelete } = props;
  const data = item.data;

  if (kind === "books") {
    const images = Array.isArray(data.images)
      ? data.images.filter(
          (image: unknown): image is string =>
            typeof image === "string" && !!image.trim(),
        )
      : [];
    const imageUri = images[0] || text(data.thumbnail, "");
    return (
      <View style={styles.card}>
        <View style={styles.bookImageContainer}>
          {imageUri ? (
            <BookCover uri={imageUri} />
          ) : (
            <Text style={styles.imageFallback}>
              Falha ao carregar imagem
            </Text>
          )}
        </View>
        <Text style={styles.title}>{text(data.title, "Livro sem título")}</Text>
        <Text style={styles.body}>
          {text(data.author, "Autor não informado")}
        </Text>
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
          accessibilityLabel={`Excluir livro ${text(data.title, "")}`}
          disabled={deleting}
          onPress={() => onDelete(item.id, text(data.title, "este livro"))}
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
  }

  const date =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toLocaleDateString("pt-BR")
      : "";
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {text(data.offeredBookTitle, "Livro oferecido")}
      </Text>
      <Text style={styles.body}>
        Por: {text(data.requestedBookTitle, "Livro solicitado")}
      </Text>
      <Text style={styles.body}>
        Situação: {statuses[text(data.status, "")] ?? "Não informada"}
      </Text>
      {!!date && <Text style={styles.body}>Registrada em {date}</Text>}
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
