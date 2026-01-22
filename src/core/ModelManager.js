import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = 'https://raw.githubusercontent.com/pushmatrix/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb';

const COLORS = {
    mint: 0x90b89b,
    purple: 0xada2ff,
    grey: 0x7a7a7a,
    black: 0x333333,
    pink: 0xffbfe2,
};

export default class ModelManager {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.model = null;
        this.meshes = [];
        this.originalMaterials = [];
        this.currentColor = null;
        this.currentMaterial = 'plain';
        this.leatherTexture = null;
        this.leatherRoughnessMap = null;
        this.onProgress = null;
    }

    async load() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                MODEL_URL,
                (gltf) => {
                    this.model = gltf.scene;
                    this._processModel();
                    this.scene.add(this.model);
                    this.onProgress?.(100);
                    resolve(this.model);
                },
                (progress) => {
                    if (progress.total > 0) {
                        this.onProgress?.((progress.loaded / progress.total) * 100);
                    }
                },
                reject
            );
        });
    }

    _processModel() {
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        this.model.position.set(-center.x, -box.min.y - 0.42, -center.z);

        const scale = 1.5 / Math.max(size.x, size.y, size.z);
        this.model.scale.setScalar(scale);

        const newBox = new THREE.Box3().setFromObject(this.model);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        this.model.position.set(-newCenter.x, -newBox.min.y - 0.42, -newCenter.z);

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                this.meshes.push(child);
                this.originalMaterials.push(child.material.clone());
            }
        });
    }

    setColor(colorName) {
        if (!COLORS[colorName]) return;

        this.currentColor = colorName;
        const color = new THREE.Color(COLORS[colorName]);

        this.meshes.forEach((mesh) => {
            if (!mesh.material) return;
            if (!mesh.material._isCloned) {
                mesh.material = mesh.material.clone();
                mesh.material._isCloned = true;
            }
            mesh.material.color = color;
            mesh.material.needsUpdate = true;
        });
    }

    async setMaterial(materialType) {
        this.currentMaterial = materialType;

        if (materialType === 'textured' && !this.leatherTexture) {
            await this._loadLeatherTextures();
        }

        this.meshes.forEach((mesh) => {
            if (!mesh.material) return;
            if (!mesh.material._isCloned) {
                mesh.material = mesh.material.clone();
                mesh.material._isCloned = true;
            }

            if (materialType === 'plain') {
                mesh.material.map = null;
                mesh.material.roughnessMap = null;
                mesh.material.roughness = 0.5;
                mesh.material.metalness = 0.1;
            } else if (materialType === 'textured' && this.leatherTexture) {
                mesh.material.map = this.leatherTexture;
                mesh.material.roughnessMap = this.leatherRoughnessMap;
                mesh.material.roughness = 1.0;
                mesh.material.metalness = 0.0;
            }

            mesh.material.needsUpdate = true;
        });
    }

    async _loadLeatherTextures() {
        const path = '/brown_leather_1k.blend/textures/';

        return new Promise((resolve) => {
            this.leatherTexture = this.textureLoader.load(path + 'brown_leather_albedo_1k.jpg', (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.repeat.set(4, 4);
                tex.colorSpace = THREE.SRGBColorSpace;
            });

            this.leatherRoughnessMap = this.textureLoader.load(path + 'brown_leather_rough_1k.jpg', (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.repeat.set(4, 4);
                resolve();
            });
        });
    }

    reset() {
        this.currentColor = null;
        this.currentMaterial = 'plain';

        this.meshes.forEach((mesh, i) => {
            if (this.originalMaterials[i]) {
                mesh.material = this.originalMaterials[i].clone();
                mesh.material._isCloned = true;
            }
        });
    }

    getCurrentColor() {
        return this.currentColor;
    }

    getCurrentMaterial() {
        return this.currentMaterial;
    }

    getModel() {
        return this.model;
    }

    static getColors() {
        return COLORS;
    }

    dispose() {
        this.meshes.forEach((mesh) => {
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
            } else {
                mesh.material?.dispose();
            }
        });

        this.originalMaterials.forEach((mat) => mat.dispose());

        if (this.model) {
            this.scene.remove(this.model);
        }

        this.meshes = [];
        this.originalMaterials = [];
        this.model = null;
    }
}
