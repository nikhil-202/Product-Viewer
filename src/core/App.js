import RendererManager from './RendererManager.js';
import SceneManager from './SceneManager.js';
import CameraManager from './CameraManager.js';
import LightingManager from './LightingManager.js';
import ControlsManager from './ControlsManager.js';
import ModelManager from './ModelManager.js';
import AnimationManager from './AnimationManager.js';

export default class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.isInitialized = false;
        this.isRunning = false;
        this.animationFrameId = null;
        this.modelTargetScale = 1;
        this.onLoadProgress = null;

        this.rendererManager = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightingManager = null;
        this.controlsManager = null;
        this.modelManager = null;
        this.animationManager = null;

        this._boundAnimate = this._animate.bind(this);
        this._boundHandleResize = this._handleResize.bind(this);
    }

    async init() {
        if (this.isInitialized) return;

        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;

        this.rendererManager = new RendererManager(this.canvas);
        this.sceneManager = new SceneManager();
        this.cameraManager = new CameraManager(aspect);
        this.lightingManager = new LightingManager(this.sceneManager.getScene());
        this.controlsManager = new ControlsManager(this.cameraManager.getCamera(), this.canvas);
        this.modelManager = new ModelManager(this.sceneManager.getScene());
        this.animationManager = new AnimationManager();

        this.controlsManager.onInteractionStart(() => this.animationManager.pause());
        this.controlsManager.onInteractionEnd(() => this.animationManager.resume());

        this.modelManager.onProgress = (progress) => this.onLoadProgress?.(progress);

        await this.modelManager.load();

        const model = this.modelManager.getModel();
        this.animationManager.setTarget(model);

        if (model) {
            this.modelTargetScale = model.scale.x;
            model.scale.setScalar(0.001);
        }

        window.addEventListener('resize', this._boundHandleResize);
        this.isInitialized = true;
        this.start();
    }

    playEntranceAnimation(onComplete = null) {
        this.animationManager?.playEntranceAnimation(this.modelTargetScale, onComplete);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._animate();
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    _animate() {
        if (!this.isRunning) return;
        this.animationFrameId = requestAnimationFrame(this._boundAnimate);
        this.controlsManager.update();
        this.animationManager.update();
        this.rendererManager.render(this.sceneManager.getScene(), this.cameraManager.getCamera());
    }

    _handleResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.cameraManager.resize(width, height);
        this.rendererManager.resize(width, height);
    }

    // Public API
    setColor(colorName) {
        this.modelManager?.setColor(colorName);
    }

    setMaterial(materialType) {
        this.modelManager?.setMaterial(materialType);
    }

    reset() {
        this.modelManager?.reset();
    }

    setCameraPosition(positionName) {
        if (!this.cameraManager) return;
        this.animationManager.pause();
        this.cameraManager.animateToPosition(positionName, () => {
            setTimeout(() => this.animationManager.resumeImmediate(), 500);
        });
    }

    getCurrentColor() {
        return this.modelManager?.getCurrentColor() || null;
    }

    getCurrentMaterial() {
        return this.modelManager?.getCurrentMaterial() || 'plain';
    }

    dispose() {
        this.stop();
        window.removeEventListener('resize', this._boundHandleResize);

        this.animationManager?.dispose();
        this.modelManager?.dispose();
        this.controlsManager?.dispose();
        this.lightingManager?.dispose();
        this.sceneManager?.dispose();
        this.rendererManager?.dispose();

        this.isInitialized = false;
    }
}
