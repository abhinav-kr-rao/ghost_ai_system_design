"use client";

import React, { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ShareDialog } from "./share-dialog";
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

      <main className="flex min-h-screen items-center justify-center bg-[#0f1115] px-6 py-24 lg:pl-80 lg:pr-80 text-center">
        <div className="flex w-full max-w-3xl items-center justify-center rounded-xl border border-white/10 bg-[#161a22] p-8 shadow-2xl">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Workspace Preview
            </p>
            <h1 className="mb-3 text-3xl font-semibold text-white">
              {project.name}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              The collaborative canvas shell is ready. The next step will add the interactive editor surface and AI panel.
            </p>
          </div>
        </div>
        <aside className={`fixed right-0 top-16 hidden h-[calc(100vh-4rem)] w-80 border-l border-white/10 bg-[#11141a] p-6 lg:flex lg:flex-col ${isAIOpen ? "" : "hidden"}`}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Assistant
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
            AI chat panel coming soon.
          </div>
        </aside>
      </main>
    </>
  );
}
