import * as THREE from 'three';
import gsap from 'gsap';

const CAMERA_POSITIONS = {
    front: { x: 0, y: 1, z: 4 },
    side: { x: 4, y: 1, z: 0 },
    top: { x: 0, y: 5, z: 0.1 },
    perspective: { x: 3, y: 2, z: 3 },
};

export default class CameraManager {
    constructor(aspect) {
        this.target = new THREE.Vector3(0, 0, 0);
        this.isAnimating = false;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(3, 2, 3);
        this.camera.lookAt(this.target);
    }

    animateToPosition(positionName, onComplete = null) {
        const pos = CAMERA_POSITIONS[positionName];
        if (!pos) return;

        this.isAnimating = true;

        gsap.to(this.camera.position, {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => this.camera.lookAt(this.target),
            onComplete: () => {
                this.isAnimating = false;
                onComplete?.();
            }
        });
    }

    static getPositions() {
        return CAMERA_POSITIONS;
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }

    reset() {
        this.animateToPosition('perspective');
    }
}
