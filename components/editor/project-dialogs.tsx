"use client";

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
import type { DialogType } from "@/hooks/use-project-actions";
import type { EditorProjectSummary } from "@/lib/projects";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  activeProject: EditorProjectSummary | null;
  isLoading: boolean;
  projectName: string;
  roomIdPreview: string;
  setProjectName: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
}

export function ProjectDialogs({
  activeDialog,
  activeProject,
  isLoading,
  projectName,
  roomIdPreview,
  setProjectName,
  onClose,
  onSubmit,
}: ProjectDialogsProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onSubmit();
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
                  Room ID preview: {roomIdPreview}
                </p>
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
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
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        )}

        {isDelete && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
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
              <Button type="submit" variant="destructive" disabled={isLoading}>
                Delete
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
