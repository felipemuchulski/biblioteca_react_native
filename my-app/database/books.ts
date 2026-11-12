import { getFirestore } from "firebase/firestore";

import type { BookCondition } from "../src/types/book";
import { getFirebaseAuth } from "./firebase";

export type RegisterBookInput = {
  title: string;
  author: string;
  images: string[];
  thumbnail: string;
  category: string[];
  condition: BookCondition;
  conditionNote?: string;
  tradeWithBookId?: string;
};

export async function registerBook(input: RegisterBookInput): Promise<string> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Entre na sua conta para cadastrar um livro.");

  const title = input.title.trim();
  const author = input.author.trim();
  if (!title || !author || input.images.length === 0 || !input.condition) {
    throw new Error("Preencha todos os campos obrigatórios do livro.");
  }

  const firestore = getFirestore(auth.app);
  const { collection, doc, serverTimestamp, setDoc } = await import(
    "firebase/firestore"
  );
  const reference = doc(collection(firestore, "books"));
  const owner = user.displayName?.trim() || user.email || "Usuário";
  const conditionNote = input.conditionNote?.trim();

  await setDoc(reference, {
    ownerId: user.uid,
    owner,
    title,
    author,
    images: input.images,
    thumbnail: input.thumbnail,
    category: input.category,
    type: "exchange",
    available: true,
    bookCondition: input.condition,
    ...(conditionNote ? { bookConditionNote: conditionNote } : {}),
    ...(input.tradeWithBookId
      ? { tradeWithBookId: input.tradeWithBookId }
      : {}),
    createdAt: serverTimestamp(),
  });

  return reference.id;
}
