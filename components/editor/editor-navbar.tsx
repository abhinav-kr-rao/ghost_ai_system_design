"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { CanvasEdgeType } from "@/types/canvas";

interface EditorNavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectName?: string;
  shareAction?: ReactNode;
  aiOpen?: boolean;
  onToggleAI?: () => void;
  edgeType?: CanvasEdgeType;
  onEdgeTypeChange?: (edgeType: CanvasEdgeType) => void;
}

export function EditorNavbar({
  isOpen,
  setIsOpen,
  projectName = "Editor",
  shareAction,
  aiOpen,
  onToggleAI,
  edgeType,
  onEdgeTypeChange,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-20">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle project sidebar"
          >
            {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{projectName}</span>
            <span className="text-xs text-muted-foreground">Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {edgeType && onEdgeTypeChange ? (
            <div className="flex items-center gap-1 rounded-radius-md border border-border bg-background p-1">
              <Button
                variant={edgeType === "default" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onEdgeTypeChange("default")}
                aria-pressed={edgeType === "default"}
              >
                Curvy
              </Button>
              <Button
                variant={edgeType === "straight" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onEdgeTypeChange("straight")}
                aria-pressed={edgeType === "straight"}
              >
                Straight
              </Button>
            </div>
          ) : null}
          {shareAction ? shareAction : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label={aiOpen ? "Close AI sidebar" : "Open AI sidebar"}
            aria-pressed={aiOpen ?? false}
            onClick={onToggleAI}
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
