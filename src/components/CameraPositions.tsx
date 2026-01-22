'use client';

import styles from './CameraPositions.module.css';

const POSITIONS = [
    { name: 'front', label: 'Front', icon: '👁️' },
    { name: 'side', label: 'Side', icon: '↔️' },
    { name: 'top', label: 'Top', icon: '⬆️' },
    { name: 'perspective', label: '3D', icon: '🎯' },
];

interface CameraPositionsProps {
    activePosition: string | null;
    onPositionChange: (positionName: string) => void;
}

export default function CameraPositions({ activePosition, onPositionChange }: CameraPositionsProps) {
    return (
        <div className={styles.container}>
            <span className={styles.label}>View</span>
            <div className={styles.buttons}>
                {POSITIONS.map((position) => (
                    <button
                        key={position.name}
                        className={`${styles.button} ${activePosition === position.name ? styles.active : ''}`}
                        onClick={() => onPositionChange(position.name)}
                        title={position.label}
                    >
                        <span className={styles.icon}>{position.icon}</span>
                        <span className={styles.buttonLabel}>{position.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
