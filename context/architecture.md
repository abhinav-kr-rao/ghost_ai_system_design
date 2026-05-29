# System Architecture Document

## Technology Stack

| Layer | Technology | Role in System |
| :--- | :--- | :--- |
| **Language** | TypeScript | End-to-end type safety, enforcing shared schemas between the AI, database, and client. |
| **Frontend Framework** | Next.js (App Router) | React framework for routing, server-side rendering, and building the UI application shell. |
| **Styling** | Tailwind CSS | Utility-first CSS for responsive, performant UI components. |
| **Real-time State** | Liveblocks | CRDT-powered WebSocket backend managing multiplayer presence, cursors, and concurrent canvas editing. |
| **Authentication** | Clerk | Identity provider and session management. |
| **Database** | PostgreSQL + Prisma | Relational data store for users, projects, collaborator relationships, and job run histories. |
| **Blob Storage** | Vercel Blob | Immutable object storage for saving the final, generated Markdown `.md` technical specifications. |
| **AI Engine** | Vercel AI SDK | Orchestrates single-call LLM interactions using strict structured outputs (Zod-to-JSON) for graph generation. |
| **Background Jobs** | Trigger.dev | Asynchronous task queue handling long-running AI inference and file saving without blocking the UI. |

---

## System Boundaries

The codebase is organized by domain responsibility to maintain strict separation of concerns:

* **`/app`**: The Next.js routing layer. Handles page rendering, layout, and HTTP API endpoints. *Does not contain complex business logic.*
* **`/components/canvas`**: The interactive visualization layer. Owns the Liveblocks React Flow integration, custom node rendering, and edge logic.
* **`/lib/db`**: The data access layer. Owns the Prisma client, database schema definition, and all CRUD operations against PostgreSQL.
* **`/lib/ai`**: The generation engine. Contains Vercel AI SDK configurations, LLM model selection, system prompts, and the Zod schemas defining valid architecture graphs.
* **`/jobs`**: The async worker layer. Contains Trigger.dev background task definitions (e.g., `generate-architecture-graph`, `compile-markdown-spec`).
* **`/app/api/webhooks`**: The integration layer. Listens for external events (e.g., Clerk `user.created` webhooks) to keep internal systems synced.

---

## Storage Model

Data is strictly partitioned based on its velocity and immutability:

1.  **Relational Database (PostgreSQL):** Stores slow-moving, structured metadata.
    * User profiles, Projects (with an `ownerId`), and a Junction Table for invited `Editors`.
    * Historical logs of AI generation runs and references to Blob URLs.
    * *Rule:* Never store the live canvas graph state here.
2.  **Transient/Real-time Memory (Liveblocks):** Stores high-velocity, multi-editor state.
    * The live JSON graph schema (Nodes, Edges, X/Y coordinates, component properties).
    * Ephemeral data like multiplayer cursors and user presence.
3.  **Immutable Object Storage (Vercel Blob):** Stores static output artifacts.
    * The generated Markdown technical specifications. Once a spec is compiled and saved, it acts as a read-only historical record.

---

## Authentication and Access Model

* **Identity & Sync:** Clerk acts as the Identity Provider. A webhook (via Svix) listens for Clerk's `user.created` events and creates a corresponding User record in PostgreSQL to maintain foreign key integrity.
* **Document-Based Ownership:** The system uses a strict Owner/Editor access model.
    * **Owner:** The user who created the project. Has full rights: read, write, invite Editors, remove Editors, and delete the project.
    * **Editor:** Users explicitly invited to a specific project. They have read/write access to the canvas but cannot manage project metadata or delete the project.
* **The WebSocket Gatekeeper:** When a user opens a canvas, the client requests a token from `/api/liveblocks-auth`. This endpoint verifies the active Clerk session and queries Prisma to check if the user is either the `ownerId` of the project OR exists in the project's collaborator table. *Only then* does it sign and return a secure Liveblocks token.

---

## AI and Background Task Model

To prevent UI freezing and Vercel serverless timeout limits, all AI operations are decoupled from the main thread using Trigger.dev:

1.  **Graph Generation Task:** User submits a prompt -> UI calls an API -> API enqueues a `generate-graph` Trigger.dev job and returns a `jobId`. The Trigger job calls the Vercel AI SDK, enforces a Zod schema, and directly mutates the Liveblocks room state via the Liveblocks REST API when complete.
2.  **Spec Compilation Task:** User clicks "Generate Spec" -> Trigger.dev job spins up -> Reads the current Liveblocks canvas state -> Passes the exact node/edge JSON to the LLM -> Generates Markdown -> Saves to Vercel Blob -> Updates PostgreSQL -> Fires an event back to the client that the file is ready.

---

## System Invariants

These rules are structural absolutes. Breaking them will result in rejected pull requests:

1.  **Single Source of Visual Truth:** The Liveblocks room state is the *only* source of truth for the architecture canvas. The PostgreSQL database must never attempt to cache, sync, or store the live node/edge graph.
2.  **Strict Schema Validation:** All AI-generated canvas updates must pass strict Zod validation via the Vercel AI SDK's `generateObject` before modifying the canvas. No raw text responses are permitted to touch the visual layer.
3.  **No Blocking the Main Thread:** Any process involving LLM inference or external file compilation must be offloaded to a Trigger.dev background job. Next.js API routes must respond within 2 seconds with a job status.
4.  **AI Statelessness:** The AI agent must have zero memory of previous generations. Every background job must provide the LLM with the *entire* current canvas state to prevent hallucinated nodes or "semantic drift" during subsequent edits.
5.  **Database-Gated Sockets & Mutations:** A Liveblocks connection token must never be issued based solely on a valid Clerk session; the backend must explicitly verify ownership or invitation status in PostgreSQL. Furthermore, destructive actions (removing users, deleting projects) must explicitly verify the user is the `ownerId` before executing.
