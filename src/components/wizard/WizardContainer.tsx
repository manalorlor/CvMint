import React, { useState } from "react";
import { ResumeData, CareerStage } from "../../types";
import { PRESET_ROLE_SAMPLES } from "../../data/defaultResume";
import { UndoRedoControls } from "../common/UndoRedoControls";
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Award,
  FolderGit2,
  FileText,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Wand2,
  PanelLeftClose,
  PanelLeftOpen,
  ListOrdered,
  Sparkles,
  BookOpen,
} from "lucide-react";

import { PersonalInfoStep } from "./PersonalInfoStep";
import { EducationStep } from "./EducationStep";
import { ExperienceStep } from "./ExperienceStep";
import { SkillsStep } from "./SkillsStep";
import { CertificationsStep } from "./CertificationsStep";
import { ProjectsStep } from "./ProjectsStep";
import { SummaryStep } from "./SummaryStep";
import { ReferencesStep } from "./ReferencesStep";
import { CareerStageSelectorModal, CAREER_STAGE_OPTIONS } from "./CareerStageSelectorModal";

interface WizardContainerProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onFinish?: () => void;
  onOpenTemplates?: () => void;
  onOpenAts?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
}

export const getWizardStepsForStage = (stage?: CareerStage) => {
  if (stage === "student") {
    return [
      { id: 1, key: "personal", title: "Personal Info", icon: User },
      { id: 2, key: "education", title: "Education & Coursework", icon: GraduationCap },
      { id: 3, key: "projects", title: "Academic Projects", icon: FolderGit2 },
      { id: 4, key: "skills", title: "Skills & Activities", icon: Wrench },
      { id: 5, key: "experience", title: "Internships & Jobs (Optional)", icon: Briefcase },
      { id: 6, key: "certifications", title: "Certifications", icon: Award },
      { id: 7, key: "summary", title: "Career Objective", icon: FileText },
      { id: 8, key: "references", title: "References", icon: UserCheck },
    ];
  }
  if (stage === "recent_graduate") {
    return [
      { id: 1, key: "personal", title: "Personal Info", icon: User },
      { id: 2, key: "education", title: "Education & Honors", icon: GraduationCap },
      { id: 3, key: "projects", title: "Capstone & Projects", icon: FolderGit2 },
      { id: 4, key: "experience", title: "Experience & NSS", icon: Briefcase },
      { id: 5, key: "skills", title: "Key Competencies", icon: Wrench },
      { id: 6, key: "certifications", title: "Certifications", icon: Award },
      { id: 7, key: "summary", title: "Career Summary", icon: FileText },
      { id: 8, key: "references", title: "References", icon: UserCheck },
    ];
  }
  return [
    { id: 1, key: "personal", title: "Personal Info", icon: User },
    { id: 2, key: "education", title: "Education History", icon: GraduationCap },
    { id: 3, key: "experience", title: "Work Experience", icon: Briefcase },
    { id: 4, key: "skills", title: "Skills & Expertise", icon: Wrench },
    { id: 5, key: "certifications", title: "Certifications", icon: Award },
    { id: 6, key: "projects", title: "Key Projects", icon: FolderGit2 },
    { id: 7, key: "summary", title: "Executive Summary", icon: FileText },
    { id: 8, key: "references", title: "References", icon: UserCheck },
  ];
};

