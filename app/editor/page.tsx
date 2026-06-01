"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs, type Project } from "@/hooks/use-project-dialogs";
import { Button } from "@/components/ui/button";

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Architecture Redesign", slug: "architecture-redesign" },
  { id: "2", name: "Backend V2", slug: "backend-v2" },
  { id: "3", name: "Internal Tools", slug: "internal-tools", isShared: true },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <div>
      <EditorNavbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={MOCK_PROJECTS}
        onOpenCreate={dialogs.openCreateDialog}
        onOpenRename={dialogs.openRenameDialog}
        onOpenDelete={dialogs.openDeleteDialog}
      />
      <ProjectDialogs
        activeDialog={dialogs.activeDialog}
        activeProject={dialogs.activeProject}
        isLoading={dialogs.isLoading}
        onClose={dialogs.closeDialog}
      />
      <main className="pt-16 transition-all duration-300">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Create a project or open an existing one
          </h1>
          <p className="text-muted-foreground mb-8">
            Start a new architecture workspace, or choose a project from the
            sidebar.
          </p>
          <Button onClick={dialogs.openCreateDialog} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </div>
      </main>
    </div>
  );
}
