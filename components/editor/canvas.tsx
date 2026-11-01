"use client";

import { Cursors, useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionMode,
  Controls,
  Handle,
  MiniMap,
  type NodeAddChange,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo, useRef } from "react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import type {
  CanvasEdge,
  CanvasEdgeType,
  CanvasNode,
  CanvasNodeData,
  ShapeDragPayload,
} from "@/types/canvas";
import { ShapePanel } from "./shape-panel";

const SHAPE_CLASSES: Record<CanvasNodeData["shape"], string> = {
  rectangle: "rounded-md",
  circle: "rounded-full",
  diamond: "[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
  pill: "rounded-full",
  cylinder: "rounded-[50%/15%]",
  hexagon:
    "[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
};

function CanvasNodeRenderer(props: { data: CanvasNodeData }) {
  const { data } = props;
  const handlePositions = [
    { type: "target" as const, position: Position.Top, id: "target-top" },
    { type: "source" as const, position: Position.Top, id: "source-top" },
    { type: "target" as const, position: Position.Right, id: "target-right" },
    { type: "source" as const, position: Position.Right, id: "source-right" },
    { type: "target" as const, position: Position.Bottom, id: "target-bottom" },
    { type: "source" as const, position: Position.Bottom, id: "source-bottom" },
    { type: "target" as const, position: Position.Left, id: "target-left" },
    { type: "source" as const, position: Position.Left, id: "source-left" },
  ];

  return (
    <div
      className={`relative h-full w-full bg-gray-400 ${SHAPE_CLASSES[data.shape]}`}
    >
      <div
        className={`absolute inset-[2px] flex items-center justify-center bg-white ${SHAPE_CLASSES[data.shape]}`}
      >
        <span className="px-2 text-center text-sm font-medium text-gray-700">
          {data.label}
        </span>
      </div>
      {handlePositions.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          className="h-3! w-3! border-2! border-background! bg-gray-500!"
        />
      ))}
    </div>
  );
}

// Canvas content component using React Flow hooks
interface CanvasContentProps {
  edgeType: CanvasEdgeType;
}

function CanvasContent({ edgeType }: CanvasContentProps) {
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
  const renderedEdges = useMemo(
    () => edges.map((edge) => ({ ...edge, type: edgeType })),
    [edges, edgeType],
  );

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
        nodeCounterRef.current[payload.shape] =
          (nodeCounterRef.current[payload.shape] || 0) + 1;
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
        const addChange: NodeAddChange<CanvasNode> = {
          item: newNode,
          type: "add",
        };
        onNodesChange([addChange]);
      } catch (error) {
        console.error("Failed to parse drag data:", error);
      }
    },
    [screenToFlowPosition, onNodesChange],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const connectionWithType: Connection & { type: CanvasEdgeType } = {
        ...connection,
        type: edgeType,
      };
      onConnect(connectionWithType);
    },
    [edgeType, onConnect],
  );

  const nodeTypes = {
    canvasNode: CanvasNodeRenderer,
  };

  return (
    <div
      className="h-full w-full bg-background"
      role="application"
      aria-label="Architecture canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls className="canvas-controls" />
        <MiniMap />
        <Cursors />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}

export function Canvas({ edgeType }: CanvasContentProps) {
  return (
    <ReactFlowProvider>
      <CanvasContent edgeType={edgeType} />
    </ReactFlowProvider>
  );
}
