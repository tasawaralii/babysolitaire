# Baby Solitaire 🃏

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://babysolitaire.pages.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)

A highly customizable implementation of the classic Solitaire (Klondike) card game built with React, featuring custom data structures implemented from scratch and a dedicated backend.

**🔗 Play the live game here:** [https://babysolitaire.pages.dev/](https://babysolitaire.pages.dev/)

## ✨ Features

- **Custom Data Structures**: Built using custom implementations of:
  - Linked Lists for tableau piles
  - Stacks for foundations
  - Queues for stock and waste piles

- **Game Features**:
  - Drag and drop card movement
  - Multiple card movement
  - Undo/Redo functionality
  - Hint system
  - Score tracking & Move counter
  - Timer
  - Victory detection

- **Modern UI**:
  - Smooth animations
  - Responsive design
  - Theme customization
  - Victory celebration

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

3. **Start Backend**
```bash
uv run fastapi dev
```

#### Frontend Setup

4. **Navigate to the frontend directory**
```bash
cd ../frontend
```

5. **Install dependencies**
```bash
npm install
# or
yarn install
```

6. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

7. **Play the game!**
Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Objective**: Reveal all cards in the tableau by moving them strategically.
   
2. **Card Movement Rules**:
   - Move cards between tableau piles in descending order with alternating colors.
   - Move cards to foundation piles in ascending order by suit.
   - Turn over cards from the stock pile when stuck.

3. **Controls**:
   - Drag and drop cards to move them.
   - Click the stock pile to draw new cards.
   - Use undo/redo buttons to correct mistakes.
   - Click the hint button if you need help.

4. **Scoring**:
   - Scoring can be customized using settings. Users can set their preferred values before the game starts.

## 🛠️ Tech Stack

- **[React](https://react.dev/)** - UI Framework
- **[Vite](https://vitejs.dev/)** - Build Tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[DND Kit](https://dndkit.com/)** - Drag and Drop Architecture
- **[Python](https://www.python.org/) & [uv](https://docs.astral.sh/uv/)** - Backend & Package Management
- **Custom Data Structures** - Core Game Logic