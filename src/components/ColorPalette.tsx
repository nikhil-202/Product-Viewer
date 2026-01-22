'use client';

import styles from './ColorPalette.module.css';

const COLORS = [
    { name: 'mint', hex: '#90b89b', label: 'Mint' },
    { name: 'purple', hex: '#ada2ff', label: 'Purple' },
    { name: 'grey', hex: '#7a7a7a', label: 'Grey' },
    { name: 'black', hex: '#333333', label: 'Black' },
    { name: 'pink', hex: '#ffbfe2', label: 'Pink' },
];

interface ColorPaletteProps {
    activeColor: string | null;
    onColorChange: (colorName: string) => void;
}

export default function ColorPalette({ activeColor, onColorChange }: ColorPaletteProps) {
    return (
        <div className={styles.container}>
            <span className={styles.label}>Color</span>
            <div className={styles.swatches}>
                {COLORS.map((color) => (
                    <button
                        key={color.name}
                        className={`${styles.swatch} ${activeColor === color.name ? styles.active : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => onColorChange(color.name)}
                        title={color.label}
                    >
                        {activeColor === color.name && <span className={styles.checkmark}>✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
