# MazeMind PRD (Roles 1 & 4)

## 1. Overview

MazeMind is a 5x5 grid maze solver and visualizer. The grid is modeled as a small, unweighted
graph where each cell can be open or a wall. The product must support algorithmic solving
(BFS-based AI mode) and be architected so that a front-end visualizer can consume the
underlying maze and path data cleanly.

This PRD focuses on the responsibilities of:

- **Role 1 – The Architect (Backend/Algo)**: Maze generation and solving logic.
- **Role 4 – The AI/Prompt Engineer**: Assets and prompts that accelerate development with
  tools like Cursor and GitHub Copilot.

## 2. Functional Requirements (Architect)

### 2.1 Grid & Types

- Represent the maze as a 2D grid of `Cell` objects.
- Each cell must track at least:
  - `row: number`
  - `col: number`
  - `isWall: boolean`
  - `isStart: boolean`
  - `isEnd: boolean`
  - `isVisited: boolean`
  - `isPath: boolean`
  - `previous: Cell | null`
- Expose shared types so that a React UI or any other client can consume them.

### 2.2 Maze Generation

- Provide a `generateMaze` function that:
  - Accepts `rows`, `cols`, `start`, and `end` positions (default: 5x5, (0,0) → (4,4)).
  - Returns a `Grid` where:
    - Start and end are always open (never walls).
    - There is always at least one valid path from start to end.
  - Uses a randomized strategy so that each run produces a slightly different maze.
- Implementation constraints:
  - Respect the small problem size (5x5) and favor clarity and correctness.
  - Keep the implementation deterministic given a fixed RNG seed (future extension).

### 2.3 Maze Solving (BFS)

- Provide a `solveBFS` function that:
  - Takes a `Grid`, `start`, and `end` positions.
  - Treats walls as blocked cells.
  - Uses **Breadth-First Search (BFS)** to find the shortest path in an unweighted grid.
  - Returns:
    - `visitedOrder: Cell[]` – all cells visited, in the order they were explored.
    - `shortestPath: Cell[]` – the reconstructed shortest path from start to end. May be
      empty if no path exists.
- Behavior & guarantees:
  - Throws if the grid is empty or if start/end are out of bounds.
  - If start or end is a wall, returns an unsolvable result with an empty path.
  - Marks cells along the shortest path with `isPath = true`.
  - Uses the `previous` pointer on cells to reconstruct the path.

### 2.4 Path Validation

- Provide a `validatePath` helper that:
  - Accepts a `Grid`, a path as an array of `{ row, col }` positions, and the `start` and
    `end` positions.
  - Returns `true` only if:
    - The path starts at `start` and ends at `end`.
    - Every step is within bounds of the grid.
    - No step walks through a wall.
    - The path moves in 4-connected Manhattan steps (up/down/left/right only).
    - No position is visited more than once (simple path).

## 3. Non-Functional Requirements (Architect)

- Code must be written in **TypeScript** and live under `mazemind-frontend/src/algorithms`.
- All public functions must be pure with respect to their inputs, except for clearly
  documented mutation of `Grid` traversal flags (`isVisited`, `isPath`, `previous`).
- APIs should be small and composable so the frontend can:
  - Generate a maze.
  - Run BFS.
  - Replay `visitedOrder` and `shortestPath` as animations.

## 4. Testing Strategy

- Use **Vitest** for unit tests in `src/algorithms/mazeAlgorithms.test.ts`.
- Minimum coverage:
  - `solveBFS` on an empty 5x5 grid with a straight path.
  - `solveBFS` on a grid with walls, confirming it respects blockages.
  - `generateMaze` called multiple times to ensure that every generated maze is solvable
    and that `validatePath` accepts the BFS result.

## 5. AI / Prompt Engineering (Role 4)

### 5.1 Goals

- Use AI tools to accelerate:
  - Boilerplate generation (Vite, React scaffolding, hooks, and components).
  - Refactoring of maze logic into reusable hooks (`useGrid`, `useMazeSolver`).
  - Creation of additional tests and documentation.

### 5.2 Context Rules for AI Tools

When prompting Cursor/Copilot:

- Always include:
  - The current file or code snippet you want to modify.
  - The expected public API shape from this PRD (function names, parameters, return types).
- Ask for **small, composable changes** instead of giant rewrites.
- Prefer prompts that:
  - Specify the tech stack explicitly: "Vite + TypeScript", "CSS Grid", "BFS pathfinding".
  - Mention performance and visualization needs: "return visitedOrder for animation".

### 5.3 Example Prompt Snippets

**Algorithms (Role 1 + 4)**

> You are a senior TypeScript engineer. I have a 5x5 maze grid represented as a
> 2D array of `Cell` objects with fields `{ row, col, isWall, isStart, isEnd,
> isVisited, isPath, previous }`. Implement a pure `solveBFS` function that
> returns both the `visitedOrder` and the `shortestPath` from start to end.
> The graph is unweighted and movement is allowed only in 4 directions.

**React Grid Hook (future work)**

> Given the BFS and maze generation utilities in `src/algorithms`, generate a
> `useGrid` hook that stores a `Grid` in React state, exposes methods
> `generateNewMaze()`, `runSolver()`, and `reset()`, and returns state slices
> suitable for rendering with a CSS Grid of `<div>` cells.

**Juice / Animation (future work)**

> Update the grid cell component so that when a cell becomes part of
> `visitedOrder` it pulses blue, and when it becomes part of `shortestPath` it
> turns yellow with a staggered animation. Use Framer Motion with layout
> animations and Tailwind utility classes.

## 6. Out of Scope for This PR

- Full React conversion of the current Vite template.
- Visual grid rendering, keyboard navigation, and screen shake/particle effects.
- Deployment (e.g., Vercel/Netlify) and CI/CD automation.

These are intended for the Visualizer, UX/Juice Designer, and Product Integrator roles.
