import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Load Model function
export async function loadModel(modelPath: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        resolve(gltf.scene);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
