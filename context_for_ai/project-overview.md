# Project Overview: Collaborative System Design Workspace

## Overview
The application is a web-based collaborative workspace designed to accelerate the software architecture phase by translating plain English descriptions into interactive, real-time system diagrams. Engineering teams can collaboratively edit these diagrams on a shared multiplayer canvas. Once the architectural design is finalized on the canvas, the application automatically reads the visual state and generates a comprehensive, versioned Markdown technical specification that serves as a buildable blueprint for the team.

## Goals
1. Reduce the friction between high-level system ideation and structured, actionable architectural diagrams.
2. Enable seamless, real-time multiplayer collaboration without race conditions or state desynchronization during canvas editing.
3. Establish a single source of truth where the visual architecture directly governs the final technical documentation.
4. Deliver a performant, low-latency user experience by offloading heavy AI generation tasks to asynchronous background queues.

## Core User Flow
1. **Authentication & Project Creation**: A user signs in using Clerk, creates a new project, and automatically becomes the sole **Owner** of that project.
2. **Inviting Collaborators**: The Owner invites other users (via email or link) to join the project as **Editors**. 
3. **Initial AI Generation**: Any user in the project enters a plain English prompt (e.g., "A scalable e-commerce backend with caching").
4. **Asynchronous Processing**: A Trigger.dev background job passes the prompt alongside a strict Zod graph schema to the LLM via the Vercel AI SDK.
5. **Live Canvas Population**: The AI returns a structured JSON graph (nodes and edges), which immediately populates the interactive canvas.
6. **Collaborative Editing**: Both the Owner and Editors join the Liveblocks room. They see live cursors and can manually drag, drop, add, or delete components simultaneously.
7. **Project Management**: The Owner can remove Editors from the project or permanently delete the entire project at any time.
8. **Spec Generation**: Once the team agrees on the final architecture, a user clicks "Generate Tech Spec."
9. **Artifact Creation**: A Trigger.dev job reads the final, modified Liveblocks graph state and passes it to the LLM to generate a Markdown technical specification.
10. **Storage & Review**: The Markdown file is permanently saved to Vercel Blobs, and its URL is logged to the PostgreSQL database, allowing the team to download or view the final build instructions.

## Features
**Authentication & Access Management**
* Clerk-based identity management and session handling.
* Document-style project ownership (One Owner, Multiple Editors).
* Granular project management capabilities exclusively for the Owner (kick users, delete project).
* Secure Liveblocks token exchange gated by database-level project permissions.

**Real-Time Collaboration Canvas**
* Multi-user live cursors and presence indicators.
* Visual node-editor allowing placement of microservices, databases, load balancers, etc.
* CRDT-based conflict resolution to handle concurrent node dragging and connecting.

**AI & Generation Engine**
* Single-call LLM generation using the Vercel AI SDK to enforce structured JSON graph outputs.
* Automated Markdown technical specification generation derived strictly from the canvas graph state.

**Data & State Management**
* Relational database (PostgreSQL via Prisma) for tracking users, projects, collaborator access lists, and generation logs.
* Immutable artifact storage (Vercel Blobs) for keeping versioned histories of the generated Markdown specs.
* Trigger.dev integration for non-blocking asynchronous queue management.

## In-Scope (Version 1)
* Real-time multi-user canvas interaction (managing nodes, edges, and component properties).
* AI-driven canvas generation from a single initial prompt utilizing structured JSON outputs.
* Generation of high-level Markdown technical specifications based strictly on the final canvas state.
* Project-level, invitation-based access control (Owner vs. Editor logic).
* Background job processing for AI tasks to ensure the frontend remains responsive.

## Out-of-Scope (Version 1)
* B2B SaaS Organization Workspaces (Team-wide access).
* Cloud provider pricing estimation models or budget forecasting.
* Generation of Infrastructure as Code (IaC) such as Terraform, CloudFormation, or Pulumi scripts.
* Low-level API schema definition (e.g., OpenAPI/Swagger) or strict database table schemas.
* Multi-agent AI pipelines, complex reasoning loops, or Retrieval-Augmented Generation (RAG) implementations.

## Success Criteria
* **Concurrency**: Multiple authenticated users can edit the same architecture canvas simultaneously without state desynchronization, data loss, or visual stuttering.
* **Access Control**: Only invited Editors can access the canvas, and only the Project Owner can delete the project or revoke access.
* **AI Reliability**: The system successfully translates a plain English prompt into a valid, renderable node-and-edge graph structure >95% of the time without schema validation errors.
* **Spec Accuracy**: The generated Markdown technical specification accurately reflects the final user-modified canvas state.
* **Performance**: The frontend UI remains completely unblocked and responsive during all LLM generation and data saving tasks.
