export const CONFIRMATIONS = {
  cancel: { question: "cancelar", button: "Cancelar solicitação" },
  reject: { question: "recusar", button: "Recusar" },
} as const;

export const TRADE_STATUS: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  completed: "Troca bem-sucedida",
  cancelled: "Cancelada",
  rejected: "Recusada",
  negotiating: "Aguardando Negociação",
};
