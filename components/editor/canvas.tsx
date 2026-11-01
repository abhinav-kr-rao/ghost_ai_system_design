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
  type NodeProps,
  NodeResizer,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import type {
  CanvasEdge,
  CanvasEdgeType,
  CanvasNode,
  ShapeDragPayload,
} from "@/types/canvas";
import { ShapePanel } from "./shape-panel";
import { ShapeVisual } from "./shape-visual";

interface CanvasNodeRendererProps extends NodeProps<CanvasNode> {
  onLabelChange: (nodeId: string, label: string) => void;
}

function CanvasNodeRenderer({
  id,
  data,
  selected,
  onLabelChange,
}: CanvasNodeRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setDraftLabel(data.label);
    setIsEditing(true);
  }, [data.label]);

  const handleLabelChange = useCallback(
    (label: string) => {
      setDraftLabel(label);
      onLabelChange(id, label);
    },
    [id, onLabelChange],
  );

  const handleLabelKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      event.stopPropagation();
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    },
    [],
  );

  return (
    <div className="relative h-full w-full">
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={48}
        handleClassName="!h-2 !w-2 !border-2 !border-background !bg-accent-primary"
        lineClassName="!border-accent-primary/60"
      />
      <ShapeVisual shape={data.shape} className="absolute inset-0" />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={draftLabel}
            onChange={(event) => handleLabelChange(event.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleLabelKeyDown}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Edit node label"
            className="h-full w-full resize-none overflow-hidden border-0 bg-transparent px-2 py-1 text-center text-sm font-medium text-primary outline-none"
          />
        ) : (
          <button
            type="button"
            onDoubleClick={startEditing}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={data.label || "Node label"}
            className={`h-full w-full border-0 bg-transparent px-2 text-center text-sm font-medium outline-none ${
              data.label ? "text-primary" : "text-secondary"
            }`}
          >
            {data.label || "Add label"}
          </button>
        )}
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
  const nodesRef = useRef(nodes);
  const nodeCounterRef = useRef<Record<string, number>>({});
  nodesRef.current = nodes;
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

  const handleLabelChange = useCallback(
    (nodeId: string, label: string) => {
      const node = nodesRef.current.find(
        (candidate) => candidate.id === nodeId,
      );
      if (!node) {
        return;
      }

      onNodesChange([
        {
          id: nodeId,
          type: "replace",
          item: {
            ...node,
            data: {
              ...node.data,
              label,
            },
          },
        },
      ]);
    },
    [onNodesChange],
  );

  const nodeTypes = useMemo(
    () => ({
      canvasNode: (props: NodeProps<CanvasNode>) => (
        <CanvasNodeRenderer {...props} onLabelChange={handleLabelChange} />
      ),
    }),
    [handleLabelChange],
  );

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
