# Progress Tracker
Update this file after every meaningful implementation change.
## Current Phase
- Shape panel and node creation - COMPLETE
## Current Goal
- Verify the editor theme and canvas controls in the browser.
## Completed
- Added the design system and UI primitive components.
- Created components/editor/editor-navbar.tsx.
- Created components/editor/project-sidebar.tsx.
- Verified the dialog pattern is ready for future use.
- Built the editor navbar and project sidebar shell.
- Implemented Clerk authentication.
- Implemented project dialogs and editor home (04-project-dialogs.md).
- Implemented Prisma models (Project, ProjectCollaborator) and configuration (05-prisma.md).
- Implemented backend project API routes (06-project-apis.md).
- Wired the editor home to real owned/shared project data and mutation flow (07-wire-editor-home.md).
- Added the editor workspace shell at app/editor/[roomId]/page.tsx with server-side access checks and a full-screen placeholder layout.
- Added reusable access helpers in lib/project-access.ts and an access-denied view in components/editor/access-denied.tsx.
- Added the share dialog UI at components/editor/share-dialog.tsx for owners and collaborators.
- Added collaborator API routes at app/api/projects/[projectId]/collaborators/route.ts for listing, inviting, and removing collaborators.
- Enforced owner-only invite/remove server-side behavior and enriched collaborator profiles through Clerk when available.
- Configured liveblocks.config.ts with Presence (cursor position, isThinking) and UserMeta (id, name, avatar, cursorColor).
- Created lib/liveblocks.ts with cached Liveblocks client and deterministic color mapping helper.
- Implemented POST /api/liveblocks-auth with Clerk authentication, project access verification, room creation, and user metadata attachment.
- Installed @liveblocks/react-flow and reactflow packages.
- Created types/canvas.ts with CanvasNode, CanvasEdge, and CanvasNodeData types supporting label, color, and shape.
- Implemented components/editor/canvas-wrapper.tsx with LiveblocksProvider, RoomProvider, error handling, and suspense loading.
- Implemented components/editor/canvas.tsx with React Flow using useLiveblocksFlow, dot-pattern background, MiniMap, and loose connection behavior.
- Updated components/editor/editor-shell.tsx to wrap canvas with CanvasWrapper and render full-screen collaborative canvas.
- Implemented shape panel with draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon).
- Added drag-and-drop support to canvas with screen-to-canvas coordinate conversion.
- Implemented custom canvas node renderer for all shape types as bordered rectangles with centered labels.
- Updated types/canvas.ts to include all shape types and ShapeDragPayload interface.
- Generated node IDs using shape name, timestamp, and counter for uniqueness.
- Fixed diamond and hexagon borders by rendering a gray clipped outer layer with an inset white shape.
- Enlarged the canvas connection handles for easier line creation.
- Wired rename and delete actions plus their existing dialogs into the workspace project sidebar.
## In Progress
- Added theme toggle with persisted light/dark mode support.
- Moved the edge style selector inside the canvas and reduced its size.
- Updated canvas and node colors for dark mode visibility.
- Styled React Flow canvas controls so their icons and buttons remain visible in dark mode.
## Next Up
- Verify the editor theme, canvas controls, and project actions in the browser.
## Open Questions
- [any unresolved decisions]
## Architecture Decisions
- Configured multi-file schema for Prisma with Project and ProjectCollaborator models.
- Configured dynamic DB driver adapter (native vs pg connector) depending on DATABASE_URL.
- Editor create uses the generated room ID as the persisted project ID so project and Liveblocks room identifiers stay aligned.
## Session Notes
- Implemented complete Liveblocks realtime collaboration setup:
  - Defined Presence (cursor + isThinking) and UserMeta (name, avatar, cursorColor) types in liveblocks.config.ts
  - Created cached Liveblocks client with deterministic color assignment based on user ID hash
  - Built POST /api/liveblocks-auth with full access verification and session token generation
  - All Liveblocks dependencies already installed
- Implemented base canvas with React Flow and Liveblocks:
  - Installed @liveblocks/react-flow and reactflow packages
  - Created canvas types file with CanvasNode, CanvasEdge, and CanvasNodeData
  - Built CanvasWrapper component wrapping Liveblocks room setup with error boundaries
  - Implemented Canvas component using useLiveblocksFlow hook with empty initial state
  - Added dot-pattern background, MiniMap, fit-view, and loose connection behavior
  - Updated EditorShell to use CanvasWrapper and render full-screen collaborative canvas
- Implemented shape panel with drag-and-drop node creation:
  - Created components/editor/shape-panel.tsx with draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon)
  - Each shape includes icon, label, and sensible default sizes in drag payload
  - Implemented screen-to-canvas coordinate conversion using React Flow's screenToFlowPosition
  - Added custom canvas node renderer (CanvasNodeRenderer) that renders all shapes as simple bordered rectangles with centered labels
  - Implemented drag-over and drop event handlers on canvas wrapper element
  - Node IDs generated using shape name, timestamp, and counter for uniqueness
  - Node data includes label (empty), color (white), and shape type
  - Updated types/canvas.ts with ShapeDragPayload interface and all shape types
  - Used NodeAddChange and onNodesChange to add new nodes to Liveblocks storage
  - Build passes without errors
- Fixed canvas rendering issue:
  - Issue: useReactFlow() hook was being called outside ReactFlow component context
  - Solution: Refactored canvas.tsx to create CanvasContent component with React Flow hooks
  - CanvasContent is rendered inside ReactFlow, ensuring proper hook context
  - Canvas now renders correctly when clicking on projects
