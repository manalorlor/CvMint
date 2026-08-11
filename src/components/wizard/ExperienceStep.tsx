import React, { useState } from "react";
import { ResumeData, WorkExperience } from "../../types";
import { Plus, Trash2, Briefcase, Sparkles, Loader2, Wand2 } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ExperienceStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const experiences = resume.workExperience || [];
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newExp: WorkExperience = {
      id: "exp-" + Date.now(),
      companyName: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      responsibilities: [
        "",
      ],
      achievements: "",
    };
    onChange({
      ...resume,
      workExperience: [...experiences, newExp],
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      workExperience: experiences.filter((e) => e.id !== id),
    });
  };

  const handleChange = (id: string, field: keyof WorkExperience, value: any) => {
    onChange({
      ...resume,
      workExperience: experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const handleAddBullet = (expId: string) => {
    onChange({
      ...resume,
      workExperience: experiences.map((e) => {
        if (e.id === expId) {
          return {
            ...e,
            responsibilities: [...(e.responsibilities || []), ""],
          };
        }
        return e;
      }),
    });
  };

  const handleUpdateBullet = (expId: string, index: number, text: string) => {
    onChange({
      ...resume,
      workExperience: experiences.map((e) => {
        if (e.id === expId) {
          const updated = [...(e.responsibilities || [])];
          updated[index] = text;
          return { ...e, responsibilities: updated };
        }
        return e;
      }),
    });
  };

  const handleRemoveBullet = (expId: string, index: number) => {
    onChange({
      ...resume,
      workExperience: experiences.map((e) => {
        if (e.id === expId) {
          const updated = (e.responsibilities || []).filter((_, i) => i !== index);
          return { ...e, responsibilities: updated };
        }
        return e;
      }),
    });
  };

  const handleAiGenerateResponsibilities = async (exp: WorkExperience) => {
    try {
      setGeneratingId(exp.id);
      const res = await fetch("/api/ai/generate-responsibilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: exp.position || resume.targetJobTitle || "Professional",
          company: exp.companyName || "Company",
          fieldOfStudy: resume.fieldOfStudy || "General",
          skills: resume.skills.map((s) => s.name),
        }),
      });

      const data = await res.json();
      if (data.responsibilities && Array.isArray(data.responsibilities)) {
        onChange({
          ...resume,
          workExperience: experiences.map((e) =>
            e.id === exp.id ? { ...e, responsibilities: data.responsibilities } : e
          ),
        });
      }
    } catch (err) {
      console.error("Failed to generate responsibilities:", err);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Student / Graduate Work Experience Guidance Banner */}
      {resume.careerStage === "student" && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-black text-xs flex-shrink-0">
            No Job History?
          </div>
          <div className="space-y-1 text-xs text-slate-800">
            <h4 className="font-extrabold uppercase tracking-wide text-amber-950">Don't Worry — This Step Is Optional For Students!</h4>
            <p className="leading-relaxed">
              If you don't have formal work experience yet, you can leave this blank or add <strong>Campus Assistant roles, Volunteer work, Student Club Leadership, or Internships/Attachments</strong>. Your CV automatically prioritizes your Education and Academic Projects!
            </p>
          </div>
        </div>
      )}

      {resume.careerStage === "recent_graduate" && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-xl font-bold text-xs flex-shrink-0">
            NSS & Internships Tip
          </div>
          <div className="space-y-1 text-xs text-purple-950">
            <h4 className="font-extrabold uppercase tracking-wide">Include National Service (NSS) & Industrial Attachments</h4>
            <p className="leading-relaxed">
              Employers value National Service Scheme (NSS) placements, industrial training, and vacation internships! List your position as e.g. "National Service Personnel" or "Engineering Intern".
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" /> Work Experience
          </h3>
          <p className="text-sm text-slate-600">
            List your employment history with action verbs, metrics, and key accomplishments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 rounded-2xl text-sm font-medium hover:border-blue-400 hover:text-blue-500 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6 text-slate-300" />
          <span>+ Add your first work experience</span>
        </button>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Position #{idx + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAiGenerateResponsibilities(exp)}
                    disabled={generatingId === exp.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-200 dark:shadow-none transition"
                  >
                    {generatingId === exp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    AI Optimize
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Position / Job Title *</label>
                  <input
                    type="text"
                    value={exp.position || ""}
                    onChange={(e) => handleChange(exp.id, "position", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                    placeholder="e.g., Senior Full Stack Engineer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={exp.companyName || ""}
                    onChange={(e) => handleChange(exp.id, "companyName", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                    placeholder="e.g., Hubtel Ghana / MTN Ghana / Ecobank"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={exp.location || ""}
                    onChange={(e) => handleChange(exp.id, "location", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                    placeholder="e.g. Accra, Ghana or Remote (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Start Date (Optional)</label>
                  <input
                    type="text"
                    value={exp.startDate || ""}
                    onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                    placeholder="e.g. 2022-01 (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">End Date (Optional)</label>
                  <input
                    type="text"
                    disabled={exp.isCurrentJob}
                    value={exp.endDate || ""}
                    onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100 disabled:opacity-50"
                    placeholder="e.g. 2024-01 (Optional)"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.isCurrentJob || false}
                  onChange={(e) => handleChange(exp.id, "isCurrentJob", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                  I currently work here
                </label>
              </div>

              {/* Responsibilities Bullets */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    Responsibilities & Achievements (Bulleted)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(exp.id)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>

                {exp.responsibilities?.map((resp, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-center">
                    <span className="text-blue-600 font-bold">•</span>
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                      placeholder="e.g. Optimized database query performance by 40% using indexing and caching."
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(exp.id, bIdx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Key Accomplishment (Optional)</label>
                <input
                  type="text"
                  value={exp.achievements || ""}
                  onChange={(e) => handleChange(exp.id, "achievements", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 dark:text-slate-100"
                  placeholder="e.g., Awarded Employee of the Quarter Q3 2024 for leading major system overhaul."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 rounded-xl text-sm font-medium hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            + Add Another Experience
          </button>
        </div>
      )}
    </div>
  );
};
