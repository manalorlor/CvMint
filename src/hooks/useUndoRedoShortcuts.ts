import { useEffect } from "react";
import { useResumeStore } from "../store/useResumeStore";

export function useUndoRedoShortcuts() {
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const pastLength = useResumeStore((s) => s.past.length);
  const futureLength = useResumeStore((s) => s.future.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user pressed Cmd or Ctrl
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();

      // Undo: Cmd+Z or Ctrl+Z (without Shift)
      if (key === "z" && !e.shiftKey) {
        if (pastLength > 0) {
          e.preventDefault();
          undo();
        }
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y or Cmd+Y
      if ((key === "z" && e.shiftKey) || key === "y") {
        if (futureLength > 0) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, pastLength, futureLength]);
}
