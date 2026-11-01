## FIXED ✓
1. On clicking on a project, unable to view or edit the canvas.
   - **Root Cause:** The `useReactFlow()` hook was being called in the Canvas component before the ReactFlow component was rendered in the component tree. React Flow hooks can only be used within the ReactFlow context.
   - **Fix:** Refactored Canvas component to separate the hook logic into a `CanvasContent` component that's rendered inside the Canvas wrapper. This ensures `useReactFlow()` is called within the ReactFlow context.

2. In project sidebar, on clicking the rename and delete icon, nothing was happening.
   - **Root Cause:** The workspace editor rendered the sidebar without passing rename/delete handlers or mounting the project dialogs.
   - **Fix:** Wired the existing project action hook and `ProjectDialogs` into `components/editor/editor-shell.tsx`.

## Current Issues
1. In canvas area, the lines connecting the shapes is not consistent with the toggle in the top right section, "Curvy/Striaght", when toggle is straight all lines are not becoming straight and same with curvy toggle. Check "context/screenshots/image-1.png" for reference.

2. There is a right component that is taking too much space for only displaying the connecting lines toggle, at top, and displaying Liveblocks logo at bottom, the sidebar for AI chatbot section, when opened , the canvas area becomes too small due to this. Reduce the right component.Check "context/screenshots/image-2.png" for reference.
Shift the line toggle in the navbar. 

# Drag and Drop Issues

3. On drawing lines in the canvas for connecting the shapes, there is inconsistency when joining the ends of shapes. Fix it.


## On completion, verify that:

1. The line toggler is on the navbar.

2. On clicking line toggler, if curvy, all lines connecting the shapes is becoming curvy and if straight, all lines connecting the shapes is becoming straight.

3. The right sidebar component is for AI chatbot that opens and closes on clicking its toggle, and the extra section with no functionality is gone.

4. The drag and drop is working fine, on joining the line connecting the shape at an end, the line connects the exact end where the cursor drops and also where originates.