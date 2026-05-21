import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { type AuthUser } from "../../types";

export const loginService = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signupService = async (email: string, password: string) => {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  // Guardamos el Rol en Firebase:
  const uid = credentials.user.uid;
  await setDoc(doc(db, "users", uid), {
    email,
    role: "customer",
  });
};

export const logoutService = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<AuthUser | null> => {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid,
    email: data.email,
    role: data.role,
  };
};
