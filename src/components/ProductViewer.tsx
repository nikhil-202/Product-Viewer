'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import App from '@/core/App';
import ColorPalette from './ColorPalette';
import MaterialPalette from './MaterialPalette';
import ResetButton from './ResetButton';
import CameraPositions from './CameraPositions';
import styles from './ProductViewer.module.css';

export default function ProductViewer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<App | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [activeMaterial, setActiveMaterial] = useState('plain');
    const [activeCameraPosition, setActiveCameraPosition] = useState<string | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const app = new App(canvasRef.current);
        appRef.current = app;

        app.onLoadProgress = (progress: number) => setLoadProgress(progress);

        app.init().then(() => {
            setIsLoading(false);
            app.playEntranceAnimation();
        });

        return () => {
            appRef.current?.dispose();
            appRef.current = null;
        };
    }, []);

    const handleColorChange = useCallback((colorName: string) => {
        appRef.current?.setColor(colorName);
        setActiveColor(colorName);
    }, []);

    const handleMaterialChange = useCallback((materialType: string) => {
        appRef.current?.setMaterial(materialType);
        setActiveMaterial(materialType);
    }, []);

    const handleReset = useCallback(() => {
        appRef.current?.reset();
        setActiveColor(null);
        setActiveMaterial('plain');
    }, []);

    const handleCameraPositionChange = useCallback((positionName: string) => {
        appRef.current?.setCameraPosition(positionName);
        setActiveCameraPosition(positionName);
    }, []);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.loaderContent}>
                        <div className={styles.shoeIcon}>
                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 42c0-8 6-14 14-14h20c8 0 14 6 14 14v6H8v-6z" fill="#333" opacity="0.1" />
                                <path d="M10 40c0-6 4.5-11 10-11h24c5.5 0 10 5 10 11v4H10v-4z" stroke="#333" strokeWidth="2" fill="none" />
                                <path d="M14 44h36" stroke="#333" strokeWidth="2" />
                                <path d="M20 29c0-4 3-7 7-7h10c4 0 7 3 7 7" stroke="#333" strokeWidth="2" fill="none" />
                                <circle cx="24" cy="36" r="2" fill="#333" />
                                <circle cx="32" cy="36" r="2" fill="#333" />
                                <circle cx="40" cy="36" r="2" fill="#333" />
                            </svg>
                        </div>

                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${loadProgress}%` }} />
                            </div>
                            <span className={styles.loadingText}>
                                {loadProgress < 100 ? 'Loading Model' : 'Preparing Scene'}
                                <span className={styles.dots}></span>
                            </span>
                            <span className={styles.loadingSubtext}>{Math.round(loadProgress)}%</span>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && (
                <>
                    <CameraPositions
                        activePosition={activeCameraPosition}
                        onPositionChange={handleCameraPositionChange}
                    />

                    <div className={styles.controls}>
                        <div className={styles.controlsInner}>
                            <ColorPalette activeColor={activeColor} onColorChange={handleColorChange} />
                            <MaterialPalette activeMaterial={activeMaterial} onMaterialChange={handleMaterialChange} />
                            <ResetButton onReset={handleReset} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
