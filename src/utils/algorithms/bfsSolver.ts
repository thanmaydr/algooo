import { CellType } from '../constants';
import { type AnimationStep } from '../../components/animations/useAnimationQueue';
import { type GridCellData } from '../gridHelpers';

interface Point {
    row: number;
    col: number;
}

export const solveMazeBFS = (
    grid: GridCellData[][],
    start: Point,
    end: Point
): { visitedSteps: AnimationStep[]; pathSteps: AnimationStep[] } => {
    const rows = grid.length;
    const cols = grid[0].length;
    const visitedSteps: AnimationStep[] = [];
    const pathSteps: AnimationStep[] = [];

    const queue: Point[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, Point>();

    visited.add(`${start.row},${start.col}`);

    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1],  // Right
    ];

    let found = false;

    while (queue.length > 0) {
        const current = queue.shift()!;
        const { row, col } = current;

        if (row === end.row && col === end.col) {
            found = true;
            break;
        }

        // Don't animate start node as visited (keep it as START)
        if (!(row === start.row && col === start.col)) {
            visitedSteps.push({ row, col, newState: CellType.VISITED });
        }

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const key = `${newRow},${newCol}`;

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited.has(key) &&
                grid[newRow][newCol].type !== CellType.WALL
            ) {
                visited.add(key);
                parent.set(key, { row, col });
                queue.push({ row: newRow, col: newCol });
            }
        }
    }

    if (found) {
        let curr = end;
        // Backtrack from end to start
        while (curr) {
            const key = `${curr.row},${curr.col}`;
            // Don't animate start/end as path (keep them distinct)
            if (
                !(curr.row === start.row && curr.col === start.col) &&
                !(curr.row === end.row && curr.col === end.col)
            ) {
                pathSteps.unshift({ row: curr.row, col: curr.col, newState: CellType.PATH });
            }

            const parentNode = parent.get(key);
            if (!parentNode) break;
            curr = parentNode;
        }
    }

    return { visitedSteps, pathSteps };
};
