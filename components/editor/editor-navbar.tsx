"use client";

import { UserButton } from "@clerk/nextjs";
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
            {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
