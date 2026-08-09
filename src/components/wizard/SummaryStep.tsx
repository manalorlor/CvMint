import React, { useState } from "react";
import { ResumeData } from "../../types";
import { Sparkles, Loader2, Check } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const SummaryStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingObjective, setIsGeneratingObjective] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<string[]>([]);
  const [objectiveOptions, setObjectiveOptions] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("Professional & Impactful");

  const handleAiGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: resume.targetJobTitle || resume.personalInfo.jobTitle || "Professional",
          fieldOfStudy: resume.fieldOfStudy || "General",
          yearsOfExperience: resume.yearsOfExperience || 5,
          skills: resume.skills.map((s) => s.name),
          tone: selectedTone,
        }),
      });

      const data = await res.json();
      if (data.summaries && Array.isArray(data.summaries)) {
        setSummaryOptions(data.summaries);
        if (data.summaries.length > 0) {
          onChange({ ...resume, professionalSummary: data.summaries[0] });
        }
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAiGenerateObjective = async () => {
    try {
      setIsGeneratingObjective(true);
      const res = await fetch("/api/ai/generate-objective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: resume.targetJobTitle || "Professional",
          fieldOfStudy: resume.fieldOfStudy || "General",
        }),
      });

      const data = await res.json();
      if (data.objectives && Array.isArray(data.objectives)) {
        setObjectiveOptions(data.objectives);
        if (data.objectives.length > 0) {
          onChange({ ...resume, careerObjective: data.objectives[0] });
        }
      }
    } catch (err) {
      console.error("Failed to generate objective:", err);
    } finally {
      setIsGeneratingObjective(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" /> Professional Summary & Career Objective
        </h3>
        <p className="text-sm text-slate-600">
          Craft an impactful 3-4 sentence elevator pitch to capture recruiter attention immediately.
        </p>
      </div>

      {/* Tone selector */}
      <div className="flex items-center gap-3 bg-slate-100/70 p-3.5 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-800">AI Tone & Style:</span>
        <select
          value={selectedTone}
          onChange={(e) => setSelectedTone(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Professional & Impactful">Professional & Impactful</option>
          <option value="Executive & Leadership">Executive & Leadership</option>
          <option value="Technical & Data-Driven">Technical & Data-Driven</option>
          <option value="Concise & Direct">Concise & Direct</option>
        </select>
      </div>

      {/* Summary Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Professional Summary</label>
          <button
            type="button"
            onClick={handleAiGenerateSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
          >
            {isGeneratingSummary ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Generate Options
          </button>
        </div>

        <textarea
          rows={4}
          value={resume.professionalSummary || ""}
          onChange={(e) => onChange({ ...resume, professionalSummary: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
          placeholder="Enter your professional summary or click 'AI Generate Options'..."
        />

        {/* AI Options Picker */}
        {summaryOptions.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-800">Select an AI Generated Option:</p>
            {summaryOptions.map((opt, idx) => {
              const isSelected = resume.professionalSummary === opt;
              return (
                <div
                  key={idx}
                  onClick={() => onChange({ ...resume, professionalSummary: opt })}
                  className={`p-3 rounded-xl text-xs cursor-pointer border transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs"
                      : "border-slate-200 hover:border-emerald-300 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="flex-1">{opt}</p>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Objective Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Career Objective</label>
          <button
            type="button"
            onClick={handleAiGenerateObjective}
            disabled={isGeneratingObjective}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
          >
            {isGeneratingObjective ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            )}
            AI Generate Objective
          </button>
        </div>

        <textarea
          rows={2}
          value={resume.careerObjective || ""}
          onChange={(e) => onChange({ ...resume, careerObjective: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
          placeholder="Enter career objective..."
        />

        {objectiveOptions.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-xs font-bold text-slate-800">Select an Objective Option:</p>
            {objectiveOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => onChange({ ...resume, careerObjective: opt })}
                className={`p-2.5 rounded-xl text-xs cursor-pointer border transition ${
                  resume.careerObjective === opt
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold"
                    : "border-slate-200 hover:border-emerald-300 bg-slate-50 text-slate-700"
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
