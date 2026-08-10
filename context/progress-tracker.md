# Progress Tracker
Update this file after every meaningful implementation change.
## Current Phase
- Share workflow
## Current Goal
- Add the editor share dialog with collaborator management, Clerk-backed user enrichment, and project-link copying.
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
## In Progress
- [None]
## Next Up
- [None]
## Open Questions
- [any unresolved decisions]
## Architecture Decisions
- Configured multi-file schema for Prisma with Project and ProjectCollaborator models.
- Configured dynamic DB driver adapter (native vs pg connector) depending on DATABASE_URL.
- Editor create uses the generated room ID as the persisted project ID so project and Liveblocks room identifiers stay aligned.
## Session Notes
- Verified the workspace shell and share workflow with npm run build.
