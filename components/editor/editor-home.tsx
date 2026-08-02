"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { EditorHomeProjects } from "@/lib/projects";

interface EditorHomeProps {
  projects: EditorHomeProjects;
}

export function EditorHome({ projects }: EditorHomeProps) {
  const actions = useProjectActions();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenProject = (projectId: string) => {
    router.push(`/editor?projectId=${encodeURIComponent(projectId)}`);
    router.refresh();
  };

  return (
    <div>
      <EditorNavbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={projects.ownedProjects}
        sharedProjects={projects.sharedProjects}
        onOpenCreate={actions.openCreateDialog}
        onOpenRename={actions.openRenameDialog}
        onOpenDelete={actions.openDeleteDialog}
        onOpenProject={(project) => handleOpenProject(project.id)}
      />
      <ProjectDialogs
        activeDialog={actions.activeDialog}
        activeProject={actions.activeProject}
        isLoading={actions.isLoading}
        projectName={actions.projectName}
        roomIdPreview={actions.roomIdPreview}
        setProjectName={actions.setProjectName}
        onClose={actions.closeDialog}
        onSubmit={actions.submitDialog}
      />
      <main className="pt-16 transition-all duration-300">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Create a project or open an existing one
          </h1>
          <p className="mb-8 text-muted-foreground">
            Start a new architecture workspace, or choose a project from the
            sidebar.
          </p>
          <Button onClick={actions.openCreateDialog} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </div>
      </main>
    </div>
  );
}