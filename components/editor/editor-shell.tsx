"use client";

import React, { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ShareDialog } from "./share-dialog";
import { CanvasWrapper } from "./canvas-wrapper";
import { Canvas } from "./canvas";
import type { EditorHomeProjects } from "@/lib/projects";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

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
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={projects.ownedProjects}
        sharedProjects={projects.sharedProjects}
        activeProjectId={activeProjectId}
        showBackdrop={false}
        onOpenProject={(p) => handleOpenProject(p.id)}
      />

      <main className="flex min-h-screen w-full flex-col bg-background lg:pl-80 lg:pr-80">
        <CanvasWrapper roomId={project.id}>
          <div className="flex flex-1">
            <div className="flex-1">
              <Canvas />
            </div>
            <aside className={`${isAIOpen ? "w-80" : "w-0"} border-l border-white/10 bg-[#11141a] transition-all duration-200 ${!isAIOpen ? "overflow-hidden" : "p-6 flex flex-col"}`}>
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
