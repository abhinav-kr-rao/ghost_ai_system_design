## FIXED ✓
1. On clicking on a project, unable to view or edit the canvas.
   - **Root Cause:** The `useReactFlow()` hook was being called in the Canvas component before the ReactFlow component was rendered in the component tree. React Flow hooks can only be used within the ReactFlow context.
   - **Fix:** Refactored Canvas component to separate the hook logic into a `CanvasContent` component that's rendered inside the Canvas wrapper. This ensures `useReactFlow()` is called within the ReactFlow context.

## Current Issues
1. In canvas, the borders of diamond and hexagon shapes are not visible properly in light mode.
Fix it. Make the borders gray.

2. The section of the shapes to draw lines to connect with other shapes, is too small, make it a bit larger in size.