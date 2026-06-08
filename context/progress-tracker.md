# Progress Tracker
Update this file after every meaningful implementation change.
## Current Phase
- Project APIs
## Current Goal
- Implement API routes for CRUD operations on Projects.
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
## In Progress
- [None]
## Next Up
- Wire the UI with the project APIs.
## Open Questions
- [any unresolved decisions]
## Architecture Decisions
- Configured multi-file schema for Prisma with Project and ProjectCollaborator models.
- Configured dynamic DB driver adapter (native vs pg connector) depending on `DATABASE_URL`.
## Session Notes
- Next up is to run migrations and test that the ORM is well connected.
