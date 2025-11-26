import React from 'react';
import { ToolType } from '../../utils/constants';

interface ToolbarProps {
    activeTool: ToolType | null;
    onToolChange: (tool: ToolType) => void;
    onGenerateMaze: () => void;
    onSolveMaze: () => void;
    onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    activeTool,
    onToolChange,
    onGenerateMaze,
    onSolveMaze,
    onReset,
}) => {
    const tools = [
        { type: ToolType.WALL, label: 'Draw Walls' },
        { type: ToolType.START, label: 'Set Start' },
        { type: ToolType.END, label: 'Set End' },
    ];

    return (
        <div className="flex gap-4 p-4 bg-gray-100 rounded-lg shadow-md mb-6">
            <div className="flex gap-2 border-r border-gray-300 pr-4">
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        className={`px-4 py-2 rounded font-medium transition-colors ${activeTool === tool.type
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        onClick={() => onToolChange(tool.type)}
                    >
                        {tool.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition-colors"
                    onClick={onGenerateMaze}
                >
                    Generate Maze
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
                    onClick={onSolveMaze}
                >
                    Solve Maze
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
                    onClick={onReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
