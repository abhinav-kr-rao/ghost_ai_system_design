import type { CanvasEdge, CanvasNode } from "@/types/canvas";
import { CANVAS_COLOR_PALETTE } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function node(
  id: string,
  label: string,
  shape: CanvasNode["data"]["shape"],
  x: number,
  y: number,
  colorIndex: number,
  width = 160,
  height = 72,
): CanvasNode {
  const color = CANVAS_COLOR_PALETTE[colorIndex];
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    style: { width, height },
    data: {
      label,
      shape,
      color: color.background,
      textColor: color.text,
    },
  };
}

function edge(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    source,
    target,
    type: "default",
    data: {},
  };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Platform",
    description: "API gateway, core services, cache, and database.",
    nodes: [
      node("gateway", "API Gateway", "pill", 300, 40, 2),
      node("users", "User Service", "rectangle", 80, 220, 3),
      node("orders", "Order Service", "rectangle", 300, 220, 3),
      node("payments", "Payment Service", "rectangle", 520, 220, 3),
      node("cache", "Redis Cache", "cylinder", 300, 400, 4),
      node("database", "PostgreSQL", "cylinder", 520, 400, 5),
    ],
    edges: [
      edge("gateway-users", "gateway", "users"),
      edge("gateway-orders", "gateway", "orders"),
      edge("gateway-payments", "gateway", "payments"),
      edge("users-cache", "users", "cache"),
      edge("orders-cache", "orders", "cache"),
      edge("payments-database", "payments", "database"),
    ],
  },
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "Source control through build, test, and deployment.",
    nodes: [
      node("source", "Source", "hexagon", 40, 220, 6),
      node("build", "Build", "rectangle", 240, 220, 2),
      node("test", "Test", "diamond", 440, 220, 4, 140, 140),
      node("staging", "Staging", "pill", 620, 220, 5),
      node("production", "Production", "rectangle", 820, 220, 6),
    ],
    edges: [
      edge("source-build", "source", "build"),
      edge("build-test", "build", "test"),
      edge("test-staging", "test", "staging"),
      edge("staging-production", "staging", "production"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-driven System",
    description: "Producer, event bus, consumers, and event store.",
    nodes: [
      node("producer", "Producer", "rectangle", 80, 220, 2),
      node("broker", "Event Broker", "hexagon", 330, 220, 3),
      node("worker-a", "Worker A", "circle", 560, 100, 4, 140, 140),
      node("worker-b", "Worker B", "circle", 560, 340, 4, 140, 140),
      node("event-store", "Event Store", "cylinder", 780, 220, 5),
    ],
    edges: [
      edge("producer-broker", "producer", "broker"),
      edge("broker-worker-a", "broker", "worker-a"),
      edge("broker-worker-b", "broker", "worker-b"),
      edge("worker-a-store", "worker-a", "event-store"),
      edge("worker-b-store", "worker-b", "event-store"),
    ],
  },
];
