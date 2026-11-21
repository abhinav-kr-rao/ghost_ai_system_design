# Progress Tracker
Update this file after every meaningful implementation change.
## Current Phase
- Starter template library and collaborative canvas import - COMPLETE
## Current Goal
- Verify starter template text contrast and appended template imports in the browser.
## Completed
- Added a starter template library with microservices, CI/CD pipeline, and event-driven system diagrams using shared canvas types and node colors.
- Added a starter templates dialog with a scrollable card grid and lightweight fixed-size SVG diagram previews.
- Added a navbar Templates entry point for opening the starter template library.
- Wired template import through the existing Liveblocks React Flow state to clear current edges/nodes before adding the selected template and fit the view.
- Verified `npm run build` passes with the starter template implementation.
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
- Moved the Curvy/Straight toggle into the navbar and applied its selection to existing and new edges.
- Added source and target connection handles on all four sides of each canvas shape.
- Reduced the AI sidebar width and removed the permanent right-side canvas reservation.
- Corrected Liveblocks best-practice reference examples for composer submission, Lexical toolbars, React Flow suspense, multiple editors, primitives, notification emails, unsaved changes, and Yjs package-manager overrides.
- Added cursor-attached drag previews for every shape using the same default dimensions as dropped nodes.
- Updated canvas shape rendering to use CSS shapes for rectangles, pills, and circles and scalable SVG shapes for diamonds, hexagons, and cylinders.
- Standardized all shape borders to use the same border token and fixed drag-preview cleanup to avoid stale event targets.
- Added selected-node resize handles with minimum dimensions and collaborative dimension updates.
- Added centered inline node label editing with placeholder text, synchronized typing, blur/Escape close behavior, and canvas interaction protection.
- Thickened CSS and SVG canvas shape borders to 3px and made the “Add label” placeholder use the visible muted theme token in light and dark modes.
- Added a predefined node color palette with paired background and text colors.
- Added a floating NodeToolbar above selected nodes with active swatch styling and tight text-color hover glow.
- Wired swatch selection into Liveblocks node replace mutations and updated node shapes and labels immediately.
- Added backward-compatible text color fallbacks for existing canvas nodes.
- Added a floating bottom-left zoom and history control bar.
- Replaced the React Flow built-in controls with animated zoom in, zoom out, and fit-view actions.
- Wired Liveblocks undo/redo availability and actions to the control bar.
- Added keyboard shortcuts for zooming and undo/redo while ignoring editable fields.
- Fixed starter template card descriptions to use a high-contrast muted text token in light and dark themes.
- Updated starter template modal copy to clarify that imports are added alongside existing canvas content.
- Fixed template imports to add template nodes and edges instead of waiting for the canvas to become empty.
- Namespaced template node and edge IDs per import so repeated template imports remain separate canvas content.
## FIXED - Current Issues
1. **Starter template text clarity:** Updated the card descriptions to use `text-muted-foreground` and increased line height for clearer visibility beside the Import button.
2. **Template import with existing canvas content:** Starter templates now append unique, namespaced node and edge IDs to the existing Liveblocks canvas state, then fit the view.
- Added `hooks/useKeyboardShortcuts.ts` with React Flow and Liveblocks action handlers.
## In Progress
- None
## Next Up
- Verify the editor theme, canvas controls, edge connections, node resizing, inline label editing, color toolbar, project actions, shape drag previews, and starter template appending in the browser.
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
