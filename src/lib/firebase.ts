import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { ResumeData } from "../types";

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firestore client is offline or test connection pending.");
    }
  }
}

// Google Auth Handlers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Ensure user profile document exists in Firestore
    if (result.user) {
      const userRef = doc(db, "users", result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || "",
          displayName: result.user.displayName || "User",
          photoURL: result.user.photoURL || "",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error: any) {
    if (
      error?.code === "auth/popup-closed-by-user" ||
      error?.code === "auth/cancelled-popup-request" ||
      error?.code === "auth/popup-blocked"
    ) {
      console.info("Google sign-in popup was closed or cancelled by the user.");
      return null;
    }
    console.error("Google Auth Sign In Error:", error);
    throw error;
  }
}

// Email/Password Handlers
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCred.user;
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName || user.email?.split("@")[0] || "User",
      photoURL: "",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return user;
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function deleteAccountAndData(user: User): Promise<void> {
  const userId = user.uid;
  // 1. Delete user's resumes from Firestore
  try {
    const resumesCol = collection(db, "users", userId, "resumes");
    const snapshot = await getDocs(resumesCol);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "users", userId, "resumes", docSnap.id));
    }
    // 2. Delete user profile document
    await deleteDoc(doc(db, "users", userId));
  } catch (err) {
    console.warn("Could not delete user Firestore documents before account deletion:", err);
  }
  // 3. Delete Firebase Auth account
  await deleteUser(user);
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Firestore Resume Operations
export async function saveResumeToFirestore(userId: string, resume: ResumeData): Promise<void> {
  const path = `users/${userId}/resumes/${resume.id}`;
  try {
    const resumeRef = doc(db, "users", userId, "resumes", resume.id);
    await setDoc(resumeRef, {
      id: resume.id,
      userId,
      title: resume.title,
      targetJobTitle: resume.targetJobTitle || "",
      resumeData: resume,
      createdAt: resume.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteResumeFromFirestore(userId: string, resumeId: string): Promise<void> {
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, "users", userId, "resumes", resumeId);
    await deleteDoc(resumeRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchUserResumesFromFirestore(userId: string): Promise<ResumeData[]> {
  const path = `users/${userId}/resumes`;
  try {
    const resumesCol = collection(db, "users", userId, "resumes");
    const snapshot = await getDocs(resumesCol);
    const results: ResumeData[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.resumeData) {
        results.push(data.resumeData as ResumeData);
      }
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export { onAuthStateChanged };
