import React, { useState, useEffect, useRef } from "react";
import { ResumeData } from "../../types";
import { ResumeRenderer } from "../templates/ResumeRenderer";
import { CustomizerPanel } from "../customizer/CustomizerPanel";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  FileText,
  FileDown,
  ChevronDown,
  Layout,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface ResumePreviewModalProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenTemplates: () => void;
  onOpenPrintPreview: () => void;
  exportFormat: "docx" | "pdf";
  setExportFormat: (format: "docx" | "pdf") => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  resume,
  onChange,
  onOpenTemplates,
  onOpenPrintPreview,
  exportFormat,
  setExportFormat,
}) => {
  const [zoom, setZoom] = useState<number>(0.95);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(true);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Responsive container width tracking for mobile phone screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (canvasContainerRef.current) {
        const clientW = canvasContainerRef.current.clientWidth;
        setContainerWidth(Math.min(clientW, window.innerWidth - 24));
      } else {
        setContainerWidth(Math.min(800, window.innerWidth - 24));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showCustomizer]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const resetZoom = () => setZoom(0.95);

  // Auto-calculated scale factor for small screen mobile phones & tablets
  const padding = window.innerWidth < 640 ? 12 : 24;
  const availableWidth = Math.max(240, containerWidth - padding);
  const autoFitScale = Math.min(zoom, availableWidth / 800);
  const scaledWidth = Math.min(800 * autoFitScale, availableWidth);
  const scaledHeight = 1050 * autoFitScale;

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* Top Preview Controls Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-3 sm:p-4 flex flex-wrap justify-between items-center gap-2 sm:gap-3 w-full max-w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition ${
              showCustomizer
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle Left Design Panel"
          >
            {showCustomizer ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Design Panel</span>
            <span className="sm:hidden">Panel</span>
          </button>

          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            <Layout className="w-3.5 h-3.5 text-slate-600" />
            <span>Templates</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-bold text-slate-700">
          <button onClick={zoomOut} className="p-1 hover:bg-slate-200 rounded-lg" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 min-w-[36px] text-center">{Math.round(autoFitScale * 100)}%</span>
          <button onClick={zoomIn} className="p-1 hover:bg-slate-200 rounded-lg" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={resetZoom} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400" title="Reset Zoom">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Format & Print Controls */}
        <div className="flex items-center gap-2">
          {/* Document Format Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFormatDropdownOpen(!formatDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition"
            >
              {exportFormat === "docx" ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Word</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-red-600" />
                  <span>PDF</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {formatDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setFormatDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setExportFormat("docx");
                      setFormatDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                      exportFormat === "docx" ? "bg-slate-100 text-slate-900 font-bold" : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Word (.docx)</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExportFormat("pdf");
                      setFormatDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                      exportFormat === "pdf" ? "bg-slate-100 text-slate-900 font-bold" : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileDown className="w-4 h-4 text-red-600" />
                      <span>PDF (.pdf)</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Trigger Read-Only Print Preview Modal */}
          <button
            type="button"
            onClick={onOpenPrintPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </button>
        </div>
      </div>

      {/* Responsive Layout Container */}
      <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-full overflow-x-hidden">
        {/* LEFT PANEL: Customizer Panel */}
        {showCustomizer && (
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 transition-all order-1 max-w-full overflow-hidden">
            <CustomizerPanel
              resume={resume}
              onChange={onChange}
              onOpenTemplates={onOpenTemplates}
            />
          </div>
        )}

        {/* RIGHT AREA: Document Canvas with Mobile Auto-Scaling */}
        <div
          ref={canvasContainerRef}
          className="flex-1 w-full bg-slate-200/80 rounded-2xl p-2 sm:p-6 md:p-8 min-h-[500px] sm:min-h-[900px] flex justify-center items-start overflow-hidden shadow-inner border border-slate-300/80 order-2 max-w-full"
        >
          <div
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              position: "relative",
              overflow: "hidden",
            }}
            className="shadow-md rounded-sm bg-white border border-slate-300 transition-all max-w-full"
          >
            <div
              style={{
                width: "800px",
                transform: `scale(${autoFitScale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <ResumeRenderer resume={resume} scale={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
