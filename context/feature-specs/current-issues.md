## FIXED ✓
1. On clicking on a project, unable to view or edit the canvas.
   - **Root Cause:** The `useReactFlow()` hook was being called in the Canvas component before the ReactFlow component was rendered in the component tree. React Flow hooks can only be used within the ReactFlow context.
   - **Fix:** Refactored Canvas component to separate the hook logic into a `CanvasContent` component that's rendered inside the Canvas wrapper. This ensures `useReactFlow()` is called within the ReactFlow context.

2. In project sidebar, on clicking the rename and delete icon, nothing was happening.
   - **Root Cause:** The workspace editor rendered the sidebar without passing rename/delete handlers or mounting the project dialogs.
   - **Fix:** Wired the existing project action hook and `ProjectDialogs` into `components/editor/editor-shell.tsx`.

## Current Issues
1. The Rectangle, Circle and Pill shapes have lighter and thinner borders than Diamond cylinder and hexagon shapes. Make the borders of all shapes consistent