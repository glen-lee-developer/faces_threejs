import * as THREE from "three";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import model1 from "../images/model1.png";
import model2 from "../images/model2.png";
import model3 from "../images/model3.png";
import model4 from "../images/model4.png";
import model5 from "../images/model5.png";
import model6 from "../images/model5.png";

async function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0xffffff, 1);

  //  Setup
  addLights(scene);
  const camera = createCamera();

  const gridSize = 19; // Define grid size

  setupControls(camera, renderer);
  const { width, height } = setupResize(camera, renderer);
  const textureLoader = new THREE.TextureLoader();
  const textures = [
    textureLoader.load(model1),
    textureLoader.load(model2),
    textureLoader.load(model3),
    textureLoader.load(model4),
    textureLoader.load(model5),
    textureLoader.load(model6),
  ];
  const randomnessFactor = 0; // Adjust this value to control the amount of randomness

  // Create a grid of planes
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Randomly choose a texture from the array
      const texture = textures[Math.floor(Math.random() * textures.length)];

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      // Create a plane geometry and adjust its UVs to map to a section of the texture
      const geometry = new THREE.PlaneGeometry(1, 1);
      const uvAttribute = geometry.getAttribute("uv");

      for (let k = 0; k < uvAttribute.count; k++) {
        const u = uvAttribute.getX(k);
        const v = uvAttribute.getY(k);
        uvAttribute.setXY(k, (u + i) / gridSize, (v + j) / gridSize);
      }

      const myMesh = new THREE.Mesh(geometry, material);

      // Position the mesh in the grid
      const x = i - (gridSize / 2 - 0.5);
      const y = j - (gridSize / 2 - 0.5);
      myMesh.position.set(x, y, 0);

      // Calculate the distance from the center
      const distanceFromCenter = Math.sqrt(x * x + y * y);

      // Add a random offset to the radius
      const radius = gridSize / 2 + (Math.random() - 0.5) * randomnessFactor;

      // If the distance is less than the radius, add the mesh to the scene
      if (distanceFromCenter <= radius) {
        scene.add(myMesh);
      }
    }
  }
  // Create raycaster and mouse objects
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  // Create a set to store the meshes that have already been hovered over
  const hoveredMeshes = new Set();

  // Update the mouse object whenever the mouse moves
  canvas.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Clear the set of hovered meshes
    hoveredMeshes.clear();
  });
  // Create a variable to store the currently hovered mesh
  let hoveredMesh = null;

  // Update the texture of the mesh under the mouse cursor
  function updateTexture() {
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    // If there is one (or more) intersections
    if (intersects.length > 0) {
      // If the closest object intersected is not the currently stored intersection object
      if (intersects[0].object !== hoveredMesh) {
        // Store reference to closest object as current intersection object
        hoveredMesh = intersects[0].object;

        // Filter out the current texture from the array of textures
        const otherTextures = textures.filter(
          (texture) => texture !== hoveredMesh.material.map
        );

        // Randomly choose a texture from the array of other textures
        const texture =
          otherTextures[Math.floor(Math.random() * otherTextures.length)];

        // Update the material of the intersected object
        hoveredMesh.material.map = texture;
        hoveredMesh.material.needsUpdate = true;
      }
    } else {
      // There are no intersections
      // Remove previous intersection object reference
      hoveredMesh = null;
    }
  }

  // Call updateTexture in your render loop
  function animate() {
    requestAnimationFrame(animate);

    updateTexture();

    renderer.render(scene, camera);
  }

  animate();
}
init();
