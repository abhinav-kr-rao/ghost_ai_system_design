"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CanvasTemplate } from "./starter-templates";
import { CANVAS_TEMPLATES } from "./starter-templates";

interface StarterTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: CanvasTemplate) => void;
}

interface TemplatePreviewProps {
  template: CanvasTemplate;
}

const PREVIEW_WIDTH = 260;
const PREVIEW_HEIGHT = 160;
const PREVIEW_PADDING = 14;

function TemplatePreview({ template }: TemplatePreviewProps) {
  if (template.nodes.length === 0) {
    return <svg viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`} />;
  }

  const positionedNodes = template.nodes.map((node) => {
    const width =
      typeof node.style?.width === "number" ? node.style.width : 160;
    const height =
      typeof node.style?.height === "number" ? node.style.height : 72;
    return {
      node,
      width,
      height,
      left: node.position.x,
      top: node.position.y,
      right: node.position.x + width,
      bottom: node.position.y + height,
    };
  });

  const minX = Math.min(...positionedNodes.map((item) => item.left));
  const minY = Math.min(...positionedNodes.map((item) => item.top));
  const maxX = Math.max(...positionedNodes.map((item) => item.right));
  const maxY = Math.max(...positionedNodes.map((item) => item.bottom));
  const boundsWidth = Math.max(maxX - minX, 1);
  const boundsHeight = Math.max(maxY - minY, 1);
  const scale = Math.min(
    (PREVIEW_WIDTH - PREVIEW_PADDING * 2) / boundsWidth,
    (PREVIEW_HEIGHT - PREVIEW_PADDING * 2) / boundsHeight,
  );
  const offsetX = (PREVIEW_WIDTH - boundsWidth * scale) / 2 - minX * scale;
  const offsetY = (PREVIEW_HEIGHT - boundsHeight * scale) / 2 - minY * scale;

  const transformedNodes = positionedNodes.map((item) => ({
    ...item,
    x: item.left * scale + offsetX,
    y: item.top * scale + offsetY,
    width: item.width * scale,
    height: item.height * scale,
  }));

  const centerById = new Map(
    transformedNodes.map((item) => [
      item.node.id,
      {
        x: item.x + item.width / 2,
        y: item.y + item.height / 2,
      },
    ]),
  );

  return (
    <svg
      viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`}
      className="h-40 w-full"
      role="img"
      aria-label={`${template.name} diagram preview`}
    >
      {template.edges.map((canvasEdge) => {
        const source = centerById.get(canvasEdge.source);
        const target = centerById.get(canvasEdge.target);
        if (!source || !target) {
          return null;
        }
        return (
          <line
            key={canvasEdge.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="var(--border)"
            strokeWidth="2"
          />
        );
      })}
      {transformedNodes.map((item) => {
        const { node, x, y, width, height } = item;
        const background = node.data.color || "#FFFFFF";
        const shape = node.data.shape;
        const common = {
          fill: background,
          stroke: "var(--border)",
          strokeWidth: 2,
        };

        if (shape === "circle") {
          return (
            <ellipse
              key={node.id}
              cx={x + width / 2}
              cy={y + height / 2}
              rx={width / 2}
              ry={height / 2}
              {...common}
            />
          );
        }
        if (shape === "diamond") {
          return (
            <polygon
              key={node.id}
              points={`${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`}
              {...common}
            />
          );
        }
        if (shape === "hexagon") {
          return (
            <polygon
              key={node.id}
              points={`${x + width * 0.25},${y} ${x + width * 0.75},${y} ${x + width},${y + height / 2} ${x + width * 0.75},${y + height} ${x + width * 0.25},${y + height} ${x},${y + height / 2}`}
              {...common}
            />
          );
        }
        if (shape === "cylinder") {
          return (
            <g key={node.id}>
              <rect
                x={x}
                y={y + height * 0.12}
                width={width}
                height={height * 0.76}
                {...common}
              />
              <ellipse
                cx={x + width / 2}
                cy={y + height * 0.12}
                rx={width / 2}
                ry={Math.min(height * 0.12, 8)}
                {...common}
              />
              <ellipse
                cx={x + width / 2}
                cy={y + height * 0.88}
                rx={width / 2}
                ry={Math.min(height * 0.12, 8)}
                {...common}
              />
            </g>
          );
        }
        return (
          <rect
            key={node.id}
            x={x}
            y={y}
            width={width}
            height={height}
            rx={shape === "pill" ? height / 2 : 6}
            {...common}
          />
        );
      })}
    </svg>
  );
}

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  const handleImport = (template: CanvasTemplate) => {
    onImport(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Starter templates</DialogTitle>
          <DialogDescription>
            Import a pre-built diagram to replace the current canvas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {CANVAS_TEMPLATES.map((template) => (
            <article
              key={template.id}
              className="flex min-h-64 flex-col rounded-radius-lg border border-border bg-surface p-3"
            >
              <div className="rounded-radius-md border border-border bg-canvas">
                <TemplatePreview template={template} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-primary">
                {template.name}
              </h3>
              <p className="mt-1 min-h-10 text-xs text-secondary">
                {template.description}
              </p>
              <Button
                type="button"
                className="mt-3 w-full"
                onClick={() => handleImport(template)}
              >
                Import
              </Button>
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
