import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import floorTextureURL from '../assets/textures/floor.jpg';
import wallTextureURL from '../assets/textures/wall.jpg';
import ceilingTextureURL from '../assets/textures/ceiling.jpg';
import skyTextureURL from '../assets/textures/sky.jpg';

import candleModel from '../assets/models/candle.glb';
import personModel from '../assets/models/meditating_person.glb';

import musicFile from '../assets/music/relax.mp3';

// Scene Setup
const scene = new THREE.Scene();

// Background Sky
const skyTexture = new THREE.TextureLoader().load(skyTextureURL);
scene.background = skyTexture;

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Load Textures
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(floorTextureURL);
const wallTexture = textureLoader.load(wallTextureURL);
const ceilingTexture = textureLoader.load(ceilingTextureURL);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ map: floorTexture })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Wall
const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 3),
  new THREE.MeshStandardMaterial({ map: wallTexture })
);
wall.position.set(0, 1.5, -5);
scene.add(wall);

// Ceiling
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ map: ceilingTexture })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 3;
scene.add(ceiling);

// Orbit Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// Gizmo Control Helper
function addTransformControlToModel(model, position) {
  model.position.copy(position);
  scene.add(model);

  const transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.attach(model);
  transformControl.addEventListener('dragging-changed', (event) => {
    orbitControls.enabled = !event.value;
  });
  scene.add(transformControl);
}

// Load Models
const gltfLoader = new GLTFLoader();

gltfLoader.load(candleModel, (gltf) => {
  addTransformControlToModel(gltf.scene, new THREE.Vector3(-1, 0, 0));
});

gltfLoader.load(personModel, (gltf) => {
  addTransformControlToModel(gltf.scene, new THREE.Vector3(1, 0, 0));
});

// Music Setup
const listener = new THREE.AudioListener();
camera.add(listener);

const backgroundMusic = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load(musicFile, (buffer) => {
  backgroundMusic.setBuffer(buffer);
  backgroundMusic.setLoop(true);
  backgroundMusic.setVolume(0.5);
});

// Music Button
const button = document.createElement('button');
button.textContent = 'Play Music';
button.style.position = 'absolute';
button.style.top = '20px';
button.style.left = '20px';
button.style.zIndex = '1';
button.style.padding = '10px';
button.style.background = 'rgba(255, 255, 255, 0.8)';
button.style.border = 'none';
button.style.cursor = 'pointer';
button.onclick = () => {
  if (backgroundMusic.isPlaying) {
    backgroundMusic.pause();
    button.textContent = 'Play Music';
  } else {
    backgroundMusic.play();
    button.textContent = 'Pause Music';
  }
};
document.body.appendChild(button);

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}

animate();
