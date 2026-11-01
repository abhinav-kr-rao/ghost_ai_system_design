"use client";

import { ReactNode } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { RoomProvider } from "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";

interface CanvasWrapperProps {
  roomId: string;
  children: ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-full text-red-500">
      <div>
        <p className="font-semibold">Failed to load canvas</p>
        <p className="text-sm">{error.message}</p>
      </div>
    </div>
  );
}

export function CanvasWrapper({ roomId, children }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: { x: 0, y: 0 }, isThinking: false }}>
        <ErrorBoundary fallback={<ErrorFallback error={new Error("Canvas connection failed")} />}>
          <ClientSideSuspense fallback={<div className="flex items-center justify-center h-full">Loading canvas...</div>}>
            {children}
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
