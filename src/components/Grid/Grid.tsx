import React from 'react';
import { GridCell } from './GridCell';
import { type GridCellData } from '../../utils/gridHelpers';
import { ToolType } from '../../utils/constants';
import { GRID_COLS } from '../../utils/constants';
import './grid.css';

interface GridProps {
    grid: GridCellData[][];
    activeTool: ToolType | null;
    onCellClick: (row: number, col: number, activeTool: ToolType | null) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, activeTool, onCellClick }) => {
    return (
        <div
            className="grid-container"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 25px)` }}
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <GridCell
                        key={`${rowIndex}-${colIndex}`}
                        row={cell.row}
                        col={cell.col}
                        type={cell.type}
                        onClick={() => onCellClick(cell.row, cell.col, activeTool)}
                    />
                ))
            )}
        </div>
    );
};
