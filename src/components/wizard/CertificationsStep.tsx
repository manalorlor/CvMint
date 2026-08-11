import React from "react";
import { ResumeData, Certification } from "../../types";
import { Plus, Trash2, Award } from "lucide-react";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const CertificationsStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const certifications = resume.certifications || [];

  const handleAdd = () => {
    const newCert: Certification = {
      id: "cert-" + Date.now(),
      certificationName: "",
      institution: "",
      issueDate: "",
    };
    onChange({
      ...resume,
      certifications: [...certifications, newCert],
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      certifications: certifications.filter((c) => c.id !== id),
    });
  };

  const handleChange = (id: string, field: keyof Certification, value: string) => {
    onChange({
      ...resume,
      certifications: certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> Certifications & Credentials
          </h3>
          <p className="text-xs text-gray-500">Highlight industry credentials, cloud certifications, or professional licenses.</p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">No certifications added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 text-xs font-semibold text-emerald-600 hover:underline"
          >
            + Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Certification</span>
                <button
                  type="button"
                  onClick={() => handleRemove(cert.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.certificationName || ""}
                    onChange={(e) => handleChange(cert.id, "certificationName", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Issuing Institution *</label>
                  <input
                    type="text"
                    value={cert.institution || ""}
                    onChange={(e) => handleChange(cert.id, "institution", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Amazon Web Services / Cisco"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Issue Date (Optional)</label>
                  <input
                    type="text"
                    value={cert.issueDate || ""}
                    onChange={(e) => handleChange(cert.id, "issueDate", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. 2023-05 (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="text"
                    value={cert.expiryDate || ""}
                    onChange={(e) => handleChange(cert.id, "expiryDate", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. 2026-05 (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={cert.credentialId || ""}
                    onChange={(e) => handleChange(cert.id, "credentialId", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. AWS-ASA-930219 (Optional)"
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
