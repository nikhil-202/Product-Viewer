import * as THREE from 'three';

export default class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        this._createPedestal();
    }

    _createPedestal() {
        const geometry = new THREE.CylinderGeometry(1.2, 1.4, 0.15, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0xe0e0e0,
            metalness: 0.1,
            roughness: 0.8,
        });

        this.pedestal = new THREE.Mesh(geometry, material);
        this.pedestal.position.y = -0.5;
        this.pedestal.receiveShadow = true;
        this.scene.add(this.pedestal);
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    getScene() {
        return this.scene;
    }

    getPedestal() {
        return this.pedestal;
    }

    dispose() {
        if (this.pedestal) {
            this.pedestal.geometry.dispose();
            this.pedestal.material.dispose();
        }
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}
