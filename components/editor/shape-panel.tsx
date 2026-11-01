"use client";

import React from "react";
import { ShapeDragPayload } from "@/types/canvas";
import { Button } from "@/components/ui/button";

export type ShapeType = "rectangle" | "diamond" | "circle" | "pill" | "cylinder" | "hexagon";

const SHAPE_CONFIGS: Record<ShapeType, { label: string; icon: string; width: number; height: number }> = {
  rectangle: { label: "Rectangle", icon: "□", width: 200, height: 120 },
  diamond: { label: "Diamond", icon: "◇", width: 150, height: 150 },
  circle: { label: "Circle", icon: "○", width: 120, height: 120 },
  pill: { label: "Pill", icon: "⬭", width: 180, height: 100 },
  cylinder: { label: "Cylinder", icon: "⬘", width: 150, height: 140 },
  hexagon: { label: "Hexagon", icon: "⬡", width: 160, height: 160 },
};

export function ShapePanel() {
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, shape: ShapeType) => {
    console.log("Shape is ",shape);
    
    const config = SHAPE_CONFIGS[shape];
    const payload: ShapeDragPayload = {
      shape,
      width: config.width,
      height: config.height,
    };
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
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
