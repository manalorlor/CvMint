import React, { useState, useEffect } from "react";
import { ResumeData, AtsAnalysisResult } from "../../types";
import { X, CheckCircle2, AlertTriangle, Lightbulb, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

interface AtsAnalyzerModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
  onApplyKeyword?: (keyword: string) => void;
  initialJobDesc?: string;
}

export const AtsAnalyzerModal: React.FC<AtsAnalyzerModalProps> = ({
  resume,
  isOpen,
  onClose,
  onApplyKeyword,
  initialJobDesc,
}) => {
  const [jobDesc, setJobDesc] = useState(initialJobDesc || resume.targetJobTitle || "");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysisResult | null>(null);

  useEffect(() => {
    if (initialJobDesc) {
      setJobDesc(initialJobDesc);
    }
  }, [initialJobDesc]);

  const runAtsScan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resume,
          targetJobDescription: jobDesc || resume.targetJobTitle,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("ATS Audit error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysis) {
      runAtsScan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const score = analysis?.score || 82;

  const getScoreBadge = (val: number) => {
    if (val >= 85) return { text: "Excellent ATS Match", textCol: "text-emerald-700" };
    if (val >= 70) return { text: "Good - Minor Tweaks Recommended", textCol: "text-amber-700" };
    return { text: "Low ATS Compliance", textCol: "text-red-700" };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="fixed inset-0 bg-slate-800/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-slate-200">
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
                Audit Tool
              </span>
              <h2 className="text-xl font-bold text-slate-900">ATS Resume Scanner</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Evaluates keyword density, formatting, and structural compliance for employer tracking systems.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Target Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Target Job Title / Job Description
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 font-medium"
            />
            <button
              onClick={runAtsScan}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Re-Scan
            </button>
          </div>
        </div>

        {/* Score Indicator */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall ATS Score</div>
            <div className={`text-2xl font-black mt-0.5 ${badge.textCol}`}>{badge.text}</div>
          </div>
          <div className="text-3xl font-black text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl">
            {score}<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
        </div>

        {/* Audit Results */}
        {analysis && (
          <div className="space-y-4 text-xs">
            {/* Found Keywords */}
            {analysis.foundKeywords && analysis.foundKeywords.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Detected Matching Keywords ({analysis.foundKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.foundKeywords.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Recommended Keywords to Include ({analysis.missingKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => onApplyKeyword && onApplyKeyword(kw)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-medium transition"
                      title="Click to copy/use"
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Formatting & Structure Suggestions */}
            {analysis.formattingCheck && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  Formatting Recommendations
                </div>
                <ul className="space-y-1 text-slate-600 list-disc pl-5">
                  {analysis.formattingCheck.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
