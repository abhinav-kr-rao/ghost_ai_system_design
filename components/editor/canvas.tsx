"use client";

import { useCanRedo, useCanUndo, useRedo, useUndo } from "@liveblocks/react";
import { Cursors, useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionMode,
  type EdgeAddChange,
  Handle,
  MiniMap,
  type NodeAddChange,
  type NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { Maximize, Minus, Plus, Redo2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type {
  CanvasColorPair,
  CanvasEdge,
  CanvasEdgeType,
  CanvasNode,
  ShapeDragPayload,
} from "@/types/canvas";
import { CANVAS_COLOR_PALETTE } from "@/types/canvas";
import { ShapePanel } from "./shape-panel";
import { ShapeVisual } from "./shape-visual";
import type { CanvasTemplate } from "./starter-templates";

export interface TemplateImportRequest {
  nonce: number;
  template: CanvasTemplate;
}

interface CanvasNodeRendererProps extends NodeProps<CanvasNode> {
  onLabelChange: (nodeId: string, label: string) => void;
  onColorChange: (nodeId: string, colorPair: CanvasColorPair) => void;
}

function CanvasNodeRenderer({
  id,
  data,
  selected,
  onLabelChange,
  onColorChange,
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

  const backgroundColor = data.color || "#FFFFFF";
  const textColor = data.textColor || "#111827";

  const preventCanvasInteraction = useCallback(
    (event: React.SyntheticEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    [],
  );

  return (
    <div className="relative h-full w-full">
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        offset={10}
        align="center"
        className="flex items-center gap-1 rounded-radius-md border border-border bg-popover p-1 shadow-md"
        onPointerDown={preventCanvasInteraction}
        onMouseDown={preventCanvasInteraction}
      >
        {CANVAS_COLOR_PALETTE.map((colorPair) => {
          const isActive =
            backgroundColor.toLowerCase() ===
            colorPair.background.toLowerCase();

          return (
            <button
              key={colorPair.name}
              type="button"
              aria-label={`Set node color to ${colorPair.name}`}
              aria-pressed={isActive}
              className="node-color-swatch h-5 w-5 shrink-0 rounded-full border-2 border-popover transition-shadow"
              style={
                {
                  backgroundColor: colorPair.background,
                  outline: isActive
                    ? "2px solid var(--accent-primary)"
                    : "1px solid var(--border)",
                  outlineOffset: isActive ? "1px" : "0",
                  "--swatch-glow": colorPair.text,
                } as React.CSSProperties
              }
              onPointerDown={preventCanvasInteraction}
              onClick={(event) => {
                event.stopPropagation();
                onColorChange(id, colorPair);
              }}
            />
          );
        })}
      </NodeToolbar>
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={48}
        handleClassName="!h-2 !w-2 !border-2 !border-background !bg-accent-primary"
        lineClassName="!border-accent-primary/60"
      />
      <ShapeVisual
        shape={data.shape}
        backgroundColor={backgroundColor}
        className="absolute inset-0"
      />
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
            placeholder="Add label"
            className="h-full w-full resize-none overflow-hidden border-0 bg-transparent px-2 py-1 text-center text-sm font-medium placeholder:text-muted-foreground outline-none"
            style={{ color: textColor }}
          />
        ) : (
          <button
            type="button"
            onDoubleClick={startEditing}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={data.label || "Node label"}
            className="h-full w-full border-0 bg-transparent px-2 text-center text-sm font-medium outline-none"
            style={{
              color: data.label ? textColor : "var(--muted-foreground)",
            }}
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
  templateImport?: TemplateImportRequest | null;
}

function CanvasContent({ edgeType, templateImport }: CanvasContentProps) {
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

  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();
  const { screenToFlowPosition } = reactFlowInstance;
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const nodesRef = useRef(nodes);
  const nodeCounterRef = useRef<Record<string, number>>({});
  const handledTemplateImportRef = useRef(0);
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
            textColor: "#111827",
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

  const handleColorChange = useCallback(
    (nodeId: string, colorPair: CanvasColorPair) => {
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
              color: colorPair.background,
              textColor: colorPair.text,
            },
          },
        },
      ]);
    },
    [onNodesChange],
  );

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut({ duration: 200 });
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ duration: 200 });
  }, [reactFlowInstance]);

  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn({ duration: 200 });
  }, [reactFlowInstance]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [canRedo, redo]);

  useEffect(() => {
    if (
      !templateImport ||
      handledTemplateImportRef.current === templateImport.nonce
    ) {
      return;
    }

    handledTemplateImportRef.current = templateImport.nonce;
    const templateIdPrefix = `template-${templateImport.nonce}-`;
    const nodeAdds: NodeAddChange<CanvasNode>[] =
      templateImport.template.nodes.map((templateNode) => ({
        type: "add",
        item: {
          ...templateNode,
          id: `${templateIdPrefix}${templateNode.id}`,
          position: { ...templateNode.position },
          style: templateNode.style ? { ...templateNode.style } : undefined,
          data: { ...templateNode.data },
        },
      }));
    if (nodeAdds.length > 0) {
      onNodesChange(nodeAdds);
    }

    const edgeAdds: EdgeAddChange<CanvasEdge>[] =
      templateImport.template.edges.map((templateEdge) => ({
        type: "add",
        item: {
          ...templateEdge,
          id: `${templateIdPrefix}${templateEdge.id}`,
          source: `${templateIdPrefix}${templateEdge.source}`,
          target: `${templateIdPrefix}${templateEdge.target}`,
          type: edgeType,
          data: { ...templateEdge.data },
        },
      }));
    if (edgeAdds.length > 0) {
      onEdgesChange(edgeAdds);
    }

    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ duration: 200, padding: 0.18 });
    });
  }, [
    templateImport,
    edgeType,
    onNodesChange,
    onEdgesChange,
    reactFlowInstance,
  ]);

  useKeyboardShortcuts({
    reactFlowInstance,
    onUndo: handleUndo,
    onRedo: handleRedo,
  });

  const nodeTypes = useMemo(
    () => ({
      canvasNode: (props: NodeProps<CanvasNode>) => (
        <CanvasNodeRenderer
          {...props}
          onLabelChange={handleLabelChange}
          onColorChange={handleColorChange}
        />
      ),
    }),
    [handleLabelChange, handleColorChange],
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
        <MiniMap />
        <Cursors />
      </ReactFlow>
      <div className="fixed bottom-24 left-4 z-40 flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1.5 shadow-lg">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out (-)"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-hover"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleFitView}
            aria-label="Fit view"
            title="Fit view"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-hover"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in (+)"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-hover"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            aria-label="Undo"
            title="Undo (Ctrl/Cmd+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            aria-label="Redo"
            title="Redo (Ctrl/Cmd+Shift+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ShapePanel />
    </div>
  );
}

export function Canvas({ edgeType, templateImport }: CanvasContentProps) {
  return (
    <ReactFlowProvider>
      <CanvasContent edgeType={edgeType} templateImport={templateImport} />
    </ReactFlowProvider>
  );
}
