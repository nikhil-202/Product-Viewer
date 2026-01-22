export default class ControlsManager {
    constructor(domElement, model = null) {
        this.domElement = domElement;
        this.model = model;
        this.isUserInteracting = false;
        this._onStartCallback = null;
        this._onEndCallback = null;

        // Rotation state
        this.isDragging = false;
        this.previousMouseX = 0;
        this.previousMouseY = 0;
        this.rotationSpeedX = 0.005;
        this.rotationSpeedY = 0.005;

        // Target rotation for smooth damping
        this.targetRotationY = 0;
        this.targetRotationX = 0;
        this.dampingFactor = 0.1;

        // Bind event handlers
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        this._addEventListeners();
    }

    setModel(model) {
        this.model = model;
        if (model) {
            this.targetRotationY = model.rotation.y;
            this.targetRotationX = model.rotation.x;
        }
    }

    _addEventListeners() {
        this.domElement.addEventListener('mousedown', this._onMouseDown);
        this.domElement.addEventListener('mousemove', this._onMouseMove);
        this.domElement.addEventListener('mouseup', this._onMouseUp);
        this.domElement.addEventListener('mouseleave', this._onMouseUp);
        this.domElement.addEventListener('touchstart', this._onTouchStart, { passive: false });
        this.domElement.addEventListener('touchmove', this._onTouchMove, { passive: false });
        this.domElement.addEventListener('touchend', this._onTouchEnd);
    }

    _onMouseDown(e) {
        this.isDragging = true;
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
        this.isUserInteracting = true;
        this.syncWithModel();
        this._onStartCallback?.();
    }

    _onMouseMove(e) {
        if (!this.isDragging || !this.model) return;

        const deltaX = e.clientX - this.previousMouseX;
        const deltaY = e.clientY - this.previousMouseY;

        this.targetRotationY += deltaX * this.rotationSpeedX;
        this.targetRotationX += deltaY * this.rotationSpeedY;

        // Clamp vertical rotation to prevent flipping
        this.targetRotationX = Math.max(-0.5, Math.min(0.5, this.targetRotationX));

        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
    }

    _onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.isUserInteracting = false;
            this._onEndCallback?.();
        }
    }

    _onTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            this.isDragging = true;
            this.previousMouseX = e.touches[0].clientX;
            this.previousMouseY = e.touches[0].clientY;
            this.isUserInteracting = true;
            this.syncWithModel();
            this._onStartCallback?.();
        }
    }

    _onTouchMove(e) {
        if (!this.isDragging || !this.model || e.touches.length !== 1) return;
        e.preventDefault();

        const deltaX = e.touches[0].clientX - this.previousMouseX;
        const deltaY = e.touches[0].clientY - this.previousMouseY;

        this.targetRotationY += deltaX * this.rotationSpeedX;
        this.targetRotationX += deltaY * this.rotationSpeedY;
        this.targetRotationX = Math.max(-0.5, Math.min(0.5, this.targetRotationX));

        this.previousMouseX = e.touches[0].clientX;
        this.previousMouseY = e.touches[0].clientY;
    }

    _onTouchEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            this.isUserInteracting = false;
            this._onEndCallback?.();
        }
    }

    onInteractionStart(callback) {
        this._onStartCallback = callback;
    }

    onInteractionEnd(callback) {
        this._onEndCallback = callback;
    }

    update() {
        if (!this.model) return;

        // Apply smooth damping to rotation
        this.model.rotation.y += (this.targetRotationY - this.model.rotation.y) * this.dampingFactor;
        this.model.rotation.x += (this.targetRotationX - this.model.rotation.x) * this.dampingFactor;
    }

    syncWithModel() {
        if (this.model) {
            this.targetRotationY = this.model.rotation.y;
            this.targetRotationX = this.model.rotation.x;
        }
    }

    resetRotation() {
        this.targetRotationX = 0;
        this.targetRotationY = 0;
    }

    dispose() {
        this.domElement.removeEventListener('mousedown', this._onMouseDown);
        this.domElement.removeEventListener('mousemove', this._onMouseMove);
        this.domElement.removeEventListener('mouseup', this._onMouseUp);
        this.domElement.removeEventListener('mouseleave', this._onMouseUp);
        this.domElement.removeEventListener('touchstart', this._onTouchStart);
        this.domElement.removeEventListener('touchmove', this._onTouchMove);
        this.domElement.removeEventListener('touchend', this._onTouchEnd);
    }
}
