import React from "react";
import { ResumeData } from "../../types";
import { Plus, Edit3, Copy, Trash2, Download, FileText, CheckCircle2 } from "lucide-react";
import { ResumeStrengthRing } from "./ResumeStrengthRing";

interface ResumeDashboardProps {
  resumes: ResumeData[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExportDocx: (resume: ResumeData) => void;
  onExportPdf: () => void;
}

export const ResumeDashboard: React.FC<ResumeDashboardProps> = ({
  resumes,
  activeResumeId,
  onSelectResume,
  onCreateNew,
  onDuplicate,
  onDelete,
  onExportDocx,
}) => {
  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-slate-200/60 border border-slate-300/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs text-slate-900">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300/60">
            My Workspace
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">My Resumes</h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl font-medium">
            Manage your saved ATS resumes, track live strength scores, audit weak verbs, and export in Word or PDF.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition transform hover:scale-105"
        >
          <Plus className="w-5 h-5" /> Create New Resume
        </button>
      </div>

      {/* Primary Active Resume Strength Audit Ring */}
      {activeResume && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Resume Strength Audit ({activeResume.title || "Untitled Resume"})
            </h3>
          </div>
          <ResumeStrengthRing resume={activeResume} size={130} strokeWidth={10} showDetails={true} />
        </div>
      )}

      {/* Grid of Resumes */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          All Saved Resumes ({resumes.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const isActive = resume.id === activeResumeId;

            return (
              <div
                key={resume.id}
                className={`bg-white rounded-2xl border-2 p-6 transition shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between ${
                  isActive
                    ? "border-emerald-600 ring-2 ring-emerald-500/10"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {resume.title || "Untitled Resume"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {resume.targetJobTitle || "General Role"}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    )}
                  </div>

                  {/* Compact Strength Progress Ring */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <ResumeStrengthRing resume={resume} compactMode={true} />
                  </div>

                  {/* Info Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-600">
                    <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">
                      Template: {resume.templateId || "Modern"}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">
                      {resume.workExperience?.length || 0} Exp
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">
                      {resume.skills?.length || 0} Skills
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectResume(resume.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Resume
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onExportDocx(resume)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Download Word .docx"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicate(resume.id)}
                      className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {resumes.length > 1 && (
                      <button
                        onClick={() => onDelete(resume.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
