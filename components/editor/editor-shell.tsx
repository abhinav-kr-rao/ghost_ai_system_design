"use client";

import { useState } from "react";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { EditorHomeProjects } from "@/lib/projects";
import type { CanvasEdgeType } from "@/types/canvas";
import { Canvas } from "./canvas";
import { CanvasWrapper } from "./canvas-wrapper";
import { EditorNavbar } from "./editor-navbar";
import { ProjectDialogs } from "./project-dialogs";
import { ProjectSidebar } from "./project-sidebar";
import { ShareDialog } from "./share-dialog";

interface EditorShellProps {
  project: { id: string; name: string; ownerId?: string };
  projects: EditorHomeProjects;
  activeProjectId?: string;
  isOwner?: boolean;
}

export default function EditorShell({
  project,
  projects,
  activeProjectId,
  isOwner = false,
}: EditorShellProps) {
  const actions = useProjectActions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [edgeType, setEdgeType] = useState<CanvasEdgeType>("default");

  const handleOpenProject = (projectId: string) => {
    window.location.href = `/editor/${encodeURIComponent(projectId)}`;
  };

  const toggleAI = () => setIsAIOpen((v) => !v);

  return (
    <>
      <EditorNavbar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        projectName={project.name}
        shareAction={
          <ShareDialog
            projectId={project.id}
            projectName={project.name}
            isOwner={isOwner}
          />
        }
        aiOpen={isAIOpen}
        onToggleAI={toggleAI}
        edgeType={edgeType}
        onEdgeTypeChange={setEdgeType}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={projects.ownedProjects}
        sharedProjects={projects.sharedProjects}
        activeProjectId={activeProjectId}
        showBackdrop={false}
        onOpenCreate={actions.openCreateDialog}
        onOpenRename={actions.openRenameDialog}
        onOpenDelete={actions.openDeleteDialog}
        onOpenProject={(p) => handleOpenProject(p.id)}
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
        error={actions.error}
      />

      <main className="flex min-h-screen w-full flex-col bg-background lg:pl-80">
        <CanvasWrapper roomId={project.id}>
          <div className="flex min-h-[calc(100vh-4rem)] flex-1">
            <div className="relative flex-1">
              <Canvas edgeType={edgeType} />
            </div>
            <aside
              className={`${isAIOpen ? "w-100" : "w-0"} border-l border-border bg-background transition-all duration-200 ${!isAIOpen ? "overflow-hidden" : "flex flex-col p-4"}`}
            >
              {isAIOpen && (
                <>
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      AI Assistant
                    </h2>
                  </div>
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                    AI chat panel coming soon.
                  </div>
                </>
              )}
            </aside>
          </div>
        </CanvasWrapper>
      </main>
    </>
  );
}
