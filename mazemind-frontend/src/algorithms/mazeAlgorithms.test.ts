import { describe, expect, it } from 'vitest';
import { createEmptyGrid, type Position } from './mazeTypes';
import { generateMaze, solveBFS, validatePath } from './mazeAlgorithms';

describe('solveBFS', () => {
  it('finds a straight path in an empty 5x5 grid', () => {
    const start: Position = { row: 0, col: 0 };
    const end: Position = { row: 0, col: 4 };

    const grid = createEmptyGrid(5, 5, start, end);
    const { shortestPath } = solveBFS(grid, start, end);

    expect(shortestPath.length).toBe(5);
    expect(validatePath(grid, shortestPath, start, end)).toBe(true);
  });

  it('respects walls when searching for a path', () => {
    const start: Position = { row: 0, col: 0 };
    const end: Position = { row: 0, col: 2 };

    const grid = createEmptyGrid(3, 3, start, end);
    // Block the direct route; the solver must go around or fail.
    grid[0][1].isWall = true;

    const { shortestPath } = solveBFS(grid, start, end);

    // Either no path exists or the path must be longer than the naive straight line.
    expect(shortestPath.length === 0 || shortestPath.length > 3).toBe(true);
  });
});

describe('generateMaze', () => {
  it('always produces a solvable 5x5 maze from start to end', () => {
    const start: Position = { row: 0, col: 0 };
    const end: Position = { row: 4, col: 4 };

    // Run multiple times to sanity-check the random generator.
    for (let i = 0; i < 10; i++) {
      const grid = generateMaze(5, 5, start, end);
      const { shortestPath } = solveBFS(grid, start, end);

      expect(shortestPath.length).toBeGreaterThan(0);
      expect(validatePath(grid, shortestPath, start, end)).toBe(true);
    }
  });
});
