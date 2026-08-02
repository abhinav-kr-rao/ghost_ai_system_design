# Progress Tracker
Update this file after every meaningful implementation change.
## Current Phase
- Editor home wiring
## Current Goal
- Wire the editor home sidebar and dialogs to the real project data and mutation API.
## Completed
- Adding the design system and UI primitive components.
- Created `components/editor/editor-navbar.tsx`
- Created `components/editor/project-sidebar.tsx`
- Verified dialog pattern is ready for future use.
- Built the editor navbar and project sidebar shell.
- Implementing Clerk authentication.
- Implemented project dialogs and editor home (04-project-dialogs.md).
- Implemented Prisma models (Project, ProjectCollaborator) and configuration (05-prisma.md).
- Implemented backend project API routes (06-project-apis.md).
- Wired the editor home to real owned/shared project data and mutation flow (07-wire-editor-home.md).
## In Progress
- [None]
## Next Up
- [None]
## Open Questions
- [any unresolved decisions]
## Architecture Decisions
- Configured multi-file schema for Prisma with Project and ProjectCollaborator models.
- Configured dynamic DB driver adapter (native vs pg connector) depending on `DATABASE_URL`.
- Editor create uses the generated room ID as the persisted project ID so project and Liveblocks room identifiers stay aligned.
## Session Notes
- Verified with `npm run build` after the editor home wiring changes.
