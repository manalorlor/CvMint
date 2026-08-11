import React from "react";
import { ResumeData, Project } from "../../types";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ProjectsStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const projects = resume.projects || [];

  const handleAdd = () => {
    const newProj: Project = {
      id: "proj-" + Date.now(),
      projectName: "",
      description: "",
      technologiesUsed: "",
    };
    onChange({
      ...resume,
      projects: [...projects, newProj],
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      projects: projects.filter((p) => p.id !== id),
    });
  };

  const handleChange = (id: string, field: keyof Project, value: string) => {
    onChange({
      ...resume,
      projects: projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Student Project Emphasis Banner */}
      {(resume.careerStage === "student" || resume.careerStage === "recent_graduate") && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex-shrink-0">
            Crucial for Students
          </div>
          <div className="space-y-1 text-xs text-emerald-950">
            <h4 className="font-extrabold uppercase tracking-wide">Academic & Class Projects Replace Job Experience</h4>
            <p className="leading-relaxed">
              Showcase term papers, lab assignments, capstone final-year projects, group presentations, or open-source software. Recruiter studies show 84%+ of entry-level employers evaluate candidates by project achievements!
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-600" /> Key Projects
          </h3>
          <p className="text-xs text-gray-500">Showcase relevant portfolio projects, technical work, or major deliverables.</p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 text-xs font-semibold text-emerald-600 hover:underline"
          >
            + Add your first key project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Project</span>
                <button
                  type="button"
                  onClick={() => handleRemove(proj.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={proj.projectName || ""}
                    onChange={(e) => handleChange(proj.id, "projectName", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. AI Resume & Portfolio Builder"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Technologies Used (Optional)</label>
                  <input
                    type="text"
                    value={proj.technologiesUsed || ""}
                    onChange={(e) => handleChange(proj.id, "technologiesUsed", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. React, TypeScript, Python, GCP (Optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Project Description *</label>
                <textarea
                  rows={2}
                  value={proj.description || ""}
                  onChange={(e) => handleChange(proj.id, "description", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Describe key problem solved, architectural approach, and impact..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project Link (Optional)</label>
                  <input
                    type="text"
                    value={proj.projectLink || ""}
                    onChange={(e) => handleChange(proj.id, "projectLink", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="https://myproject.com (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Link (Optional)</label>
                  <input
                    type="text"
                    value={proj.githubLink || ""}
                    onChange={(e) => handleChange(proj.id, "githubLink", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="github.com/user/project (Optional)"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
