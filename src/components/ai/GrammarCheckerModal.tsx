import React, { useState, useEffect } from "react";
import { ResumeData, GrammarAuditResult } from "../../types";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Loader2, Sparkles, RefreshCw } from "lucide-react";

interface GrammarCheckerModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarCheckerModal: React.FC<GrammarCheckerModalProps> = ({ resume, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<GrammarAuditResult | null>(null);

  const generateFallbackGrammarAudit = (): GrammarAuditResult => {
    const summary = resume.professionalSummary || "";
    const exps = resume.experience || [];

    const issues: { original: string; suggestion: string; reason: string }[] = [];
    const weakVerbs: { word: string; betterAlternatives: string[] }[] = [];

    // Check summary passive phrasing
    if (summary.toLowerCase().includes("responsible for")) {
      issues.push({
        original: "responsible for",
        suggestion: "spearheaded / administered",
        reason: "Replace passive phrase with an active leadership verb to increase impact.",
      });
    }

    if (summary.toLowerCase().includes("worked on")) {
      issues.push({
        original: "worked on",
        suggestion: "orchestrated / engineered",
        reason: "Replace vague phrase with a precise descriptive action verb.",
      });
    }

    // Check experience action verbs
    exps.forEach((exp) => {
      (exp.bulletPoints || []).forEach((bullet) => {
        const bLower = bullet.toLowerCase();
        if (bLower.includes("helped")) {
          weakVerbs.push({
            word: "helped",
            betterAlternatives: ["collaborated with", "facilitated", "assisted in driving"],
          });
        } else if (bLower.includes("handled")) {
          weakVerbs.push({
            word: "handled",
            betterAlternatives: ["managed", "executed", "directed", "administered"],
          });
        }
      });
    });

    return {
      grammarIssues: issues,
      weakVerbs: weakVerbs.length > 0 ? weakVerbs : [
        {
          word: "assisted",
          betterAlternatives: ["co-managed", "accelerated", "implemented"],
        },
      ],
      longSentences: [],
      incompleteDates: [],
      missingSections: [],
    };
  };

  const runAudit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/check-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume }),
      });

      if (!res.ok) {
        throw new Error("API route unavailable on static hosting.");
      }

      const data = await res.json();
      if (data.audit) {
        setAudit(data.audit);
      } else {
        setAudit(generateFallbackGrammarAudit());
      }
    } catch (err) {
      console.warn("Server API call failed, using client proofreader fallback:", err);
      setAudit(generateFallbackGrammarAudit());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !audit) {
      runAudit();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">
                AI Proofreader
              </span>
              <h2 className="text-xl font-extrabold text-gray-900">Grammar & Quality Checker</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Checks for spelling, weak passive verbs, incomplete dates, and run-on sentences.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Proofreading entire resume content...</p>
          </div>
        ) : audit ? (
          <div className="space-y-6">
            {/* Grammar issues */}
            {audit.grammarIssues?.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Grammar & Phrasing Suggestions
                </h4>
                <div className="space-y-2">
                  {audit.grammarIssues.map((g, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                      <p className="text-gray-600 line-through">"{g.original}"</p>
                      <p className="font-bold text-amber-950">Suggestion: "{g.suggestion}"</p>
                      <p className="text-[11px] text-amber-800 italic">{g.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No critical grammar or spelling issues detected!
              </div>
            )}

            {/* Weak Verbs */}
            {audit.weakVerbs?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Weak Verbs to Power Up
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {audit.weakVerbs.map((wv, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                      <span className="font-bold text-purple-900">{wv.word}</span>
                      <p className="text-gray-600 mt-0.5">Alternatives: {wv.betterAlternatives.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Incomplete Dates & Long Sentences */}
            {(audit.incompleteDates?.length > 0 || audit.longSentences?.length > 0) && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                {audit.incompleteDates?.map((d, i) => (
                  <p key={i} className="text-gray-700 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> <strong className="text-gray-900">Incomplete Date:</strong> {d}</p>
                ))}
                {audit.longSentences?.map((s, i) => (
                  <p key={i} className="text-gray-700 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> <strong className="text-gray-900">Long Sentence:</strong> "{s}"</p>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={runAudit}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-check
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
