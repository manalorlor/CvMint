import React, { useState } from "react";
import { ResumeData } from "../types";
import { UndoRedoControls } from "./common/UndoRedoControls";
import { CVMintLogo } from "./common/CVMintLogo";
import {
  FileText,
  Download,
  Layout,
  ShieldCheck,
  FolderOpen,
  Eye,
  ChevronDown,
  Briefcase,
  FileCode,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "wizard" | "preview" | "jobs";
  setActiveTab: (tab: "dashboard" | "wizard" | "preview" | "jobs") => void;
  resume: ResumeData;
  onOpenTemplates: () => void;
  onOpenAts: () => void;
  onOpenGrammar: () => void;
  onOpenJobs: () => void;
  onOpenAdmin: () => void;
  exportFormat: "docx" | "pdf";
  setExportFormat: (format: "docx" | "pdf") => void;
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportTxt: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  resume,
  onOpenTemplates,
  onOpenAts,
  exportFormat,
  setExportFormat,
  onPrint,
  onExportDocx,
  onExportPdf,
  onExportTxt,
  onExportJson,
  onImportJson,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
  };

  const navTabClick = (tab: "dashboard" | "wizard" | "preview" | "jobs") => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile & Tablet Hamburger Menu Toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile & Tablet view */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition flex items-center gap-1.5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold hidden sm:inline text-slate-700">Menu</span>
            </button>

            {/* Brand Logo */}
            <CVMintLogo size="md" onClick={() => navTabClick("dashboard")} />
          </div>

          {/* Desktop Central Navigation Links (Visible on Large screens lg:flex) */}
          <div className="hidden lg:flex items-center gap-1.5 border-l border-r border-slate-200/80 px-4 py-1">
            <button
              onClick={() => navTabClick("dashboard")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>My Resumes</span>
            </button>

            <button
              onClick={() => navTabClick("wizard")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "wizard"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Builder Wizard</span>
            </button>

            <button
              onClick={() => navTabClick("preview")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => navTabClick("jobs")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "jobs"
                  ? "bg-amber-100 text-amber-950 border border-amber-300 font-extrabold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Jobs in Ghana</span>
            </button>
          </div>

          {/* Right Tools & Export Dropdown */}
          <div className="flex items-center gap-2">
            {/* Stack Undo/Redo */}
            <UndoRedoControls size="sm" />

            {/* Templates Modal */}
            <button
              onClick={onOpenTemplates}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition"
            >
              <Layout className="w-3.5 h-3.5 text-slate-600" />
              <span>Templates</span>
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-extrabold rounded-full border border-amber-200">Soon</span>
            </button>

            {/* ATS Analyzer Button */}
            <button
              onClick={onOpenAts}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">ATS Check</span>
              <span className="xs:hidden">ATS</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {exportOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setExportOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs font-semibold space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Format
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setExportFormat("docx");
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between transition ${
                        exportFormat === "docx"
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Microsoft Word</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">.docx</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExportFormat("pdf");
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between transition ${
                        exportFormat === "pdf"
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span>PDF Document</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">.pdf</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        onPrint();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Print Preview & Export</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        onExportTxt();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <FileCode className="w-4 h-4 text-slate-500" />
                      <span>Plain Text (.txt)</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        onExportJson();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Backup Resume Data (.json)</span>
                    </button>

                    <label className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer">
                      <Download className="w-4 h-4 text-slate-500 rotate-180" />
                      <span>Import Backup (.json)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          handleFileUpload(e);
                          setExportOpen(false);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE & TABLET SLIDE-OUT LEFT PANE DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Left Slide-Out Panel */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 border-r border-slate-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <CVMintLogo size="sm" onClick={() => navTabClick("dashboard")} />

                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation List */}
              <div className="space-y-1.5">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Main Views
                </div>

                <button
                  onClick={() => navTabClick("dashboard")}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    activeTab === "dashboard"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className={`w-4 h-4 ${activeTab === "dashboard" ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>My Resumes</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => navTabClick("wizard")}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    activeTab === "wizard"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${activeTab === "wizard" ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>Builder Wizard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => navTabClick("preview")}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    activeTab === "preview"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${activeTab === "preview" ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>Live Preview</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => navTabClick("jobs")}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    activeTab === "jobs"
                      ? "bg-amber-100 text-amber-950 font-black border border-amber-300"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>Jobs in Ghana</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                    GH
                  </span>
                </button>
              </div>

              {/* Tools Section */}
              <div className="pt-4 border-t border-slate-200 space-y-1.5">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tools & Templates
                </div>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenTemplates();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-3"
                >
                  <Layout className="w-4 h-4 text-slate-500" />
                  <span>Templates Gallery</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenAts();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ATS Keyword Checker</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                CvMint — Professional ATS CV Builder
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
