import React from "react";
import { ResumeData, Customization, FontFamily, FontSize, LineSpacing, MarginSize, LayoutMode, BorderStyle } from "../../types";
import { RESUME_TEMPLATES } from "../../data/templates";
import {
  Palette,
  Type,
  Layout,
  Maximize2,
  ArrowUp,
  ArrowDown,
  Eye,
  SlidersHorizontal,
  Check,
} from "lucide-react";

interface CustomizerPanelProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenTemplates: () => void;
}

const COLOR_PRESETS = [
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Executive Navy", hex: "#1e3a8a" },
  { name: "Emerald Green", hex: "#059669" },
  { name: "Teal Studio", hex: "#0d9488" },
  { name: "Charcoal Dark", hex: "#1e293b" },
  { name: "Ruby Red", hex: "#dc2626" },
  { name: "Violet Gradient", hex: "#6d28d9" },
  { name: "Copper Amber", hex: "#b45309" },
  { name: "Steel Slate", hex: "#475569" },
  { name: "Deep Indigo", hex: "#1e1b4b" },
];

const FONTS: { id: FontFamily; label: string }[] = [
  { id: "jakarta", label: "Plus Jakarta Sans" },
  { id: "inter", label: "Inter (Modern)" },
  { id: "merriweather", label: "Merriweather (Serif)" },
  { id: "playfair", label: "Playfair Display" },
  { id: "poppins", label: "Poppins (Clean)" },
  { id: "lora", label: "Lora (Editorial)" },
  { id: "roboto", label: "Roboto (Tech)" },
  { id: "space", label: "Space Grotesk (Mono)" },
  { id: "outfit", label: "Outfit (Geometric)" },
  { id: "sourcesans", label: "Source Sans 3" },
];

const SECTION_LABELS: Record<string, string> = {
  summary: "Professional Summary & Objective",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills & Competencies",
  projects: "Key Projects",
  certifications: "Certifications",
  references: "References",
};

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({ resume, onChange, onOpenTemplates }) => {
  const c = resume.customization || {
    fontFamily: "jakarta",
    fontSize: "md",
    fontColor: "#0f172a",
    headingColor: "#1e293b",
    accentColor: "#2563eb",
    lineSpacing: "normal",
    margins: "normal",
    paperSize: "a4",
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "references"],
    showProfilePicture: true,
    showIcons: true,
    layoutMode: "header-accent",
    themeColor: "#2563eb",
    borderStyle: "solid",
  };

  const updateCust = (fields: Partial<Customization>) => {
    onChange({
      ...resume,
      customization: {
        ...c,
        ...fields,
      },
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const order = [...(c.sectionOrder || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    updateCust({ sectionOrder: order });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Resume Design & Layout
        </h3>
        <button
          type="button"
          onClick={onOpenTemplates}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          <Layout className="w-3.5 h-3.5" /> Switch Template <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-extrabold">Soon</span>
        </button>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" /> Theme Accent Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => {
            const isSelected = c.accentColor?.toLowerCase() === p.hex.toLowerCase();
            return (
              <button
                key={p.hex}
                type="button"
                onClick={() => updateCust({ accentColor: p.hex, themeColor: p.hex })}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-black/10 transition transform hover:scale-110 shadow-sm"
                style={{ backgroundColor: p.hex }}
                title={p.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
          <input
            type="color"
            value={c.accentColor || "#2563eb"}
            onChange={(e) => updateCust({ accentColor: e.target.value, themeColor: e.target.value })}
            className="w-7 h-7 p-0 border-0 rounded-full cursor-pointer"
            title="Custom Hex Picker"
          />
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-600" /> Typography
        </label>
        <select
          value={c.fontFamily}
          onChange={(e) => updateCust({ fontFamily: e.target.value as FontFamily })}
          className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Font Size & Margins */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Font Size</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
            {(["sm", "md", "lg"] as FontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateCust({ fontSize: size })}
                className={`flex-1 py-1 text-center font-medium transition ${
                  c.fontSize === size ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Margins</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
            {(["compact", "normal", "spacious"] as MarginSize[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateCust({ margins: m })}
                className={`flex-1 py-1 text-center font-medium capitalize transition ${
                  c.margins === m ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {m === "compact" ? "Tight" : m === "spacious" ? "Wide" : "Norm"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Mode */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-blue-600" /> Structure & Layout
        </label>
        <select
          value={c.layoutMode}
          onChange={(e) => updateCust({ layoutMode: e.target.value as LayoutMode })}
          className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium bg-white"
        >
          <option value="header-accent">Header Accent (Classic Top)</option>
          <option value="single-column">Single Column (ATS Standard)</option>
          <option value="two-column-left">Two Column (Left Sidebar)</option>
          <option value="sidebar-dark">Dark Tech Sidebar</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-blue-600" /> Visibility Toggles
        </label>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
            <input
              type="checkbox"
              checked={c.showIcons}
              onChange={(e) => updateCust({ showIcons: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            Show Header Contact Icons
          </label>
        </div>
      </div>

      {/* Section Reorder */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-800">
          Section Reordering (Drag / Shift)
        </label>
        <div className="space-y-1">
          {c.sectionOrder?.map((secKey, idx) => (
            <div
              key={secKey}
              className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50 text-xs text-gray-800 font-medium"
            >
              <span>{SECTION_LABELS[secKey] || secKey}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === c.sectionOrder.length - 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
