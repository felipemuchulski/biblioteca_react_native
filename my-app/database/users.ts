import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { getFirebaseAuth } from './firebase';

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
  readonly originalCause: unknown;

  constructor(cause: unknown) {
    super('A conta foi criada, mas não foi possível salvar o perfil no Firestore.');
    this.name = 'UserProfileSaveError';
    this.originalCause = cause;
    this.cause = cause;
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  whatsapp: string,
  location: { address: string; latitude: number; longitude: number }
) {
  const auth = getFirebaseAuth();
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const currentUser = auth.currentUser;
  const user = currentUser?.email?.toLowerCase() === normalizedEmail
    ? currentUser
    : (await createUserWithEmailAndPassword(auth, normalizedEmail, password)).user;

  try {
    await updateProfile(user, { displayName: normalizedName });
    const { doc, getFirestore, serverTimestamp, setDoc } = await import('firebase/firestore');
    await setDoc(doc(getFirestore(), 'users', user.uid), {
      uid: user.uid,
      displayName: normalizedName,
      email: normalizedEmail,
      whatsapp,
      address: location.address,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (cause) {
    throw new UserProfileSaveError(cause);
  }

  return user;
}
