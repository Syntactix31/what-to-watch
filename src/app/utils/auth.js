import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code === "auth/invalid-credential") return "Incorrect email or password.";
  if (code === "auth/user-not-found") return "No account found with that email.";
  if (code === "auth/wrong-password") return "Incorrect email or password.";
  if (code === "auth/email-already-in-use") return "That email is already in use.";
  if (code === "auth/weak-password") return "Password is too weak (min 6 characters).";
  if (code === "auth/popup-closed-by-user") return "Popup closed. Try again.";
  if (code === "auth/unauthorized-domain") return "This domain isn’t authorized in Firebase.";
  return "Something went wrong. Please try again.";
}

async function applyPersistence(remember) {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
}

export async function loginWithEmail(email, password, remember = true) {
  await applyPersistence(remember);
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    throw new Error(friendlyAuthError(e));
  }
}

export async function loginWithGoogle(remember = true) {
  await applyPersistence(remember);
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return await signInWithPopup(auth, provider);
  } catch (e) {
    throw new Error(friendlyAuthError(e));
  }
}

export async function signUpWithEmail(name, email, password, remember = true) {
  await applyPersistence(remember);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name?.trim()) await updateProfile(cred.user, { displayName: name.trim() });
    return cred;
  } catch (e) {
    throw new Error(friendlyAuthError(e));
  }
}

export async function resetPassword(email) {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (e) {
    throw new Error(friendlyAuthError(e));
  }
}
