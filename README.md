# 🌌 NexaSetu — AI-Powered Project Orchestration

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**NexaSetu** is a next-generation project management platform designed for high-velocity teams. It blends traditional project tracking with an autonomous AI Orchestrator, allowing you to manage complex ecosystems via natural language and real-time data insights.

---

## 🔗 Ecosystem Links

- **Backend Infrastructure:** [GitHub Repository](https://github.com/yashshinde88585/NexaSetu-Backend.git)

---

## ✨ Core Features

### 🪄 The Magic Bar (AI Orchestrator)
Command your workspace through a powerful Natural Language Interface.
- **Natural Language Execution:** Ask AI to "Show healthy projects", "Summarize weekly velocity", or "Reassign tasks".
- **Intent Extraction:** Automatically translates unstructured text into system actions.
- **Autonomous Staging:** AI stages complex actions for human approval before execution.

### 📊 Precision Dashboard & Analytics
Get a bird's-eye view of your entire organization's health.
- **Live Velocity Tracking:** Real-time progress bars and project health labels.
- **At-Risk Detection:** Automatically flags projects falling behind schedule.
- **Unified Activity Stream:** A centralized feed for team updates, commits, and state changes.

### 🛡️ Secure SaaS Infrastructure
Built for production-grade security and scale.
- **Stateful Auth:** Implementation of secure HttpOnly cookie-based sessions (XSS-resistant).
- **Squad Provisioning:** Bulk onboard team members with pre-configured roles and project assignments.
- **Instant Access:** Provisioned users can log in immediately using their email as a temporary password.

### 🎨 Developer-Core Aesthetic
A premium interface designed for focus and productivity.
- **Glassmorphism Design:** Modern, sleek UI with backdrop blurs and subtle gradients.
- **High-Performance Logic:** Built on React 19 and Tanstack Query for near-zero latency.
- **Responsive Layout:** Fluid transitions across desktop, tablet, and mobile views.

---

## 🚀 Tech Stack

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Modern CSS Variables & Utilities)
- **State & Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Interactive Tours:** [React Joyride](https://react-joyride.com/)
- **API Communication:** [Axios](https://axios-http.com/)

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/nexasetu-frontend.git
cd nexasetu-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_HF_TOKEN=your_huggingface_token
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

---

## 📁 Project Structure

```text
src/
├── api/            # API services and axios instances
├── components/     # Reusable UI components
│   ├── dashboard/  # Dashboard-specific parts
│   ├── project/    # Project-related elements
│   ├── MagicBar.jsx# The AI Orchestrator UI
│   └── AppTour.jsx # Onboarding logic
├── context/        # Auth and global state providers
├── hooks/          # Custom React hooks (useDashboard, etc.)
├── pages/          # Full page views (Dashboard, Portfolio, Auth)
├── utils/          # Helper functions and constants
└── index.css       # Global styles and Tailwind directives
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
