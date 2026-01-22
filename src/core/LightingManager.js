import * as THREE from 'three';

export default class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];
        this._setupLights();
    }

    _setupLights() {
        // Ambient
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambient);
        this.lights.push(ambient);

        // Key light with shadows
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -5;
        keyLight.shadow.camera.right = 5;
        keyLight.shadow.camera.top = 5;
        keyLight.shadow.camera.bottom = -5;
        keyLight.shadow.bias = -0.0005;
        this.scene.add(keyLight);
        this.lights.push(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-3, 4, -3);
        this.scene.add(fillLight);
        this.lights.push(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
        rimLight.position.set(0, 2, -5);
        this.scene.add(rimLight);
        this.lights.push(rimLight);
    }

    dispose() {
        this.lights.forEach(light => {
            light.shadow?.map?.dispose();
            this.scene.remove(light);
        });
        this.lights = [];
    }
}
