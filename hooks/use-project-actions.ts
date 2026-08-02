"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EditorProjectSummary } from "@/lib/projects";

export type DialogType = "create" | "rename" | "delete" | null;

interface UseProjectActionsResult {
  activeDialog: DialogType;
  activeProject: EditorProjectSummary | null;
  isLoading: boolean;
  projectName: string;
  roomIdPreview: string;
  openCreateDialog: () => void;
  openRenameDialog: (project: EditorProjectSummary) => void;
  openDeleteDialog: (project: EditorProjectSummary) => void;
  closeDialog: () => void;
  setProjectName: (value: string) => void;
  submitDialog: () => Promise<void>;
}

function slugifyProjectName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createShortUniqueSuffix() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
}

export function useProjectActions(): UseProjectActionsResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [activeProject, setActiveProject] = useState<EditorProjectSummary | null>(null);
  const [projectName, setProjectName] = useState("");
  const [roomSuffix, setRoomSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeProjectId = searchParams.get("projectId");

  const roomIdPreview = useMemo(() => {
    if (!roomSuffix) {
      return "project";
    }

    const slug = slugifyProjectName(projectName);
    return `${slug || "project"}-${roomSuffix}`;
  }, [projectName, roomSuffix]);

  const openCreateDialog = () => {
    setActiveDialog("create");
    setActiveProject(null);
    setProjectName("");
    setRoomSuffix(createShortUniqueSuffix());
  };

  const openRenameDialog = (project: EditorProjectSummary) => {
    setActiveDialog("rename");
    setActiveProject(project);
    setProjectName(project.name);
    setRoomSuffix("");
  };

  const openDeleteDialog = (project: EditorProjectSummary) => {
    setActiveDialog("delete");
    setActiveProject(project);
    setProjectName("");
    setRoomSuffix("");
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setActiveProject(null);
    setProjectName("");
    setRoomSuffix("");
    setIsLoading(false);
  };

  const submitDialog = async () => {
    if (isLoading) {
      return;
    }

    if (activeDialog === "create") {
      const trimmedName = projectName.trim();

      if (!trimmedName || !roomSuffix) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            id: roomIdPreview,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }

        const project = (await response.json()) as EditorProjectSummary;
        closeDialog();
        router.push(`/editor?projectId=${encodeURIComponent(project.id)}`);
        router.refresh();
        return;
      } catch (error) {
        console.error("[PROJECT_CREATE]", error);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (activeDialog === "rename" && activeProject) {
      const trimmedName = projectName.trim();

      if (!trimmedName) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to rename project");
        }

        closeDialog();
        router.refresh();
        return;
      } catch (error) {
        console.error("[PROJECT_RENAME]", error);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (activeDialog === "delete" && activeProject) {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        const isDeletingActiveWorkspace = activeProjectId === activeProject.id;
        closeDialog();

        if (isDeletingActiveWorkspace) {
          router.replace("/editor");
        } else {
          router.refresh();
        }

        return;
      } catch (error) {
        console.error("[PROJECT_DELETE]", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    activeDialog,
    activeProject,
    isLoading,
    projectName,
    roomIdPreview,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    setProjectName,
    submitDialog,
  };
}