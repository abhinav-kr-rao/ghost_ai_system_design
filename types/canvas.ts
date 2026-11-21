import type { Edge, Node } from "@xyflow/react";

/**
 * Canvas node data shape
 */
export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  textColor: string;
  shape: "rectangle" | "circle" | "diamond" | "pill" | "cylinder" | "hexagon";
}

export interface CanvasColorPair {
  name: string;
  background: string;
  text: string;
}

export const CANVAS_COLOR_PALETTE: CanvasColorPair[] = [
  { name: "White", background: "#FFFFFF", text: "#111827" },
  { name: "Slate", background: "#1F2937", text: "#F9FAFB" },
  { name: "Indigo", background: "#6366F1", text: "#FFFFFF" },
  { name: "Purple", background: "#A855F7", text: "#FFFFFF" },
  { name: "Emerald", background: "#10B981", text: "#FFFFFF" },
  { name: "Amber", background: "#FBBF24", text: "#111827" },
  { name: "Red", background: "#EF4444", text: "#FFFFFF" },
];

/**
 * Shape drag payload
 */
export interface ShapeDragPayload {
  shape: CanvasNodeData["shape"];
  width: number;
  height: number;
}

/**
 * Canvas edge data shape
 */
export interface CanvasEdgeData extends Record<string, unknown> {}

export type CanvasEdgeType = "default" | "straight";

/**
 * Canvas node type with data
 */
export type CanvasNode = Node<CanvasNodeData, "canvasNode">;

/**
 * Canvas edge type
 */
export type CanvasEdge = Edge<CanvasEdgeData, CanvasEdgeType>;

/**
 * Storage types for Liveblocks
 */
export interface CanvasStorage {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}
