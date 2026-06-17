import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00b4d8, 1.5);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// 3D Object - Enhanced Cube
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
  color: 0x00b4d8,
  metalness: 0.4,
  roughness: 0.6,
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;
controls.enableZoom = true;
controls.enablePan = true;

// Animation State
let isAnimating = true;

// UI Controls
const resetViewBtn = document.getElementById('resetView');
const toggleAnimationBtn = document.getElementById('toggleAnimation');

resetViewBtn.addEventListener('click', () => {
  camera.position.set(0, 0, 5);
  controls.reset();
});

toggleAnimationBtn.addEventListener('click', () => {
  isAnimating = !isAnimating;
  controls.autoRotate = isAnimating;
  toggleAnimationBtn.textContent = `Animation: ${isAnimating ? 'ON' : 'OFF'}`;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  if (isAnimating) {
    cube.rotation.x += 0.001;
  }
  
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Performance Optimization - Throttle resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100);
});