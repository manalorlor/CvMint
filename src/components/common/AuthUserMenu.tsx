import React, { useState, useEffect } from "react";
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
  Camera,
  Check,
  Upload,
  UserPlus,
  Lock,
} from "lucide-react";

interface AuthUserMenuProps {
  onOpenAdmin?: () => void;
  onOpenSignUp?: () => void;
  inDrawer?: boolean;
  onDrawerClose?: () => void;
}

export const AuthUserMenu: React.FC<AuthUserMenuProps> = ({
  onOpenAdmin,
  onOpenSignUp,
  inDrawer = false,
  onDrawerClose,
}) => {
  const {
    currentUser,
    logoutUser,
    deleteAccount,
    recoverPassword,
    updatePassword,
    updateProfile,
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

  // Password Change State in Account Settings
  const [changePassNew, setChangePassNew] = useState("");
  const [changePassConfirm, setChangePassConfirm] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);

  // User Profile Form States
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);

  const getDisplayName = () => {
    if (!currentUser) return "User";
    return (
      currentUser.user_metadata?.display_name ||
      currentUser.user_metadata?.full_name ||
      currentUser.user_metadata?.name ||
      currentUser.displayName ||
      currentUser.email?.split("@")[0] ||
      "User"
    );
  };

  const getAvatarUrl = () => {
    if (!currentUser) return "";
    return (
      currentUser.user_metadata?.avatar_url ||
      currentUser.user_metadata?.picture ||
      currentUser.photoURL ||
      ""
    );
  };

  useEffect(() => {
    if (currentUser) {
      setEditDisplayName(getDisplayName());
      setEditAvatarUrl(getAvatarUrl());
    }
  }, [currentUser, showAccountModal]);

  if (!currentUser) {
    if (inDrawer) {
      return (
        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 text-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Account & Cloud Storage</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Sign in or create an account to save and auto-sync your CVs safely across devices.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onDrawerClose) onDrawerClose();
              if (onOpenSignUp) onOpenSignUp();
            }}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up / Sign In</span>
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenSignUp}
        className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition flex-shrink-0 cursor-pointer"
        title="Create a free account to save and sync your CVs"
      >
        <UserPlus className="w-3.5 h-3.5 text-white" />
        <span>Sign Up</span>
      </button>
    );
  }

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();

  const ADMIN_EMAILS = ["manassehlorlor@gmail.com"];
  const isAdminUser = currentUser?.email
    ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
    : false;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setAccountError("Image file size must be smaller than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditAvatarUrl(result);
          setAccountError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setProfileSaveSuccess(null);

    if (!editDisplayName.trim()) {
      setAccountError("Display Name cannot be empty.");
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateProfile(editDisplayName.trim(), editAvatarUrl);
      setProfileSaveSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setAccountError(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser.email) return;
    try {
      setResetMessage(null);
      setAccountError(null);
      await recoverPassword(currentUser.email);
      setResetMessage("Password reset email sent to " + currentUser.email + "! Please check your inbox and Spam/Junk folder.");
    } catch (err: any) {
      setAccountError("Failed to send reset email: " + (err?.message || "Unknown error"));
    }
  };

  const handleChangePasswordDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setPassChangeSuccess(null);

    if (!changePassNew.trim()) {
      setAccountError("Please enter a new password.");
      return;
    }
    if (changePassNew.length < 6) {
      setAccountError("Password must be at least 6 characters long.");
      return;
    }
    if (changePassNew !== changePassConfirm) {
      setAccountError("Passwords do not match. Please verify.");
      return;
    }

    try {
      setIsChangingPass(true);
      await updatePassword(changePassNew);
      setPassChangeSuccess("Password updated successfully!");
      setChangePassNew("");
      setChangePassConfirm("");
    } catch (err: any) {
      console.error("Change password error:", err);
      setAccountError(err?.message || "Failed to update password.");
    } finally {
      setIsChangingPass(false);
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

  if (inDrawer) {
    return (
      <>
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 text-slate-800">
          <div className="flex items-center gap-3 pb-2.5 border-b border-slate-200/80">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {displayName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-900 truncate">{displayName}</span>
              <span className="text-[11px] text-slate-500 truncate">{currentUser.email}</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <CloudCheck className="w-3 h-3 text-emerald-600" /> Cloud Sync Active
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                if (onDrawerClose) onDrawerClose();
                setShowAccountModal(true);
                setAccountError(null);
                setResetMessage(null);
                setProfileSaveSuccess(null);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200/70 bg-white border border-slate-200/80 transition flex items-center justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>Account & Security Settings</span>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                syncCloudResumes();
              }}
              disabled={isSyncing}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/70 bg-white border border-slate-200/80 transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              ) : (
                <CloudCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span>Sync Resumes Now</span>
            </button>

            {onOpenAdmin && isAdminUser && (
              <button
                type="button"
                onClick={() => {
                  if (onDrawerClose) onDrawerClose();
                  onOpenAdmin();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200/70 bg-white border border-slate-200/80 transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Settings className="w-4 h-4 text-amber-600" />
                <span>System Admin Panel</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onDrawerClose) onDrawerClose();
                logoutUser();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 bg-white border border-rose-200/80 transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Settings & User Profile Modal */}
        {showAccountModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAccountModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
                  <p className="text-xs text-slate-500">Manage your profile picture, name, authentication, and database records</p>
                </div>
              </div>

              {accountError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium leading-relaxed">
                  {accountError}
                </div>
              )}

              {profileSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{profileSaveSuccess}</span>
                </div>
              )}

              {resetMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium leading-relaxed">
                  {resetMessage}
                </div>
              )}

              {/* Profile Edit Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="relative group">
                    {editAvatarUrl ? (
                      <img
                        src={editAvatarUrl}
                        alt="Avatar Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                        {editDisplayName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}

                    <label className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-emerald-600 transition shadow-md">
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left w-full">
                    <label className="block text-xs font-bold text-slate-700">Profile Photo</label>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Click camera icon to upload custom picture from device
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Name / Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email || ""}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </form>

              {/* Direct Password Change Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Security & Password Settings</span>
                </div>

                {passChangeSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{passChangeSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePasswordDirect} className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                      <input
                        type="password"
                        value={changePassNew}
                        onChange={(e) => setChangePassNew(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={changePassConfirm}
                        onChange={(e) => setChangePassConfirm(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {isChangingPass ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>

                    {currentUser.email && (
                      <button
                        type="button"
                        onClick={handleSendResetEmail}
                        className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-500" />
                        <span>Send Reset Email Link</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setShowAccountModal(false);
                  }}
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-slate-300" />
                  <span>Sign Out of Account</span>
                </button>
              </div>

              {/* Danger Zone / Account & Database Deletion */}
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
                    <span>Delete Account & Wipe Database Records</span>
                  </button>
                ) : (
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                    <p className="text-xs text-rose-900 font-medium leading-relaxed">
                      Are you sure? This will permanently delete your user account, profile picture, and all associated resume records from the database. All your data will be completely cleared from the database. This action cannot be undone.
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
                            <span>Deleting & Wiping Database...</span>
                          </>
                        ) : (
                          <span>Yes, Delete Account & Wipe DB</span>
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
      </>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition cursor-pointer"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-6 h-6 rounded-full object-cover border border-emerald-500/30 flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {displayName?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
          {displayName}
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
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {displayName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 truncate">
                  {displayName}
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
                setProfileSaveSuccess(null);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-slate-600" />
              <span>User Profile & Settings</span>
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

      {/* Account Settings & User Profile Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
                <p className="text-xs text-slate-500">Manage your profile picture, name, authentication, and database records</p>
              </div>
            </div>

            {accountError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium leading-relaxed">
                {accountError}
              </div>
            )}

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{profileSaveSuccess}</span>
              </div>
            )}

            {resetMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium leading-relaxed">
                {resetMessage}
              </div>
            )}

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Avatar Selection & Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="relative group">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                      {editDisplayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  <label className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-emerald-600 transition shadow-md">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left w-full">
                  <label className="block text-xs font-bold text-slate-800">
                    Profile Picture
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload a JPEG or PNG image (max 3MB), or paste a photo URL below.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl("")}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Username
                </label>
                <input
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email || ""}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>

            {/* Direct Password Change Section */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Security & Password Settings</span>
              </div>

              {passChangeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{passChangeSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordDirect} className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={changePassNew}
                      onChange={(e) => setChangePassNew(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={changePassConfirm}
                      onChange={(e) => setChangePassConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>

                  {currentUser.email && (
                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      <span>Send Reset Email Link</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setShowAccountModal(false);
                }}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4 text-slate-300" />
                <span>Sign Out of Account</span>
              </button>
            </div>

            {/* Danger Zone / Account & Database Deletion */}
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
                  <span>Delete Account & Wipe Database Records</span>
                </button>
              ) : (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    Are you sure? This will permanently delete your user account, profile picture, and all associated resume records from the database. All your data will be completely cleared from the database. This action cannot be undone.
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
                          <span>Deleting & Wiping Database...</span>
                        </>
                      ) : (
                        <span>Yes, Delete Account & Wipe DB</span>
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

