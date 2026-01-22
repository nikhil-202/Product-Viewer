'use client';

import styles from './MaterialPalette.module.css';

const MATERIALS = [
    { name: 'plain', label: 'Plain', icon: '◯' },
    { name: 'textured', label: 'Textured', icon: '◉' },
];

interface MaterialPaletteProps {
    activeMaterial: string;
    onMaterialChange: (materialType: string) => void;
}

export default function MaterialPalette({ activeMaterial, onMaterialChange }: MaterialPaletteProps) {
    return (
        <div className={styles.container}>
            <span className={styles.label}>Material</span>
            <div className={styles.options}>
                {MATERIALS.map((material) => (
                    <button
                        key={material.name}
                        className={`${styles.option} ${activeMaterial === material.name ? styles.active : ''}`}
                        onClick={() => onMaterialChange(material.name)}
                    >
                        <span className={styles.icon}>{material.icon}</span>
                        <span className={styles.optionLabel}>{material.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
