export interface Position {
  row: number;
  col: number;
}

export interface Cell extends Position {
  /**
   * When true, this cell is blocked and cannot be traversed by the solver
   * or the manual player.
   */
  isWall: boolean;
  /** True if this cell is the designated start cell. */
  isStart: boolean;
  /** True if this cell is the designated end / goal cell. */
  isEnd: boolean;
  /**
   * Used by search algorithms like BFS to record that this cell has been
   * discovered and expanded.
   */
  isVisited: boolean;
  /** True for cells that belong to the final shortest path. */
  isPath: boolean;
  /** Pointer used for path reconstruction in BFS. */
  previous: Cell | null;
}

export type Grid = Cell[][];

export interface MazeSolution {
  /** All cells visited by the solver in the order they were explored. */
  visitedOrder: Cell[];
  /** The reconstructed shortest path from start to end (may be empty). */
  shortestPath: Cell[];
}

export function createEmptyGrid(
  rows: number,
  cols: number,
  start: Position,
  end: Position,
): Grid {
  if (rows <= 0 || cols <= 0) {
    throw new Error('rows and cols must be positive');
  }

  const grid: Grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isWall: false,
        isStart: row === start.row && col === start.col,
        isEnd: row === end.row && col === end.col,
        isVisited: false,
        isPath: false,
        previous: null,
      });
    }
    grid.push(currentRow);
  }

  return grid;
}

/**
 * Reset all traversal-related fields so the same grid instance can be reused
 * for multiple searches.
 */
export function resetTraversalState(grid: Grid): void {
  for (const row of grid) {
    for (const cell of row) {
      cell.isVisited = false;
      cell.isPath = false;
      cell.previous = null;
    }
  }
}
