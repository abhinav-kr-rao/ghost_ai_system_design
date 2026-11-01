import type { Edge, Node } from "@xyflow/react";

/**
 * Canvas node data shape
 */
export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond" | "pill" | "cylinder" | "hexagon";
}

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
