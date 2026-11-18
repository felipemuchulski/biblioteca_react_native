import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseAuth } from "./firebase";

export type TradeBookSnapshot = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
};

export type TradeContact = { email: string; whatsapp: string };

export async function createTrade(input: {
  senderName: string;
  senderContact: TradeContact;
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

  const tradeRef = doc(collection(firestore, "trades"));
  const batch = writeBatch(firestore);
  batch.set(tradeRef, {
    participantIds: [user.uid, input.recipientId],
    sender: { uid: user.uid, displayName: senderName },
    recipient: { uid: input.recipientId, displayName: recipientName },
    offeredBooks: input.offeredBooks,
    requestedBook: input.requestedBook,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  batch.set(doc(tradeRef, "contacts", user.uid), input.senderContact);
  await batch.commit();
  return tradeRef;
}

export async function acceptTrade(tradeId: string, contact: TradeContact) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Entre na sua conta para aceitar a solicitação.");
  if (!contact.email.trim() || !contact.whatsapp.trim()) {
    throw new Error("Complete seu e-mail e WhatsApp no perfil antes de aceitar.");
  }
  const firestore = getFirestore(auth.app);
  const tradeRef = doc(firestore, "trades", tradeId);
  const batch = writeBatch(firestore);
  batch.update(tradeRef, { status: "negotiating" });
  batch.set(doc(tradeRef, "contacts", user.uid), contact);
  await batch.commit();
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

export async function declineNegotiation(tradeId: string) {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) throw new Error("Entre na sua conta para declinar a troca.");
  await updateDoc(doc(getFirestore(auth.app), "trades", tradeId), {
    status: "rejected",
  });
}
