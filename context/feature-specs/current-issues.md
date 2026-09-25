## FIXED ✓
1. On clicking on a project, unable to view or edit the canvas.
   - **Root Cause:** The `useReactFlow()` hook was being called in the Canvas component before the ReactFlow component was rendered in the component tree. React Flow hooks can only be used within the ReactFlow context.
   - **Fix:** Refactored Canvas component to separate the hook logic into a `CanvasContent` component that's rendered inside the Canvas wrapper. This ensures `useReactFlow()` is called within the ReactFlow context.

## Current Issues
On reloading the app. and opening a project, this is shown
- Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 3.4s (next.js: 91ms, proxy.ts: 24ms, application-code: 3.3s)
Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 2.1s (next.js: 3ms, proxy.ts: 15ms, application-code: 2.1s)
[browser] Liveblocks Authentication failed: Failed to authenticate: {"error":"Internal server error"} (500 returned by POST /api/liveblocks-auth) 
Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 2.1s (next.js: 5ms, proxy.ts: 17ms, application-code: 2.1s)
[browser] Liveblocks Authentication failed: Failed to authenticate: {"error":"Internal server error"} (500 returned by POST /api/liveblocks-auth) 
Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 2.0s (next.js: 7ms, proxy.ts: 14ms, application-code: 2.0s)
[browser] Liveblocks Authentication failed: Failed to authenticate: {"error":"Internal server error"} (500 returned by POST /api/liveblocks-auth) 
Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 2.1s (next.js: 5ms, proxy.ts: 15ms, application-code: 2.0s)
[browser] Liveblocks Authentication failed: Failed to authenticate: {"error":"Internal server error"} (500 returned by POST /api/liveblocks-auth) 
Inside post --------------------
Error in liveblocks-auth: Error: Failed to create room: Not Found
    at getOrCreateLiveblocksRoom (lib/liveblocks.ts:44:11)
    at async POST (app/api/liveblocks-auth/route.ts:53:5)
  42 |
  43 |   if (!response.ok && response.status !== 409) {
> 44 |     throw new Error(
     |           ^
  45 |       `Failed to create room: ${response.statusText}`
  46 |     );
  47 |   }
 POST /api/liveblocks-auth 500 in 1898ms (next.js: 4ms, proxy.ts: 14ms, application-code: 1879ms)
[browser] Liveblocks Authentication failed: Failed to authenticate: {"error":"Internal server error"} (500 returned by POST /api/liveblocks-auth) 

On clicking on a project , these errors are shown
## Error Type
Console Error

## Error Message
Liveblocks "Connection to websocket server closed. Reason: You have no access to this room (code: 4001)."

## Error Type
Console Error

## Error Message
Liveblocks "You have no access to this room"


## Error Type
Runtime Error

## Error Message
Seems like you have not used ReactFlowProvider as an ancestor. Help: https://reactflow.dev/error#001


    at CanvasContent (components/editor/canvas.tsx:48:33)
    at Canvas (components/editor/canvas.tsx:131:10)
    at EditorShell (components/editor/editor-shell.tsx:63:15)
    at EditorRoomPage (app/editor/[roomId]/page.tsx:30:7)

## Code Frame
  46 |     });
  47 |
> 48 |   const { screenToFlowPosition } = useReactFlow();
     |                                 ^
  49 |   const nodeCounterRef = useRef<Record<string, number>>({});
  50 |
  51 |   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {

Next.js version: 16.2.4 (Turbopack)
