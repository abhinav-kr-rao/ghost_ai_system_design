# UI Context & Design System

## Aesthetic Principles
* **Theme:** Dark mode default (with light mode support).
* **Vibe:** Friendly, rich, and simple. Avoids harsh pure blacks (`#000000`); uses deep, saturated slate-blues for dark mode and warm off-whites for light mode.
* **Accents:** Vibrant Indigo for primary actions and a distinct Purple for AI interactions to separate human vs. AI elements.

## 1. Semantic Color Tokens (Tailwind Configuration)

| Token Name | Light Mode (Hex) | Dark Mode (Hex) | Usage / Role in App |
| :--- | :--- | :--- | :--- |
| **Backgrounds** | | | |
| `bg-app` | `#FAFAFA` | `#0B0F19` | Main application background (outside canvas). |
| `bg-canvas` | `#F3F4F6` | `#111827` | The infinite diagramming area (looks great with a subtle dot grid). |
| `bg-surface` | `#FFFFFF` | `#1F2937` | Modals, sidebars, floating toolbars, and node backgrounds. |
| `bg-surface-hover` | `#F9FAFB` | `#374151` | Hover states for dropdowns and interactive list items. |
| **Typography** | | | |
| `text-primary` | `#111827` | `#F9FAFB` | Headings, primary node labels, active text. |
| `text-secondary` | `#4B5563` | `#9CA3AF` | Descriptions, metadata, secondary node details. |
| `text-muted` | `#9CA3AF` | `#6B7280` | Placeholders, disabled states, timestamps. |
| **Borders & Lines** | | | |
| `border-subtle` | `#E5E7EB` | `#374151` | Dividers, subtle node borders, canvas grid lines. |
| `border-strong` | `#D1D5DB` | `#4B5563` | Selected node outlines, input borders, active edges. |
| **Brand & Accents** | | | |
| `accent-primary` | `#4F46E5` | `#6366F1` | Primary buttons, active cursors, selected node highlights. |
| `accent-hover` | `#4338CA` | `#818CF8` | Hover states for primary actions. |
| `accent-ai` | `#9333EA` | `#A855F7` | "Generate Spec" buttons, AI prompt backgrounds, agent cursors. |
| `accent-ai-glow` | `#F3E8FF` | `#3B0764` | Very subtle background glow for AI-generated nodes. |
| **Status (Feedback)** | | | |
| `status-success` | `#10B981` | `#34D399` | Success toasts, valid connections, online status. |
| `status-warning` | `#F59E0B` | `#FBBF24` | Warning messages, missing properties on a node. |
| `status-error` | `#EF4444` | `#F87171` | Destructive actions (delete project), invalid connections. |

## 2. Typography

| Category | Font Family | Weight & Usage |
| :--- | :--- | :--- |
| **Primary (UI & Headings)** | **Geist** or **Inter** | Friendly, highly legible sans-serifs. Use Medium (500) for UI labels and SemiBold (600) for node titles. |
| **Monospace (Code & Specs)** | **Geist Mono** or **JetBrains Mono** | Rich, readable monospaces for the generated Markdown specs, API endpoints inside nodes, or JSON views. |

## 3. Border Radius Scale

To maintain the "friendly" aesthetic, structural UI avoids sharp corners (`0px`) where possible.

| Token | Value | Target Elements |
| :--- | :--- | :--- |
| `radius-none` | `0px` | Flush elements, full-bleed backgrounds. |
| `radius-sm` | `4px` | Checkboxes, small tooltips, inner badges. |
| `radius-md` | `8px` | **The default.** Diagram nodes, input fields, buttons, dropdown menus. |
| `radius-lg` | `12px` | Large structural elements: Sidebars, modal windows, floating action bars. |
| `radius-full` | `9999px` | Avatars, live multiplayer cursor bubbles, notification dots. |

## 4. UI Implementation Rules for AI Agents
* **Always use Tailwind CSS** classes mapped to these semantic tokens. Avoid hardcoding raw hex values in component files.
* Ensure sufficient **color contrast** for all `text-primary` and `text-secondary` elements against their respective backgrounds.
* Apply `accent-ai` strictly to features powered by the Vercel AI SDK to build user trust and clearly communicate when the AI is active or has generated a specific canvas node.
