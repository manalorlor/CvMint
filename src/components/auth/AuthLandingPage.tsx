import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CVMintLogo } from "../common/CVMintLogo";
import {
  ShieldCheck,
  Cloud,
  FileCheck,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  Zap,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AuthLandingPageProps {
  onContinueAsGuest?: () => void;
  initialMode?: "login" | "register" | "forgot";
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onContinueAsGuest, initialMode = "login" }) => {
  const { registerWithEmail, loginWithEmail, recoverPassword, loading, isSyncing } = useAuth();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  // Synchronize mode if initialMode prop changes & check for email confirmation notices
  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
    if (typeof window !== "undefined") {
      const notice = sessionStorage.getItem("email_confirmed_notice");
      if (notice) {
        setRegisterSuccessMessage(notice);
        sessionStorage.removeItem("email_confirmed_notice");
        setMode("login");
      }
    }
  }, [initialMode]);

  // Form Fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);

    if (!email.trim()) {
      setAuthError("Please enter your registered email address.");
      return;
    }

    try {
      setIsAuthenticating(true);
      await recoverPassword(email.trim());
      setResetSuccessMessage("Password reset email sent! Please check your inbox and Spam/Junk folder. Click the link in the email to set your new password.");
    } catch (err: any) {
      console.error("Password recovery error:", err);
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-email" || err?.message?.includes("User not found")) {
        setAuthError("No account found matching that email address.");
      } else {
        setAuthError(err?.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setAuthError("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!displayName.trim()) {
        setAuthError("Please enter a username or full name.");
        return;
      }
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
    }

    try {
      setIsAuthenticating(true);
      if (mode === "register") {
        await registerWithEmail(email.trim(), password, displayName.trim());
        setRegisterSuccessMessage("Account created successfully! Please check your email inbox to confirm your address if required, then enter your password below to sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        await loginWithEmail(email.trim(), password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg = err?.message || "";
      if (msg.includes("already registered") || msg.includes("User already registered")) {
        setAuthError("An account with this email address already exists. Please sign in instead.");
      } else if (msg.includes("Invalid login credentials")) {
        setAuthError("Invalid email or password. Please double check and try again.");
      } else if (msg.includes("Password should be at least")) {
        setAuthError("Password is too weak. Please use a stronger password.");
      } else {
        setAuthError(msg || "Authentication failed. Please check your details and try again.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900 border-t-2 border-emerald-600">
      {/* Navigation Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CVMintLogo size="md" showTagline={false} />
        </div>

        {onContinueAsGuest && (
          <button
            onClick={onContinueAsGuest}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 my-auto">
        {/* Left Column: Product Value Props */}
        <div className="flex-1 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Professional CV & Resume Builder</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
            Craft ATS-Ready Resumes & Land Your Next Career Opportunity
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Sign in or create an account to sync your resumes securely across all your devices, run instant ATS content checks, and export editable Word & PDF files.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">ATS Optimization</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Compliant with recruiter tracking systems.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex-shrink-0">
                <Cloud className="w-4 h-4 text-teal-700" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">Cloud Sync</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Automatic cloud backup across all browsers.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex-shrink-0">
                <FileCheck className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">Word & PDF Exports</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Editable .docx, clean PDF & plain text formats.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">AI Career Assistant</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Bullet point generator & grammar refinement.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Restrained Auth Card */}
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs relative">
          {/* Mode Switcher Tabs */}
          {mode !== "forgot" ? (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setAuthError(null);
                  setResetSuccessMessage(null);
                  setRegisterSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setAuthError(null);
                  setResetSuccessMessage(null);
                  setRegisterSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "register"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          ) : (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setAuthError(null);
                  setResetSuccessMessage(null);
                  setRegisterSuccessMessage(null);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}

          <div className="text-center space-y-1 mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "login"
                ? "Welcome back"
                : mode === "register"
                ? "Create your account"
                : "Reset your password"}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === "login"
                ? "Sign in to access your saved resumes and tools"
                : mode === "register"
                ? "Get started with your free CvMinter account"
                : "We will send a password reset link to your email"}
            </p>
          </div>

          {registerSuccessMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-950 mb-0.5">Registration Successful!</span>
                <span>{registerSuccessMessage}</span>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium leading-relaxed whitespace-pre-line">
              {authError}
              {authError.includes("Supabase is not configured") && onContinueAsGuest && (
                <div className="mt-2.5 pt-2 border-t border-amber-200/80">
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  >
                    Continue as Guest for now
                  </button>
                </div>
              )}
            </div>
          )}

          {resetSuccessMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium leading-relaxed">
              {resetSuccessMessage}
            </div>
          )}

          {/* Password Recovery Mode */}
          {mode === "forgot" ? (
            <div className="space-y-4">
              <form onSubmit={handlePasswordRecoverySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating || loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer mt-1 shadow-2xs"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Password Reset Email</span>
                    </>
                  )}
                </button>
              </form>

              {/* Direct Alternative Options */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 text-center mb-1">
                  Or choose a direct alternative:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setAuthError(null);
                    }}
                    className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-[11px] border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sign In Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setAuthError(null);
                    }}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-[11px] border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Create Account</span>
                  </button>
                </div>

                {onContinueAsGuest && (
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mt-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Continue to App as Guest</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Email & Password Form */
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
              {mode === "register" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name / Username
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setAuthError(null);
                        setResetSuccessMessage(null);
                      }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                  />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition shadow-2xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || isSyncing || loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer mt-1 shadow-2xs"
              >
                {isAuthenticating || isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : mode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Guest Option */}
          {onContinueAsGuest && (
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-[11px] text-slate-500 hover:text-slate-800 transition font-medium cursor-pointer"
              >
                Skip for now — Continue as Guest
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-5 text-center text-xs text-slate-500 border-t border-slate-200/80">
        <p>© 2026 CvMinter. Professional Resume & CV Builder. Built by MANATECH</p>
      </footer>
    </div>
  );
};
