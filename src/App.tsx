import { useState, useCallback } from 'react';
import { Grid } from './components/Grid/Grid';
import { Toolbar } from './components/Toolbar/Toolbar';
import { useGrid } from './hooks/useGrid';
import { ToolType, CellType } from './utils/constants';
import { useAnimationQueue } from './components/animations/useAnimationQueue';
import { generateMazeDFS } from './utils/algorithms/dfsGenerator';
import { solveMazeBFS } from './utils/algorithms/bfsSolver';
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(ToolType.WALL);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const { grid, toggleCell, resetGrid, setCell } = useGrid(rows, cols);

  const handleGridUpdate = useCallback((row: number, col: number, newState: CellType) => {
    setCell(row, col, newState);
  }, [setCell]);

  const { startAnimation, isAnimating } = useAnimationQueue(handleGridUpdate, 10);

  const handleGenerateMaze = () => {
    if (isAnimating) return;
    resetGrid();
    const steps = generateMazeDFS(rows, cols);
    startAnimation(steps);
  };

  const handleSolveMaze = () => {
    if (isAnimating) return;

    // Find start and end positions
    let start = null;
    let end = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].type === CellType.START) start = { row: r, col: c };
        if (grid[r][c].type === CellType.END) end = { row: r, col: c };
      }
    }

    if (!start || !end) {
      alert('Please set both Start and End points.');
      return;
    }

    const { visitedSteps, pathSteps } = solveMazeBFS(grid, start, end);

    // Chain animations: Visited first, then Path
    startAnimation([...visitedSteps, ...pathSteps]);
  };

  return (
    <div className="app-container">
      <h1 className="text-3xl font-bold mb-8">MazeMind</h1>
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onGenerateMaze={handleGenerateMaze}
        onSolveMaze={handleSolveMaze}
        onReset={resetGrid}
        rows={rows}
        cols={cols}
        onRowsChange={setRows}
        onColsChange={setCols}
      />
      <Grid
        grid={grid}
        activeTool={activeTool}
        onCellClick={toggleCell}
        cols={cols}
      />
    </div>
  );
}

export default App;
