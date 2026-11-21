"use client";

import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { useEffect } from "react";

interface UseKeyboardShortcutsOptions<
  NodeType extends Node,
  EdgeType extends Edge,
> {
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType>;
  onUndo: () => void;
  onRedo: () => void;
}

export function useKeyboardShortcuts<
  NodeType extends Node,
  EdgeType extends Edge,
>({
  reactFlowInstance,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsOptions<NodeType, EdgeType>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest("input, textarea, [contenteditable='true'], [role='textbox']"))
      ) {
        return;
      }

      const hasPrimaryModifier = event.metaKey || event.ctrlKey;

      if (hasPrimaryModifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
        return;
      }

      if (hasPrimaryModifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        onRedo();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        reactFlowInstance.zoomIn({ duration: 200 });
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        reactFlowInstance.zoomOut({ duration: 200 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reactFlowInstance, onUndo, onRedo]);
}
