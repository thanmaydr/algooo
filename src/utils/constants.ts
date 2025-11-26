export const CellType = {
    EMPTY: 'EMPTY',
    WALL: 'WALL',
    START: 'START',
    END: 'END',
    VISITED: 'VISITED',
    PATH: 'PATH',
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export const ToolType = {
    WALL: 'WALL',
    START: 'START',
    END: 'END',
} as const;

export type ToolType = typeof ToolType[keyof typeof ToolType];

export const GRID_ROWS = 20;
export const GRID_COLS = 20;
