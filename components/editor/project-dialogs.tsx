"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project, DialogType } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  activeProject: Project | null;
  isLoading: boolean;
  onClose: () => void;
  // Mocks for now — these aren't hooked up to APIs yet
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectDialogs({
  activeDialog,
  activeProject,
  isLoading,
  onClose,
}: ProjectDialogsProps) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (activeDialog === "rename" && activeProject) {
      setProjectName(activeProject.name);
    } else {
      setProjectName("");
    }
  }, [activeDialog, activeProject]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    // Mock submit
    // console.log("The new name is ",projectName);
    

    onClose();
  };

  const isCreate = activeDialog === "create";
  const isRename = activeDialog === "rename";
  const isDelete = activeDialog === "delete";

  const isOpen = activeDialog !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {isCreate && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new project to start building your architecture.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Slug preview: {createSlug(projectName) || "project-slug"}
                </p>
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={!projectName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        )}

        {isRename && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Rename your project. Current name:{" "}
                <strong className="text-foreground">
                  {activeProject?.name}
                </strong>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={!projectName.trim()}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        )}

        {isDelete && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Mock submit
              onClose();
            }}
          >
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong className="text-foreground">
                  {activeProject?.name}
                </strong>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
