import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { getFirebaseAuth } from './firebase';

export async function registerUser(name: string, email: string, password: string) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  await updateProfile(credential.user, { displayName: name.trim() });
  return credential.user;
}
