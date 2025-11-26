import { useState, useCallback } from 'react';
import { Grid } from './components/Grid/Grid';
import { Toolbar } from './components/Toolbar/Toolbar';
import { useGrid } from './hooks/useGrid';
import { ToolType, CellType } from './utils/constants';
import { useAnimationQueue } from './components/animations/useAnimationQueue';
import { generateMazeDFS } from './utils/algorithms/dfsGenerator';
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(ToolType.WALL);
  const { grid, toggleCell, resetGrid, setCell } = useGrid();

  const handleGridUpdate = useCallback((row: number, col: number, newState: CellType) => {
    setCell(row, col, newState);
  }, [setCell]);

  const { startAnimation, isAnimating } = useAnimationQueue(handleGridUpdate, 10);

  const handleGenerateMaze = () => {
    if (isAnimating) return;
    resetGrid();
    const steps = generateMazeDFS();
    startAnimation(steps);
  };

  const handleSolveMaze = () => {
    console.log('Solve Maze');
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
      />
      <Grid
        grid={grid}
        activeTool={activeTool}
        onCellClick={toggleCell}
      />
    </div>
  );
}

export default App;
