import React, { createContext, useContext, useEffect, useState } from "react";
import {
  supabase,
  User,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetLink,
  deleteAccountAndData,
  logOut,
  fetchUserResumesFromSupabase,
  saveResumeToSupabase,
  isSupabaseConfigured,
} from "../lib/supabase";
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
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const { resumes, setResumes } = useResumeStore();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        syncUserResumesOnLoad(user.id);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        await syncUserResumesOnLoad(user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserResumesOnLoad = async (userId: string) => {
    try {
      setIsSyncing(true);
      const cloudResumes = await fetchUserResumesFromSupabase(userId);
      if (cloudResumes && cloudResumes.length > 0) {
        setResumes(cloudResumes);
        setLastSyncedAt(new Date());
      } else if (resumes.length > 0) {
        for (const resume of resumes) {
          await saveResumeToSupabase(userId, resume);
        }
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.error("Error syncing Supabase resumes on load:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsSyncing(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Failed to sign in with Google:", err);
      throw err;
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
          await saveResumeToSupabase(user.id, resume);
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
        const cloudResumes = await fetchUserResumesFromSupabase(user.id);
        if (cloudResumes && cloudResumes.length > 0) {
          setResumes(cloudResumes);
        } else {
          for (const resume of resumes) {
            await saveResumeToSupabase(user.id, resume);
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
      await deleteAccountAndData(currentUser.id);
      setCurrentUser(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
      setCurrentUser(null);
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const syncCloudResumes = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      for (const resume of resumes) {
        await saveResumeToSupabase(currentUser.id, resume);
      }
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error("Failed to sync resumes to Supabase:", err);
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
        isSupabaseConfigured,
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
