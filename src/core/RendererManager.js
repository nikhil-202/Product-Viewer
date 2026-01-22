import * as THREE from 'three';

export default class RendererManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this._updateSize();
  }

  _updateSize() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
  }

  resize(width, height) {
    this.renderer.setSize(width, height, false);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  getRenderer() {
    return this.renderer;
  }

  dispose() {
    this.renderer.dispose();
  }
}
