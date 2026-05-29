"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditorNavbar({ isOpen, setIsOpen }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-10">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center" />
      </div>
    </header>
  );
}
