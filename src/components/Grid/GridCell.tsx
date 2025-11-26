import React from 'react';
import { CellType } from '../../utils/constants';
import './grid.css';

interface GridCellProps {
    row: number;
    col: number;
    type: CellType;
    onClick: (row: number, col: number) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ row, col, type, onClick }) => {
    const handleClick = () => {
        onClick(row, col);
    };

    return (
        <div
            className={`grid-cell cell-${type.toLowerCase()}`}
            onClick={handleClick}
            data-row={row}
            data-col={col}
        />
    );
};
