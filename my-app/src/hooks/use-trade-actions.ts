import { useState } from "react";
import { Alert, Platform } from "react-native";

import {
  acceptTrade,
  cancelTrade,
  confirmTradeSuccess,
  declineNegotiation,
  rejectTrade,
} from "../../database/trades";
import { ITradeContact, TradeAction } from "@/types";
import { CONFIRMATIONS } from "@/constants/trade";

export const useTradeActions = (contact: ITradeContact) => {
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const runAction = async (id: string, action: TradeAction) => {
    switch (action) {
      case "cancel":
        await cancelTrade(id);
        break;
      case "reject":
        await rejectTrade(id);
        break;
      case "accept":
        await acceptTrade(id, contact);
        break;
      case "success":
        await confirmTradeSuccess(id);
        break;
      case "decline":
        await declineNegotiation(id);
        break;
    }
  };

  const perform = async (id: string, action: TradeAction) => {
    setRespondingId(id);
    try {
      await runAction(id, action);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Tente novamente mais tarde.";
      if (Platform.OS === "web") globalThis.alert(message);
      else Alert.alert("Não foi possível atualizar a solicitação", message);
    } finally {
      setRespondingId(null);
    }
  };

  const respondToTrade = (id: string, action: TradeAction) => {
    const confirmation =
      action === "cancel" || action === "reject"
        ? CONFIRMATIONS[action]
        : undefined;

    if (!confirmation) {
      void perform(id, action);
      return;
    }

    const message = `Deseja ${confirmation.question} esta solicitação de troca?`;
    if (Platform.OS === "web") {
      if (globalThis.confirm(message)) void perform(id, action);
      return;
    }

    Alert.alert("Confirmar ação", message, [
      { text: "Voltar", style: "cancel" },
      {
        text: confirmation.button,
        style: "destructive",
        onPress: () => void perform(id, action),
      },
    ]);
  };

  return { respondingId, respondToTrade };
};
