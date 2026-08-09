import React, { useState, useEffect, useRef } from "react";
import { ResumeData } from "../../types";
import { ResumeRenderer } from "../templates/ResumeRenderer";
import { RESUME_TEMPLATES } from "../../data/templates";
import {
  Printer,
  X,
  FileText,
  FileDown,
  CheckCircle2,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
} from "lucide-react";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  exportFormat: "docx" | "pdf";
  setExportFormat: (format: "docx" | "pdf") => void;
  onConfirmExport: (format: "docx" | "pdf") => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  resume,
  exportFormat,
  setExportFormat,
  onConfirmExport,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Measure canvas area width to automatically fit A4 resume (800px wide) on mobile/tablet screens
  useEffect(() => {
    if (!isOpen) return;

    const updateWidth = () => {
      if (canvasRef.current) {
        setContainerWidth(canvasRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth > 768 ? 600 : window.innerWidth - 32);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate auto-fit responsive scale factor
  const padding = window.innerWidth < 640 ? 16 : 32;
  const availableWidth = Math.max(280, containerWidth - padding);
  const fitScale = Math.min(zoom, availableWidth / 800);
  const scaledWidth = 800 * fitScale;
  const scaledHeight = 1050 * fitScale;

  const currentTemplate =
    RESUME_TEMPLATES.find((t) => t.id === resume.templateId) || RESUME_TEMPLATES[0];

  const handleSystemPrint = () => {
    window.print();
  };

  const handleAction = () => {
    onConfirmExport(exportFormat);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-800/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-preview-title"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Clean Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-100 text-slate-800 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 id="print-preview-title" className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
                Print & Export Preview
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                  Read-Only
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
            aria-label="Close Print Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Left Panel + Right Preview Canvas */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANEL: Export Controls & Document Settings */}
          <div className="w-full md:w-80 lg:w-96 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto flex-shrink-0 space-y-5">
            <div className="space-y-4">
              {/* Output Format Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat("docx")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      exportFormat === "docx"
                        ? "bg-slate-800 text-white border-slate-800 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className={`w-4 h-4 ${exportFormat === "docx" ? "text-white" : "text-blue-600"}`} />
                    <div>
                      <div className="text-xs">Word (.docx)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat("pdf")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      exportFormat === "pdf"
                        ? "bg-slate-800 text-white border-slate-800 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <FileDown className={`w-4 h-4 ${exportFormat === "pdf" ? "text-white" : "text-red-600"}`} />
                    <div>
                      <div className="text-xs">PDF (.pdf)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Document Summary (Clean text list, no artificial nested cards) */}
              <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>Template</span>
                  <span className="font-bold text-slate-900">{currentTemplate.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>Candidate</span>
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">
                    {resume.personalInfo?.firstName || "Candidate"} {resume.personalInfo?.lastName || ""}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>Target Role</span>
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">
                    {resume.targetJobTitle || "Professional"}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Paper Size</span>
                  <span className="font-bold text-slate-900">A4 Portrait</span>
                </div>
              </div>

              {/* Layout Verification Note */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Standard ATS Formatting
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your resume is structured for clean ATS parser reading and standard A4 page printing.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAction}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                {exportFormat === "pdf" ? (
                  <>
                    <FileDown className="w-4 h-4" /> Download PDF
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Export Word (.docx)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSystemPrint}
                className="w-full py-2 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Document (Ctrl+P)
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-1.5 px-4 text-slate-500 hover:text-slate-800 font-semibold text-xs text-center transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Scaled Read-Only Resume Document Area */}
          <div
            ref={canvasRef}
            className="flex-1 bg-slate-200 p-3 sm:p-6 flex flex-col items-center justify-start overflow-auto relative min-h-[360px]"
          >
            {/* Zoom Controls Bar */}
            <div className="sticky top-0 z-20 mb-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="p-1 hover:bg-slate-100 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[45px] text-center">{Math.round(fitScale * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
                className="p-1 hover:bg-slate-100 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-500 pl-1 border-l border-slate-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Read-Only
              </span>
            </div>

            {/* Scaled Document Container */}
            <div
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                position: "relative",
                overflow: "hidden",
              }}
              className="shadow-md rounded-sm bg-white border border-slate-300 transition-all"
            >
              <div
                style={{
                  width: "800px",
                  transform: `scale(${fitScale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                className="pointer-events-none select-none"
              >
                <ResumeRenderer resume={resume} scale={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
