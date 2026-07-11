# Baby Solitaire 🃏

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://babysolitaire.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)

A full-stack implementation of the classic Solitaire (Klondike) card game. This project was built from scratch to demonstrate a deep understanding of Data Structures and Algorithms (DSA), featuring custom-built data structures on the frontend and an A* Search AI solver on the backend.

**🔗 Play the live game here:** [https://babysolitaire.vercel.app/](https://babysolitaire.vercel.app/)

## ✨ Core Engineering Features

- **Custom JavaScript Data Structures**: 
  Instead of relying on standard arrays, the core game engine was built using custom OOP implementations of:
  - **Linked Lists** for managing Tableau pile chains and sub-list severing.
  - **Stacks** for managing Foundation drops and Undo/Redo histories.
  - **Queues** for cyclical Stock and Waste pile rotations.
- **A* Search Algorithm Backend (Daily Challenge)**:
  - The Python backend features an AI solver that pre-computes winnable game seeds.
  - Utilizes an A* Search algorithm with aggressive heuristic pruning and safe-move dominances to navigate the massive Solitaire state space and verify winnability within seconds.
- **Fully Responsive UI**:
  - Pixel-perfect scaling using Tailwind CSS breakpoints for a native-app feel on both desktop and mobile devices.
  - Touch-optimized Drag-and-Drop using `@dnd-kit/core`.
- **Game Features**:
  - Free Play & AI-verified Daily Challenge modes.
  - Greedy-algorithm hint system.
  - Customizable themes and dynamic scoring.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python (for the backend)
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tasawaralii/babysolitaire.git
cd babysolitaire
```

#### Backend Setup

2. **Navigate to the backend directory and install dependencies**
```bash
cd backend
uv sync
```

3. **Configure Environment Variables**
Create a `.env` file in the `backend` root and specify your allowed CORS origins:
```env
FRONTEND_DOMAIN=http://localhost:5173
```

4. **Start Backend**
```bash
uv run fastapi dev
```

#### Frontend Setup

5. **Navigate to the frontend directory**
```bash
cd ../frontend
```

6. **Configure Environment Variables**
Create a `.env` file in the `frontend` root to connect to the backend:
```env
VITE_BACKEND_DOMAIN=http://localhost:8000
```

7. **Install dependencies and run the development server**
```bash
npm install
npm run dev
```

8. **Play the game!**
Open your browser and navigate to `http://localhost:5173`

## 🧠 Architectural Decisions & Trade-offs

During development, several intentional architectural trade-offs were made to balance performance, deployment overhead, and user experience:

- **In-Memory Storage vs. Persistent Database:** Currently, the Daily Challenge leaderboard utilizes an in-memory data structure rather than a persistent database (e.g., PostgreSQL). This was a deliberate choice to prioritize lightweight deployment and rapid prototyping for a portfolio piece. Because the leaderboard resets daily, long-term persistence is not required for the core game loop. The backend storage layer is fully abstracted, making a future SQL/NoSQL ORM integration trivial.
- **Background Scheduler vs. On-Demand AI:** Validating a random Solitaire seed via A* Search is computationally heavy. Instead of forcing the first user of the day to wait 15 seconds for a seed to generate, the FastAPI backend utilizes `APScheduler` to pre-compute and cache the next day's solvable seed precisely at midnight, ensuring sub-200ms response times for all users.
- **Greedy Frontend Hints vs. A* Backend Hints:** The frontend Hint button utilizes a static greedy algorithm rather than querying the backend's A* path. This was explicitly maintained to demonstrate the limitations of greedy algorithms—they can quickly find the *next* logical move based on immediate priority, but unlike A* Search, they cannot look ahead to guarantee a global win.

## 🛠️ Tech Stack

- **[React](https://react.dev/)** - UI Framework
- **[Vite](https://vitejs.dev/)** - Build Tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling & Responsive Layout
- **[DND Kit](https://dndkit.com/)** - Drag and Drop Architecture
- **[FastAPI](https://fastapi.tiangolo.com/)** - High-performance Python Backend
- **Custom Data Structures & A* Search** - Core Game & AI Logic