export const WizardContainer: React.FC<WizardContainerProps> = ({ resume, onChange, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const wizardSteps = getWizardStepsForStage(resume.careerStage);
  const activeStep = wizardSteps[currentStep - 1] || wizardSteps[0];
  const progressPercent = Math.round((currentStep / wizardSteps.length) * 100);

  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep((prev) => prev + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const applyPresetRole = (roleKey: string) => {
    const preset = PRESET_ROLE_SAMPLES[roleKey];
    if (preset) {
      onChange({
        ...resume,
        ...preset,
        targetJobTitle: preset.targetJobTitle || resume.targetJobTitle,
        skills: preset.skills ? (preset.skills as any) : resume.skills,
        professionalSummary: preset.professionalSummary || resume.professionalSummary,
      });
      setPresetModalOpen(false);
    }
  };

  const handleSelectStage = (newStage: CareerStage) => {
    const opt = CAREER_STAGE_OPTIONS.find((o) => o.id === newStage);
    const newSectionOrder = opt ? opt.sectionOrder : ["summary", "experience", "skills", "certifications", "education", "projects", "references"];

    onChange({
      ...resume,
      careerStage: newStage,
      customization: {
        ...resume.customization,
        sectionOrder: newSectionOrder,
      },
    });
    setStageModalOpen(false);
  };

  const renderActiveStepContent = () => {
    switch (activeStep.key) {
      case "personal":
        return <PersonalInfoStep resume={resume} onChange={onChange} />;
      case "education":
        return <EducationStep resume={resume} onChange={onChange} />;
      case "experience":
        return <ExperienceStep resume={resume} onChange={onChange} />;
      case "skills":
        return <SkillsStep resume={resume} onChange={onChange} />;
      case "certifications":
        return <CertificationsStep resume={resume} onChange={onChange} />;
      case "projects":
        return <ProjectsStep resume={resume} onChange={onChange} />;
      case "summary":
        return <SummaryStep resume={resume} onChange={onChange} />;
      case "references":
        return <ReferencesStep resume={resume} onChange={onChange} />;
      default:
        return <PersonalInfoStep resume={resume} onChange={onChange} />;
    }
  };

  const currentStageBadge = CAREER_STAGE_OPTIONS.find((o) => o.id === (resume.careerStage || "professional"));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[680px] w-full max-w-full">
      {/* LEFT SIDE PANEL: Steps Navigation Panel */}
      {isSidebarOpen && (
        <aside className="w-full md:w-64 lg:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-3 sm:p-4 flex-shrink-0 flex flex-col justify-between max-w-full overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-200">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-slate-600" />
                Wizard Steps
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 md:hidden"
                title="Collapse Panel"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Stage Picker Switcher Button */}
            <button
              type="button"
              onClick={() => setStageModalOpen(true)}
              className="w-full p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition text-left space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-blue-600">
                  Current Profile Mode
                </span>
                <span className="text-[10px] font-bold text-blue-600 underline">Change</span>
              </div>
              <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
                {resume.careerStage === "student" && <GraduationCap className="w-4 h-4 text-blue-600" />}
                {resume.careerStage === "recent_graduate" && <BookOpen className="w-4 h-4 text-purple-600" />}
                {(!resume.careerStage || resume.careerStage === "professional") && <Briefcase className="w-4 h-4 text-emerald-600" />}
                <span>{currentStageBadge?.title || "Experienced Worker"}</span>
              </div>
            </button>

            {/* Vertical Steps */}
            <nav className="grid grid-cols-2 xs:grid-cols-4 md:flex md:flex-col gap-1.5 w-full">
              {wizardSteps.map((step) => {
                const Icon = step.icon;
                const isCurrent = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`text-left p-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      isCurrent
                        ? "bg-slate-800 text-white shadow-xs"
                        : isCompleted
                        ? "bg-emerald-50 text-emerald-900 hover:bg-emerald-100/80"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <span
                        className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${
                          isCurrent
                            ? "bg-slate-700 text-emerald-400"
                            : isCompleted
                            ? "bg-emerald-200 text-emerald-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="truncate text-[11px] sm:text-xs">{step.title}</span>
                    </div>

                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600 hidden md:inline flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-slate-200 hidden md:block">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Form Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-between max-w-full overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-3 max-w-full">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {!isSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex-shrink-0"
                  title="Open Steps Panel"
                >
                  <PanelLeftOpen className="w-4 h-4 text-blue-600" />
                </button>
              )}

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {activeStep.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStageModalOpen(true)}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black border transition uppercase tracking-wider flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  >
                    <span>Mode: {currentStageBadge?.title}</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 font-medium truncate">
                  Complete each section to generate your professional resume.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UndoRedoControls size="md" />

              <button
                type="button"
                onClick={() => setPresetModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition"
              >
                <Wand2 className="w-3.5 h-3.5 text-slate-600" /> Role Preset
              </button>
            </div>
          </div>

          {/* Progress Line */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <span>Step {currentStep} of {wizardSteps.length}</span>
              <span>{activeStep.title}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Step Form Body */}
        <div className="p-4 sm:p-6 md:p-8 min-h-[380px] bg-white flex-1 max-w-full overflow-x-hidden">
          {renderActiveStepContent()}
        </div>

        {/* Bottom Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center max-w-full">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 sm:px-6 py-2.5 text-slate-600 font-bold text-xs sm:text-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 sm:px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2"
          >
            {currentStep === wizardSteps.length ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Finalize Resume
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Career Stage Selector Modal */}
      <CareerStageSelectorModal
        isOpen={stageModalOpen}
        currentStage={resume.careerStage || "professional"}
        onSelectStage={handleSelectStage}
        onClose={() => setStageModalOpen(false)}
      />

      {/* Role Preset Selection Modal */}
      {presetModalOpen && (
        <div className="fixed inset-0 bg-slate-800/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-slate-700" /> Choose Role Preset
            </h3>
            <p className="text-xs text-slate-600">
              Populate job fields, titles, and skills tailored to target roles.
            </p>

            <div className="space-y-2 pt-2 max-h-[300px] overflow-y-auto">
              {Object.keys(PRESET_ROLE_SAMPLES).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => applyPresetRole(role)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition flex justify-between items-center group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700">{role}</h4>
                    <p className="text-[11px] text-slate-500">{PRESET_ROLE_SAMPLES[role].targetJobTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
                </button>
              ))}
            </div>

            <div className="pt-3 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPresetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
