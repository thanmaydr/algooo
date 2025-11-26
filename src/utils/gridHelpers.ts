import { CellType, GRID_ROWS, GRID_COLS } from './constants';

export interface GridCellData {
    row: number;
    col: number;
    type: CellType;
}

export const createInitialGrid = (rows: number = GRID_ROWS, cols: number = GRID_COLS): GridCellData[][] => {
    const grid: GridCellData[][] = [];
    for (let row = 0; row < rows; row++) {
        const currentRow: GridCellData[] = [];
        for (let col = 0; col < cols; col++) {
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
