import React, { useState } from "react";
import { ResumeData, TemplateInfo } from "./types";
import { exportToDocx } from "./utils/docxExporter";
import { exportToPdf } from "./utils/pdfExporter";
import { exportToJson, exportToPlainText, downloadBlob } from "./utils/exporter";
import { useResumeStore } from "./store/useResumeStore";
import { useUndoRedoShortcuts } from "./hooks/useUndoRedoShortcuts";
import { useAuth } from "./context/AuthContext";
import { AuthLandingPage } from "./components/auth/AuthLandingPage";
import { CVMintLogo } from "./components/common/CVMintLogo";
import { Loader2 } from "lucide-react";

import { Navbar } from "./components/Navbar";
import { WelcomeHero } from "./components/dashboard/WelcomeHero";
import { ResumeDashboard } from "./components/dashboard/ResumeDashboard";
import { WizardContainer } from "./components/wizard/WizardContainer";
import { ResumePreviewModal } from "./components/preview/ResumePreviewModal";
import { PrintPreviewModal } from "./components/preview/PrintPreviewModal";
import { TemplateGalleryModal } from "./components/templates/TemplateGalleryModal";
import { AtsAnalyzerModal } from "./components/ai/AtsAnalyzerModal";
import { GrammarCheckerModal } from "./components/ai/GrammarCheckerModal";
import { AdminModal } from "./components/admin/AdminModal";
import { GhanaJobsWidget } from "./components/jobs/GhanaJobsWidget";
import { ResumeRenderer } from "./components/templates/ResumeRenderer";

