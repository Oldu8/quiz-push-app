import { FirebaseError } from "firebase/app";
import {
  Unsubscribe,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type UserRole = "user";

export type UserDocument = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  expoPushToken: string | null;
  platform: string | null;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

type AuthUserSummary = {
  uid: string;
  email: string;
  name?: string | null;
};

const USERS_COLLECTION = "users";

const getUserDocRef = (uid: string) => doc(db, USERS_COLLECTION, uid);

const mapFirebaseErrorToMessage = (error: unknown): string => {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already in use. Try logging in instead.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger one.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support if this is unexpected.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthUserSummary> => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const { uid } = credential.user;

    const userDoc: UserDocument = {
      uid,
      email,
      name,
      role: "user",
      expoPushToken: null,
      platform: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(getUserDocRef(uid), userDoc, { merge: true });

    return {
      uid,
      email,
      name,
    };
  } catch (error) {
    throw new Error(mapFirebaseErrorToMessage(error));
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthUserSummary> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const { uid, email: userEmail, displayName } = credential.user;

    return {
      uid,
      email: userEmail ?? email,
      name: displayName,
    };
  } catch (error) {
    throw new Error(mapFirebaseErrorToMessage(error));
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(mapFirebaseErrorToMessage(error));
  }
};

export const subscribeToAuthChanges = (
  listener: (user: User | null) => void,
): Unsubscribe => {
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      listener(user);
    },
    (error) => {
      console.error("Auth state change error", error);
    },
  );

  return unsubscribe;
};
