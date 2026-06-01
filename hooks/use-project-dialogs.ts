import { useState } from "react";

export type DialogType = "create" | "rename" | "delete" | null;

export interface Project {
  id: string;
  name: string;
  slug: string;
  isShared?: boolean;
}

export function useProjectDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openCreateDialog = () => {
    setActiveDialog("create");
    setActiveProject(null);
  };

  const openRenameDialog = (project: Project) => {
    setActiveDialog("rename");
    setActiveProject(project);
  };

  const openDeleteDialog = (project: Project) => {
    setActiveDialog("delete");
    setActiveProject(project);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setActiveProject(null);
    setIsLoading(false);
  };

  return {
    activeDialog,
    activeProject,
    isLoading,
    setIsLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
  };
}
