import { Timestamp } from "firebase/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { TradeContactInfo } from "@/components/profile/TradeContactInfo";
import { AppColors } from "@/constants/colors";
import type { ProfileRecord } from "@/hooks/use-profile-records";
import { ITradeData, TradeAction } from "@/types";
import { TRADE_STATUS } from "@/constants/trade";

interface ITradeRecordCardProps {
  item: ProfileRecord;
  currentUid?: string;
  responding?: boolean;
  onTradeAction?: (id: string, action: TradeAction) => void;
}

const TradeRecordCard = (props: ITradeRecordCardProps) => {
  const { item, currentUid, responding = false, onTradeAction } = props;
  const data = item.data as ITradeData;

  const date =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toLocaleDateString("pt-BR")
      : "";
  const sender = data.sender;
  const recipient = data.recipient;

  const offeredTitles =
    data.offeredBooks?.map((book) => book.title || "Livro").join(", ") ||
    data.offeredBookTitle ||
    "um livro";
  const requestedTitle =
    data.requestedBook?.title ||
    data.requestedBookTitle ||
    "um livro solicitado";

  const isSender = sender?.uid === currentUid;
  const isRecipient = recipient?.uid === currentUid;
  const pending = data.status === "pending";
  const negotiating = data.status === "negotiating";
  const completed = data.status === "completed";
  const alreadyConfirmed =
    !!currentUid && !!data.successConfirmedBy?.includes(currentUid);
  const otherUserId = isSender ? recipient?.uid : sender?.uid;
  const otherName =
    (isSender ? recipient?.displayName : sender?.displayName) ||
    "outro participante";

  const dispatch = (action: TradeAction) => onTradeAction?.(item.id, action);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Solicitação de troca</Text>
      <Text style={styles.body}>
        {isRecipient
          ? `${sender?.displayName || "Um usuário"} oferece `
          : "Você ofereceu "}
        {`'${offeredTitles}'`} em troca de {`'${requestedTitle}'`}.
      </Text>
      <Text style={styles.body}>
        Situação: {TRADE_STATUS[data.status ?? ""] ?? "Não informada"}
      </Text>
      {!!date && <Text style={styles.body}>Registrada em {date}</Text>}

      {negotiating && item.hasPendingWrites && (
        <View style={styles.contactLoading}>
          <ActivityIndicator color={AppColors.blue} size="small" />
          <Text style={styles.body}>
            Aguardando confirmação para carregar os contatos...
          </Text>
        </View>
      )}
      {(negotiating || completed) && !item.hasPendingWrites && otherUserId && (
        <TradeContactInfo
          tradeId={item.id}
          otherUserId={otherUserId}
          otherName={otherName}
        />
      )}

      {pending && isSender && (
        <TouchableOpacity
          disabled={responding}
          onPress={() => dispatch("cancel")}
          style={[
            styles.tradeAction,
            styles.cancelAction,
            responding && styles.disabledButton,
          ]}
        >
          {responding ? (
            <ActivityIndicator color={AppColors.danger} size="small" />
          ) : (
            <Text style={styles.cancelText}>Cancelar solicitação</Text>
          )}
        </TouchableOpacity>
      )}

      {pending && isRecipient && (
        <View style={styles.tradeActions}>
          <TouchableOpacity
            disabled={responding}
            onPress={() => dispatch("reject")}
            style={[
              styles.tradeAction,
              styles.cancelAction,
              responding && styles.disabledButton,
            ]}
          >
            {responding ? (
              <ActivityIndicator color={AppColors.danger} size="small" />
            ) : (
              <Text style={styles.cancelText}>Recusar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={responding}
            onPress={() => dispatch("accept")}
            style={[
              styles.tradeAction,
              styles.acceptAction,
              responding && styles.disabledButton,
            ]}
          >
            <Text style={styles.acceptText}>Aceitar</Text>
          </TouchableOpacity>
        </View>
      )}

      {negotiating && (
        <View style={styles.tradeActions}>
          <TouchableOpacity
            disabled={responding || alreadyConfirmed}
            onPress={() => dispatch("success")}
            style={[
              styles.tradeAction,
              styles.acceptAction,
              (responding || alreadyConfirmed) && styles.disabledButton,
            ]}
          >
            {responding ? (
              <ActivityIndicator color={AppColors.white} size="small" />
            ) : (
              <Text style={styles.acceptText}>
                {alreadyConfirmed
                  ? "Aguardando outra confirmação"
                  : "Troca bem-sucedida"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={responding}
            onPress={() => dispatch("decline")}
            style={[
              styles.tradeAction,
              styles.cancelAction,
              responding && styles.disabledButton,
            ]}
          >
            {responding ? (
              <ActivityIndicator color={AppColors.danger} size="small" />
            ) : (
              <Text style={styles.cancelText}>Troca declinada</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TradeRecordCard;

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  body: { color: AppColors.categoryText, lineHeight: 22 },
  contactLoading: { flexDirection: "row", alignItems: "center", gap: 8 },
  tradeActions: { flexDirection: "row", gap: 10 },
  tradeAction: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  cancelAction: { backgroundColor: "#FCEBEC" },
  cancelText: { color: AppColors.danger, fontWeight: "700" },
  acceptAction: { backgroundColor: AppColors.blue },
  acceptText: { color: AppColors.white, fontWeight: "700" },
  disabledButton: { opacity: 0.6 },
});
