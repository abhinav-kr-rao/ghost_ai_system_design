"use client";

import type { CanvasNodeData } from "@/types/canvas";

interface ShapeVisualProps {
  shape: CanvasNodeData["shape"];
  className?: string;
}

const SVG_SHAPES = new Set<CanvasNodeData["shape"]>([
  "diamond",
  "cylinder",
  "hexagon",
]);

export function ShapeVisual({ shape, className = "" }: ShapeVisualProps) {
  if (!SVG_SHAPES.has(shape)) {
    const shapeClass =
      shape === "pill"
        ? "rounded-full"
        : shape === "circle"
          ? "rounded-full"
          : "rounded-md";

    return (
      <div
        className={`h-full w-full border-2 border-border bg-background ${shapeClass} ${className}`}
      />
    );
  }

  return (
    <svg
      className={`h-full w-full text-foreground ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {shape === "diamond" && (
        <polygon
          points="50,1 99,50 50,99 1,50"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
      {shape === "hexagon" && (
        <polygon
          points="25,1 75,1 99,50 75,99 25,99 1,50"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
      {shape === "cylinder" && (
        <>
          <path
            d="M1 15 C1 7 23 1 50 1 S99 7 99 15 V85 C99 93 77 99 50 99 S1 93 1 85 Z"
            fill="var(--background)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M1 15 C1 23 23 29 50 29 S99 23 99 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}
