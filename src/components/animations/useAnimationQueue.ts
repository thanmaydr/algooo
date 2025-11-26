import { useState, useRef, useCallback, useEffect } from 'react';
import { CellType } from '../../utils/constants';

export interface AnimationStep {
    row: number;
    col: number;
    newState: CellType;
}

export const useAnimationQueue = (
    onUpdateGrid: (row: number, col: number, newState: CellType) => void,
    speed: number = 20
) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const queueRef = useRef<AnimationStep[]>([]);
    const timeoutRef = useRef<number | null>(null);

    const processQueue = useCallback(() => {
        if (queueRef.current.length === 0) {
            setIsAnimating(false);
            return;
        }

        const step = queueRef.current.shift();
        if (step) {
            onUpdateGrid(step.row, step.col, step.newState);
        }

        timeoutRef.current = window.setTimeout(processQueue, speed);
    }, [onUpdateGrid, speed]);

    const startAnimation = useCallback((steps: AnimationStep[]) => {
        queueRef.current = [...steps];
        setIsAnimating(true);
        processQueue();
    }, [processQueue]);

    const stopAnimation = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsAnimating(false);
    }, []);

    const clearQueue = useCallback(() => {
        stopAnimation();
        queueRef.current = [];
    }, [stopAnimation]);

    useEffect(() => {
        return () => {
            stopAnimation();
        };
    }, [stopAnimation]);

    return {
        isAnimating,
        startAnimation,
        stopAnimation,
        clearQueue,
    };
};
