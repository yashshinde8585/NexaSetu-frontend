# NexaSetu Tactical Interface (Frontend)

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### The UI/UX Problem
Modern engineering workspaces are cluttered. Developers are buried in ticket noise, while leaders are lost in spreadsheets. Most interfaces prioritize "storing data" over "enabling action," leading to cognitive overload and "dashboard fatigue."

### The Pain
Navigating 15 different pages to find one blocker. Switching between Jira, GitHub, and Slack just to understand project health. Staring at generic charts that don't tell you what to do next. You aren't using a tool; you're fighting an interface.

### The Insight
A workspace should be a **Tactical Command Center**. It should prune the noise and adapt its entire layout to your specific mission. Whether you are a CTO looking at portfolio risk or an Intern tracking your first task, the interface must be invisible and the insights must be loud.

### The Solution
The NexaSetu Tactical Interface is a high-performance, role-adaptive frontend. Built on a brutalist, high-contrast design system, it emphasizes clarity over decoration. It replaces traditional navigation with a natural-language "Magic Bar" and provides specialized tactical views for every rank in the engineering organization.

### The Outcome
Zero-scroll awareness. Command-line speed in a visual UI. A single, focused source of truth that adapts to your role, reducing context-switching by 70% and turning passive data into active execution.

---

## 🔗 Ecosystem Links
- **Backend Infrastructure:** [GitHub Repository](https://github.com/yashshinde88585/NexaSetu-Backend.git)

---

## One-Line Core Idea
A role-adaptive tactical command center designed for zero-latency engineering execution.

---

## Key Features (UI-Focused)

- **Role-Adaptive Dashboards:** 15+ specialized tactical views (CTO, VP, EM, TL, SWE, QA, etc.) that reconfigure the UI based on your mission profile.
- **Magic Bar (Command Engine):** A natural-language interface that executes actions, filters views, and navigates the platform without manual clicking.
- **High-Density Tactical Layouts:** Zero-scroll design patterns that fit critical performance indicators (EPI) within the viewport.
- **Project Flow Visualization:** Interactive dependency mapping using ReactFlow to visualize task bottlenecks.
- **Brutalist Design System:** A high-contrast, "Project 0" aesthetic that eliminates glare and focuses attention on status-critical data.
- **Live Activity Feed:** Real-time, socket-powered collaborative updates across all dashboards.

---

## Tech Stack

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Modern CSS Variables & Utilities)
- **Data Orchestration:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Communication:** [Axios](https://axios-http.com/)
- **Real-time:** Socket.io-client
- **Visualization:** ReactFlow & Recharts

---

## Architecture Overview

### Component Structure
NexaSetu utilizes an **Atomic Design Architecture**:
- **Atoms:** Standardized primitives (Buttons, BackButtons, Badges).
- **Molecules:** Combined units (TaskItems, SearchResults).
- **Organisms:** High-level functional modules like the `MagicBar`, `ActionCenter`, and `ProjectCard`.
- **Layouts:** Structural templates (e.g., `TacticalLayout`) that enforce the zero-scroll design across roles.

### State Flow
- **Global Identity:** Handled by `AuthContext`, managing session persistence and role-based permissions.
- **Command State:** Managed by `MagicContext`, bridging the natural language engine with UI updates.
- **Server State:** Managed via **TanStack Query**, ensuring cache consistency and efficient background refetching.

---

## Folder Structure

```text
src/
├── api/                # API integration layer & Axios configuration
├── components/         # Atomic Design repository
│   ├── atoms/          # UI primitives
│   ├── molecules/      # Composite UI elements
│   ├── organisms/      # Functional modules (MagicBar, ActionCenter)
│   └── layouts/        # Shared structural containers
├── context/            # Global state providers (Auth, Magic)
├── hooks/              # Custom logic (Queries, UI interactions)
├── pages/              # 35+ Role-specific dashboard views
├── routes/             # Navigation & role-protection logic
├── services/           # Business logic & WebSocket listeners
├── utils/              # Tactical UI helpers & formatters
└── index.css           # Brutalist design system & Tailwind directives
```

---

## How the UI Works

1.  **Authentication:** Users enter via a focused AuthLayout. Upon login, the `AuthContext` detects the user's role.
2.  **Adaptive Routing:** The system routes the user to their specific dashboard (e.g., `CTODashboard` for executives).
3.  **Data Hydration:** TanStack Query fetches domain-specific metrics (EPIs, Sprint stats) and caches them.
4.  **Interaction:** Users navigate via the **Magic Bar** or role-specific sidebar.
5.  **Execution:** Natural language commands trigger API calls that update the reflected UI immediately.

---

## Setup Instructions

1.  Navigate to the frontend directory:
    ```bash
    cd NexaSetu-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```

---

## Environment Variables

Create a `.env` file in the `NexaSetu-frontend` root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Performance Optimizations

- **Vite Bundling:** Optimized for fast HMR and lightweight production builds.
- **TanStack Caching:** Minimizes redundant API requests and provides "instant" UI updates.
- **Windowing/Lazy Loading:** Role-specific pages are loaded only when needed.
- **CSS Variable Injection:** Global design tokens are managed via CSS variables for instant theme adjustments.

---

## UI/UX Decisions

- **Monochromatic Base:** Using a stark #161622 background to reduce screen glare.
- **Status Accents:** Vibrant colors are reserved strictly for actionable states.
- **Typography:** High-readability sans-serif fonts with wide letter-spacing.
- **Reduced Animation:** Motion is used sparingly to maintain institutional stability.

---

## Limitations

- **Complex Viewport Density:** Highly optimized for desktop; mobile responsiveness requires further refinement.
- **Component Proliferation:** Maintaining consistency across 35+ views is a continuous refactoring focus.

---

## Conclusion
The NexaSetu Tactical Interface is more than a dashboard; it is a professional-grade execution tool. By stripping away the fluff of traditional SaaS design and focusing on role-adaptive mission awareness, it empowers engineering teams to move with absolute clarity and speed.
