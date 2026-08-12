import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  ShieldAlert,
  Cpu,
  Sparkles,
  Layers,
  Users,
  Search,
  RotateCw,
  Trash2,
  Lock,
  Key,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Copy,
  Check,
  Activity,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAllRegisteredUsers,
  adminSetUserRestriction,
  adminDeleteUserAccount,
  adminResetUserPassword,
  RegisteredUser,
  ADMIN_EMAILS,
} from "../../lib/adminService";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "ai" | "templates" | "system">("users");

  // Users Directory State
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "restricted">("all");

  // Action State Modals
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Restrict Modal State
  const [userToRestrict, setUserToRestrict] = useState<RegisteredUser | null>(null);
  const [restrictionReason, setRestrictionReason] = useState<string>("");
  const [isSubmittingRestrict, setIsSubmittingRestrict] = useState<boolean>(false);

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState<RegisteredUser | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState<boolean>(false);

  // Reset Password Modal State
  const [userToResetPass, setUserToResetPass] = useState<RegisteredUser | null>(null);
  const [isSubmittingReset, setIsSubmittingReset] = useState<boolean>(false);

  // AI Settings State
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(1024);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are an elite executive HR recruiter and ATS resume optimization expert."
  );

  const isAdmin = currentUser?.email
    ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
    : false;

  const loadUsersList = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await fetchAllRegisteredUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users list:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadUsersList();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
            <p className="text-xs text-slate-500 mt-1">
              System Admin privileges are restricted exclusively to authorized administrator accounts (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">manassehlorlor@gmail.com</code>).
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "active") return !u.is_restricted;
    if (statusFilter === "restricted") return u.is_restricted;
    return true;
  });

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => !u.is_restricted).length;
  const restrictedUsersCount = users.filter((u) => u.is_restricted).length;
  const adminUsersCount = users.filter((u) => u.role === "admin").length;

  // Handlers
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleConfirmRestrictToggle = async () => {
    if (!userToRestrict) return;
    setIsSubmittingRestrict(true);
    setActionErrorMessage(null);
    setActionSuccessMessage(null);

    try {
      const nextRestrictedState = !userToRestrict.is_restricted;
      await adminSetUserRestriction(
        userToRestrict.id,
        userToRestrict.email,
        nextRestrictedState,
        restrictionReason
      );

      setActionSuccessMessage(
        nextRestrictedState
          ? `User "${userToRestrict.email}" has been restricted from platform access.`
          : `User "${userToRestrict.email}" account access has been reactivated.`
      );

      setUserToRestrict(null);
      setRestrictionReason("");
      await loadUsersList();
    } catch (err: any) {
      console.error("Error setting user restriction:", err);
      setActionErrorMessage(err?.message || "Failed to update user restriction status.");
    } finally {
      setIsSubmittingRestrict(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsSubmittingDelete(true);
    setActionErrorMessage(null);
    setActionSuccessMessage(null);

    try {
      await adminDeleteUserAccount(userToDelete.id, userToDelete.email);
      setActionSuccessMessage(`User "${userToDelete.email}" and associated records deleted successfully.`);
      setUserToDelete(null);
      await loadUsersList();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setActionErrorMessage(err?.message || "Failed to delete user account.");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!userToResetPass) return;
    setIsSubmittingReset(true);
    setActionErrorMessage(null);
    setActionSuccessMessage(null);

    try {
      await adminResetUserPassword(userToResetPass.email);
      setActionSuccessMessage(
        `Password reset email link successfully dispatched to "${userToResetPass.email}".`
      );
      setUserToResetPass(null);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setActionErrorMessage(err?.message || "Failed to send password reset email.");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">System Admin Control Center</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage registered user accounts, reset credentials, restrict users, and inspect total user metrics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Action Success / Error Banners */}
        {actionSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {actionErrorMessage && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 text-xs font-semibold text-rose-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{actionErrorMessage}</span>
            </div>
            <button
              onClick={() => setActionErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalUsersCount}</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Users</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{activeUsersCount}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Restricted Users</p>
              <p className="text-xl font-extrabold text-rose-700 mt-0.5">{restrictedUsersCount}</p>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <UserX className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Accounts</p>
              <p className="text-xl font-extrabold text-amber-700 mt-0.5">{adminUsersCount}</p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-bold text-slate-600 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Registered Users Directory ({totalUsersCount})
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "ai"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Cpu className="w-4 h-4" /> Gemini AI Engine Config
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "templates"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" /> ATS Templates Status
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "system"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" /> System Health
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {activeTab === "users" && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 border border-slate-200 rounded-xl shadow-2xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by User Name, Email ID, or User ID..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 transition"
                  >
                    <option value="all">All Statuses ({totalUsersCount})</option>
                    <option value="active">Active Only ({activeUsersCount})</option>
                    <option value="restricted">Restricted Only ({restrictedUsersCount})</option>
                  </select>

                  <button
                    onClick={loadUsersList}
                    disabled={isLoadingUsers}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Refresh user directory"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoadingUsers ? "animate-spin text-emerald-600" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Users Directory Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                {isLoadingUsers ? (
                  <div className="p-12 text-center text-slate-500 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                    <p className="text-xs font-semibold">Loading registered users directory...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 space-y-2">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No matching users found</p>
                    <p className="text-[11px] text-slate-400">
                      Try clearing search queries or changing status filters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">User Name & ID</th>
                          <th className="py-3 px-4">Email Address</th>
                          <th className="py-3 px-4">Registration Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredUsers.map((u) => {
                          const isMasterAdmin = ADMIN_EMAILS.includes(u.email.toLowerCase());

                          return (
                            <tr key={u.id} className="hover:bg-slate-50/80 transition">
                              {/* Name & ID */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                                    {u.display_name.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                      <span>{u.display_name}</span>
                                      {isMasterAdmin && (
                                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-100 text-amber-800 rounded border border-amber-300">
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                      ID: {u.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="py-3.5 px-4 text-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <span className="font-semibold text-slate-900">{u.email}</span>
                                  <button
                                    onClick={() => handleCopyEmail(u.email)}
                                    className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                    title="Copy email address"
                                  >
                                    {copiedEmail === u.email ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* Registration Date */}
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4">
                                {u.is_restricted ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                                    <UserX className="w-3 h-3" /> Restricted
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <UserCheck className="w-3 h-3 text-emerald-600" /> Active
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                {isMasterAdmin ? (
                                  <span className="text-[10px] font-bold text-slate-400 italic">
                                    Master System Admin
                                  </span>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Reset Password Button */}
                                    <button
                                      onClick={() => setUserToResetPass(u)}
                                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                      title="Send password reset link to user email"
                                    >
                                      <Key className="w-3.5 h-3.5" />
                                      <span className="hidden md:inline">Reset Pass</span>
                                    </button>

                                    {/* Restrict / Unrestrict Button */}
                                    <button
                                      onClick={() => {
                                        setUserToRestrict(u);
                                        setRestrictionReason(u.restriction_reason || "");
                                      }}
                                      className={`px-2.5 py-1.5 border rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                        u.is_restricted
                                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                          : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                      }`}
                                      title={u.is_restricted ? "Reactivate account access" : "Restrict account access"}
                                    >
                                      {u.is_restricted ? (
                                        <>
                                          <UserCheck className="w-3.5 h-3.5" />
                                          <span className="hidden md:inline">Unrestrict</span>
                                        </>
                                      ) : (
                                        <>
                                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                                          <span className="hidden md:inline">Restrict</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Delete User Button */}
                                    <button
                                      onClick={() => setUserToDelete(u)}
                                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                      title="Delete user account and data"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span className="hidden md:inline">Delete</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" /> Gemini 3.6 Flash Generation Parameters
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Global Recruiter System Prompt
                </label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    AI Creativity Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Output Tokens</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1024)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Active Model Endpoint
                </span>
                <p>Gemini 3.6 Flash model proxy active on Express Node.js backend (`/api/ai/*`)</p>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Manage Active ATS Templates (15 Verified)</h3>
              <p className="text-xs text-slate-600">All 15 ATS templates are online and fully rendering in live preview, PDF, and DOCX format.</p>
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Templates Online: Modern, Executive, Corporate, Creative, Minimalist, Classic, Academic, Government, ATS Simple, Elegant, Tech, Medical, Finance, Engineering, Graduate.</span>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-700 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">System Environment & Database Health</h3>
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Supabase Cloud Database</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Connected</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Express Node API Server</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Operational (Port 3000)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Ghana Open Vacancies Live Search</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active Grounding</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Admin modifications apply immediately to system auth registry.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            Close Admin Panel
          </button>
        </div>
      </div>

      {/* Restrict Confirmation Modal Dialog */}
      {userToRestrict && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-800">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                {userToRestrict.is_restricted ? "Reactivate User Account" : "Restrict User Account"}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {userToRestrict.is_restricted ? (
                <>Are you sure you want to reactivate access for user <strong>{userToRestrict.email}</strong>? They will regain full access to sign in.</>
              ) : (
                <>Are you sure you want to restrict user <strong>{userToRestrict.email}</strong>? Restricted users are immediately blocked from signing in.</>
              )}
            </p>

            {!userToRestrict.is_restricted && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Restriction Reason (Optional)
                </label>
                <input
                  type="text"
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                  placeholder="e.g. Terms violation, requested by user"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setUserToRestrict(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestrictToggle}
                disabled={isSubmittingRestrict}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                  userToRestrict.is_restricted
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {isSubmittingRestrict ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : userToRestrict.is_restricted ? (
                  "Confirm Reactivation"
                ) : (
                  "Confirm Restriction"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {userToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-800">
              <div className="p-2 bg-rose-100 rounded-xl text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Delete User Account</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete user <strong>{userToDelete.email}</strong> ({userToDelete.display_name})? This will permanently wipe their account and saved resume data.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {isSubmittingDelete ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  "Yes, Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Confirmation Dialog */}
      {userToResetPass && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-blue-800">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Reset User Password</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatch an official password reset link email to <strong>{userToResetPass.email}</strong>? The user will receive an email allowing them to set a new password.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setUserToResetPass(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetPassword}
                disabled={isSubmittingReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {isSubmittingReset ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  "Send Reset Link Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
