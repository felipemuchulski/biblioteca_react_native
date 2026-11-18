import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseAuth } from "./firebase";

export type TradeBookSnapshot = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
};

export async function createTrade(input: {
  senderName: string;
  recipientId: string;
  recipientName: string;
  offeredBooks: TradeBookSnapshot[];
  requestedBook: TradeBookSnapshot;
}) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Entre na sua conta para enviar uma solicitação.");
  if (!input.recipientId || input.recipientId === user.uid) {
    throw new Error("Não foi possível identificar quem receberá a solicitação.");
  }
  if (input.offeredBooks.length < 1 || input.offeredBooks.length > 20) {
    throw new Error("Selecione entre 1 e 20 livros para oferecer.");
  }

  const firestore = getFirestore(auth.app);
  const senderName = input.senderName.trim() || user.displayName?.trim() || "Usuário";
  const recipientName = input.recipientName.trim() || "Usuário";

  return addDoc(collection(firestore, "trades"), {
    participantIds: [user.uid, input.recipientId],
    sender: { uid: user.uid, displayName: senderName },
    recipient: { uid: input.recipientId, displayName: recipientName },
    offeredBooks: input.offeredBooks,
    requestedBook: input.requestedBook,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function cancelTrade(tradeId: string) {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) throw new Error("Entre na sua conta para cancelar a solicitação.");
  await updateDoc(doc(getFirestore(auth.app), "trades", tradeId), {
    status: "cancelled",
  });
}

export async function rejectTrade(tradeId: string) {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) throw new Error("Entre na sua conta para recusar a solicitação.");
  await updateDoc(doc(getFirestore(auth.app), "trades", tradeId), {
    status: "rejected",
  });
}
