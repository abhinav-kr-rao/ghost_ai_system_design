"use client";

import { useCallback, useRef } from "react";
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

// Custom canvas node renderer
function CanvasNodeRenderer(props: any) {
  const { data } = props as { data: CanvasNodeData };
  return (
    <div className="flex items-center justify-center border-2 border-gray-400 bg-white rounded-md w-full h-full">
      <Handle type="target" position={Position.Top} />
      <span className="text-sm font-medium text-center px-2 text-gray-700">{data.label}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// Canvas content component using React Flow hooks
function CanvasContent() {
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
    <div className="w-full h-full bg-background" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
        <Cursors />
      </ReactFlow>
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
