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

  const handleOpenProject = (projectId: string) => {
    window.location.href = `/editor/${encodeURIComponent(projectId)}`;
  };

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
    </>
  );
}
