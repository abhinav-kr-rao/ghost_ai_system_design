"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <EditorNavbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ProjectSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">ghost ai</h1>
        </div>
      </main>
    </div>
  );
}
