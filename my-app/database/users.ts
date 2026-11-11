import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { getFirebaseAuth } from "./firebase";
import { isValidCoordinates, type Coordinates } from "../src/utils/distance";
import {
  addressFields,
  emptyAddress,
  normalizeAddress,
  validateAddress,
  type Address,
} from "../src/utils/address";

// O contrato dos campos do livro será definido no futuro cadastro de livros.
export type UserBook = Record<string, unknown>;

function readUserBooks(value: unknown): UserBook[] {
  if (!Array.isArray(value)) return [];
  return value.filter((book): book is UserBook =>
    book !== null && typeof book === "object" && !Array.isArray(book),
  );
}

export interface UserProfile {
  displayName: string;
  email: string;
  whatsapp: string;
  address?: Address;
  coordinates?: Coordinates | null;
  books?: UserBook[];
  likedBooks?: UserBook[];
}

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export async function fetchAddressByPostalCode(
  postalCode: string,
): Promise<ViaCepAddress> {
  const normalizedPostalCode = postalCode.replace(/\D/g, "");
  if (!/^\d{8}$/.test(normalizedPostalCode)) {
    throw new Error("Informe um CEP com 8 dígitos.");
  }

  const response = await fetch(
    `https://viacep.com.br/ws/${normalizedPostalCode}/json/`,
  );
  if (!response.ok) {
    throw new Error("Não foi possível consultar o CEP.");
  }

  const data: ViaCepAddress & { erro?: boolean } = await response.json();
  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return data;
}

export async function subscribeToUserProfile(
  uid: string,
  onProfile: (profile: UserProfile | null) => void,
  onError: () => void,
) {
  const { doc, getFirestore, onSnapshot } = await import("firebase/firestore");
  return onSnapshot(
    doc(getFirestore(getFirebaseAuth().app), "users", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfile(null);
        return;
      }
      const data = snapshot.data();
      onProfile({
        displayName:
          typeof data.displayName === "string" ? data.displayName : "",
        email: typeof data.email === "string" ? data.email : "",
        whatsapp: typeof data.whatsapp === "string" ? data.whatsapp : "",
        coordinates: isValidCoordinates(data.coordinates) ? data.coordinates : null,
        books: readUserBooks(data.books),
        likedBooks: readUserBooks(data.likedBooks),
        address: Object.fromEntries(
          addressFields.map(([key]) => [
            key,
            typeof data.address?.[key] === "string" ? data.address[key] : "",
          ]),
        ) as Address,
      });
    },
    onError,
  );
}

export function formatWhatsappInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const hasBrazilCountryCode =
    value.trimStart().startsWith("+55") ||
    (digits.startsWith("55") && digits.length > 11);
  const localNumber = (hasBrazilCountryCode ? digits.slice(2) : digits).slice(
    0,
    11,
  );

  if (!localNumber) return "";

  const areaCode = localNumber.slice(0, 2);
  const subscriberNumber = localNumber.slice(2);
  let formatted = `+55 (${areaCode}`;

  if (areaCode.length === 2) formatted += ")";
  if (subscriberNumber) {
    const firstPartLength = subscriberNumber.startsWith("9") ? 5 : 4;
    const firstPart = subscriberNumber.slice(0, firstPartLength);
    const secondPart = subscriberNumber.slice(firstPartLength);
    formatted += ` ${firstPart}${secondPart ? `-${secondPart}` : ""}`;
  }

  return formatted;
}

export function normalizeWhatsappNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const internationalDigits =
    value.trim().startsWith("+") || digits.startsWith("55")
      ? digits
      : `55${digits}`;

  return /^[1-9]\d{7,14}$/.test(internationalDigits)
    ? `+${internationalDigits}`
    : null;
}

export class UserProfileSaveError extends Error {
  readonly originalCause: unknown;

  constructor(cause: unknown) {
    super(
      "A conta foi criada, mas não foi possível salvar o perfil no Firestore.",
    );
    this.name = "UserProfileSaveError";
    this.originalCause = cause;
    this.cause = cause;
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  whatsapp: string,
  address: Address = emptyAddress,
  coordinates: Coordinates | null = null,
) {
  if (coordinates !== null && !isValidCoordinates(coordinates)) {
    throw new Error("Selecione uma localização válida no mapa.");
  }
  const addressError = validateAddress(address);
  if (addressError) throw new Error(addressError);
  const auth = getFirebaseAuth();
  const normalizedName = name.trim();
  if (!normalizedName || normalizedName.length > 120) {
    throw new Error("Informe um nome com até 120 caracteres.");
  }
  const normalizedEmail = email.trim().toLowerCase();
  const currentUser = auth.currentUser;
  const user =
    currentUser?.email?.toLowerCase() === normalizedEmail
      ? currentUser
      : (await createUserWithEmailAndPassword(auth, normalizedEmail, password))
          .user;

  try {
    await updateProfile(user, { displayName: normalizedName });
    const { doc, getFirestore, serverTimestamp, runTransaction } =
      await import("firebase/firestore");
    const firestore = getFirestore(auth.app);
    const reference = doc(firestore, "users", user.uid);
    await runTransaction(firestore, async (transaction) => {
      const snapshot = await transaction.get(reference);
      const existing = snapshot.data() ?? {};
      const data = {
        displayName: normalizedName,
        whatsapp,
        address: normalizeAddress(address),
        coordinates: coordinates ? { latitude: coordinates.latitude, longitude: coordinates.longitude } : null,
        // Uma nova tentativa de cadastro não deve apagar livros já existentes.
        ...(!('books' in existing) ? { books: [] } : {}),
        ...(!('likedBooks' in existing) ? { likedBooks: [] } : {}),
      };
      if (snapshot.exists()) transaction.update(reference, data);
      else transaction.set(reference, {
        ...data,
        uid: user.uid,
        email: normalizedEmail,
        createdAt: serverTimestamp(),
      });
    });
  } catch (cause) {
    throw new UserProfileSaveError(cause);
  }

  return user;
}

export async function saveUserProfile(
  values: Pick<UserProfile, "displayName" | "whatsapp" | "coordinates"> & { address: Address },
) {
  if (values.coordinates != null && !isValidCoordinates(values.coordinates)) {
    throw new Error("Selecione uma localização válida no mapa.");
  }
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Entre na sua conta para editar o perfil.");
  const displayName = values.displayName.trim();
  if (!displayName || displayName.length > 120)
    throw new Error("Informe um nome com até 120 caracteres.");
  const whatsapp = normalizeWhatsappNumber(values.whatsapp);
  if (!whatsapp) throw new Error("Informe um WhatsApp válido com DDD.");
  const addressError = validateAddress(values.address);
  if (addressError) throw new Error(addressError);
  const { doc, getFirestore, runTransaction, serverTimestamp } =
    await import("firebase/firestore");
  const reference = doc(getFirestore(auth.app), "users", user.uid);
  await runTransaction(getFirestore(auth.app), async (transaction) => {
    const snapshot = await transaction.get(reference);
    const data = {
      displayName,
      whatsapp,
      address: normalizeAddress(values.address),
      ...(values.coordinates !== undefined ? {
        coordinates: values.coordinates ? {
          latitude: values.coordinates.latitude, longitude: values.coordinates.longitude,
        } : null,
      } : {}),
    };
    if (snapshot.exists()) transaction.update(reference, data);
    else
      transaction.set(reference, {
        ...data,
        uid: user.uid,
        email: user.email,
        books: [],
        likedBooks: [],
        createdAt: serverTimestamp(),
      });
  });
}
