import React from "react";
import { Sparkles, Layout, Wand2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { CVMintLogo } from "../common/CVMintLogo";

interface WelcomeHeroProps {
  onCreateClick: () => void;
  onTemplatesClick: () => void;
  onJobsClick?: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onCreateClick, onTemplatesClick, onJobsClick }) => {
  return (
    <div className="relative overflow-hidden bg-slate-200/60 rounded-3xl p-8 md:p-12 border border-slate-300/80 shadow-sm text-slate-900">
      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300/60 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 100% ATS-Compliant & Verified
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <CVMintLogo size="lg" showText={false} />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Welcome to <span className="text-emerald-600">CvMinter</span> — <span className="text-slate-800">ATS Resume Builder</span>
          </h1>
        </div>

        <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
          Build a polished, employer-ready CV in minutes. Powered by intelligent ATS scoring, active verbs analysis, tailored job bullet generators, and 15+ professionally formatted templates.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-7 py-3.5 text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md transition transform hover:-translate-y-0.5"
          >
            Create Resume <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTemplatesClick}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-2xl transition shadow-sm"
          >
            <Layout className="w-4 h-4 text-emerald-600" />
            <span>View Templates</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full border border-amber-200">Soon</span>
          </button>

          {onJobsClick && (
            <button
              onClick={onJobsClick}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-2xl shadow-sm transition"
            >
              <span>🇬🇭</span> Ghana Vacancies
            </button>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-300/80 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Passes ATS Keyword Scanners</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Export to Editable Word (.docx) & PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>AI Bullet & Summary Generator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

