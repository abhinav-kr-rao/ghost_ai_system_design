## FIXED ✓
1. On clicking on a project, unable to view or edit the canvas.
   - **Root Cause:** The `useReactFlow()` hook was being called in the Canvas component before the ReactFlow component was rendered in the component tree. React Flow hooks can only be used within the ReactFlow context.
   - **Fix:** Refactored Canvas component to separate the hook logic into a `CanvasContent` component that's rendered inside the Canvas wrapper. This ensures `useReactFlow()` is called within the ReactFlow context.

2. In project sidebar, on clicking the rename and delete icon, nothing was happening.
   - **Root Cause:** The workspace editor rendered the sidebar without passing rename/delete handlers or mounting the project dialogs.
   - **Fix:** Wired the existing project action hook and `ProjectDialogs` into `components/editor/editor-shell.tsx`.

3. Shape borders were inconsistent between CSS-rendered and SVG-rendered shapes.
   - **Fix:** Standardized all shape borders to use the same border token and two-pixel width in both previews and dropped nodes.

4. Dragging a shape from the panel caused a `currentTarget is null` cleanup error.
   - **Fix:** Captured the drag source before cleanup so the preview can be removed without reading the cleared event target.

## Verification
- All shape borders use the `border-border` token and a consistent two-pixel width in both drag previews and dropped canvas nodes.
- Drag-preview cleanup no longer reads `event.currentTarget` after the event callback.
- `npm run build` passes.



## Current Issues

1. On opening the starter template, some text, between the tile and "Import" button, is not clearly visible, check context/screenshots/image-4.png for reference

2. On clicking import on a starter template, if the canvas is empty the template appears on the canvas, but on importing another template (with previous content on canvas still there), the new template is not visible.

## Verification

1. All text in the starter template dialog should be clearly visible in light and dark mode.

2. On importing a template, that template should come on canvas along with any content that already on canvas.

3. `npm run build` passes.