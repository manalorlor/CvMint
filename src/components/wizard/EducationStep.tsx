import React from "react";
import { ResumeData, Education } from "../../types";
import { Plus, Trash2, GraduationCap, Building2, Sparkles } from "lucide-react";
import { GHANAIAN_UNIVERSITIES, TOP_GHANAIAN_UNIVERSITIES } from "../../data/ghanaianUniversities";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const EducationStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const educationList = resume.education || [];

  const handleAdd = () => {
    const newEdu: Education = {
      id: "edu-" + Date.now(),
      institutionName: "",
      country: "",
      fieldOfStudy: "",
      degree: "",
      startYear: "",
      completionYear: "",
      isCurrentStudent: false,
    };
    onChange({
      ...resume,
      education: [...educationList, newEdu],
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      education: educationList.filter((e) => e.id !== id),
    });
  };

  const handleChange = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...resume,
      education: educationList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Student / Graduate High-Impact Tip Banner */}
      {(resume.careerStage === "student" || resume.careerStage === "recent_graduate") && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex-shrink-0">
            Student Priority
          </div>
          <div className="space-y-1 text-xs text-blue-950">
            <h4 className="font-extrabold uppercase tracking-wide">Education Is Your #1 Asset</h4>
            <p className="leading-relaxed">
              Since you are a student or recent graduate, recruiters examine your degree, institution, GPA, and relevant coursework first. List key course modules (e.g. Data Structures, Macroeconomics, Financial Accounting) and academic honors!
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" /> Education History
          </h3>
          <p className="text-xs text-gray-500">List your academic degrees, GPA, and relevant achievements.</p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Add Degree
        </button>
      </div>

      {educationList.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 text-xs font-semibold text-emerald-600 hover:underline"
          >
            + Add your first education degree
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu, idx) => (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4 relative group">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Degree #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(edu.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Datalist for Ghanaian Universities */}
              <datalist id={`ghana-unis-${edu.id}`}>
                {GHANAIAN_UNIVERSITIES.map((uni) => (
                  <option key={uni.name} value={uni.name}>
                    {uni.shortName} - {uni.category} ({uni.location})
                  </option>
                ))}
              </datalist>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Institution Name *
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold">Select or Type Below</span>
                    </div>

                    {/* Ghanaian University Select Dropdown */}
                    <select
                      value={
                        GHANAIAN_UNIVERSITIES.some((u) => u.name === edu.institutionName)
                          ? edu.institutionName
                          : "Other"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "Other") {
                          handleChange(edu.id, "institutionName", val);
                          if (!edu.country) {
                            handleChange(edu.id, "country", "Ghana");
                          }
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-emerald-200 bg-emerald-50/50 rounded-lg text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-1"
                    >
                      <option value="Other">-- Choose from Ghanaian Universities List (or select Other) --</option>
                      
                      <optgroup label="Public Universities">
                        {GHANAIAN_UNIVERSITIES.filter((u) => u.category === "Public").map((uni) => (
                          <option key={uni.name} value={uni.name}>
                            {uni.name} ({uni.location})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Technical Universities">
                        {GHANAIAN_UNIVERSITIES.filter((u) => u.category === "Technical").map((uni) => (
                          <option key={uni.name} value={uni.name}>
                            {uni.name} ({uni.location})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Private Universities">
                        {GHANAIAN_UNIVERSITIES.filter((u) => u.category === "Private").map((uni) => (
                          <option key={uni.name} value={uni.name}>
                            {uni.name} ({uni.location})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Colleges of Education & Health">
                        {GHANAIAN_UNIVERSITIES.filter((u) => u.category === "College").map((uni) => (
                          <option key={uni.name} value={uni.name}>
                            {uni.name} ({uni.location})
                          </option>
                        ))}
                      </optgroup>
                      <option value="Other">Other / Unlisted Institution (Type custom name below)</option>
                    </select>

                    {/* Autocomplete Input with datalist */}
                    <input
                      type="text"
                      list={`ghana-unis-${edu.id}`}
                      value={edu.institutionName || ""}
                      onChange={(e) => {
                        handleChange(edu.id, "institutionName", e.target.value);
                        if (!edu.country && e.target.value) {
                          handleChange(edu.id, "country", "Ghana");
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="Type or select university name (e.g. KNUST, UG Legon, Harvard)..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Country / Location (Optional)</label>
                    <input
                      type="text"
                      value={edu.country || ""}
                      onChange={(e) => handleChange(edu.id, "country", e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="e.g. Ghana (Optional)"
                    />
                  </div>
                </div>

                {/* Quick Pick Pills */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Quick Select Popular Universities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {TOP_GHANAIAN_UNIVERSITIES.map((topUni) => (
                      <button
                        type="button"
                        key={topUni}
                        onClick={() => {
                          handleChange(edu.id, "institutionName", topUni);
                          if (!edu.country) {
                            handleChange(edu.id, "country", "Ghana");
                          }
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded-full border transition font-medium ${
                          edu.institutionName === topUni
                            ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                            : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                        }`}
                      >
                        {topUni.split("(")[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Degree Level *</label>
                  <select
                    value={
                      [
                        "Bachelor of Science (B.Sc.)",
                        "Bachelor of Arts (B.A.)",
                        "Bachelor of Technology (B.Tech)",
                        "Master of Science (M.Sc.)",
                        "Master of Business Administration (MBA)",
                        "Doctor of Philosophy (Ph.D.)",
                        "Higher National Diploma (HND)",
                        "Diploma",
                        "WASSCE / High School Certificate",
                        "Professional Certification"
                      ].includes(edu.degree || "")
                        ? edu.degree
                        : "Other"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "Other") {
                        handleChange(edu.id, "degree", val);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-1 bg-white"
                  >
                    <option value="">-- Select Degree / Qualification --</option>
                    <option value="Bachelor of Science (B.Sc.)">Bachelor of Science (B.Sc.)</option>
                    <option value="Bachelor of Arts (B.A.)">Bachelor of Arts (B.A.)</option>
                    <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech)</option>
                    <option value="Master of Science (M.Sc.)">Master of Science (M.Sc.)</option>
                    <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                    <option value="Doctor of Philosophy (Ph.D.)">Doctor of Philosophy (Ph.D.)</option>
                    <option value="Higher National Diploma (HND)">Higher National Diploma (HND)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="WASSCE / High School Certificate">WASSCE / High School Certificate</option>
                    <option value="Professional Certification">Professional Certification</option>
                    <option value="Other">Other (Type Custom Degree Below)</option>
                  </select>

                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Bachelor of Science / Diploma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Field of Study / Major *</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy || ""}
                    onChange={(e) => handleChange(edu.id, "fieldOfStudy", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Computer Science / Economics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">GPA / Grade / Class (Optional)</label>
                  <input
                    type="text"
                    value={edu.gradeGpa || ""}
                    onChange={(e) => handleChange(edu.id, "gradeGpa", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. 3.85 / 4.0 or First Class Honors (Optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Year (Optional)</label>
                  <input
                    type="text"
                    value={edu.startYear || ""}
                    onChange={(e) => handleChange(edu.id, "startYear", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="2020 (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Completion Year (Optional)</label>
                  <input
                    type="text"
                    disabled={edu.isCurrentStudent}
                    value={edu.completionYear || ""}
                    onChange={(e) => handleChange(edu.id, "completionYear", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-100"
                    placeholder="2024 (Optional)"
                  />
                </div>

                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.isCurrentStudent || false}
                      onChange={(e) => handleChange(edu.id, "isCurrentStudent", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    Currently Enrolled / Student
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Relevant Coursework</label>
                <input
                  type="text"
                  value={edu.relevantCoursework || ""}
                  onChange={(e) => handleChange(edu.id, "relevantCoursework", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Data Structures, Machine Learning, Corporate Finance"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
