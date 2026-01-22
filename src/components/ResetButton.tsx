'use client';

import styles from './ResetButton.module.css';

interface ResetButtonProps {
    onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
    return (
        <button className={styles.button} onClick={onReset} title="Reset">
            <span className={styles.icon}>↺</span>
            <span className={styles.label}>Reset</span>
        </button>
    );
}
