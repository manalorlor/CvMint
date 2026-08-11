import React from "react";
import { ResumeData, ReferenceType, CustomReference } from "../../types";
import { Plus, Trash2, UserCheck } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ReferencesStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const references = resume.references || { type: "available_upon_request", customReferences: [] };

  const handleTypeChange = (type: ReferenceType) => {
    onChange({
      ...resume,
      references: {
        ...references,
        type,
      },
    });
  };

  const handleAddCustom = () => {
    const newRef: CustomReference = {
      id: "ref-" + Date.now(),
      name: "",
      position: "",
      company: "",
      phone: "",
      email: "",
    };
    onChange({
      ...resume,
      references: {
        ...references,
        type: "custom",
        customReferences: [...(references.customReferences || []), newRef],
      },
    });
  };

  const handleRemoveCustom = (id: string) => {
    onChange({
      ...resume,
      references: {
        ...references,
        customReferences: (references.customReferences || []).filter((r) => r.id !== id),
      },
    });
  };

  const handleUpdateCustom = (id: string, field: keyof CustomReference, value: string) => {
    onChange({
      ...resume,
      references: {
        ...references,
        customReferences: (references.customReferences || []).map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" /> References
        </h3>
        <p className="text-xs text-gray-500">Choose how references should be displayed on your resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label
          onClick={() => handleTypeChange("none")}
          className={`p-4 rounded-xl border cursor-pointer transition text-left ${
            references.type === "none"
              ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-bold text-xs text-gray-900">No References</div>
          <p className="text-[11px] text-gray-500 mt-1">Omit the references section entirely.</p>
        </label>

        <label
          onClick={() => handleTypeChange("available_upon_request")}
          className={`p-4 rounded-xl border cursor-pointer transition text-left ${
            references.type === "available_upon_request"
              ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-bold text-xs text-gray-900">Available Upon Request</div>
          <p className="text-[11px] text-gray-500 mt-1">Displays standard line: "References available upon request".</p>
        </label>

        <label
          onClick={() => handleTypeChange("custom")}
          className={`p-4 rounded-xl border cursor-pointer transition text-left ${
            references.type === "custom"
              ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-bold text-xs text-gray-900">Custom Contacts</div>
          <p className="text-[11px] text-gray-500 mt-1">Provide specific reference names & contact details.</p>
        </label>
      </div>

      {references.type === "custom" && (
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-800">Reference Contacts</h4>
            <button
              type="button"
              onClick={handleAddCustom}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Reference
            </button>
          </div>

          {references.customReferences?.map((ref) => (
            <div key={ref.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-emerald-800">Contact</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(ref.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (Optional)</label>
                  <input
                    type="text"
                    value={ref.name || ""}
                    onChange={(e) => handleUpdateCustom(ref.id, "name", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Ing. Emmanuel Ampofo (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Position / Title (Optional)</label>
                  <input
                    type="text"
                    value={ref.position || ""}
                    onChange={(e) => handleUpdateCustom(ref.id, "position", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Director of Engineering (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    value={ref.company || ""}
                    onChange={(e) => handleUpdateCustom(ref.id, "company", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Hubtel Ghana (Optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={ref.email || ""}
                    onChange={(e) => handleUpdateCustom(ref.id, "email", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. e.ampofo@hubtel.com (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={ref.phone || ""}
                    onChange={(e) => handleUpdateCustom(ref.id, "phone", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. +233 24 300 1122 (Optional)"
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
