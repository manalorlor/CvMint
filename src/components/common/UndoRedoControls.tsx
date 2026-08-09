import React from "react";
import { Undo2, Redo2 } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

interface UndoRedoControlsProps {
  size?: "sm" | "md";
  showBadges?: boolean;
}

export const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({
  size = "md",
  showBadges = true,
}) => {
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const past = useResumeStore((s) => s.past);
  const future = useResumeStore((s) => s.future);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const btnClasses = size === "sm" ? "p-1.5 text-xs" : "px-2.5 py-1.5 text-xs font-semibold";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        title={canUndo ? `Undo change (Ctrl+Z / ⌘Z) [${past.length} step${past.length > 1 ? "s" : ""}]` : "Nothing to undo"}
        className={`${btnClasses} rounded-lg transition-all flex items-center gap-1.5 ${
          canUndo
            ? "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm active:scale-95"
            : "text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed"
        }`}
      >
        <Undo2 className={iconSize} />
        <span className="hidden sm:inline">Undo</span>
        {showBadges && canUndo && (
          <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold rounded-full">
            {past.length}
          </span>
        )}
      </button>

      <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700" />

      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        title={canRedo ? `Redo change (Ctrl+Y / ⌘⇧Z) [${future.length} step${future.length > 1 ? "s" : ""}]` : "Nothing to redo"}
        className={`${btnClasses} rounded-lg transition-all flex items-center gap-1.5 ${
          canRedo
            ? "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm active:scale-95"
            : "text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed"
        }`}
      >
        <span className="hidden sm:inline">Redo</span>
        <Redo2 className={iconSize} />
        {showBadges && canRedo && (
          <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold rounded-full">
            {future.length}
          </span>
        )}
      </button>
    </div>
  );
};
