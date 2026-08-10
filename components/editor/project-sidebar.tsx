"use client";

import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { EditorProjectSummary } from "@/lib/projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects?: EditorProjectSummary[];
  sharedProjects?: EditorProjectSummary[];
  onOpenCreate?: () => void;
  onOpenRename?: (project: EditorProjectSummary) => void;
  onOpenDelete?: (project: EditorProjectSummary) => void;
  onOpenProject?: (project: EditorProjectSummary) => void;
  activeProjectId?: string;
  showBackdrop?: boolean;
}

type ShowNameButton = {

  onOpenProject?: (project: EditorProjectSummary) => void;
  project: EditorProjectSummary
}



const ShowNameButton = ({ onOpenProject, project }: ShowNameButton) => {

  return <button
    type="button"
    className="text-left text-sm font-medium"
    onClick={() => onOpenProject?.(project)}
  >
    {project.name}


  </button>

}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects = [],
  sharedProjects = [],
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
  onOpenProject,
  activeProjectId,
  showBackdrop = true,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Backdrop scrim overlay for mobile */}
      {isOpen && showBackdrop && (
        <div
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm sm:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r z-20 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Projects</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <Tabs defaultValue="my-projects" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
              <TabsContent
                value="my-projects"
                className="flex-1 overflow-hidden mt-4"
              >
                {ownedProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">
                      No projects yet.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full pr-4 -mr-4">
                    <div className="space-y-1">


                      {ownedProjects.map((project) => (
                        <div
                          key={project.id}
                          className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted"
                        >
                          <ShowNameButton onOpenProject={onOpenProject} project={project}>

                          </ShowNameButton>

                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onOpenRename?.(project)}
                            >
                              <Pencil className="h-3 w-3" />
                              <span className="sr-only">Rename</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => onOpenDelete?.(project)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              <TabsContent
                value="shared"
                className="flex-1 overflow-hidden mt-4"
              >
                {sharedProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">
                      No shared projects yet.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full pr-4 -mr-4">
                    <div className="space-y-1">


                      {sharedProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted"
                        >

                          <ShowNameButton onOpenProject={onOpenProject} project={project}>

                          </ShowNameButton>



                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <div className="p-4 border-t shrink-0">
            <Button className="w-full" onClick={onOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
