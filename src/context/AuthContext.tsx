import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetLink,
  deleteAccountAndData,
  logOut,
  onAuthStateChanged,
  testConnection,
  fetchUserResumesFromFirestore,
  saveResumeToFirestore,
  deleteResumeFromFirestore,
} from "../lib/firebase";
import { useResumeStore } from "../store/useResumeStore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logoutUser: () => Promise<void>;
  syncCloudResumes: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const { resumes, setResumes } = useResumeStore();

  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // Fetch user's resumes from Firestore
        try {
          setIsSyncing(true);
          const cloudResumes = await fetchUserResumesFromFirestore(user.uid);
          if (cloudResumes && cloudResumes.length > 0) {
            setResumes(cloudResumes);
            setLastSyncedAt(new Date());
          } else if (resumes.length > 0) {
            // Upload local resumes to Firestore for first-time cloud setup
            for (const resume of resumes) {
              await saveResumeToFirestore(user.uid, resume);
            }
            setLastSyncedAt(new Date());
          }
        } catch (err) {
          console.error("Error syncing Firestore resumes on auth state change:", err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsSyncing(true);
      const user = await signInWithGoogle();
      if (user) {
        const cloudResumes = await fetchUserResumesFromFirestore(user.uid);
        if (cloudResumes && cloudResumes.length > 0) {
          setResumes(cloudResumes);
        } else {
          for (const resume of resumes) {
            await saveResumeToFirestore(user.uid, resume);
          }
        }
        setLastSyncedAt(new Date());
      }
    } catch (err: any) {
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request" &&
        err?.code !== "auth/popup-blocked"
      ) {
        console.error("Failed to sign in with Google:", err);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      setIsSyncing(true);
      const user = await signUpWithEmail(email, pass, name);
      if (user && resumes.length > 0) {
        for (const resume of resumes) {
          await saveResumeToFirestore(user.uid, resume);
        }
      }
      setLastSyncedAt(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setIsSyncing(true);
      const user = await signInWithEmail(email, pass);
      if (user) {
        const cloudResumes = await fetchUserResumesFromFirestore(user.uid);
        if (cloudResumes && cloudResumes.length > 0) {
          setResumes(cloudResumes);
        } else {
          for (const resume of resumes) {
            await saveResumeToFirestore(user.uid, resume);
          }
        }
        setLastSyncedAt(new Date());
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const recoverPassword = async (email: string) => {
    await sendPasswordResetLink(email);
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      await deleteAccountAndData(currentUser);
      setCurrentUser(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const syncCloudResumes = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      for (const resume of resumes) {
        await saveResumeToFirestore(currentUser.uid, resume);
      }
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error("Failed to sync resumes to cloud:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        recoverPassword,
        deleteAccount,
        logoutUser,
        syncCloudResumes,
        isSyncing,
        lastSyncedAt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
