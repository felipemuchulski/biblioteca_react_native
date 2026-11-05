import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { getFirebaseAuth } from './firebase';
import { addressFields, emptyAddress, normalizeAddress, validateAddress, type Address } from '../src/utils/address';

export interface UserProfile {
  displayName: string;
  email: string;
  whatsapp: string;
  address?: Address;
}

export async function subscribeToUserProfile(
  uid: string,
  onProfile: (profile: UserProfile | null) => void,
  onError: () => void,
) {
  const { doc, getFirestore, onSnapshot } = await import('firebase/firestore');
  return onSnapshot(doc(getFirestore(getFirebaseAuth().app), 'users', uid), (snapshot) => {
    if (!snapshot.exists()) {
      onProfile(null);
      return;
    }
    const data = snapshot.data();
    onProfile({
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
      whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : '',
      address: Object.fromEntries(addressFields.map(([key]) => [
        key, typeof data.address?.[key] === 'string' ? data.address[key] : '',
      ])) as Address,
    });
  }, onError);
}

export function formatWhatsappInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  const hasBrazilCountryCode =
    value.trimStart().startsWith('+55') ||
    (digits.startsWith('55') && digits.length > 11);
  const localNumber = (hasBrazilCountryCode ? digits.slice(2) : digits).slice(0, 11);

  if (!localNumber) return '';

  const areaCode = localNumber.slice(0, 2);
  const subscriberNumber = localNumber.slice(2);
  let formatted = `+55 (${areaCode}`;

  if (areaCode.length === 2) formatted += ')';
  if (subscriberNumber) {
    const firstPartLength = subscriberNumber.startsWith('9') ? 5 : 4;
    const firstPart = subscriberNumber.slice(0, firstPartLength);
    const secondPart = subscriberNumber.slice(firstPartLength);
    formatted += ` ${firstPart}${secondPart ? `-${secondPart}` : ''}`;
  }

  return formatted;
}

export function normalizeWhatsappNumber(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  const internationalDigits = value.trim().startsWith('+') || digits.startsWith('55')
    ? digits
    : `55${digits}`;

  return /^[1-9]\d{7,14}$/.test(internationalDigits)
    ? `+${internationalDigits}`
    : null;
}

export class UserProfileSaveError extends Error {
  constructor(cause: unknown) {
    super('A conta foi criada, mas não foi possível salvar o perfil no Firestore.');
    this.name = 'UserProfileSaveError';
    this.cause = cause;
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  whatsapp: string,
  address: Address = emptyAddress,
) {
  const addressError = validateAddress(address);
  if (addressError) throw new Error(addressError);
  const auth = getFirebaseAuth();
  const normalizedName = name.trim();
  if (!normalizedName || normalizedName.length > 120) {
    throw new Error('Informe um nome com até 120 caracteres.');
  }
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );

  try {
    await updateProfile(credential.user, { displayName: normalizedName });
    const { doc, getFirestore, serverTimestamp, setDoc } = await import('firebase/firestore');
    await setDoc(doc(getFirestore(auth.app), 'users', credential.user.uid), {
      uid: credential.user.uid,
      displayName: normalizedName,
      email: normalizedEmail,
      whatsapp,
      address: normalizeAddress(address),
      createdAt: serverTimestamp(),
    });
  } catch (cause) {
    throw new UserProfileSaveError(cause);
  }

  return credential.user;
}

export async function saveUserProfile(values: Pick<UserProfile, 'displayName' | 'whatsapp'> & { address: Address }) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta para editar o perfil.');
  const displayName = values.displayName.trim();
  if (!displayName || displayName.length > 120) throw new Error('Informe um nome com até 120 caracteres.');
  const whatsapp = normalizeWhatsappNumber(values.whatsapp);
  if (!whatsapp) throw new Error('Informe um WhatsApp válido com DDD.');
  const addressError = validateAddress(values.address);
  if (addressError) throw new Error(addressError);
  const { doc, getFirestore, runTransaction, serverTimestamp } = await import('firebase/firestore');
  const reference = doc(getFirestore(auth.app), 'users', user.uid);
  await runTransaction(getFirestore(auth.app), async (transaction) => {
    const snapshot = await transaction.get(reference);
    const data = { displayName, whatsapp, address: normalizeAddress(values.address) };
    if (snapshot.exists()) transaction.update(reference, data);
    else transaction.set(reference, { ...data, uid: user.uid, email: user.email, createdAt: serverTimestamp() });
  });
}
