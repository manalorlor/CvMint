import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LogIn,
  LogOut,
  Cloud,
  CloudCheck,
  Loader2,
  User as UserIcon,
  Trash2,
  ShieldAlert,
  X,
  Key,
  Settings,
} from "lucide-react";

interface AuthUserMenuProps {
  onOpenAdmin?: () => void;
}

export const AuthUserMenu: React.FC<AuthUserMenuProps> = ({ onOpenAdmin }) => {
  const {
    currentUser,
    loginWithGoogle,
    logoutUser,
    deleteAccount,
    recoverPassword,
    isSyncing,
    lastSyncedAt,
    syncCloudResumes,
  } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <button
        onClick={loginWithGoogle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 shadow-2xs transition flex-shrink-0 cursor-pointer"
        title="Sign in with Google to sync your CVs to Cloud Storage"
      >
        <LogIn className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Sign In / Sync</span>
        <span className="sm:hidden">Sign In</span>
      </button>
    );
  }

  const ADMIN_EMAILS = ["manassehlorlor@gmail.com"];
  const isAdminUser = currentUser?.email
    ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || currentUser.email.toLowerCase().includes("admin")
    : false;

  const handleSendResetEmail = async () => {
    if (!currentUser.email) return;
    try {
      setResetMessage(null);
      setAccountError(null);
      await recoverPassword(currentUser.email);
      setResetMessage("Password reset email sent to your address!");
    } catch (err: any) {
      setAccountError("Failed to send reset email: " + (err?.message || "Unknown error"));
    }
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      setIsDeleting(true);
      setAccountError(null);
      await deleteAccount();
      setShowAccountModal(false);
    } catch (err: any) {
      console.error("Delete account error:", err);
      if (err?.code === "auth/requires-recent-login") {
        setAccountError("Deleting an account requires recent authentication. Please sign out and sign back in before deleting.");
      } else {
        setAccountError(err?.message || "Failed to delete account. Please try again later.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition cursor-pointer"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || "User"}
            className="w-6 h-6 rounded-full object-cover border border-emerald-500/30 flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {currentUser.displayName?.[0] || currentUser.email?.[0] || "U"}
          </div>
        )}

        <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
          {currentUser.displayName || currentUser.email?.split("@")[0]}
        </span>

        {isSyncing ? (
          <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin flex-shrink-0" />
        ) : (
          <CloudCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        )}
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-xs text-slate-700 space-y-2">
            <div className="px-4 pb-2 border-b border-slate-100 flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.displayName?.[0] || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 truncate">
                  {currentUser.displayName || "User Account"}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="px-4 py-1.5 bg-emerald-50/60 mx-2 rounded-xl flex items-center justify-between text-[11px] font-semibold text-emerald-900 border border-emerald-100">
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Storage</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">
                Active
              </span>
            </div>

            {lastSyncedAt && (
              <div className="px-4 text-[10px] text-slate-400 font-medium">
                Last synced: {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            <button
              onClick={() => {
                syncCloudResumes();
                setDropdownOpen(false);
              }}
              disabled={isSyncing}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              ) : (
                <CloudCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span>Sync Resumes Now</span>
            </button>

            <button
              onClick={() => {
                setShowAccountModal(true);
                setDropdownOpen(false);
                setDeleteConfirmStep(false);
                setAccountError(null);
                setResetMessage(null);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-slate-600" />
              <span>Account Settings</span>
            </button>

            {onOpenAdmin && isAdminUser && (
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>System Admin Panel</span>
              </button>
            )}

            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={() => {
                  logoutUser();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Account Settings & Deletion Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-slate-800 space-y-5">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
                <p className="text-xs text-slate-500">Manage profile & account preferences</p>
              </div>
            </div>

            {accountError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium leading-relaxed">
                {accountError}
              </div>
            )}

            {resetMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium leading-relaxed">
                {resetMessage}
              </div>
            )}

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Display Name</span>
                <span className="font-bold text-slate-800">{currentUser.displayName || "User"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Email Address</span>
                <span className="font-bold text-slate-800">{currentUser.email || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-500">Cloud Sync Status</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
            </div>

            {/* Password Recovery Option */}
            {currentUser.email && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-slate-600" />
                  <span>Send Password Reset Email</span>
                </button>
              </div>
            )}

            {/* Danger Zone / Account Deletion */}
            <div className="pt-3 border-t border-slate-200/80">
              <h4 className="text-xs font-bold text-rose-600 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Danger Zone</span>
              </h4>

              {!deleteConfirmStep ? (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmStep(true)}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Delete My Account</span>
                </button>
              ) : (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    Are you sure? This will permanently delete your user profile and all saved resumes from cloud storage. This action cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleDeleteAccountConfirm}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <span>Yes, Delete Account</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmStep(false)}
                      className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

