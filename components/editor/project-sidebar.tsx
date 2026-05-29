"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-full w-80 bg-background border-r z-20 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          <Tabs defaultValue="my-projects">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
            <TabsContent value="my-projects">
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              </div>
            </TabsContent>
            <TabsContent value="shared">
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No shared projects yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="p-4 border-t">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
}
