"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  Handle,
  Position,
  NodeAddChange,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import { CanvasNode, CanvasEdge, ShapeDragPayload, CanvasNodeData } from "@/types/canvas";
import { ShapePanel } from "./shape-panel";

const SHAPE_CLASSES: Record<CanvasNodeData["shape"], string> = {
  rectangle: "rounded-md",
  circle: "rounded-full",
  diamond: "[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
  pill: "rounded-full",
  cylinder: "rounded-[50%/15%]",
  hexagon: "[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
};

function CanvasNodeRenderer(props: { data: CanvasNodeData }) {
  const { data } = props as { data: CanvasNodeData };
  return (
    <div
      className={`relative h-full w-full bg-gray-400 ${SHAPE_CLASSES[data.shape]}`}
    >
      <div className={`absolute inset-[2px] flex items-center justify-center bg-white ${SHAPE_CLASSES[data.shape]}`}>
        <span className="px-2 text-center text-sm font-medium text-gray-700">{data.label}</span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 !border-2 !border-background !bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 !border-2 !border-background !bg-gray-500"
      />
    </div>
  );
}

// Canvas content component using React Flow hooks
function CanvasContent() {
  const [edgeType, setEdgeType] = useState<"default" | "straight">("default");
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const { screenToFlowPosition } = useReactFlow();
  const nodeCounterRef = useRef<Record<string, number>>({});

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      try {
        const data = e.dataTransfer.getData("application/json");
        const payload: ShapeDragPayload = JSON.parse(data);

        // Convert screen position to canvas coordinates
        const canvasPosition = screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });

        // Generate node ID
        nodeCounterRef.current[payload.shape] = (nodeCounterRef.current[payload.shape] || 0) + 1;
        const nodeId = `${payload.shape}-${Date.now()}-${nodeCounterRef.current[payload.shape]}`;

        // Create new node
        const newNode: CanvasNode = {
          id: nodeId,
          position: canvasPosition,
          data: {
            label: "",
            color: "#ffffff",
            shape: payload.shape,
          },
          style: {
            width: payload.width,
            height: payload.height,
          },
          type: "canvasNode",
        };

        // Add node using the onNodesChange handler
        const addChange: NodeAddChange = {
          item: newNode,
          type: "add",
        };
        onNodesChange([addChange as any]);
      } catch (error) {
        console.error("Failed to parse drag data:", error);
      }
    },
    [screenToFlowPosition, onNodesChange],
  );

  const nodeTypes = {
    canvasNode: CanvasNodeRenderer,
  };

  return (
    <div className="w-full h-full bg-background " onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: edgeType }}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls className="canvas-controls" />
        <MiniMap />
        <Cursors />
      </ReactFlow>
      <div className="fixed right-6 top-24 z-40 flex items-center gap-1 rounded-radius-md border border-border bg-background p-1 shadow-lg">
        <button
          type="button"
          className={`rounded-radius-sm px-2 py-1 text-xs ${edgeType === "default" ? "bg-accent-primary text-white" : "text-muted-foreground"}`}
          onClick={() => setEdgeType("default")}
        >
          Curvy
        </button>
        <button
          type="button"
          className={`rounded-radius-sm px-2 py-1 text-xs ${edgeType === "straight" ? "bg-accent-primary text-white" : "text-muted-foreground"}`}
          onClick={() => setEdgeType("straight")}
        >
          Straight
        </button>
      </div>
      <ShapePanel />
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}
