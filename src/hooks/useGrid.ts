import { useState, useCallback } from 'react';
import { CellType, ToolType } from '../utils/constants';
import { createInitialGrid, type GridCellData } from '../utils/gridHelpers';

export const useGrid = () => {
    const [grid, setGrid] = useState<GridCellData[][]>(createInitialGrid());

    const toggleCell = useCallback((row: number, col: number, activeTool: ToolType | null) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((r) => [...r]);
            const cell = newGrid[row][col];
            let newType: CellType = cell.type;

            if (activeTool === ToolType.WALL) {
                if (cell.type === CellType.EMPTY) {
                    newType = CellType.WALL;
                } else if (cell.type === CellType.WALL) {
                    newType = CellType.EMPTY;
                }
            } else if (activeTool === ToolType.START) {
                // Clear previous start
                newGrid.forEach((r) => r.forEach((c) => {
                    if (c.type === CellType.START) c.type = CellType.EMPTY;
                }));
                newType = CellType.START;
            } else if (activeTool === ToolType.END) {
                // Clear previous end
                newGrid.forEach((r) => r.forEach((c) => {
                    if (c.type === CellType.END) c.type = CellType.EMPTY;
                }));
                newType = CellType.END;
            }

            newGrid[row][col] = { ...cell, type: newType };
            return newGrid;
        });
    }, []);

    const resetGrid = useCallback(() => {
        setGrid(createInitialGrid());
    }, []);

    const setCell = useCallback((row: number, col: number, type: CellType) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((r) => [...r]);
            newGrid[row][col] = { ...newGrid[row][col], type };
            return newGrid;
        });
    }, []);

    return { grid, toggleCell, resetGrid, setCell };
};
