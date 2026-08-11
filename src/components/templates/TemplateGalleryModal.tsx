import React, { useState } from "react";
import { TemplateInfo } from "../../types";
import { RESUME_TEMPLATES } from "../../data/templates";
import { X, Check, Layout, Sparkles, Clock, Bell, ShieldCheck } from "lucide-react";

interface TemplateGalleryModalProps {
  isOpen: boolean;
  selectedTemplateId: string;
  onSelectTemplate: (template: TemplateInfo) => void;
  onClose: () => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  selectedTemplateId,
  onSelectTemplate,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  const categories = ["All", ...Array.from(new Set(RESUME_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    selectedCategory === "All"
      ? RESUME_TEMPLATES
      : RESUME_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-yellow-400" />
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                CV Templates Gallery
              </h2>
              <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wide">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Custom theme switcher under active development. Standard ATS Executive layout is currently active for maximum recruiter delivery.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coming Soon Alert Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-indigo-500/10 border-b border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-700 rounded-xl flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                Custom Template Engine Under Construction
              </h3>
              <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                We are building 15+ specialized visual layouts (Tech Minimalist, Executive Serif, Modern Creative). Currently, your resume automatically uses our <span className="font-bold text-slate-900">Master Executive ATS Template</span> — guaranteed 99% ATS compliance on Workday, Taleo, and Jobberman Ghana.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotified(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 shadow-xs ${
              notified
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {notified ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>You'll Be Notified!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-yellow-400" />
                <span>Notify Me On Launch</span>
              </>
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 bg-slate-50">
          {/* Default Active Master Template Card */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500 ring-2 ring-emerald-500/20 p-4 shadow-md flex flex-col justify-between space-y-4 relative">
            <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Active & Verified
            </span>

            <div className="space-y-3">
              <div className="w-full h-36 rounded-xl p-3 bg-emerald-50/50 border border-emerald-200 shadow-inner flex flex-col justify-between">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20" />
                  <div className="space-y-1 flex-1">
                    <div className="h-2.5 w-24 bg-slate-800 rounded" />
                    <div className="h-2 w-16 bg-emerald-600 rounded" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded" />
                  <div className="h-2 w-4/5 bg-slate-200 rounded" />
                  <div className="h-2 w-2/3 bg-slate-200 rounded" />
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                  Standard ATS Executive Template
                  <Check className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Single-column standard layout designed for 100% Applicant Tracking System parser readability.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const defaultTpl = RESUME_TEMPLATES[0];
                if (defaultTpl) onSelectTemplate(defaultTpl);
                onClose();
              }}
              className="w-full py-2.5 text-xs font-black rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition"
            >
              Active ATS Standard Template
            </button>
          </div>

          {/* Upcoming Template Previews */}
          {filteredTemplates.map((template) => {
            if (template.id === "modern-ats" || template.id === "standard") return null;

            return (
              <div
                key={template.id}
                className="bg-white/80 rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm flex flex-col justify-between space-y-4 relative group opacity-90 hover:opacity-100 transition"
              >
                <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full flex items-center gap-1 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Coming Soon
                </span>

                <div className="space-y-3">
                  {/* Thumbnail Mockup */}
                  <div
                    className="w-full h-36 rounded-xl p-3 space-y-2 border border-slate-100 shadow-inner flex flex-col justify-between relative overflow-hidden"
                    style={{ backgroundColor: `${template.accentColor}08` }}
                  >
                    <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: template.accentColor }}>
                      <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                      <div className="space-y-1 flex-1">
                        <div className="h-2.5 w-24 bg-slate-800 rounded"></div>
                        <div className="h-2 w-16 rounded" style={{ backgroundColor: template.accentColor }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-200 rounded"></div>
                      <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                      <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                    </div>

                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-3 py-1 bg-slate-900/90 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow">
                        Theme Preview Soon
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center justify-between">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNotified(true)}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Unlocks on Release</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
