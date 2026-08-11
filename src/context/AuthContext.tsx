import React, { createContext, useContext, useEffect, useState } from "react";
import {
  supabase,
  User,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetLink,
  updateUserPassword,
  updateUserProfile,
  deleteAccountAndData,
  logOut,
  fetchUserResumesFromSupabase,
  saveResumeToSupabase,
  isSupabaseConfigured,
} from "../lib/supabase";
import { useResumeStore } from "../store/useResumeStore";
import { DEFAULT_RESUME } from "../data/defaultResume";
import { Lock, Loader2, CheckCircle2, X } from "lucide-react";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (displayName: string, avatarUrl?: string) => Promise<void>;
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
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState<boolean>(false);

  const { resumes, setResumes } = useResumeStore();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check if URL hash or query contains password recovery indicator
    if (
      typeof window !== "undefined" &&
      (window.location.hash.includes("type=recovery") ||
        window.location.search.includes("type=recovery") ||
        window.location.hash.includes("access_token"))
    ) {
      setShowResetModal(true);
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        setShowResetModal(true);
      }

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

  const updatePassword = async (newPass: string) => {
    await updateUserPassword(newPass);
  };

  const handleModalPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!newPassword.trim()) {
      setResetError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match. Please check and try again.");
      return;
    }

    try {
      setIsUpdatingPass(true);
      await updatePassword(newPassword);
      setResetSuccess(true);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess(false);
        setNewPassword("");
        setConfirmNewPassword("");
      }, 2500);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setResetError(err?.message || "Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const updateProfile = async (displayName: string, avatarUrl?: string) => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      const updatedUser = await updateUserProfile(displayName, avatarUrl);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      await deleteAccountAndData(currentUser.id);
      if (typeof window !== "undefined") {
        localStorage.removeItem("cv_app_resumes");
      }
      setResumes([DEFAULT_RESUME]);
      setCurrentUser(null);
    } catch (err) {
      console.error("Failed to delete account and database data:", err);
      throw err;
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
        updatePassword,
        updateProfile,
        deleteAccount,
        logoutUser,
        syncCloudResumes,
        isSyncing,
        lastSyncedAt,
        isSupabaseConfigured,
      }}
    >
      {children}

      {/* Set New Password Modal (Triggers on Recovery Link Click) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-700">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Set New Password</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your new password below to update your CvMinter account credentials.
            </p>

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Password updated successfully! Redirecting...</span>
              </div>
            ) : (
              <form onSubmit={handleModalPasswordUpdate} className="space-y-3.5 pt-1">
                {resetError && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                    {resetError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-type your new password"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPass}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  {isUpdatingPass ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
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
