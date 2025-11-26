# MazeMind Prompt Library (Role 4)

These prompts are designed for tools like Cursor and GitHub Copilot to accelerate
work on MazeMind. Always paste the relevant file contents and mention the
expected public API before using them.

---

## A. Project Initialization & Structure

**Goal:** Scaffold or refactor the frontend around the existing maze algorithms.

**Prompt:**

You are a senior React + TypeScript architect. I have a Vite + TypeScript
project called "MazeMind". Under `src/algorithms` I already have
`mazeTypes.ts` and `mazeAlgorithms.ts` that expose:

- `Cell`, `Grid`, `Position`
- `createEmptyGrid(rows, cols, start, end)`
- `generateMaze(rows, cols, start, end)`
- `solveBFS(grid, start, end)`
- `validatePath(grid, path, start, end)`

Refactor the project into a feature-based structure with:

- `src/features/grid` – grid rendering and cell components
- `src/features/controls` – buttons and mode toggles
- `src/hooks` – reusable logic (`useGrid`, `useMazeSolver`)

Create minimal React components and hooks that consume the existing
algorithm APIs, using CSS Grid `<div>` cells (not Canvas).

---

## B. Algorithm Visualization Hook

**Goal:** Drive AI visualization (visited order + shortest path) from React.

**Prompt:**

You are working in a Vite + React + TypeScript project. The maze logic lives
in `src/algorithms/mazeAlgorithms.ts` and exposes `generateMaze` and
`solveBFS`. Implement a `useMazeSolver` hook that:

- Accepts `rows`, `cols`, `start`, and `end`.
- Stores a `Grid` in state and exposes it to the UI.
- Exposes `generateNewMaze()` which calls `generateMaze` and updates state.
- Exposes `runSolver()` which:
  - Calls `solveBFS`.
  - Returns `visitedOrder` and `shortestPath` arrays.
  - Does **not** animate; it only returns data so the UI layer can animate.

The hook should be fully typed, side-effect free (no timers), and easy to
wrap with an animation layer.

---

## C. Juice / Animation (for Future Roles)

**Goal:** Help the UX/Juice Designer quickly add satisfying feedback.

**Prompt:**

We have a grid of React components representing `Cell`s from MazeMind.
Each cell receives props like `{ row, col, isWall, isStart, isEnd,
 isVisited, isPath }`. Using Framer Motion and Tailwind CSS:

- When `isWall` flips from false to true, scale the cell from 0 to 1 with a
  spring bounce.
- When `isVisited` is true, pulse the cell blue briefly.
- When `isPath` is true, animate the cell turning yellow with a staggered
  delay based on its index in the shortest path.

Write a `MazeCell` component using `motion.div` that can plug into a CSS
Grid layout and supports these animations.

---

## D. Refactoring & Testing

**Goal:** Use AI to keep the algorithms clean and well-tested.

**Prompt:**

You are refactoring the maze algorithms in `src/algorithms`. Without
changing the public API, clean up the implementation of `generateMaze` and
`solveBFS` to improve readability and add comments where appropriate.

Then, extend `mazeAlgorithms.test.ts` to cover:

- A case where no path exists because a wall fully blocks the end.
- A sanity check that `validatePath` returns `false` for a path that jumps
over a cell (non-Manhattan move).

Use Vitest and TypeScript, importing from `vitest` rather than relying on
global test functions.
