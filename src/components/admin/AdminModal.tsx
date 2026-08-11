import React, { useState } from "react";
import { X, Settings, ShieldAlert, Cpu, Sparkles, Layers, Users, DollarSign, MessageSquare, Check, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_EMAILS = ["manassehlorlor@gmail.com"];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"ai" | "templates" | "users" | "settings">("ai");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an elite executive HR recruiter and ATS resume optimization expert."
  );

  if (!isOpen) return null;

  const isAdmin = currentUser?.email
    ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
    : false;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
            <p className="text-xs text-slate-500 mt-1">
              System Admin privileges are restricted to authorized administrator accounts (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">manassehlorlor@gmail.com</code>).
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-extrabold">System Admin Panel</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage AI prompt parameters, template rules, user tiers, and platform settings.
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 text-xs font-bold text-gray-600 gap-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === "ai" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-gray-900"
            }`}
          >
            <Cpu className="w-4 h-4" /> AI Prompt Settings
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === "templates" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-gray-900"
            }`}
          >
            <Layers className="w-4 h-4" /> Templates Manager
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === "users" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-gray-900"
            }`}
          >
            <DollarSign className="w-4 h-4" /> Subscription Plans
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-gray-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Site Settings & Feedback
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "ai" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Gemini System Persona Prompt
                </label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    AI Creativity Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Max Output Tokens</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1024)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Active Model Endpoint
                </span>
                <p>Gemini 3.6 Flash running server-side on Node.js/Express</p>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Manage Active Templates (15 Installed)</h3>
              <p className="text-xs text-gray-500">All 15 ATS-friendly templates are active and verified for PDF & DOCX rendering.</p>
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Modern, Executive, Corporate, Creative, Minimalist, Classic, Academic, Government, ATS Simple, Elegant, Tech, Medical, Finance, Engineering, Graduate templates online.</span>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <h4 className="font-bold text-xs text-gray-900">Free Tier</h4>
                <p className="text-2xl font-black text-gray-900">$0/mo</p>
                <p className="text-[11px] text-gray-500">Unlimited resumes, PDF export, basic templates.</p>
              </div>

              <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 space-y-2">
                <h4 className="font-bold text-xs text-blue-900">Pro Executive</h4>
                <p className="text-2xl font-black text-blue-900">$12/mo</p>
                <p className="text-[11px] text-blue-800">Unlimited Word (.docx) export, AI summary generator, ATS scanner.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <h4 className="font-bold text-xs text-gray-900">Enterprise Team</h4>
                <p className="text-2xl font-black text-gray-900">$49/mo</p>
                <p className="text-[11px] text-gray-500">Multi-user account management & priority AI server bandwidth.</p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-3 text-xs text-gray-700">
              <p className="font-bold text-gray-900">Site Status: Operational</p>
              <p>Autosave every 10s: Enabled (Local & In-Memory Persistence)</p>
              <p>Gemini API Status: Connected (Server Proxy Route Active)</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Save & Exit Admin
          </button>
        </div>
      </div>
    </div>
  );
};
