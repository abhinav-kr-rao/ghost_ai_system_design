# AI Coding Agent Workflow Rules

You are an AI coding agent operating within this codebase. You must adhere strictly to the following rules at all times. These are absolute constraints, not suggestions.

## 1. Overall Approach
* **Be Spec-Driven:** Read `project-overview.md` and `architecture.md` before executing any code generation. Align all implementation details with the defined stack (Next.js, Liveblocks, Prisma, Trigger.dev, Vercel AI SDK).
* **Work Incrementally:** Build, integrate, and verify one feature or component at a time. Do not attempt massive "big bang" code generations or multi-directory refactors in a single pass.

## 2. Scoping Rules
* **Zero Speculative Code:** Implement exactly what is requested. Do not add "nice-to-have" features, extra abstractions, or future-proofing logic unless explicitly instructed.
* **Confine Changes:** Limit your modifications to the specific logical unit (e.g., a single component, a single API route, or a specific database model). 
* **Do Not Refactor Unrelated Code:** If you spot messy code outside your current task scope, ignore it unless instructed to clean it up.

## 3. When to Split Work
* **Stop and Propose Steps:** If a requested task requires modifying more than three distinct architectural layers (e.g., changing the Prisma schema, building a Trigger.dev job, updating Liveblocks presence, and rewriting a Next.js UI component), **stop**. Break the task into discrete, sequential steps and ask the user for approval to proceed one step at a time.
* **Component Isolation:** If asked to build a complex page, build the atomic UI components first, verify them, and only then construct the page layout.

## 4. Handling Ambiguity
* **Halt on Missing Requirements:** If a requirement is missing, contradictory, or vague, **stop**. Do not invent logic to fill the gap.
* **Ask Direct Questions:** Explicitly ask the user for clarification. Provide 2-3 specific options for them to choose from to resolve the ambiguity.
* **Do Not Assume Defaults:** Do not assume default behaviors for access control, state management, or data deletion (especially regarding the Owner/Editor document model).

## 5. Restricted Files
Do **NOT** modify the following files or directories without explicit, direct instruction from the user:
* `/components/ui/*`: These are generated UI library components (e.g., shadcn/ui). Treat them as read-only.
* `prisma/schema.prisma`: Modifying the database schema requires explicit user sign-off due to migration risks.
* `package.json` / `package-lock.json`: Do not add new dependencies without asking first.
* `*.md` documentation files: Do not rewrite the foundational architecture or overview documents unless told to document an approved change.

## 6. Keeping Documentation in Sync
* **Document Architectural Changes:** If explicitly instructed to change a core technology or data model (e.g., modifying the Project/Collaborator schema), you must also update the relevant sections in `architecture.md` and `project-overview.md` in the same turn.
* **Inline Documentation:** Add clear TSdoc comments for all complex integration points, specifically for Liveblocks CRDT interactions, Trigger.dev payload parsing, and Vercel AI SDK Zod schemas.

## 7. Verification Checklist
Before declaring a logical unit "complete" and moving to the next task, verify the following:
1.  **Type Safety:** Does the code satisfy strict TypeScript compiler checks? (No `any` types for Liveblocks storage or Prisma payloads).
2.  **Environment Variables:** Are all newly introduced environment variables documented or clearly requested from the user?
3.  **Liveblocks Sync:** If modifying canvas state, are changes correctly using Liveblocks mutations (`useMutation`, `update`) rather than local React state?
4.  **AI SDK Constraints:** Does the AI SDK output strictly adhere to the defined Zod schema? Is the `generateObject` method used to guarantee JSON?
5.  **Main Thread Safety:** Are all LLM inferences and external file compilations properly offloaded to Trigger.dev jobs?
