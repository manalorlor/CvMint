import { create } from "zustand";
import { ResumeData, TemplateInfo } from "../types";
import { DEFAULT_RESUME } from "../data/defaultResume";
import { supabase, saveResumeToSupabase, deleteResumeFromSupabase, isSupabaseConfigured } from "../lib/supabase";

const MAX_HISTORY = 50;
const STORAGE_KEY = "cv_app_resumes";

interface ResumeStoreState {
  resumes: ResumeData[];
  activeResumeId: string;
  past: ResumeData[];
  future: ResumeData[];

  // Selectors / Helpers
  getActiveResume: () => ResumeData;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setActiveResumeId: (id: string) => void;
  updateActiveResume: (updated: ResumeData) => void;
  undo: () => void;
  redo: () => void;

  // Collection CRUD
  createNewResume: (initialInfo?: Partial<ResumeData["personalInfo"]>) => void;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  selectTemplate: (template: TemplateInfo) => void;
  setResumes: (resumes: ResumeData[]) => void;
  importResume: (parsed: Partial<ResumeData>) => void;
}

const loadSavedResumes = (): ResumeData[] => {
  if (typeof window === "undefined") return [DEFAULT_RESUME];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse saved resumes from localStorage:", e);
    }
  }
  return [DEFAULT_RESUME];
};

const saveResumesToStorage = (resumes: ResumeData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    // If user is authenticated, sync active resume or entire set asynchronously
    if (isSupabaseConfigured) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          resumes.forEach((resume) => {
            saveResumeToSupabase(user.id, resume).catch((err) =>
              console.error("Supabase sync error:", err)
            );
          });
        }
      });
    }
  } catch (e) {
    console.error("Failed to save resumes to storage:", e);
  }
};

export const useResumeStore = create<ResumeStoreState>((set, get) => {
  const initialResumes = loadSavedResumes();
  const initialActiveId = initialResumes[0]?.id || DEFAULT_RESUME.id;

  return {
    resumes: initialResumes,
    activeResumeId: initialActiveId,
    past: [],
    future: [],

    getActiveResume: () => {
      const { resumes, activeResumeId } = get();
      return resumes.find((r) => r.id === activeResumeId) || resumes[0] || DEFAULT_RESUME;
    },

    get canUndo() {
      return get().past.length > 0;
    },

    get canRedo() {
      return get().future.length > 0;
    },

    setActiveResumeId: (id: string) => {
      set({
        activeResumeId: id,
        past: [],
        future: [],
      });
    },

    updateActiveResume: (updated: ResumeData) => {
      const { resumes, activeResumeId, past } = get();
      const current = resumes.find((r) => r.id === activeResumeId);

      if (!current) return;

      // Avoid pushing identical state
      if (JSON.stringify(current) === JSON.stringify(updated)) return;

      const newPast = [...past, current].slice(-MAX_HISTORY);
      const newResumes = resumes.map((r) => (r.id === updated.id ? updated : r));

      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        past: newPast,
        future: [], // Clear redo history on new edit action
      });
    },

    undo: () => {
      const { past, future, resumes, activeResumeId } = get();
      if (past.length === 0) return;

      const previousState = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      const current = resumes.find((r) => r.id === activeResumeId);
      const newFuture = current ? [current, ...future].slice(0, MAX_HISTORY) : future;

      const newResumes = resumes.map((r) => (r.id === previousState.id ? previousState : r));

      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        past: newPast,
        future: newFuture,
      });
    },

    redo: () => {
      const { past, future, resumes, activeResumeId } = get();
      if (future.length === 0) return;

      const nextState = future[0];
      const newFuture = future.slice(1);

      const current = resumes.find((r) => r.id === activeResumeId);
      const newPast = current ? [...past, current].slice(-MAX_HISTORY) : past;

      const newResumes = resumes.map((r) => (r.id === nextState.id ? nextState : r));

      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        past: newPast,
        future: newFuture,
      });
    },

    createNewResume: (initialInfo?: Partial<ResumeData["personalInfo"]>) => {
      const newId = "resume-" + Date.now();
      const defaultInfo = {
        ...DEFAULT_RESUME.personalInfo,
        ...(initialInfo || {}),
      };
      const newResume: ResumeData = {
        ...DEFAULT_RESUME,
        id: newId,
        title: `Resume - ${new Date().toLocaleDateString()}`,
        personalInfo: defaultInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { resumes } = get();
      const newResumes = [newResume, ...resumes];

      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        activeResumeId: newId,
        past: [],
        future: [],
      });
    },

    duplicateResume: (id: string) => {
      const { resumes } = get();
      const target = resumes.find((r) => r.id === id);
      if (!target) return;

      const dupId = "resume-" + Date.now();
      const duplicated: ResumeData = {
        ...target,
        id: dupId,
        title: `${target.title} (Copy)`,
        updatedAt: new Date().toISOString(),
      };

      const newResumes = [duplicated, ...resumes];
      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        activeResumeId: dupId,
        past: [],
        future: [],
      });
    },

    deleteResume: (id: string) => {
      const { resumes, activeResumeId } = get();
      if (resumes.length <= 1) return;

      if (isSupabaseConfigured) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            deleteResumeFromSupabase(user.id, id).catch((err) =>
              console.error("Failed to delete resume from Supabase:", err)
            );
          }
        });
      }

      const remaining = resumes.filter((r) => r.id !== id);
      const nextActiveId = activeResumeId === id ? remaining[0].id : activeResumeId;

      saveResumesToStorage(remaining);

      set({
        resumes: remaining,
        activeResumeId: nextActiveId,
        past: [],
        future: [],
      });
    },

    selectTemplate: (template: TemplateInfo) => {
      const activeResume = get().getActiveResume();
      get().updateActiveResume({
        ...activeResume,
        templateId: template.id,
        customization: {
          ...activeResume.customization,
          themeColor: template.accentColor,
          accentColor: template.accentColor,
        },
      });
    },

    setResumes: (newResumes: ResumeData[]) => {
      saveResumesToStorage(newResumes);
      set({
        resumes: newResumes,
        past: [],
        future: [],
      });
    },

    importResume: (parsed: Partial<ResumeData>) => {
      const importedId = "resume-" + Date.now();
      const importedResume: ResumeData = {
        ...DEFAULT_RESUME,
        ...parsed,
        id: importedId,
        personalInfo: {
          ...DEFAULT_RESUME.personalInfo,
          ...(parsed.personalInfo || {}),
        },
        skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_RESUME.skills,
        education: Array.isArray(parsed.education) ? parsed.education : [],
        workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        customization: {
          ...DEFAULT_RESUME.customization,
          ...(parsed.customization || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      const { resumes } = get();
      const newResumes = [importedResume, ...resumes];
      saveResumesToStorage(newResumes);

      set({
        resumes: newResumes,
        activeResumeId: importedId,
        past: [],
        future: [],
      });
    },
  };
});
