import { CellType, GRID_ROWS, GRID_COLS } from './constants';

export interface GridCellData {
    row: number;
    col: number;
    type: CellType;
}

export const createInitialGrid = (): GridCellData[][] => {
    const grid: GridCellData[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow: GridCellData[] = [];
        for (let col = 0; col < GRID_COLS; col++) {
            currentRow.push({
                row,
                col,
                type: CellType.EMPTY,
            });
        }
        grid.push(currentRow);
    }
    return grid;
};
