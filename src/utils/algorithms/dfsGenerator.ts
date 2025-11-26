import { CellType } from '../constants';
import { type AnimationStep } from '../../components/animations/useAnimationQueue';
import { GRID_ROWS, GRID_COLS } from '../constants';

export const generateMazeDFS = (
    rows: number = GRID_ROWS,
    cols: number = GRID_COLS
): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const visited = new Set<string>();

    // Initialize grid with walls
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            steps.push({ row: r, col: c, newState: CellType.WALL });
        }
    }

    const stack: [number, number][] = [];
    // Start from (1, 1) to ensure walls around edges if grid size allows
    // Or (0,0) if we want to fill everything. Let's stick to odd coordinates for paths in DFS
    const startRow = 1;
    const startCol = 1;

    stack.push([startRow, startCol]);
    visited.add(`${startRow},${startCol}`);
    steps.push({ row: startRow, col: startCol, newState: CellType.EMPTY });

    const directions = [
        [-2, 0], // Up
        [2, 0],  // Down
        [0, -2], // Left
        [0, 2],  // Right
    ];

    while (stack.length > 0) {
        const [currentRow, currentCol] = stack[stack.length - 1];

        // Shuffle directions for random maze
        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        let moved = false;

        for (const [dr, dc] of shuffledDirections) {
            const newRow = currentRow + dr;
            const newCol = currentCol + dc;
            const wallRow = currentRow + dr / 2;
            const wallCol = currentCol + dc / 2;

            if (
                newRow > 0 && newRow < rows - 1 &&
                newCol > 0 && newCol < cols - 1 &&
                !visited.has(`${newRow},${newCol}`)
            ) {
                visited.add(`${newRow},${newCol}`);
                // Carve path (wall between and new cell)
                steps.push({ row: wallRow, col: wallCol, newState: CellType.EMPTY });
                steps.push({ row: newRow, col: newCol, newState: CellType.EMPTY });

                stack.push([newRow, newCol]);
                moved = true;
                break;
            }
        }

        if (!moved) {
            stack.pop();
        }
    }

    return steps;
};
