import type { Cell, Grid, MazeSolution, Position } from './mazeTypes';
import { createEmptyGrid, resetTraversalState } from './mazeTypes';

const DIRECTIONS: Position[] = [
  { row: -1, col: 0 }, // up
  { row: 1, col: 0 }, // down
  { row: 0, col: -1 }, // left
  { row: 0, col: 1 }, // right
];

function inBounds(grid: Grid, row: number, col: number): boolean {
  return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;
}

/**
 * Breadth-First Search solver for an unweighted maze.
 *
 * Guarantees the shortest path (if one exists) in terms of number of steps.
 */
export function solveBFS(
  grid: Grid,
  start: Position,
  end: Position,
): MazeSolution {
  if (!grid.length || !grid[0].length) {
    throw new Error('Grid must be non-empty');
  }

  const startCell = grid[start.row]?.[start.col];
  const endCell = grid[end.row]?.[end.col];

  if (!startCell || !endCell) {
    throw new Error('Start or end position is outside the grid');
  }

  if (startCell.isWall || endCell.isWall) {
    // Immediately unsolvable if either endpoint is a wall.
    return { visitedOrder: [], shortestPath: [] };
  }

  resetTraversalState(grid);

  const queue: Cell[] = [];
  const visitedOrder: Cell[] = [];

  startCell.isVisited = true;
  startCell.previous = null;
  queue.push(startCell);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      // Reconstruct shortest path by following previous pointers backwards.
      const path: Cell[] = [];
      let cursor: Cell | null = current;
      while (cursor) {
        path.push(cursor);
        cursor = cursor.previous;
      }
      const shortestPath = path.reverse();
      for (const cell of shortestPath) {
        cell.isPath = true;
      }
      return { visitedOrder, shortestPath };
    }

    for (const dir of DIRECTIONS) {
      const nextRow = current.row + dir.row;
      const nextCol = current.col + dir.col;

      if (!inBounds(grid, nextRow, nextCol)) continue;
      const neighbor = grid[nextRow][nextCol];

      if (neighbor.isWall || neighbor.isVisited) continue;

      neighbor.isVisited = true;
      neighbor.previous = current;
      queue.push(neighbor);
    }
  }

  // No path from start to end.
  return { visitedOrder, shortestPath: [] };
}

/**
 * Generate a random, always-solvable maze for a small grid using a
 * "carve walls but preserve connectivity" strategy.
 *
 * This is not a strict "perfect maze" generator, but it guarantees that
 * there is at least one valid path from start to end while adding
 * interesting walls for the manual player.
 */
export function generateMaze(
  rows = 5,
  cols = 5,
  start: Position = { row: 0, col: 0 },
  end: Position = { row: rows - 1, col: cols - 1 },
): Grid {
  const grid = createEmptyGrid(rows, cols, start, end);

  const candidates: Position[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isStart = row === start.row && col === start.col;
      const isEnd = row === end.row && col === end.col;
      if (isStart || isEnd) continue;
      candidates.push({ row, col });
    }
  }

  shuffleInPlace(candidates);

  for (const candidate of candidates) {
    const cell = grid[candidate.row][candidate.col];
    // Random chance to *consider* turning this cell into a wall.
    if (Math.random() < 0.4) {
      const previousIsWall = cell.isWall;
      cell.isWall = true;

      const { shortestPath } = solveBFS(grid, start, end);
      // If no path remains, revert this wall.
      if (shortestPath.length === 0) {
        cell.isWall = previousIsWall;
      }
    }
  }

  resetTraversalState(grid);
  return grid;
}

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

/**
 * Validate that a path is continuous, within bounds, never walks through
 * walls, and starts/ends at the requested coordinates.
 */
export function validatePath(
  grid: Grid,
  path: Position[],
  start: Position,
  end: Position,
): boolean {
  if (!grid.length || !grid[0].length) return false;
  if (!path.length) return false;

  const rows = grid.length;
  const cols = grid[0].length;

  const first = path[0];
  const last = path[path.length - 1];

  if (first.row !== start.row || first.col !== start.col) return false;
  if (last.row !== end.row || last.col !== end.col) return false;

  const seen = new Set<string>();

  for (let i = 0; i < path.length; i++) {
    const { row, col } = path[i];

    if (row < 0 || col < 0 || row >= rows || col >= cols) return false;

    const cell = grid[row][col];
    if (cell.isWall) return false;

    const key = `${row},${col}`;
    if (seen.has(key)) {
      // For shortest paths in an unweighted grid we expect a simple path.
      return false;
    }
    seen.add(key);

    if (i > 0) {
      const prev = path[i - 1];
      const dr = Math.abs(prev.row - row);
      const dc = Math.abs(prev.col - col);
      // Must move exactly one step in Manhattan distance.
      if (dr + dc !== 1) return false;
    }
  }

  return true;
}
