import React, { useState } from "react";
import { ResumeData } from "../../types";
import { calculateResumeStrength, ResumeStrengthResult } from "../../utils/resumeStrength";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface ResumeStrengthRingProps {
  resume: ResumeData;
  size?: number; // Outer SVG size in pixels (default 120)
  strokeWidth?: number; // Circle stroke width in pixels (default 10)
  showDetails?: boolean; // Whether to show breakdown cards below
  compactMode?: boolean; // Miniature ring for cards
}

export const ResumeStrengthRing: React.FC<ResumeStrengthRingProps> = ({
  resume,
  size = 130,
  strokeWidth = 10,
  showDetails = true,
  compactMode = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const result: ResumeStrengthResult = calculateResumeStrength(resume);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.totalScore / 100) * circumference;

  if (compactMode) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative inline-flex items-center justify-center">
          <svg width={42} height={42} className="transform -rotate-90">
            <circle
              cx={21}
              cy={21}
              r={16}
              stroke="currentColor"
              strokeWidth={3.5}
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx={21}
              cy={21}
              r={16}
              stroke={result.strokeColor}
              strokeWidth={3.5}
              fill="transparent"
              strokeDasharray={2 * Math.PI * 16}
              strokeDashoffset={2 * Math.PI * 16 - (result.totalScore / 100) * (2 * Math.PI * 16)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-[10px] font-black text-slate-800 dark:text-slate-200">
            {result.totalScore}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Strength Score
          </span>
          <span className="text-xs font-bold" style={{ color: result.strokeColor }}>
            {result.grade}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-6">
      {/* Header & Main Visual Ring */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          {/* Visual SVG Progress Ring */}
          <div className="relative inline-flex items-center justify-center flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Track Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Animated Progress Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={result.strokeColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {result.totalScore}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Strength
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${result.strokeColor}15`, color: result.strokeColor }}>
              <Zap className="w-3.5 h-3.5" />
              <span>{result.grade} Resume Match</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Resume Strength Meter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Calculated using live section completeness, active verbs density, and ATS search metrics.
            </p>
          </div>
        </div>

        {showDetails && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 self-stretch sm:self-auto justify-center"
          >
            {expanded ? "Hide Breakdown" : "View Strength Audit"}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Progress Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Section Score */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Section Completeness
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.breakdown.sectionScore}/{result.breakdown.maxSectionScore}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${(result.breakdown.sectionScore / result.breakdown.maxSectionScore) * 100}%` }}
            />
          </div>
        </div>

        {/* Verbs Score */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Action Verbs Quality
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.breakdown.verbScore}/{result.breakdown.maxVerbScore}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${(result.breakdown.verbScore / result.breakdown.maxVerbScore) * 100}%` }}
            />
          </div>
        </div>

        {/* ATS Score */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              ATS & Metrics Optimization
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.breakdown.atsScore}/{result.breakdown.maxAtsScore}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${(result.breakdown.atsScore / result.breakdown.maxAtsScore) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Detailed Audit Section */}
      {showDetails && expanded && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          {/* Actionable Improvement Suggestions */}
          {result.improvements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Suggested Quick Improvements ({result.improvements.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.improvements.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positives & Strengths */}
          {result.strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong Aspects Detected ({result.strengths.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.strengths.map((str, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Badges for Verbs & Missing Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action Verbs vs Weak Phrases */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500" /> Action Verbs & Language Audit
              </h5>
              
              {result.details.strongVerbsFound.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Strong Verbs:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.details.strongVerbsFound.map((verb) => (
                      <span key={verb} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded text-[11px] font-bold capitalize">
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.details.weakVerbsFound.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase">Weak Phrases Flagged:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.details.weakVerbsFound.map((weak) => (
                      <span key={weak} className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded text-[11px] font-bold">
                        "{weak}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Missing Sections Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Section Status
              </h5>

              {result.details.missingSections.length > 0 ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Incomplete / Missing:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.details.missingSections.map((sec) => (
                      <span key={sec} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[11px] font-medium">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All primary resume sections are filled!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
