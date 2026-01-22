export default class AnimationManager {
    constructor(target = null) {
        this.target = target;
        this.isRotating = true;
        this.isPaused = false;
        this.rotationSpeed = 0.003;
        this.resumeDelay = 2000;
        this._resumeTimeout = null;

        // Entrance animation
        this.isEntranceAnimating = false;
        this.entranceProgress = 0;
        this.entranceDuration = 2000;
        this.entranceStartTime = 0;
        this.entranceStartRotation = -Math.PI * 0.5;
        this.targetScale = 1;
        this._onEntranceComplete = null;
    }

    setTarget(target) {
        this.target = target;
    }

    playEntranceAnimation(targetScale = 1, onComplete = null) {
        if (!this.target) return;

        this.isEntranceAnimating = true;
        this.entranceProgress = 0;
        this.entranceStartTime = performance.now();
        this.targetScale = targetScale;
        this._onEntranceComplete = onComplete;

        this.target.scale.setScalar(0.001);
        this.target.rotation.y = this.entranceStartRotation;
        this.isPaused = true;
    }

    _easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    _easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    update() {
        if (!this.target) return;

        if (this.isEntranceAnimating) {
            const elapsed = performance.now() - this.entranceStartTime;
            this.entranceProgress = Math.min(elapsed / this.entranceDuration, 1);

            const easedProgress = this._easeOutBack(this.entranceProgress);
            this.target.scale.setScalar(easedProgress * this.targetScale);

            const rotationProgress = this._easeOutCubic(this.entranceProgress);
            this.target.rotation.y = this.entranceStartRotation * (1 - rotationProgress);

            if (this.entranceProgress >= 1) {
                this.isEntranceAnimating = false;
                this.target.scale.setScalar(this.targetScale);
                this.target.rotation.y = 0;
                this.isPaused = false;
                this._onEntranceComplete?.();
                this._onEntranceComplete = null;
            }
            return;
        }

        if (!this.isRotating || this.isPaused) return;
        this.target.rotation.y += this.rotationSpeed;
    }

    pause() {
        this.isPaused = true;
        if (this._resumeTimeout) {
            clearTimeout(this._resumeTimeout);
            this._resumeTimeout = null;
        }
    }

    resume() {
        if (this.isEntranceAnimating) return;
        if (this._resumeTimeout) clearTimeout(this._resumeTimeout);

        this._resumeTimeout = setTimeout(() => {
            this.isPaused = false;
            this._resumeTimeout = null;
        }, this.resumeDelay);
    }

    resumeImmediate() {
        if (this._resumeTimeout) {
            clearTimeout(this._resumeTimeout);
            this._resumeTimeout = null;
        }
        this.isPaused = false;
    }

    dispose() {
        if (this._resumeTimeout) {
            clearTimeout(this._resumeTimeout);
            this._resumeTimeout = null;
        }
        this.target = null;
    }
}