export function App() {
  // Auth state
  const { currentUser, loading } = useAuth();
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register" | "forgot">("login");

  // Activate global keyboard shortcuts for Undo (Ctrl+Z / Cmd+Z) and Redo (Ctrl+Y / Cmd+Shift+Z)
  useUndoRedoShortcuts();

  // Zustand Resume Store
  const resumes = useResumeStore((s) => s.resumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const getActiveResume = useResumeStore((s) => s.getActiveResume);

  const setActiveResumeId = useResumeStore((s) => s.setActiveResumeId);
  const updateActiveResume = useResumeStore((s) => s.updateActiveResume);
  const createNewResume = useResumeStore((s) => s.createNewResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const selectTemplate = useResumeStore((s) => s.selectTemplate);
  const importResume = useResumeStore((s) => s.importResume);

  const [activeTab, setActiveTab] = useState<"dashboard" | "wizard" | "preview" | "jobs">("wizard");
  const [exportFormat, setExportFormat] = useState<"docx" | "pdf">("docx");

  // Modals
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isAtsOpen, setIsAtsOpen] = useState<boolean>(false);
  const [isGrammarOpen, setIsGrammarOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);
  const [selectedJobForAts, setSelectedJobForAts] = useState<string>("");

  const activeResume = getActiveResume();

  const handleCreateNew = () => {
    let userDefaults: Partial<ResumeData["personalInfo"]> = {};
    if (currentUser) {
      const rawName =
        currentUser.user_metadata?.display_name ||
        currentUser.user_metadata?.full_name ||
        currentUser.displayName ||
        "";
      if (rawName) {
        const nameParts = rawName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        userDefaults = {
          firstName,
          lastName,
          email: currentUser.email || "",
        };
      }
    }
    createNewResume(userDefaults);
    setActiveTab("wizard");
  };

  const handleOpenSignUp = () => {
    setAuthInitialMode("register");
    setIsGuest(false);
  };

  const handleSelectTemplate = (template: TemplateInfo) => {
    selectTemplate(template);
  };

  // Export handlers
  const handleExportDocx = async (dataToExport?: ResumeData) => {
    const target = dataToExport || activeResume;
    try {
      const blob = await exportToDocx(target);
      const filename = `${target.personalInfo?.firstName || "Resume"}_${target.personalInfo?.lastName || "CV"}.docx`;
      downloadBlob(blob, filename);
    } catch (e) {
      console.error("Docx Export error:", e);
      alert("Failed to export Word document. Please try again.");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(activeResume);
    } catch (e) {
      console.error("PDF Export error:", e);
      window.print();
    }
  };

  const handlePrint = (targetResume?: ResumeData) => {
    setIsPrintPreviewOpen(true);
  };

  const handleExportTxt = () => {
    const txt = exportToPlainText(activeResume);
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const filename = `${activeResume.personalInfo?.firstName || "Resume"}_CV.txt`;
    downloadBlob(blob, filename);
  };

  const handleExportJson = () => {
    const jsonStr = exportToJson(activeResume);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const filename = `${activeResume.title || "Resume"}.json`;
    downloadBlob(blob, filename);
  };

  const handleCreateCvForJob = (job: any) => {
    const existingSkills = activeResume.skills || [];
    const newSkillNames: string[] = job.keySkills || [];

    const existingSkillNamesLower = new Set(existingSkills.map((s) => s.name.toLowerCase()));
    
    const addedSkillItems = newSkillNames
      .filter((s) => !existingSkillNamesLower.has(s.toLowerCase()))
      .map((s, idx) => ({
        id: `job-skill-${Date.now()}-${idx}`,
        name: s,
        level: "Advanced" as const,
        category: "Technical Skills" as const,
      }));

    const updatedResume: ResumeData = {
      ...activeResume,
      title: `${job.title} - ${job.company}`,
      targetJobTitle: job.title,
      careerField: job.industry || activeResume.careerField || "General Industry",
      personalInfo: {
        ...activeResume.personalInfo,
        jobTitle: job.title,
      },
      skills: [...existingSkills, ...addedSkillItems],
    };

    updateActiveResume(updatedResume);
    setActiveTab("wizard");
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && typeof parsed === "object") {
          importResume(parsed);
          alert("Resume imported successfully!");
        } else {
          alert("Invalid resume file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file. Please ensure it is a valid resume backup.");
      }
    };
    reader.readAsText(file);
  };

  // Loading Spinner Screen during Auth state check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4">
        <CVMintLogo size="lg" />
        <div className="flex items-center gap-2 mt-6 text-emerald-600 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Initializing CvMinter...</span>
        </div>
      </div>
    );
  }

  // Auth Gate: Require sign in or guest choice before showing main app page
  if (!currentUser && !isGuest) {
    return <AuthLandingPage initialMode={authInitialMode} onContinueAsGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 w-full max-w-full overflow-x-hidden">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resume={activeResume}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenAts={() => setIsAtsOpen(true)}
        onOpenGrammar={() => setIsGrammarOpen(true)}
        onOpenJobs={() => setActiveTab("jobs")}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSignUp={handleOpenSignUp}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        onPrint={() => handlePrint(activeResume)}
        onExportDocx={() => handleExportDocx(activeResume)}
        onExportPdf={handleExportPdf}
        onExportTxt={handleExportTxt}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8 w-full max-w-full">
            <WelcomeHero
              onCreateClick={handleCreateNew}
              onTemplatesClick={() => setIsTemplatesOpen(true)}
              onJobsClick={() => setActiveTab("jobs")}
            />

            <ResumeDashboard
              resumes={resumes}
              activeResumeId={activeResumeId}
              onSelectResume={(id) => {
                setActiveResumeId(id);
                setActiveTab("wizard");
              }}
              onCreateNew={handleCreateNew}
              onDuplicate={duplicateResume}
              onDelete={deleteResume}
              onExportDocx={(r) => handleExportDocx(r)}
              onExportPdf={handleExportPdf}
            />
          </div>
        )}

        {activeTab === "wizard" && (
          <WizardContainer
            resume={activeResume}
            onChange={updateActiveResume}
            onFinish={() => setActiveTab("preview")}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenAts={() => setIsAtsOpen(true)}
            onExportDocx={() => handleExportDocx(activeResume)}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === "preview" && (
          <ResumePreviewModal
            resume={activeResume}
            onChange={updateActiveResume}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenPrintPreview={() => setIsPrintPreviewOpen(true)}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
          />
        )}

        {activeTab === "jobs" && (
          <GhanaJobsWidget
            resume={activeResume}
            onCreateCvForJob={handleCreateCvForJob}
            onOpenAtsWithJob={(jobTitle, jobDesc) => {
              setSelectedJobForAts(jobDesc);
              setIsAtsOpen(true);
            }}
          />
        )}
      </main>

      {/* Main App Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CvMinter. Professional Resume & CV Builder. Built by MANATECH</p>
        </div>
      </footer>

      {/* Dedicated printable container isolated for system printing */}
      <div id="print-resume-container" className="hidden print:block" aria-hidden="true">
        <ResumeRenderer resume={activeResume} scale={1} />
      </div>

      {/* Modals */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        resume={activeResume}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        onConfirmExport={(format) => {
          if (format === "pdf") {
            handleExportPdf();
          } else {
            handleExportDocx(activeResume);
          }
        }}
      />

      <TemplateGalleryModal
        isOpen={isTemplatesOpen}
        selectedTemplateId={activeResume.templateId}
        onSelectTemplate={handleSelectTemplate}
        onClose={() => setIsTemplatesOpen(false)}
      />

      <AtsAnalyzerModal
        isOpen={isAtsOpen}
        resume={activeResume}
        initialJobDesc={selectedJobForAts}
        onClose={() => {
          setIsAtsOpen(false);
          setSelectedJobForAts("");
        }}
      />

      <GrammarCheckerModal
        isOpen={isGrammarOpen}
        resume={activeResume}
        onClose={() => setIsGrammarOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default App;
