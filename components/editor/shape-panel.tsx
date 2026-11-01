"use client";

import React from "react";
import { ShapeDragPayload } from "@/types/canvas";
import { Button } from "@/components/ui/button";

export type ShapeType =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

const SHAPE_CONFIGS: Record<
  ShapeType,
  { label: string; icon: string; width: number; height: number }
> = {
  rectangle: { label: "Rectangle", icon: "□", width: 200, height: 120 },
  diamond: { label: "Diamond", icon: "◇", width: 150, height: 150 },
  circle: { label: "Circle", icon: "○", width: 120, height: 120 },
  pill: { label: "Pill", icon: "⬭", width: 180, height: 100 },
  cylinder: { label: "Cylinder", icon: "⬘", width: 150, height: 140 },
  hexagon: { label: "Hexagon", icon: "⬡", width: 160, height: 160 },
};

export function ShapePanel() {
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    shape: ShapeType,
  ) => {
    const config = SHAPE_CONFIGS[shape];
    const payload: ShapeDragPayload = {
      shape,
      width: config.width,
      height: config.height,
    };
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(payload));

    const preview = document.createElement("div");
    preview.style.position = "absolute";
    preview.style.left = "-10000px";
    preview.style.top = "-10000px";
    preview.style.width = `${config.width}px`;
    preview.style.height = `${config.height}px`;
    preview.style.pointerEvents = "none";
    preview.className = "bg-transparent";

    const previewShape = document.createElement("div");
    previewShape.style.width = "100%";
    previewShape.style.height = "100%";
    previewShape.dataset.shape = shape;
    preview.appendChild(previewShape);
    document.body.appendChild(preview);

    const shapeClass =
      shape === "rectangle"
        ? "rounded-md"
        : shape === "pill" || shape === "circle"
          ? "rounded-full"
          : "";

    if (shapeClass) {
      previewShape.className = `border-2 border-border bg-background ${shapeClass}`;
    } else {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNamespace, "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.classList.add("text-foreground");

      const shapeElement = document.createElementNS(
        svgNamespace,
        shape === "cylinder" ? "path" : "polygon",
      );
      shapeElement.setAttribute("fill", "var(--background)");
      shapeElement.setAttribute("stroke", "currentColor");
      shapeElement.setAttribute("stroke-width", "2");
      if (shape === "diamond") {
        shapeElement.setAttribute("points", "50,1 99,50 50,99 1,50");
      } else if (shape === "hexagon") {
        shapeElement.setAttribute("points", "25,1 75,1 99,50 75,99 25,99 1,50");
      } else {
        shapeElement.setAttribute(
          "d",
          "M1 15 C1 7 23 1 50 1 S99 7 99 15 V85 C99 93 77 99 50 99 S1 93 1 85 Z",
        );
      }
      svg.appendChild(shapeElement);
      previewShape.appendChild(svg);
    }

    e.dataTransfer.setDragImage(preview, config.width / 2, config.height / 2);

    const cleanupPreview = () => {
      preview.remove();
      e.currentTarget.removeEventListener("dragend", cleanupPreview);
    };
    e.currentTarget.addEventListener("dragend", cleanupPreview, { once: true });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex gap-2 bg-background border border-border rounded-full px-4 py-3 shadow-lg">
        {(Object.keys(SHAPE_CONFIGS) as ShapeType[]).map((shape) => {
          const config = SHAPE_CONFIGS[shape];
          return (
            <Button
              key={shape}
              draggable
              onDragStart={(e) => handleDragStart(e, shape)}
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing select-none"
              title={config.label}
            >
              <span className="text-lg">{config.icon}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
