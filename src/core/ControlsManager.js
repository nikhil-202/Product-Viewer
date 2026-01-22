import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ControlsManager {
    constructor(camera, domElement) {
        this.controls = new OrbitControls(camera, domElement);
        this.isUserInteracting = false;
        this._onStartCallback = null;
        this._onEndCallback = null;

        // Configure for product viewing
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 8;
        this.controls.minPolarAngle = Math.PI * 0.1;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.enablePan = false;
        this.controls.rotateSpeed = 0.8;

        this.controls.addEventListener('start', () => {
            this.isUserInteracting = true;
            this._onStartCallback?.();
        });

        this.controls.addEventListener('end', () => {
            this.isUserInteracting = false;
            this._onEndCallback?.();
        });
    }

    onInteractionStart(callback) {
        this._onStartCallback = callback;
    }

    onInteractionEnd(callback) {
        this._onEndCallback = callback;
    }

    update() {
        this.controls.update();
    }

    dispose() {
        this.controls.dispose();
    }
}
