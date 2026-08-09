import React, { useState } from "react";
import { ResumeData, SkillItem, SkillLevel, SkillCategory } from "../../types";
import { Plus, Trash2, Wrench, Sparkles, Loader2 } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

const CATEGORIES: SkillCategory[] = [
  "Technical Skills",
  "Soft Skills",
  "Languages",
  "Computer Skills",
  "Data Analysis",
  "Programming",
  "Design",
  "Management",
  "Communication",
  "Leadership",
];

const LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export const SkillsStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const skillList = resume.skills || [];
  const [newSkillName, setNewSkillName] = useState("");
  const [newCategory, setNewCategory] = useState<SkillCategory>("Technical Skills");
  const [newLevel, setNewLevel] = useState<SkillLevel>("Advanced");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newItem: SkillItem = {
      id: "sk-" + Date.now(),
      name: newSkillName.trim(),
      category: newCategory,
      level: newLevel,
    };
    onChange({
      ...resume,
      skills: [...skillList, newItem],
    });
    setNewSkillName("");
  };

  const handleRemoveSkill = (id: string) => {
    onChange({
      ...resume,
      skills: skillList.filter((s) => s.id !== id),
    });
  };

  const handleAiSuggestSkills = async () => {
    try {
      setIsSuggesting(true);
      const res = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: resume.targetJobTitle || "Software Engineer",
          fieldOfStudy: resume.fieldOfStudy || "Computer Science",
        }),
      });

      const data = await res.json();
      if (data.suggestedSkills) {
        const newSkills: SkillItem[] = [];
        const s = data.suggestedSkills;

        if (Array.isArray(s.technical)) {
          s.technical.forEach((item: string) => {
            newSkills.push({ id: "sk-" + Math.random(), name: item, category: "Technical Skills", level: "Expert" });
          });
        }
        if (Array.isArray(s.soft)) {
          s.soft.forEach((item: string) => {
            newSkills.push({ id: "sk-" + Math.random(), name: item, category: "Soft Skills", level: "Advanced" });
          });
        }
        if (Array.isArray(s.tools)) {
          s.tools.forEach((item: string) => {
            newSkills.push({ id: "sk-" + Math.random(), name: item, category: "Computer Skills", level: "Advanced" });
          });
        }

        // Avoid duplicates
        const existingNames = new Set(skillList.map((x) => x.name.toLowerCase()));
        const filteredNew = newSkills.filter((x) => !existingNames.has(x.name.toLowerCase()));

        onChange({
          ...resume,
          skills: [...skillList, ...filteredNew],
        });
      }
    } catch (err) {
      console.error("Error suggesting skills:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-600" /> Professional Skills & Competencies
          </h3>
          <p className="text-sm text-slate-600">
            Add hard & soft skills relevant to your career field.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAiSuggestSkills}
          disabled={isSuggesting}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI Suggest Skills for Role
        </button>
      </div>

      {/* Quick Add Form */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Skill Name</label>
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
            placeholder="e.g. TypeScript, Financial Audit, SQL"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Category</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Level</label>
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Skill List */}
      <div className="flex flex-wrap gap-2 pt-2">
        {skillList.map((sk) => (
          <div
            key={sk.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-400 transition"
          >
            <div className="text-xs">
              <span className="font-bold text-slate-900">{sk.name}</span>
              <span className="text-[10px] text-slate-500 ml-1.5">({sk.level})</span>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveSkill(sk.id)}
              className="text-slate-400 hover:text-red-500 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
