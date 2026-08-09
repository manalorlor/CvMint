import React from "react";
import { CareerStage, ResumeData } from "../../types";
import { GraduationCap, Briefcase, Award, Check, Sparkles, X, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";

interface CareerStageSelectorModalProps {
  isOpen: boolean;
  currentStage?: CareerStage;
  onSelectStage: (stage: CareerStage) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const CAREER_STAGE_OPTIONS: {
  id: CareerStage;
  title: string;
  badge: string;
  badgeBg: string;
  description: string;
  icon: any;
  accentColor: string;
  sectionOrder: string[];
  highlights: string[];
}[] = [
  {
    id: "student",
    title: "Current Student / Intern",
    badge: "No Work Experience Needed",
    badgeBg: "bg-blue-100 text-blue-900 border-blue-200",
    description: "In University, College, or High School seeking attachments, part-time jobs, or internships.",
    icon: GraduationCap,
    accentColor: "text-blue-600 bg-blue-50 border-blue-200",
    sectionOrder: ["education", "projects", "skills", "experience", "certifications", "summary", "references"],
    highlights: [
      "Education, GPA & Coursework placed at the top",
      "Highlights Academic Projects, Term Papers & Group Work",
      "Emphasizes Campus Leadership, Clubs & Soft Skills",
      "Tailored for attachments, co-ops & student roles",
    ],
  },
  {
    id: "recent_graduate",
    title: "Recent Graduate / NSS",
    badge: "Entry-Level Career Focus",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-200",
    description: "Graduated within 1-2 years, undergoing National Service (NSS), or seeking entry-level roles.",
    icon: BookOpen,
    accentColor: "text-purple-600 bg-purple-50 border-purple-200",
    sectionOrder: ["education", "projects", "experience", "skills", "certifications", "summary", "references"],
    highlights: [
      "Degree, Honors & Capstone Project emphasized",
      "Prominently features National Service (NSS) & Internships",
      "Demonstrates core domain competencies & tools",
      "Optimized for entry-level corporate recruitment",
    ],
  },
  {
    id: "professional",
    title: "Experienced Worker",
    badge: "Mid to Senior Level",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-200",
    description: "Currently employed or experienced professional with prior full-time industry experience.",
    icon: Briefcase,
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    sectionOrder: ["summary", "experience", "skills", "certifications", "education", "projects", "references"],
    highlights: [
      "Work Experience & Achievements placed first",
      "Focuses on measurable metrics, revenue & team leadership",
      "Highlights professional certifications & licenses",
      "Standard executive layout favored by recruiters",
    ],
  },
];

export const CareerStageSelectorModal: React.FC<CareerStageSelectorModalProps> = ({
  isOpen,
  currentStage = "professional",
  onSelectStage,
  onClose,
  isInitialSetup = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Select Your Career Stage
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              We adjust your CV structure, section hierarchy, and guidance tips so students without formal job history get a powerful, recruiter-approved layout!
            </p>
          </div>

          {!isInitialSetup && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body - 3 Profile Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAREER_STAGE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentStage === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectStage(opt.id)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition transform hover:-translate-y-1 flex flex-col justify-between relative group shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl border ${opt.accentColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {isSelected && (
                        <span className="p-1 bg-emerald-600 text-white rounded-full">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div>
                      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full border mb-1.5 ${opt.badgeBg}`}>
                        {opt.badge}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600">
                        {opt.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        CV Structure & Features:
                      </p>
                      {opt.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`mt-4 w-full py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <span>{isSelected ? "Selected Stage" : "Choose Profile"}</span>
                    {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            💡 You can change your career stage anytime in the Wizard.
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Apply & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
